import { PDFDocument, PDFTextField } from 'pdf-lib'

export async function listTextFields(buffer: Uint8Array): Promise<string[]> {
  const doc = await PDFDocument.load(buffer)
  return doc
    .getForm()
    .getFields()
    .filter((f): f is PDFTextField => f instanceof PDFTextField)
    .map((f) => f.getName())
}

export async function fillForm(
  buffer: Uint8Array,
  values: Record<string, string>,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  const form = doc.getForm()
  for (const [name, value] of Object.entries(values)) {
    const field = form.getTextField(name)
    field.setText(value)
  }
  return doc.save()
}
