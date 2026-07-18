import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { imagesToPdf } from '@/lib/pdf/imagesToPdf'
import { readFixture } from './helpers'

describe('imagesToPdf', () => {
  it('creates one page per image', async () => {
    const png = readFixture('red-100x100.png')
    const out = await imagesToPdf([
      { bytes: png, type: 'image/png' },
      { bytes: png, type: 'image/png' },
    ])
    expect((await PDFDocument.load(out)).getPageCount()).toBe(2)
  })
})
