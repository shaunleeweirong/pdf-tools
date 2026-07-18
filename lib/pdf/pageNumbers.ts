import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function addPageNumbers(
  buffer: Uint8Array,
  opts: { start?: number } = {},
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const start = opts.start ?? 1
  doc.getPages().forEach((page, i) => {
    const { width } = page.getSize()
    const label = String(start + i)
    const size = 10
    const tw = font.widthOfTextAtSize(label, size)
    page.drawText(label, { x: width / 2 - tw / 2, y: 20, size, font, color: rgb(0, 0, 0) })
  })
  return doc.save()
}
