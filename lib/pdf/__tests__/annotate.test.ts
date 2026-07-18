import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { applyAnnotations } from '@/lib/pdf/annotate'
import { readFixture } from './helpers'

describe('applyAnnotations', () => {
  it('draws text and a rect without changing page count', async () => {
    const out = await applyAnnotations(readFixture('blank-1p.pdf'), [
      { type: 'text', page: 0, x: 20, y: 20, text: 'Hello', size: 12 },
      { type: 'rect', page: 0, x: 40, y: 40, width: 50, height: 20 },
    ])
    expect((await PDFDocument.load(out)).getPageCount()).toBe(1)
    expect(out.length).toBeGreaterThan(0)
  })
})
