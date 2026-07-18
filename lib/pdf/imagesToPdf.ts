import { PDFDocument } from 'pdf-lib'

export async function imagesToPdf(
  images: { bytes: Uint8Array; type: 'image/jpeg' | 'image/png' }[],
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  for (const img of images) {
    const embedded =
      img.type === 'image/png' ? await doc.embedPng(img.bytes) : await doc.embedJpg(img.bytes)
    const page = doc.addPage([embedded.width, embedded.height])
    page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height })
  }
  return doc.save()
}
