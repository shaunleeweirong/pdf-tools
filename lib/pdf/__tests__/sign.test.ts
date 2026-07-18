import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { placeSignature } from '@/lib/pdf/sign'
import { readFixture } from './helpers'

describe('placeSignature', () => {
  it('embeds a signature image and keeps the page count', async () => {
    const out = await placeSignature(readFixture('blank-1p.pdf'), readFixture('red-100x100.png'), {
      pageIndex: 0, x: 50, y: 50, width: 120,
    })
    expect((await PDFDocument.load(out)).getPageCount()).toBe(1)
    expect(out.length).toBeGreaterThan(0)
  })
})
