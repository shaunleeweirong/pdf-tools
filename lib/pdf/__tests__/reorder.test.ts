import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { reorder } from '@/lib/pdf/reorder'
import { readFixture } from './helpers'

describe('reorder', () => {
  it('reorders and can drop pages', async () => {
    const out = await reorder(readFixture('multi-5p.pdf'), [4, 3, 2, 1, 0])
    expect((await PDFDocument.load(out)).getPageCount()).toBe(5)
    const dropped = await reorder(readFixture('multi-5p.pdf'), [0, 1])
    expect((await PDFDocument.load(dropped)).getPageCount()).toBe(2)
  })
})
