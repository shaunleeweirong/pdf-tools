'use client'
import { useMemo, useState } from 'react'
import { TOOLS, type ToolCategory } from '@/lib/tools'
import { ToolCard } from './ToolCard'
import { Input } from '@/components/ui/input'

const CATEGORY_ORDER: ToolCategory[] = [
  'Organize',
  'Convert',
  'Page tools',
  'Forms & sign',
  'Edit',
  'Security',
]

export function ToolGrid() {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return TOOLS.filter(
      (t) =>
        !needle ||
        t.name.toLowerCase().includes(needle) ||
        t.description.toLowerCase().includes(needle),
    )
  }, [q])

  return (
    <div>
      <Input
        placeholder="Search tools…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mx-auto mb-12 h-11 max-w-md"
      />
      {CATEGORY_ORDER.map((cat) => {
        const items = filtered.filter((t) => t.category === cat)
        if (items.length === 0) return null
        return (
          <section key={cat} className="mb-12">
            <h2 className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <span className="inline-block size-1.5 bg-brand" aria-hidden />
              {cat}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
