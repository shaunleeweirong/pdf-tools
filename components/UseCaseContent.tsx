import Link from 'next/link'
import { getTool } from '@/lib/tools'
import { USE_CASES, type UseCase } from '@/content/use-cases'

/** Visible, extractable content for a programmatic use-case page (mirrors the
 * HowTo / FAQPage JSON-LD), plus links to the full tool and sibling use-cases. */
export function UseCaseContent({ uc }: { uc: UseCase }) {
  const tool = getTool(uc.tool)
  const siblings = USE_CASES.filter((u) => u.tool === uc.tool && u.useCase !== uc.useCase).slice(0, 4)

  return (
    <section className="mx-auto mt-16 max-w-3xl space-y-10 border-t border-border pt-10">
      <p className="text-base leading-relaxed text-muted-foreground">{uc.intro}</p>

      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          How to {uc.h1.toLowerCase()}
        </h2>
        <ol className="mt-4 space-y-3">
          {uc.steps.map((step, i) => (
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

      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Frequently asked questions
        </h2>
        <dl className="mt-4 space-y-5">
          {uc.faq.map((item, i) => (
            <div key={i}>
              <dt className="font-medium text-foreground">{item.q}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">More</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {tool && (
            <li>
              <Link
                href={`/${uc.tool}`}
                className="inline-block border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
              >
                Full {tool.name} tool
              </Link>
            </li>
          )}
          {siblings.map((s) => (
            <li key={s.useCase}>
              <Link
                href={`/${s.tool}/${s.useCase}`}
                className="inline-block border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
              >
                {s.h1}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
