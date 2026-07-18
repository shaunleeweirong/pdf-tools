import { PDFDocument } from 'pdf-lib'

export function parseRanges(spec: string, pageCount: number): number[][] {
  return spec
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [rawA, rawB] = part.split('-')
      const a = parseInt(rawA, 10)
      const b = rawB !== undefined ? parseInt(rawB, 10) : NaN
      const start = a
      const end = Number.isNaN(b) ? a : b
      const group: number[] = []
      for (let p = start; p <= end; p++) {
        if (p >= 1 && p <= pageCount) group.push(p - 1)
      }
      return group
    })
    .filter((g) => g.length > 0)
}

export async function split(buffer: Uint8Array, groups: number[][]): Promise<Uint8Array[]> {
  const src = await PDFDocument.load(buffer)
  const outs: Uint8Array[] = []
  for (const group of groups) {
    const doc = await PDFDocument.create()
    const pages = await doc.copyPages(src, group)
    pages.forEach((p) => doc.addPage(p))
    outs.push(await doc.save())
  }
  return outs
}
