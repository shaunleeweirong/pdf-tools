import Link from 'next/link'
import { getToolSeo } from '@/lib/seo'
import { TOOLS, getTool } from '@/lib/tools'

/**
 * Visible, extractable page content for a tool: an answer-first intro, a
 * How-to steps list, an FAQ, and related-tool links. Mirrors the HowTo /
 * FAQPage JSON-LD emitted by the route layout, so the structured data is
 * always backed by content a reader (and an AI answer engine) can see.
 */
export function ToolContent({ slug }: { slug: string }) {
  const { name, intro, steps, faq } = getToolSeo(slug)
  const tool = getTool(slug)
  const related = TOOLS.filter((t) => t.category === tool?.category && t.slug !== slug).slice(0, 5)

  return (
    <section className="mx-auto mt-16 max-w-3xl space-y-10 border-t border-border pt-10">
      <p className="text-base leading-relaxed text-muted-foreground">{intro}</p>

      {steps.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            How to {name.toLowerCase()}
          </h2>
          <ol className="mt-4 space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span
                  aria-hidden
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center bg-brand/15 font-mono text-[0.7rem] text-brand"
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {faq.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Frequently asked questions
          </h2>
          <dl className="mt-4 space-y-5">
            {faq.map((item, i) => (
              <div key={i}>
                <dt className="font-medium text-foreground">{item.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Related tools</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {related.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/${t.slug}`}
                  className="inline-block border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
