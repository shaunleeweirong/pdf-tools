'use client'
import { useEffect, useRef, useState } from 'react'
import { getPdfjs } from '@/lib/pdf/pdfjs'
import type { Annotation } from '@/lib/pdf/annotate'
import { Input } from '@/components/ui/input'

export function PdfAnnotator({
  file, onChange,
}: { file: File; onChange: (a: Annotation[]) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scale] = useState(1.5)
  const [pageHeight, setPageHeight] = useState(0)
  const [text, setText] = useState('Text')
  const [annos, setAnnos] = useState<Annotation[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const bytes = new Uint8Array(await file.arrayBuffer())
      const pdfjs = getPdfjs()
      const loadingTask = pdfjs.getDocument({ data: bytes })
      const doc = await loadingTask.promise
      const page = await doc.getPage(1)
      const viewport = page.getViewport({ scale })
      if (cancelled) return
      const canvas = canvasRef.current!
      canvas.width = viewport.width
      canvas.height = viewport.height
      setPageHeight(viewport.height)
      await page.render({ canvas, viewport }).promise
      page.cleanup()
      await doc.cleanup()
      await loadingTask.destroy()
    })()
    return () => { cancelled = true }
  }, [file, scale])

  function click(e: React.MouseEvent) {
    const rect = canvasRef.current!.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    // Convert canvas (top-left origin) → PDF (bottom-left origin), unscale.
    const next: Annotation[] = [
      ...annos,
      { type: 'text', page: 0, x: cx / scale, y: (pageHeight - cy) / scale, text, size: 14 },
    ]
    setAnnos(next)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm">Text to place:</span>
        <Input value={text} onChange={(e) => setText(e.target.value)} className="max-w-xs" />
        <span className="text-xs text-muted-foreground">Click on the page to drop it.</span>
      </div>
      <canvas ref={canvasRef} onClick={click} className="cursor-crosshair rounded border" />
      <p className="text-xs text-muted-foreground">{annos.length} annotation(s) placed.</p>
    </div>
  )
}
