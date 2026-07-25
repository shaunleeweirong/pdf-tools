import Link from 'next/link'
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
        <Link href="/studio/logout" className="text-sm text-muted-foreground hover:text-foreground">Log out</Link>
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
