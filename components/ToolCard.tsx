import Link from 'next/link'
import type { Tool } from '@/lib/tools'

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group block h-full rounded-lg border border-white/10 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/60 hover:bg-[#191919] hover:shadow-[0_10px_30px_-12px_rgba(0,68,255,0.35)] focus-visible:border-brand focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium tracking-tight text-foreground">{tool.name}</h3>
        <span
          aria-hidden
          className="-translate-x-1 text-brand opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
        >
          →
        </span>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
    </Link>
  )
}
