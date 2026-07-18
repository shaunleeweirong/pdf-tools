import { PDFDocument } from 'pdf-lib'

export async function extractPages(buffer: Uint8Array, pageIndices: number[]): Promise<Uint8Array> {
  const src = await PDFDocument.load(buffer)
  const doc = await PDFDocument.create()
  const pages = await doc.copyPages(src, pageIndices)
  pages.forEach((p) => doc.addPage(p))
  return doc.save()
}
