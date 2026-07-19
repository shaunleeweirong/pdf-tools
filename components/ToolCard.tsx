import Link from 'next/link'
import type { Tool } from '@/lib/tools'
import { ToolIcon } from './ToolIcon'

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="soft-raised group block h-full rounded-lg p-5 focus-visible:outline-none"
    >
      <div className="flex items-start gap-3">
        <ToolIcon slug={tool.slug} category={tool.category} />
        <div className="min-w-0 flex-1">
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
        </div>
      </div>
    </Link>
  )
}
