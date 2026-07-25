import matter from 'gray-matter'

export type Topic = {
  id: string
  surface: string
  targetQuery: string
  intent?: string
  priority?: number
  status: string
  url?: string
  feedback?: string
  slug?: string
}

export type Board = {
  backlog: Topic[]
  inProgress: Topic[]
  needsApproval: Topic[]
  published: Topic[]
  rejected: Topic[]
}

const IN_PROGRESS = new Set(['researching', 'briefed', 'drafting', 'changes-requested'])

export function groupPipeline(topics: Topic[]): Board {
  const board: Board = { backlog: [], inProgress: [], needsApproval: [], published: [], rejected: [] }
  for (const t of topics) {
    if (t.status === 'idea') board.backlog.push(t)
    else if (t.status === 'pending') board.needsApproval.push(t)
    else if (t.status === 'published') board.published.push(t)
    else if (t.status === 'rejected') board.rejected.push(t)
    else if (IN_PROGRESS.has(t.status)) board.inProgress.push(t)
    else board.inProgress.push(t)
  }
  return board
}

// --- GitHub Contents API (read) ---

function repo(): { owner: string; name: string } {
  const full = process.env.GITHUB_REPO ?? 'shaunleeweirong/pdf-tools'
  const [owner, name] = full.split('/')
  return { owner, name }
}

async function gh(path: string): Promise<Response> {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN not set')
  const { owner, name } = repo()
  return fetch(`https://api.github.com/repos/${owner}/${name}/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.raw+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    cache: 'no-store',
  })
}

export async function fetchKeywordMap(): Promise<{ topics: Topic[] }> {
  const res = await gh('contents/content/keyword-map.json?ref=main')
  if (!res.ok) throw new Error(`keyword-map: ${res.status}`)
  const json = JSON.parse(await res.text())
  return { topics: Array.isArray(json.topics) ? json.topics : [] }
}

export type PendingDraft = {
  slug: string
  title: string
  description: string
  body: string
  words: number
}

export async function listPendingDrafts(): Promise<PendingDraft[]> {
  const listRes = await gh('contents/content/pending?ref=main')
  if (listRes.status === 404) return [] // folder may not exist yet
  if (!listRes.ok) throw new Error(`pending list: ${listRes.status}`)
  const entries = JSON.parse(await listRes.text()) as Array<{ name: string; path: string }>
  const slugs = entries.filter((e) => e.name.endsWith('.mdx')).map((e) => e.name.replace(/\.mdx$/, ''))
  return Promise.all(
    slugs.map(async (slug) => {
      const fileRes = await gh(`contents/content/pending/${slug}.mdx?ref=main`)
      if (!fileRes.ok) throw new Error(`pending ${slug}: ${fileRes.status}`)
      const raw = await fileRes.text()
      const { data, content } = matter(raw)
      return {
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ''),
        body: content,
        words: content.trim().split(/\s+/).filter(Boolean).length,
      }
    }),
  )
}

// --- Pure helpers ---

export function applyTopicStatus(
  topics: Topic[],
  slug: string,
  status: string,
  extra: { url?: string; feedback?: string } = {},
): Topic[] {
  return topics.map((t) =>
    t.slug === slug ? { ...t, status, ...(extra.url ? { url: extra.url } : {}), ...(extra.feedback ? { feedback: extra.feedback } : {}) } : t,
  )
}

// --- GitHub Git Data API (atomic write) ---

async function ghJson(path: string, init?: RequestInit): Promise<any> {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN not set')
  const full = process.env.GITHUB_REPO ?? 'shaunleeweirong/pdf-tools'
  const res = await fetch(`https://api.github.com/repos/${full}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`GitHub ${path}: ${res.status} ${await res.text()}`)
  return res.json()
}

type FileChange = { upserts?: Record<string, string>; deletes?: string[] }

/** One atomic commit on main: create/update `upserts` and remove `deletes`. */
async function commitFiles(change: FileChange, message: string): Promise<void> {
  const ref = await ghJson('git/ref/heads/main')
  const baseCommitSha: string = ref.object.sha
  const baseCommit = await ghJson(`git/commits/${baseCommitSha}`)
  const baseTreeSha: string = baseCommit.tree.sha

  const tree: Array<Record<string, unknown>> = []
  for (const [path, content] of Object.entries(change.upserts ?? {})) {
    const blob = await ghJson('git/blobs', {
      method: 'POST',
      body: JSON.stringify({ content, encoding: 'utf-8' }),
    })
    tree.push({ path, mode: '100644', type: 'blob', sha: blob.sha })
  }
  for (const path of change.deletes ?? []) {
    tree.push({ path, mode: '100644', type: 'blob', sha: null })
  }

  const newTree = await ghJson('git/trees', {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  })
  const commit = await ghJson('git/commits', {
    method: 'POST',
    body: JSON.stringify({ message, tree: newTree.sha, parents: [baseCommitSha] }),
  })
  await ghJson('git/refs/heads/main', {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha }),
  })
}

async function readRaw(path: string): Promise<string> {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN not set')
  const full = process.env.GITHUB_REPO ?? 'shaunleeweirong/pdf-tools'
  const res = await fetch(`https://api.github.com/repos/${full}/contents/${path}?ref=main`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.raw+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`read ${path}: ${res.status}`)
  return res.text()
}

async function updatedKeywordMap(slug: string, status: string, extra?: { url?: string; feedback?: string }): Promise<string> {
  const map = JSON.parse(await readRaw('content/keyword-map.json'))
  map.topics = applyTopicStatus(map.topics ?? [], slug, status, extra)
  return JSON.stringify(map, null, 2) + '\n'
}

export async function approveDraft(slug: string): Promise<void> {
  const body = await readRaw(`content/pending/${slug}.mdx`)
  const map = await updatedKeywordMap(slug, 'published', { url: `/blog/${slug}` })
  await commitFiles(
    {
      upserts: { [`content/blog/${slug}.mdx`]: body, 'content/keyword-map.json': map },
      deletes: [`content/pending/${slug}.mdx`],
    },
    `content: publish ${slug}`,
  )
}

export async function rejectDraft(slug: string): Promise<void> {
  const map = await updatedKeywordMap(slug, 'rejected')
  await commitFiles(
    { upserts: { 'content/keyword-map.json': map }, deletes: [`content/pending/${slug}.mdx`] },
    `content: reject ${slug}`,
  )
}

export async function requestChanges(slug: string, feedback: string): Promise<void> {
  const map = await updatedKeywordMap(slug, 'changes-requested', { feedback })
  await commitFiles({ upserts: { 'content/keyword-map.json': map } }, `content: request changes on ${slug}`)
}
