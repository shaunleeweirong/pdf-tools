'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { TOOLS, type ToolCategory } from '@/lib/tools'
import { ToolCard } from './ToolCard'
import { Reveal } from './Reveal'
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
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return TOOLS.filter(
      (t) =>
        !needle ||
        t.name.toLowerCase().includes(needle) ||
        t.description.toLowerCase().includes(needle),
    )
  }, [q])

  // "/" focuses search (unless already typing in a field).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName ?? ''
      if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div>
      <div className="relative mx-auto mb-12 w-full max-w-lg">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          ref={inputRef}
          type="search"
          aria-label="Search tools"
          placeholder="Search 22 tools…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="soft-inset h-12 rounded-xl pl-11 pr-12 text-base"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:flex">
          /
        </kbd>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No tools match “{q}”. Try another word.
        </p>
      ) : (
        CATEGORY_ORDER.map((cat) => {
          const items = filtered.filter((t) => t.category === cat)
          if (items.length === 0) return null
          return (
            <Reveal key={cat}>
              <section className="mb-12">
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
            </Reveal>
          )
        })
      )}
    </div>
  )
}
