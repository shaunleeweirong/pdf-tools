import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { readFixture } from './helpers'

describe('fixtures', () => {
  it('multi-5p.pdf has 5 pages', async () => {
    const doc = await PDFDocument.load(readFixture('multi-5p.pdf'))
    expect(doc.getPageCount()).toBe(5)
  })
})
