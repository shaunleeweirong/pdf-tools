import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { merge } from '@/lib/pdf/merge'
import { readFixture } from './helpers'

describe('merge', () => {
  it('combines page counts of all inputs', async () => {
    const out = await merge([readFixture('blank-1p.pdf'), readFixture('multi-5p.pdf')])
    const doc = await PDFDocument.load(out)
    expect(doc.getPageCount()).toBe(6)
  })
})
