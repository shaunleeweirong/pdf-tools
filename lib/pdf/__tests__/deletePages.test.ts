import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { deletePages } from '@/lib/pdf/deletePages'
import { readFixture } from './helpers'

describe('deletePages', () => {
  it('removes the specified pages', async () => {
    const out = await deletePages(readFixture('multi-5p.pdf'), [0, 4])
    expect((await PDFDocument.load(out)).getPageCount()).toBe(3)
  })
})
