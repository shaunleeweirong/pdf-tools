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
