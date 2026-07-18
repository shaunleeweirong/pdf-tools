import { PDFDocument } from 'pdf-lib'

export async function nUp(buffer: Uint8Array, perSheet: 2 | 4): Promise<Uint8Array> {
  const src = await PDFDocument.load(buffer)
  const out = await PDFDocument.create()
  const embedded = await out.embedPdf(buffer, src.getPageIndices())
  const cols = perSheet === 2 ? 1 : 2
  const rows = perSheet === 2 ? 2 : 2
  // Use A4 portrait sheet.
  const sheetW = 595
  const sheetH = 842
  const cellW = sheetW / cols
  const cellH = sheetH / rows
  for (let i = 0; i < embedded.length; i += perSheet) {
    const page = out.addPage([sheetW, sheetH])
    for (let j = 0; j < perSheet && i + j < embedded.length; j++) {
      const emb = embedded[i + j]
      const col = j % cols
      const row = Math.floor(j / cols)
      const scale = Math.min(cellW / emb.width, cellH / emb.height)
      const w = emb.width * scale
      const h = emb.height * scale
      page.drawPage(emb, {
        x: col * cellW + (cellW - w) / 2,
        y: sheetH - (row + 1) * cellH + (cellH - h) / 2,
        width: w,
        height: h,
      })
    }
  }
  return out.save()
}
