import { PDFDocument } from 'pdf-lib'

export async function merge(buffers: Uint8Array[]): Promise<Uint8Array> {
  const out = await PDFDocument.create()
  for (const buf of buffers) {
    const src = await PDFDocument.load(buf)
    const pages = await out.copyPages(src, src.getPageIndices())
    pages.forEach((p) => out.addPage(p))
  }
  return out.save()
}
