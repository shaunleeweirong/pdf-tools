import { PDFDocument } from 'pdf-lib'

export async function placeSignature(
  buffer: Uint8Array,
  pngBytes: Uint8Array,
  opts: { pageIndex: number; x: number; y: number; width: number },
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  const png = await doc.embedPng(pngBytes)
  const height = (png.height / png.width) * opts.width
  const page = doc.getPage(opts.pageIndex)
  page.drawImage(png, { x: opts.x, y: opts.y, width: opts.width, height })
  return doc.save()
}
