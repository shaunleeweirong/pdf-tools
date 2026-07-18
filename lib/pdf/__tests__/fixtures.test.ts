import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { readFixture } from './helpers'

describe('fixtures', () => {
  it('multi-5p.pdf has 5 pages', async () => {
    const doc = await PDFDocument.load(readFixture('multi-5p.pdf'))
    expect(doc.getPageCount()).toBe(5)
  })

  it('red-100x100.png is a valid 100x100 PNG embeddable by pdf-lib', async () => {
    const doc = await PDFDocument.create()
    const img = await doc.embedPng(readFixture('red-100x100.png'))
    expect(img.width).toBe(100)
    expect(img.height).toBe(100)
  })
})
