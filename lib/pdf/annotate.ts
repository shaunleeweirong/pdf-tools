import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export type Annotation =
  | { type: 'text'; page: number; x: number; y: number; text: string; size: number }
  | { type: 'rect'; page: number; x: number; y: number; width: number; height: number }

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
    } else {
      page.drawRectangle({
        x: a.x, y: a.y, width: a.width, height: a.height,
        borderColor: rgb(1, 0, 0), borderWidth: 1.5,
      })
    }
  }
  return doc.save()
}
