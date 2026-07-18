import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { watermarkText } from '@/lib/pdf/watermark'
import { readFixture } from './helpers'

describe('watermarkText', () => {
  it('returns a valid PDF with the same page count', async () => {
    const out = await watermarkText(readFixture('multi-5p.pdf'), 'CONFIDENTIAL')
    const doc = await PDFDocument.load(out)
    expect(doc.getPageCount()).toBe(5)
    expect(out.length).toBeGreaterThan(0)
  })
})
