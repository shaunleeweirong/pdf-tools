'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getPdfjs } from '@/lib/pdf/pdfjs'
import type { Annotation } from '@/lib/pdf/annotate'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Mode = 'edit' | 'add'

// Geometry needed to save a text replacement (PDF coords, bottom-left origin).
interface ReplaceGeom {
  page: number
  x: number
  y: number
  width: number
  size: number
  bg: { r: number; g: number; b: number }
  original: string
}

// One editable text run on the currently-rendered page (canvas pixel coords).
interface TextBox {
  key: string
  left: number
  top: number
  width: number
  fontPx: number
  original: string
  bgCss: string
}

const MAX_SCALE = 1.5

export function PdfAnnotator({
  file,
  onChange,
}: {
  file: File
  onChange: (a: Annotation[]) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const geomRef = useRef<Record<string, ReplaceGeom>>({}) // accumulates across pages

  const [numPages, setNumPages] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageHeight, setPageHeight] = useState(0)
  const [canvasW, setCanvasW] = useState(0)
  const [containerW, setContainerW] = useState(0)
  const [scale, setScale] = useState(MAX_SCALE)
  const [mode, setMode] = useState<Mode>('edit')
  const [boxes, setBoxes] = useState<TextBox[]>([])
  const [noText, setNoText] = useState(false)
  const [loading, setLoading] = useState(true)
  const [addText, setAddText] = useState('Text')

  // User edits to existing text, keyed `${page}:${itemIndex}`; and click-placed text.
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [addAnnos, setAddAnnos] = useState<Annotation[]>([])

  // Emit the combined annotation list whenever edits or added text change.
  useEffect(() => {
    const replaces: Annotation[] = []
    for (const [key, value] of Object.entries(edits)) {
      const g = geomRef.current[key]
      if (g && value !== g.original) {
        replaces.push({
          type: 'replace',
          page: g.page,
          x: g.x,
          y: g.y,
          width: g.width,
          size: g.size,
          text: value,
          bg: g.bg,
        })
      }
    }
    onChange([...addAnnos, ...replaces])
  }, [edits, addAnnos, onChange])

  // Track available width so the page renders to fit (keeps mobile from overflowing).
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    setContainerW(el.clientWidth)
    const ro = new ResizeObserver((entries) => setContainerW(entries[0].contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Render the current page and extract its text runs.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNoText(false)
    ;(async () => {
      const bytes = new Uint8Array(await file.arrayBuffer())
      const pdfjs = await getPdfjs()
      const loadingTask = pdfjs.getDocument({ data: bytes })
      const doc = await loadingTask.promise
      if (cancelled) {
        await doc.cleanup()
        await loadingTask.destroy()
        return
      }
      setNumPages(doc.numPages)
      const page = await doc.getPage(pageIndex + 1)
      const vp1 = page.getViewport({ scale: 1 })
      const renderScale =
        containerW > 0 ? Math.max(0.4, Math.min(MAX_SCALE, containerW / vp1.width)) : MAX_SCALE
      setScale(renderScale)
      const viewport = page.getViewport({ scale: renderScale })
      const canvas = canvasRef.current!
      canvas.width = viewport.width
      canvas.height = viewport.height
      // willReadFrequently: we sample pixels (getImageData) per text run for whiteout bg.
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!
      await page.render({ canvas, viewport }).promise
      if (cancelled) {
        page.cleanup()
        await doc.cleanup()
        await loadingTask.destroy()
        return
      }
      setCanvasW(viewport.width)
      setPageHeight(viewport.height)

      const tc = await page.getTextContent()
      const nextBoxes: TextBox[] = []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tc.items.forEach((item: any, idx: number) => {
        if (typeof item.str !== 'string' || item.str.trim() === '' || !item.transform) return
        // Canvas-space placement (top-left origin) via the pdf.js text-layer method.
        const m = pdfjs.Util.transform(viewport.transform, item.transform)
        const fontPx = Math.hypot(m[2], m[3])
        const left = m[4]
        const top = m[5] - fontPx
        const widthPx = item.width * renderScale

        // PDF-space geometry (bottom-left origin) for saving.
        const x0 = item.transform[4]
        const y0 = item.transform[5]
        const size = Math.hypot(item.transform[2], item.transform[3]) || item.height || 12

        const bg = sampleBg(ctx, left + widthPx + 3, top + fontPx * 0.5, canvas.width, canvas.height)
        const key = `${pageIndex}:${idx}`
        geomRef.current[key] = { page: pageIndex, x: x0, y: y0, width: item.width, size, bg, original: item.str }
        nextBoxes.push({
          key,
          left,
          top,
          width: Math.max(widthPx, 8),
          fontPx,
          original: item.str,
          bgCss: `rgb(${Math.round(bg.r * 255)},${Math.round(bg.g * 255)},${Math.round(bg.b * 255)})`,
        })
      })

      page.cleanup()
      await doc.cleanup()
      await loadingTask.destroy()
      if (cancelled) return
      setBoxes(nextBoxes)
      setNoText(nextBoxes.length === 0)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [file, pageIndex, containerW])

  const onCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (mode !== 'add') return
      const rect = canvasRef.current!.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      setAddAnnos((prev) => [
        ...prev,
        { type: 'text', page: pageIndex, x: cx / scale, y: (pageHeight - cy) / scale, text: addText, size: 14 },
      ])
    },
    [mode, pageIndex, pageHeight, addText, scale],
  )

  const editCount = Object.entries(edits).filter(([k, v]) => geomRef.current[k] && v !== geomRef.current[k].original).length

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex overflow-hidden rounded-md border">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`px-3 py-1.5 text-sm ${mode === 'edit' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
          >
            Edit existing text
          </button>
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`px-3 py-1.5 text-sm ${mode === 'add' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
          >
            Add text
          </button>
        </div>
        {mode === 'add' && (
          <>
            <Input value={addText} onChange={(e) => setAddText(e.target.value)} className="max-w-[12rem]" />
            <span className="text-xs text-muted-foreground">Click on the page to drop it.</span>
          </>
        )}
        {mode === 'edit' && (
          <span className="text-xs text-muted-foreground">
            Click a line of text and type to replace it.
          </span>
        )}
      </div>

      {/* Page navigation */}
      {numPages > 1 && (
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
          >
            ◀ Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pageIndex + 1} of {numPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pageIndex >= numPages - 1}
            onClick={() => setPageIndex((p) => Math.min(numPages - 1, p + 1))}
          >
            Next ▶
          </Button>
        </div>
      )}

      {/* Page + overlay */}
      <div ref={wrapRef} className="w-full overflow-x-auto rounded border">
        <div className="relative" style={{ width: canvasW || undefined, height: pageHeight || undefined }}>
          <canvas
            ref={canvasRef}
            onClick={onCanvasClick}
            className={`block ${mode === 'add' ? 'cursor-crosshair' : ''}`}
          />
          {mode === 'edit' &&
            !loading &&
            boxes.map((box) => {
              const value = edits[box.key] ?? box.original
              const changed = value !== box.original
              return (
                <input
                  key={box.key}
                  value={value}
                  onChange={(e) => setEdits((prev) => ({ ...prev, [box.key]: e.target.value }))}
                  spellCheck={false}
                  style={{
                    position: 'absolute',
                    left: box.left,
                    top: box.top,
                    width: box.width,
                    height: box.fontPx * 1.35,
                    fontSize: box.fontPx,
                    lineHeight: `${box.fontPx * 1.35}px`,
                    padding: 0,
                    margin: 0,
                    border: 'none',
                    outline: changed ? '1px solid rgba(59,130,246,0.7)' : 'none',
                    background: changed ? box.bgCss : 'transparent',
                    color: changed ? '#000' : 'transparent',
                    caretColor: '#000',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    whiteSpace: 'pre',
                  }}
                />
              )
            })}
        </div>
      </div>

      {/* Status / empty state */}
      {loading ? (
        <p className="text-xs text-muted-foreground">Loading page…</p>
      ) : noText && mode === 'edit' ? (
        <p className="text-xs text-amber-600">
          No editable text found on this page (it may be a scanned image).
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {editCount} text edit{editCount === 1 ? '' : 's'}
          {addAnnos.length > 0 ? `, ${addAnnos.length} added` : ''} — changes apply across all pages when you run the tool.
        </p>
      )}
    </div>
  )
}

// Read one pixel from the rendered page as the background fill for a whiteout box.
// Returns 0–1 rgb; defaults to white on failure or if the sample looks like glyph ink.
function sampleBg(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): { r: number; g: number; b: number } {
  const white = { r: 1, g: 1, b: 1 }
  const px = Math.max(0, Math.min(w - 1, Math.round(x)))
  const py = Math.max(0, Math.min(h - 1, Math.round(y)))
  try {
    const d = ctx.getImageData(px, py, 1, 1).data
    // If the sample is very dark it's probably text ink, not background — use white.
    if (d[0] + d[1] + d[2] < 120) return white
    return { r: d[0] / 255, g: d[1] / 255, b: d[2] / 255 }
  } catch {
    return white
  }
}
