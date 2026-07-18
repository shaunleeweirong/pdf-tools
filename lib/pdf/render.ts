import { getPdfjs } from './pdfjs'

export async function getPageCount(pdfBytes: Uint8Array): Promise<number> {
  const pdfjs = getPdfjs()
  const loadingTask = pdfjs.getDocument({ data: pdfBytes.slice() })
  const doc = await loadingTask.promise
  const n = doc.numPages
  await doc.cleanup()
  await loadingTask.destroy()
  return n
}

export async function renderThumbnails(pdfBytes: Uint8Array, scale = 0.4): Promise<string[]> {
  const pdfjs = getPdfjs()
  const loadingTask = pdfjs.getDocument({ data: pdfBytes.slice() })
  const doc = await loadingTask.promise
  const out: string[] = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvas, viewport }).promise
    out.push(canvas.toDataURL('image/png'))
    page.cleanup()
  }
  await doc.cleanup()
  await loadingTask.destroy()
  return out
}

export async function renderPageToImageBlob(
  pdfBytes: Uint8Array,
  pageIndex: number,
  scale: number,
  mime: 'image/png' | 'image/jpeg',
  quality = 0.92,
): Promise<Blob> {
  const pdfjs = getPdfjs()
  const loadingTask = pdfjs.getDocument({ data: pdfBytes.slice() })
  const doc = await loadingTask.promise
  const page = await doc.getPage(pageIndex + 1)
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height
  await page.render({ canvas, viewport }).promise
  page.cleanup()
  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('canvas.toBlob returned null'))), mime, quality),
  )
  await doc.cleanup()
  await loadingTask.destroy()
  return blob
}
