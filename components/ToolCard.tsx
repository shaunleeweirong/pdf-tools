import Link from 'next/link'
import type { Tool } from '@/lib/tools'

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group block h-full rounded-lg border border-white/10 bg-card p-5 transition-colors duration-200 hover:border-brand/60 hover:bg-[#191919] focus-visible:border-brand focus-visible:outline-none"
    >
      <h3 className="font-medium tracking-tight text-foreground">{tool.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
    </Link>
  )
}
