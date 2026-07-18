import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'

describe('pdf-lib', () => {
  it('creates and saves an empty document', async () => {
    const doc = await PDFDocument.create()
    doc.addPage([200, 200])
    const bytes = await doc.save()
    expect(bytes.length).toBeGreaterThan(0)
    // PDF magic number "%PDF"
    expect(new TextDecoder().decode(bytes.slice(0, 4))).toBe('%PDF')
  })
})
