# Content Studio — Phase 2 (Approve / Reject / Request-changes → publish) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the read-only `/studio` board into an actionable one: each pending post gets **Approve** (moves `content/pending/<slug>.mdx` → `content/blog/`, marks the topic `published`, and — via git push — publishes to the blog), **Reject** (deletes the draft, marks `rejected`), and **Request changes** (records feedback, marks `changes-requested`; the draft stays for the pipeline to redraft). Each action is one atomic GitHub commit.

**Architecture:** Extends Phase 1 (branch `content-studio-p1`). Adds GitHub **write** helpers to `lib/studio/github.ts` using the Git Data API (blobs/tree/commit/ref) so a multi-file change is one atomic commit → one Vercel deploy. Three `'use server'` actions call them; **each re-checks the session server-side** (render-time gating is not a security boundary) and takes only the slug + feedback from the client, re-reading everything else from the repo. `revalidatePath('/studio')` refreshes the board in the same response.

**Tech Stack:** Next.js 16 Server Actions, GitHub Git Data API via `fetch`, React 19 forms (`<button formAction>`), Vitest. No new dependencies.

## Global Constraints

- **Auth inside every action** (Next 16 rule): each action calls `hasValidStudioSession()` and throws `Unauthorized` if false — do NOT rely on the page being gated. (Ref: `node_modules/next/dist/docs/01-app/02-guides/server-actions.md` "Security".)
- **Actions take only a reference:** `slug` (+ `feedback` for request-changes) from `FormData`; re-read the pending file + keyword-map from GitHub server-side. Validate `slug` matches `^[a-z0-9-]+$`.
- **Atomic commits:** approve/reject/request-changes each produce exactly ONE commit via the Git Data API (never multiple sequential Contents-API commits).
- **Statuses (canonical):** approve → `published` (+ `url: /blog/<slug>`); reject → `rejected`; request-changes → `changes-requested` (+ `feedback`). A pending draft `content/pending/<slug>.mdx` links to the keyword-map topic whose `slug` field === `<slug>`.
- **⚠️ PHASE 3 DEPENDENCY (from final review, I1):** current `content/keyword-map.json` topics have NO `slug` field, so `applyTopicStatus` (matches on `slug`) silently no-ops today — a manual Approve would publish the file but NOT flip the topic to `published` on the board. The Phase-3 pipeline (content-draft) MUST set a `slug` field (= the pending filename) on any topic it moves to `pending`. Until then, hand-created pending drafts need a matching topic with `slug` added manually, or the board's Published column won't reflect the approve.
- Testable pure logic in `lib/` (Vitest `include` is `lib/**`); the session helper lives in `app/studio/session.ts` (imports `next/headers`, so NOT under `lib/`). GitHub write calls are integration — smoke-verified with a real token, not unit-tested.
- Reuse Phase 1: `lib/studio/github.ts` (reads, `Topic`), `lib/studio/auth.ts` (`verifySessionToken`), `lib/studio/constants.ts` (`SESSION_COOKIE`). Add `slug?: string` to `Topic`.
- No new deps. Work on the existing `content-studio-p1` branch. Do NOT push. Conventional commits ending with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- The full write path (a real commit) needs the user's `GITHUB_TOKEN` (Contents+metadata read/write) + a real pending draft — that live test is deferred to the user; this plan verifies build + unit tests + auth-gating + UI.

---

## File Structure

- `app/studio/session.ts` — **create.** `hasValidStudioSession()` + `requireStudioSession()` (extracted from `page.tsx`'s inline `requireSession`), reused by the page and the actions.
- `lib/studio/github.ts` — **modify.** Add `slug?` to `Topic`; add pure `applyTopicStatus()`; add `commitFiles()` (Git Data API) + `approveDraft` / `rejectDraft` / `requestChanges`.
- `lib/__tests__/studio-write.test.ts` — **create.** Unit tests for `applyTopicStatus`.
- `app/studio/actions.ts` — **create.** The three `'use server'` actions.
- `app/studio/page.tsx` — **modify.** Use `requireStudioSession()`; render the Approve/Reject/Request-changes form per pending post.

---

## Task 1: Session helper extraction + write helpers

**Files:**
- Create: `app/studio/session.ts`
- Modify: `lib/studio/github.ts`
- Test: `lib/__tests__/studio-write.test.ts`

**Interfaces — Produces:**
- `app/studio/session.ts`: `hasValidStudioSession(): Promise<boolean>`, `requireStudioSession(): Promise<void>` (redirect to `/studio/login` if invalid).
- `lib/studio/github.ts`: `Topic` gains `slug?: string`; `applyTopicStatus(topics: Topic[], slug: string, status: string, extra?: { url?: string; feedback?: string }): Topic[]` (pure); `approveDraft(slug: string): Promise<void>`; `rejectDraft(slug: string): Promise<void>`; `requestChanges(slug: string, feedback: string): Promise<void>`.

- [ ] **Step 1: Write the failing test** — `lib/__tests__/studio-write.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { applyTopicStatus, type Topic } from '@/lib/studio/github'

const base: Topic[] = [
  { id: 't1', surface: 'blog', targetQuery: 'q1', status: 'pending', slug: 'post-a' },
  { id: 't2', surface: 'blog', targetQuery: 'q2', status: 'idea' },
]

describe('applyTopicStatus', () => {
  it('updates status + extras for the topic matching the slug, leaves others untouched', () => {
    const out = applyTopicStatus(base, 'post-a', 'published', { url: '/blog/post-a' })
    const t1 = out.find((t) => t.id === 't1')!
    expect(t1.status).toBe('published')
    expect(t1.url).toBe('/blog/post-a')
    expect(out.find((t) => t.id === 't2')!.status).toBe('idea')
  })
  it('records feedback for changes-requested', () => {
    const out = applyTopicStatus(base, 'post-a', 'changes-requested', { feedback: 'shorter' })
    expect(out.find((t) => t.id === 't1')!.feedback).toBe('shorter')
  })
  it('returns topics unchanged when no slug matches (never throws)', () => {
    expect(applyTopicStatus(base, 'missing', 'published')).toEqual(base)
  })
  it('does not mutate the input array', () => {
    const copy = structuredClone(base)
    applyTopicStatus(base, 'post-a', 'rejected')
    expect(base).toEqual(copy)
  })
})
```

- [ ] **Step 2: Run it — expect FAIL** (`applyTopicStatus` not exported): `npm test -- studio-write`

- [ ] **Step 3: Implement `applyTopicStatus` + `slug` field + write helpers** in `lib/studio/github.ts`.

Add `slug?: string` to the `Topic` type. Then append:

```ts
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
```

- [ ] **Step 4: Create the session helper** — `app/studio/session.ts`:

```ts
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE } from '@/lib/studio/constants'
import { verifySessionToken } from '@/lib/studio/auth'

export async function hasValidStudioSession(): Promise<boolean> {
  const secret = process.env.AUTH_SECRET
  if (!secret) return false
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  return verifySessionToken(token, secret, Date.now())
}

export async function requireStudioSession(): Promise<void> {
  if (!(await hasValidStudioSession())) redirect('/studio/login')
}
```

- [ ] **Step 5: Run tests — expect PASS**: `npm test -- studio-write`

- [ ] **Step 6: Commit**

```bash
git add app/studio/session.ts lib/studio/github.ts lib/__tests__/studio-write.test.ts
git commit -m "feat(studio): github write helpers + session helper"
```

---

## Task 2: Server actions

**Files:**
- Create: `app/studio/actions.ts`

**Interfaces — Produces:** `approveAction(formData: FormData)`, `rejectAction(formData: FormData)`, `requestChangesAction(formData: FormData)` — all `'use server'`, auth-gated, revalidate `/studio`.

- [ ] **Step 1: Implement** — `app/studio/actions.ts`:

```ts
'use server'
import { revalidatePath } from 'next/cache'
import { hasValidStudioSession } from './session'
import { approveDraft, rejectDraft, requestChanges } from '@/lib/studio/github'

const SLUG_RE = /^[a-z0-9-]+$/

async function guard(formData: FormData): Promise<string> {
  if (!(await hasValidStudioSession())) throw new Error('Unauthorized')
  const slug = String(formData.get('slug') ?? '')
  if (!SLUG_RE.test(slug)) throw new Error('Invalid slug')
  return slug
}

export async function approveAction(formData: FormData) {
  const slug = await guard(formData)
  await approveDraft(slug)
  revalidatePath('/studio')
}

export async function rejectAction(formData: FormData) {
  const slug = await guard(formData)
  await rejectDraft(slug)
  revalidatePath('/studio')
}

export async function requestChangesAction(formData: FormData) {
  const slug = await guard(formData)
  const feedback = String(formData.get('feedback') ?? '').trim()
  if (!feedback) throw new Error('Feedback is required')
  await requestChanges(slug, feedback)
  revalidatePath('/studio')
}
```

- [ ] **Step 2: Build** — `npm run build` — Expected: succeeds (actions compile; `/studio` still dynamic).

- [ ] **Step 3: Commit**

```bash
git add app/studio/actions.ts
git commit -m "feat(studio): approve/reject/request-changes server actions"
```

---

## Task 3: Wire the review controls into the board

**Files:**
- Modify: `app/studio/page.tsx`

**Interfaces — Consumes:** `requireStudioSession` (session), `approveAction`/`rejectAction`/`requestChangesAction` (actions).

- [ ] **Step 1: Use the shared session guard.** In `app/studio/page.tsx`, delete the inline `requireSession()` function and its call; import and call the shared one:

```tsx
import { requireStudioSession } from './session'
// ...at the top of StudioPage():
await requireStudioSession()
```

- [ ] **Step 2: Add the review form** to each pending `<li>`. Import the actions:

```tsx
import { approveAction, rejectAction, requestChangesAction } from './actions'
```

Inside the pending-post `<li>`, after the rendered `{content}` block, add:

```tsx
                    <form className="mt-6 space-y-3 border-t border-border pt-4">
                      <input type="hidden" name="slug" value={p.slug} />
                      <textarea
                        name="feedback"
                        rows={2}
                        placeholder="What should change? (only used for Request changes)"
                        className="w-full border border-border bg-transparent px-3 py-2 text-sm"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          formAction={approveAction}
                          className="bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground"
                        >
                          Approve &amp; publish
                        </button>
                        <button
                          formAction={requestChangesAction}
                          className="border border-border px-3 py-1.5 text-sm text-foreground hover:border-brand"
                        >
                          Request changes
                        </button>
                        <button
                          formAction={rejectAction}
                          className="border border-border px-3 py-1.5 text-sm text-destructive hover:border-destructive"
                        >
                          Reject
                        </button>
                      </div>
                    </form>
```

(`p.slug` is already available on each `PendingDraft`.)

- [ ] **Step 3: Build + lint**

Run: `npm run build` — Expected: succeeds; `/studio` dynamic.
Run: `npm run lint` — Expected: no new errors in `app/studio/page.tsx`.

- [ ] **Step 4: Commit**

```bash
git add app/studio/page.tsx
git commit -m "feat(studio): approve/reject/request-changes controls on the board"
```

---

## Task 4: Verify

**Files:** none.

- [ ] **Step 1: Full tests** — `npm test` — all pass (existing + `studio-write`).
- [ ] **Step 2: Build** — `npm run build` — succeeds; `/studio` dynamic; existing routes/public site unchanged.
- [ ] **Step 3: Auth-gating of the actions (no live GitHub needed).** Confirm by reading the code that all three actions call `hasValidStudioSession()` before any write and validate `slug`. (A POST to an action without a valid session throws `Unauthorized`; render-time gating is not relied upon.)
- [ ] **Step 4: Lint** — `npm run lint` — no new errors.
- [ ] **Note (deferred to user):** the live write path (a real Approve committing to GitHub) requires the user's `GITHUB_TOKEN` scoped **Contents: read+write** plus a real `content/pending/<slug>.mdx`. That end-to-end test happens once the token is set (and naturally in Phase 3 when the pipeline produces a pending draft).

---

## Self-Review notes (reconciled)

- **Spec coverage:** Approve (move pending→blog + status published, one atomic commit) — Task 1 `approveDraft`; Reject (delete + rejected) — `rejectDraft`; Request-changes (feedback + changes-requested, draft kept) — `requestChanges`; buttons on the board — Task 3; auth re-checked inside actions — Task 2; atomic single-commit via Git Data API — Task 1 `commitFiles`.
- **Types consistent:** `Topic.slug`, `applyTopicStatus`, `approveDraft`/`rejectDraft`/`requestChanges`, `approveAction`/`rejectAction`/`requestChangesAction`, `hasValidStudioSession`/`requireStudioSession` names match across tasks + tests + page.
- **No placeholders:** all code complete. The GitHub write path is integration (real token) — unit-tested where pure (`applyTopicStatus`), smoke-tested live by the user.
- **Security:** each action authenticates server-side, validates `slug`, takes only slug+feedback from the client, re-reads files/topics from the repo.
