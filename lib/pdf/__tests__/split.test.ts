import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { split, parseRanges } from '@/lib/pdf/split'
import { readFixture } from './helpers'

describe('split', () => {
  it('parses ranges into 0-indexed groups', () => {
    expect(parseRanges('1-3,5', 5)).toEqual([[0, 1, 2], [4]])
  })
  it('produces one PDF per group with correct page counts', async () => {
    const outs = await split(readFixture('multi-5p.pdf'), [[0, 1], [4]])
    expect(outs).toHaveLength(2)
    expect((await PDFDocument.load(outs[0])).getPageCount()).toBe(2)
    expect((await PDFDocument.load(outs[1])).getPageCount()).toBe(1)
  })
})
