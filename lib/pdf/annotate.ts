import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export type Annotation =
  | { type: 'text'; page: number; x: number; y: number; text: string; size: number }
  | { type: 'rect'; page: number; x: number; y: number; width: number; height: number }
  | {
      type: 'replace'
      page: number
      // Baseline origin of the original text run (PDF coords, bottom-left origin).
      x: number
      y: number
      // Original text-run width and font size (PDF points), used to size the cover box.
      width: number
      size: number
      text: string
      // Background color to paint over the original glyphs (0–1 per channel).
      bg: { r: number; g: number; b: number }
    }

export async function applyAnnotations(
  buffer: Uint8Array,
  annotations: Annotation[],
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  const font = await doc.embedFont(StandardFonts.Helvetica)
  for (const a of annotations) {
    const page = doc.getPage(a.page)
    if (a.type === 'text') {
      page.drawText(a.text, { x: a.x, y: a.y, size: a.size, font, color: rgb(0, 0, 0) })
    } else if (a.type === 'rect') {
      page.drawRectangle({
        x: a.x, y: a.y, width: a.width, height: a.height,
        borderColor: rgb(1, 0, 0), borderWidth: 1.5,
      })
    } else {
      // replace: cover the original glyphs with a filled box, then draw the new text
      // on the original baseline. Box spans a little below the baseline (descender)
      // and up to the cap height, with small horizontal padding.
      const descent = a.size * 0.25
      page.drawRectangle({
        x: a.x - 1,
        y: a.y - descent,
        width: a.width + 2,
        height: a.size + descent,
        color: rgb(a.bg.r, a.bg.g, a.bg.b),
      })
      page.drawText(a.text, { x: a.x, y: a.y, size: a.size, font, color: rgb(0, 0, 0) })
    }
  }
  return doc.save()
}
