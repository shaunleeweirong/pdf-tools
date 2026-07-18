import { describe, it, expect } from 'vitest'
import { pdfFilename } from '@/lib/pdf/types'

describe('pdf types', () => {
  it('builds an output filename', () => {
    expect(pdfFilename('report.pdf', 'merged')).toBe('report-merged.pdf')
    expect(pdfFilename('a.PDF', 'split')).toBe('a-split.pdf')
  })
})
