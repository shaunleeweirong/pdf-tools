import { PDFDocument } from 'pdf-lib'

export async function deletePages(buffer: Uint8Array, pageIndices: number[]): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  // Remove from highest index down so earlier indices stay valid.
  for (const i of [...pageIndices].sort((a, b) => b - a)) {
    doc.removePage(i)
  }
  return doc.save()
}
