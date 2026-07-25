# Content Studio — Phase 1 (read-only dashboard) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A private, password-protected `/studio` page that shows the content pipeline as a board (backlog / in-progress / needs-approval / published), read **live** from the GitHub repo. Read-only — approve/reject is Phase 2.

**Architecture:** Git is the database. `/studio` is a dynamic (server-rendered) route that reads `content/keyword-map.json` + `content/pending/*.mdx` from GitHub via the Contents API. Auth = a signed session cookie: an **optimistic presence check in `proxy.ts`** (Next 16's renamed middleware) plus the **authoritative HMAC verify in the server component**. The public PDF site is untouched (static, no auth).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, `node:crypto` (HMAC), built-in `fetch` (GitHub API), `gray-matter` + `next-mdx-remote/rsc` (already installed), Vitest.

## Global Constraints

- **Next 16 middleware is `proxy.ts`** (root), `export function proxy(req: NextRequest)` + `export const config = { matcher }`. Per Next 16 guidance, proxy does only an **optimistic** check (cookie present?); the **real** auth verify happens in the `/studio` server component / actions. (Ref: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`.)
- `cookies()` from `next/headers` is **async**: `const store = await cookies()`. Cookies can only be *set* in a Server Action or Route Handler, not a Server Component.
- **Testable logic lives in `lib/`** (Vitest `include` is `lib/**`); tests in `lib/__tests__/`. Pure functions (`auth`, `groupPipeline`) are unit-tested; `fetch`-based reads are smoke-verified on the running app.
- **No new runtime dependencies** (`fetch`, `node:crypto` built-in; `gray-matter`, `next-mdx-remote` already present).
- **Secrets (server-only, never sent to client):** `STUDIO_PASSWORD`, `AUTH_SECRET`, `GITHUB_TOKEN`, `GITHUB_REPO` (default `shaunleeweirong/pdf-tools`), branch `main`.
- **`SESSION_COOKIE` constant lives in `lib/studio/constants.ts`** (no `node:crypto` import) so `proxy.ts` can import it without pulling Node crypto into the proxy runtime.
- Only `/studio/**` is dynamic + gated. Do not change any existing route.
- Work on a branch (`content-studio-p1`); do NOT push (push to `main` auto-deploys). Conventional commits ending with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

## File Structure

- `lib/studio/constants.ts` — `SESSION_COOKIE` (+ shared status/board types). No Node imports.
- `lib/studio/auth.ts` — `createSessionToken` / `verifySessionToken` (HMAC + expiry, `node:crypto`).
- `lib/studio/github.ts` — GitHub Contents API reads + pure `groupPipeline(topics)`.
- `lib/__tests__/studio-auth.test.ts`, `lib/__tests__/studio-pipeline.test.ts` — unit tests.
- `proxy.ts` — optimistic gate for `/studio/**`.
- `app/studio/login/page.tsx` + `app/studio/login/action.ts` — login form + server action.
- `app/studio/page.tsx` — the dashboard (force-dynamic, real verify, board + previews).
- `app/studio/logout/route.ts` — clears the cookie.
- `.env.example` — documents the four secrets.

---

## Task 1: Session auth (HMAC cookie)

**Files:**
- Create: `lib/studio/constants.ts`, `lib/studio/auth.ts`
- Test: `lib/__tests__/studio-auth.test.ts`

**Interfaces — Produces:** `SESSION_COOKIE: string`; `createSessionToken(secret: string, nowMs: number, ttlMs?: number): string`; `verifySessionToken(token: string | undefined, secret: string, nowMs: number): boolean`.

- [ ] **Step 1: Write the failing test** — `lib/__tests__/studio-auth.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { createSessionToken, verifySessionToken } from '@/lib/studio/auth'

const SECRET = 'test-secret'
const NOW = 1_000_000

describe('session token', () => {
  it('verifies a token signed with the same secret', () => {
    const t = createSessionToken(SECRET, NOW)
    expect(verifySessionToken(t, SECRET, NOW + 1000)).toBe(true)
  })
  it('rejects a token signed with a different secret', () => {
    const t = createSessionToken(SECRET, NOW)
    expect(verifySessionToken(t, 'other', NOW + 1000)).toBe(false)
  })
  it('rejects an expired token', () => {
    const t = createSessionToken(SECRET, NOW, 1000)
    expect(verifySessionToken(t, SECRET, NOW + 2000)).toBe(false)
  })
  it('rejects a tampered or missing token', () => {
    const t = createSessionToken(SECRET, NOW)
    expect(verifySessionToken(t.slice(0, -2) + 'xx', SECRET, NOW + 1)).toBe(false)
    expect(verifySessionToken(undefined, SECRET, NOW)).toBe(false)
  })
})
```

- [ ] **Step 2: Run it — expect FAIL** (`Cannot find module '@/lib/studio/auth'`): `npm test -- studio-auth`

- [ ] **Step 3: Implement** — `lib/studio/constants.ts`:

```ts
export const SESSION_COOKIE = 'studio_session'
```

`lib/studio/auth.ts`:

```ts
import { createHmac, timingSafeEqual } from 'node:crypto'

const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000

function sign(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('base64url')
}

export function createSessionToken(secret: string, nowMs: number, ttlMs: number = DEFAULT_TTL_MS): string {
  const exp = String(nowMs + ttlMs)
  return `${exp}.${sign(exp, secret)}`
}

export function verifySessionToken(token: string | undefined, secret: string, nowMs: number): boolean {
  if (!token) return false
  const dot = token.indexOf('.')
  if (dot < 1) return false
  const exp = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = sign(exp, secret)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false
  return Number(exp) > nowMs
}
```

- [ ] **Step 4: Run it — expect PASS**: `npm test -- studio-auth`

- [ ] **Step 5: Commit**

```bash
git add lib/studio/constants.ts lib/studio/auth.ts lib/__tests__/studio-auth.test.ts
git commit -m "feat(studio): signed session token"
```

---

## Task 2: GitHub read lib + pipeline grouping

**Files:**
- Create: `lib/studio/github.ts`
- Test: `lib/__tests__/studio-pipeline.test.ts`

**Interfaces — Produces:**
- `type Topic = { id: string; surface: string; targetQuery: string; intent?: string; priority?: number; status: string; url?: string; feedback?: string }`
- `type Board = { backlog: Topic[]; inProgress: Topic[]; needsApproval: Topic[]; published: Topic[]; rejected: Topic[] }`
- `groupPipeline(topics: Topic[]): Board` (pure)
- `type PendingDraft = { slug: string; title: string; description: string; body: string; words: number }`
- `async fetchKeywordMap(): Promise<{ topics: Topic[] }>`; `async listPendingDrafts(): Promise<PendingDraft[]>` (GitHub Contents API; require `GITHUB_TOKEN`).

- [ ] **Step 1: Write the failing test** — `lib/__tests__/studio-pipeline.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { groupPipeline, type Topic } from '@/lib/studio/github'

const topics: Topic[] = [
  { id: 'a', surface: 'blog', targetQuery: 'a', status: 'idea' },
  { id: 'b', surface: 'blog', targetQuery: 'b', status: 'briefed' },
  { id: 'c', surface: 'blog', targetQuery: 'c', status: 'changes-requested' },
  { id: 'd', surface: 'blog', targetQuery: 'd', status: 'pending' },
  { id: 'e', surface: 'blog', targetQuery: 'e', status: 'published', url: '/blog/e' },
  { id: 'f', surface: 'blog', targetQuery: 'f', status: 'rejected' },
]

describe('groupPipeline', () => {
  it('buckets topics by pipeline stage', () => {
    const b = groupPipeline(topics)
    expect(b.backlog.map((t) => t.id)).toEqual(['a'])
    expect(b.inProgress.map((t) => t.id).sort()).toEqual(['b', 'c'])
    expect(b.needsApproval.map((t) => t.id)).toEqual(['d'])
    expect(b.published.map((t) => t.id)).toEqual(['e'])
    expect(b.rejected.map((t) => t.id)).toEqual(['f'])
  })
})
```

- [ ] **Step 2: Run it — expect FAIL**: `npm test -- studio-pipeline`

- [ ] **Step 3: Implement** — `lib/studio/github.ts`:

```ts
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
```

> Note: `Accept: application/vnd.github.raw+json` returns file contents as raw text (not base64), so `res.text()` is the file body directly.

- [ ] **Step 4: Run it — expect PASS**: `npm test -- studio-pipeline`

- [ ] **Step 5: Commit**

```bash
git add lib/studio/github.ts lib/__tests__/studio-pipeline.test.ts
git commit -m "feat(studio): github read lib + pipeline grouping"
```

---

## Task 3: Login (form + server action) + proxy gate

**Files:**
- Create: `app/studio/login/page.tsx`, `app/studio/login/action.ts`, `app/studio/logout/route.ts`, `proxy.ts`

**Interfaces — Consumes:** `SESSION_COOKIE` (constants), `createSessionToken` (auth). **Produces:** a working login that sets the cookie + a gate that redirects unauthenticated `/studio/**` to `/studio/login`.

- [ ] **Step 1: Login server action** — `app/studio/login/action.ts`:

```ts
'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE } from '@/lib/studio/constants'
import { createSessionToken } from '@/lib/studio/auth'

export async function login(_prev: { error?: string } | null, formData: FormData) {
  const password = String(formData.get('password') ?? '')
  const expected = process.env.STUDIO_PASSWORD
  const secret = process.env.AUTH_SECRET
  if (!expected || !secret) return { error: 'Studio is not configured (missing env).' }
  if (password !== expected) return { error: 'Wrong password.' }
  const store = await cookies()
  store.set(SESSION_COOKIE, createSessionToken(secret, Date.now()), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  redirect('/studio')
}
```

- [ ] **Step 2: Login page** — `app/studio/login/page.tsx`:

```tsx
'use client'
import { useActionState } from 'react'
import { login } from './action'

export default function StudioLoginPage() {
  const [state, action, pending] = useActionState(login, null)
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold tracking-tight">Content Studio</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter the studio password.</p>
      <form action={action} className="mt-6 space-y-3">
        <input
          type="password"
          name="password"
          autoFocus
          className="w-full border border-border bg-transparent px-3 py-2 text-sm"
          placeholder="Password"
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-brand px-3 py-2 text-sm font-medium text-brand-foreground disabled:opacity-60"
        >
          {pending ? 'Checking…' : 'Enter'}
        </button>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      </form>
    </main>
  )
}
```

- [ ] **Step 3: Logout route** — `app/studio/logout/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/studio/constants'

export async function GET(request: Request) {
  const res = NextResponse.redirect(new URL('/studio/login', request.url))
  res.cookies.delete(SESSION_COOKIE)
  return res
}
```

- [ ] **Step 4: Proxy gate** — `proxy.ts` (project root):

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/studio/constants'

// Optimistic gate only (Next 16 guidance): presence check here, real verify in the page.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLogin = pathname === '/studio/login'
  if (pathname.startsWith('/studio') && !isLogin) {
    if (!request.cookies.get(SESSION_COOKIE)) {
      return NextResponse.redirect(new URL('/studio/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = { matcher: '/studio/:path*' }
```

- [ ] **Step 5: Build + commit**

Run: `npm run build` — Expected: succeeds; `/studio/login` present in the route list.

```bash
git add app/studio/login proxy.ts app/studio/logout
git commit -m "feat(studio): password login + proxy gate"
```

---

## Task 4: Dashboard board (read-only)

**Files:**
- Create: `app/studio/page.tsx`
- Create: `.env.example`

**Interfaces — Consumes:** `SESSION_COOKIE`, `verifySessionToken`, `fetchKeywordMap`, `groupPipeline`, `listPendingDrafts`, `mdxComponents`.

- [ ] **Step 1: Dashboard page** — `app/studio/page.tsx`:

```tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { SESSION_COOKIE } from '@/lib/studio/constants'
import { verifySessionToken } from '@/lib/studio/auth'
import { fetchKeywordMap, listPendingDrafts, groupPipeline, type Topic } from '@/lib/studio/github'
import { mdxComponents } from '@/components/mdx'

export const dynamic = 'force-dynamic'

async function requireSession() {
  const secret = process.env.AUTH_SECRET
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!secret || !verifySessionToken(token, secret, Date.now())) redirect('/studio/login')
}

function Column({ title, topics }: { title: string; topics: Topic[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title} <span className="text-brand">{topics.length}</span>
      </h2>
      <ul className="mt-3 space-y-2">
        {topics.map((t) => (
          <li key={t.id} className="border border-border px-3 py-2 text-sm">
            <span className="text-foreground">{t.targetQuery}</span>
            {t.url && (
              <a href={t.url} className="ml-2 text-brand underline-offset-4 hover:underline">↗</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function StudioPage() {
  await requireSession()
  const [{ topics }, pending] = await Promise.all([fetchKeywordMap(), listPendingDrafts()])
  const board = groupPipeline(topics)

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Content Studio</h1>
        <a href="/studio/logout" className="text-sm text-muted-foreground hover:text-foreground">Log out</a>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">
          Needs your approval <span className="text-brand">{pending.length}</span>
        </h2>
        {pending.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Nothing waiting. The pipeline will fill this.</p>
        ) : (
          <ul className="mt-4 space-y-8">
            {await Promise.all(
              pending.map(async (p) => {
                const { content } = await compileMDX({
                  source: p.body,
                  components: mdxComponents,
                  options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
                })
                return (
                  <li key={p.slug} className="border border-border p-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-xl font-semibold tracking-tight">{p.title}</h3>
                      <span className={`shrink-0 font-mono text-xs ${p.words >= 800 ? 'text-muted-foreground' : 'text-destructive'}`}>
                        {p.words} words
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                    <div className="mt-4 border-t border-border pt-4">{content}</div>
                    {/* Approve / Reject / Request-changes buttons arrive in Phase 2 */}
                  </li>
                )
              }),
            )}
          </ul>
        )}
      </section>

      <div className="mt-14 grid gap-8 sm:grid-cols-3">
        <Column title="Backlog" topics={board.backlog} />
        <Column title="In progress" topics={board.inProgress} />
        <Column title="Published" topics={board.published} />
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Document env** — `.env.example`:

```bash
# Content Studio (server-only secrets)
STUDIO_PASSWORD=          # the dashboard login password
AUTH_SECRET=              # random string used to sign the session cookie
GITHUB_TOKEN=             # fine-grained PAT, Contents read/write on this repo only
GITHUB_REPO=shaunleeweirong/pdf-tools
```

- [ ] **Step 3: Build**

Run: `npm run build` — Expected: succeeds; `/studio` is dynamic (ƒ), not static.

- [ ] **Step 4: Commit**

```bash
git add app/studio/page.tsx .env.example
git commit -m "feat(studio): read-only pipeline dashboard"
```

---

## Task 5: Verify end-to-end

**Files:** none.

- [ ] **Step 1: Full test suite** — `npm test` — all pass (existing + studio-auth + studio-pipeline).
- [ ] **Step 2: Local run with env.** Create `.env.local` with a test `STUDIO_PASSWORD`, a random `AUTH_SECRET`, a real `GITHUB_TOKEN` (contents read on the repo), and `GITHUB_REPO`. `npm run build && npm run start`.
- [ ] **Step 3: Auth gate.** `curl -sI localhost:3000/studio` → 307 redirect to `/studio/login` (no cookie). Visit `/studio/login` in a browser, wrong password → error, correct password → lands on `/studio`.
- [ ] **Step 4: Board.** `/studio` shows the backlog + published columns from `content/keyword-map.json`, and (once a `content/pending/*.mdx` exists on `main`) a "Needs approval" preview with a word count. Reads reflect the live repo.
- [ ] **Step 5: Lint** — `npm run lint` on the new files → no new errors.

---

## Self-Review notes (reconciled)

- **Spec coverage (Phase 1 rows):** private `/studio` (Task 4) + password auth (Tasks 1,3) + git-as-database read via GitHub API (Task 2) + board with backlog/in-progress/needs-approval/published + pending preview + word count (Task 4) + `.env` secrets (Task 4). Approve/Reject/Request-changes + the pipeline/schedule are **Phase 2/3** (separate plans).
- **Types consistent:** `Topic`/`Board`/`PendingDraft`, `SESSION_COOKIE`, `createSessionToken`/`verifySessionToken`, `fetchKeywordMap`/`listPendingDrafts`/`groupPipeline` names match across tasks + tests + page.
- **No placeholders:** all code is complete; the only "later" markers are explicit Phase-2 hooks (the buttons).
- **Next 16:** `proxy.ts` (not middleware) with optimistic check; real verify in the server component; `await cookies()`.
