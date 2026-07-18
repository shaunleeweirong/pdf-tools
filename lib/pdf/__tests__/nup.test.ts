import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { nUp } from '@/lib/pdf/nup'
import { readFixture } from './helpers'

describe('nUp', () => {
  it('packs 4 source pages onto ceil(5/4)=2 sheets', async () => {
    const out = await nUp(readFixture('multi-5p.pdf'), 4)
    expect((await PDFDocument.load(out)).getPageCount()).toBe(2)
  })
})
