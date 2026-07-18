import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { flatten } from '@/lib/pdf/flatten'
import { readFixture } from './helpers'

describe('flatten', () => {
  it('removes interactive form fields', async () => {
    const out = await flatten(readFixture('form.pdf'))
    const doc = await PDFDocument.load(out)
    expect(doc.getForm().getFields().length).toBe(0)
  })
})
