import { PDFDocument } from 'pdf-lib'

export async function flatten(buffer: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  const form = doc.getForm()
  form.flatten()
  return doc.save()
}
