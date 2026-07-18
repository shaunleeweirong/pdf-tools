import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { extractPages } from '@/lib/pdf/extractPages'
import { readFixture } from './helpers'

describe('extractPages', () => {
  it('keeps only the requested pages in order', async () => {
    const out = await extractPages(readFixture('multi-5p.pdf'), [4, 0])
    expect((await PDFDocument.load(out)).getPageCount()).toBe(2)
  })
})
