import { PDFDocument } from 'pdf-lib'

export async function crop(
  buffer: Uint8Array,
  margins: { top: number; right: number; bottom: number; left: number },
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize()
    page.setCropBox(
      margins.left,
      margins.bottom,
      width - margins.left - margins.right,
      height - margins.top - margins.bottom,
    )
  }
  return doc.save()
}
