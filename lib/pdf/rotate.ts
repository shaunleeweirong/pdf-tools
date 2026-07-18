import { PDFDocument, degrees } from 'pdf-lib'

export async function rotate(
  buffer: Uint8Array,
  degreesCw: number,
  pageIndices?: number[],
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  const pages = doc.getPages()
  const targets = pageIndices ?? pages.map((_, i) => i)
  for (const i of targets) {
    const current = pages[i].getRotation().angle
    pages[i].setRotation(degrees((current + degreesCw) % 360))
  }
  return doc.save()
}
