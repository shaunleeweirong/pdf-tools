import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { addPageNumbers } from '@/lib/pdf/pageNumbers'
import { readFixture } from './helpers'

describe('addPageNumbers', () => {
  it('keeps page count and returns a valid PDF', async () => {
    const out = await addPageNumbers(readFixture('multi-5p.pdf'))
    expect((await PDFDocument.load(out)).getPageCount()).toBe(5)
  })
})
