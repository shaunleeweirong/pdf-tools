import { getPdfjs } from './pdfjs'
import { imagesToPdf } from './imagesToPdf'

export async function getPageCount(pdfBytes: Uint8Array): Promise<number> {
  const pdfjs = await getPdfjs()
  const loadingTask = pdfjs.getDocument({ data: pdfBytes.slice() })
  const doc = await loadingTask.promise
  const n = doc.numPages
  await doc.cleanup()
  await loadingTask.destroy()
  return n
}

export async function renderThumbnails(pdfBytes: Uint8Array, scale = 0.4): Promise<string[]> {
  const pdfjs = await getPdfjs()
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
  const pdfjs = await getPdfjs()
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

export async function extractPageImages(pdfBytes: Uint8Array): Promise<Blob[]> {
  const count = await getPageCount(pdfBytes)
  const blobs: Blob[] = []
  for (let i = 0; i < count; i++) {
    blobs.push(await renderPageToImageBlob(pdfBytes, i, 2, 'image/png'))
  }
  return blobs
}

export async function diffFirstPage(a: Uint8Array, b: Uint8Array): Promise<string> {
  const pdfjs = await getPdfjs()
  async function raster(bytes: Uint8Array) {
    const loadingTask = pdfjs.getDocument({ data: bytes.slice() })
    const doc = await loadingTask.promise
    const page = await doc.getPage(1)
    const viewport = page.getViewport({ scale: 1.5 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!
    await page.render({ canvas, viewport }).promise
    page.cleanup()
    await doc.cleanup()
    await loadingTask.destroy()
    return { canvas, ctx, w: canvas.width, h: canvas.height }
  }
  const ra = await raster(a)
  const rb = await raster(b)
  const w = Math.min(ra.w, rb.w)
  const h = Math.min(ra.h, rb.h)
  const da = ra.ctx.getImageData(0, 0, w, h)
  const db = rb.ctx.getImageData(0, 0, w, h)
  const out = ra.ctx.createImageData(w, h)
  for (let i = 0; i < da.data.length; i += 4) {
    const diff =
      Math.abs(da.data[i] - db.data[i]) +
      Math.abs(da.data[i + 1] - db.data[i + 1]) +
      Math.abs(da.data[i + 2] - db.data[i + 2])
    if (diff > 40) {
      out.data[i] = 255; out.data[i + 1] = 0; out.data[i + 2] = 0; out.data[i + 3] = 255
    } else {
      out.data[i] = da.data[i]; out.data[i + 1] = da.data[i + 1]
      out.data[i + 2] = da.data[i + 2]; out.data[i + 3] = 60
    }
  }
  const result = document.createElement('canvas')
  result.width = w; result.height = h
  result.getContext('2d')!.putImageData(out, 0, 0)
  return result.toDataURL('image/png')
}

export async function rasterizeToJpegPdfBytes(
  pdfBytes: Uint8Array,
  quality: number,
  scale: number,
): Promise<Uint8Array> {
  const count = await getPageCount(pdfBytes)
  const images: { bytes: Uint8Array; type: 'image/jpeg' }[] = []
  for (let i = 0; i < count; i++) {
    const blob = await renderPageToImageBlob(pdfBytes, i, scale, 'image/jpeg', quality)
    images.push({ bytes: new Uint8Array(await blob.arrayBuffer()), type: 'image/jpeg' })
  }
  return imagesToPdf(images)
}
