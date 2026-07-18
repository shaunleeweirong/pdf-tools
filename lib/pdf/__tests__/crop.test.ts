import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { crop } from '@/lib/pdf/crop'
import { readFixture } from './helpers'

describe('crop', () => {
  it('reduces the crop box by the margins', async () => {
    const out = await crop(readFixture('blank-1p.pdf'), { top: 10, right: 10, bottom: 10, left: 10 })
    const doc = await PDFDocument.load(out)
    const page = doc.getPage(0)
    // original blank page is 300x400; cropbox width should now be 280
    expect(Math.round(page.getCropBox().width)).toBe(280)
    expect(Math.round(page.getCropBox().height)).toBe(380)
  })
})
