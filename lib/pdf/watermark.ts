import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib'

export async function watermarkText(
  buffer: Uint8Array,
  text: string,
  opts: { opacity?: number; fontSize?: number } = {},
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  const font = await doc.embedFont(StandardFonts.HelveticaBold)
  const opacity = opts.opacity ?? 0.25
  const size = opts.fontSize ?? 48
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize()
    const textWidth = font.widthOfTextAtSize(text, size)
    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(45),
    })
  }
  return doc.save()
}
