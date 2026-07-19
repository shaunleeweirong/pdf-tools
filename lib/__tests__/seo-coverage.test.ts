import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { TOOL_SLUGS } from '@/lib/tools'

describe('per-tool SEO layouts', () => {
  it('every tool route has a server layout.tsx', () => {
    const missing = TOOL_SLUGS.filter(
      (slug) => !existsSync(path.resolve(process.cwd(), 'app', slug, 'layout.tsx'))
    )
    expect(missing, `missing layouts: ${missing.join(', ')}`).toEqual([])
  })
})
