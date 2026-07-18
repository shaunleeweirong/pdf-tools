import { PDFDocument } from 'pdf-lib'

export async function reorder(buffer: Uint8Array, order: number[]): Promise<Uint8Array> {
  const src = await PDFDocument.load(buffer)
  const doc = await PDFDocument.create()
  const pages = await doc.copyPages(src, order)
  pages.forEach((p) => doc.addPage(p))
  return doc.save()
}
