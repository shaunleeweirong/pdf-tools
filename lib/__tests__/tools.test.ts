import { describe, it, expect } from 'vitest'
import { TOOLS, getTool } from '@/lib/tools'

describe('tool registry', () => {
  it('has unique slugs', () => {
    const slugs = TOOLS.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
  it('looks up a tool by slug', () => {
    expect(getTool('merge-pdf')?.name).toBe('Merge PDF')
  })
})
