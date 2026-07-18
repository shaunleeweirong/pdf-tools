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

  it('applies a replace (cover + retype) annotation without changing page count', async () => {
    // multi-5p.pdf renders "Page N" text on each page; cover page 1's run and retype.
    const out = await applyAnnotations(readFixture('multi-5p.pdf'), [
      {
        type: 'replace',
        page: 0,
        x: 50,
        y: 350,
        width: 60,
        size: 24,
        text: 'Edited 1',
        bg: { r: 1, g: 1, b: 1 },
      },
    ])
    const doc = await PDFDocument.load(out)
    expect(doc.getPageCount()).toBe(5)
    expect(out.length).toBeGreaterThan(0)
  })
})
