import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { fillForm, listTextFields } from '@/lib/pdf/fillForm'
import { readFixture } from './helpers'

describe('fillForm', () => {
  it('lists and fills a text field', async () => {
    const buf = readFixture('form.pdf')
    expect(await listTextFields(buf)).toContain('fullName')
    const out = await fillForm(buf, { fullName: 'Ada Lovelace' })
    const doc = await PDFDocument.load(out)
    expect(doc.getForm().getTextField('fullName').getText()).toBe('Ada Lovelace')
  })
})
