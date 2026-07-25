import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { fetchKeywordMap, listPendingDrafts, groupPipeline, type Topic } from '@/lib/studio/github'
import { mdxComponents } from '@/components/mdx'
import { requireStudioSession } from './session'
import { approveAction, rejectAction, requestChangesAction } from './actions'

export const dynamic = 'force-dynamic'

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

const header = (
  <div className="flex items-center justify-between">
    <h1 className="text-3xl font-semibold tracking-tight">Content Studio</h1>
    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
    <a href="/studio/logout" className="text-sm text-muted-foreground hover:text-foreground">Log out</a>
  </div>
)

export default async function StudioPage() {
  await requireStudioSession()

  let data: { board: ReturnType<typeof groupPipeline>; pending: Awaited<ReturnType<typeof listPendingDrafts>> } | null = null
  let fetchError: string | null = null

  try {
    const [{ topics }, pending] = await Promise.all([fetchKeywordMap(), listPendingDrafts()])
    const board = groupPipeline(topics)
    data = { board, pending }
  } catch (err) {
    fetchError = err instanceof Error ? err.message : String(err)
  }

  if (fetchError !== null || data === null) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        {header}
        <p className="mt-10 text-sm text-destructive">
          Couldn&apos;t reach GitHub — check the GITHUB_TOKEN env var. ({fetchError})
        </p>
      </main>
    )
  }

  const { board, pending } = data

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {header}

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
