'use client'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'

export function SignaturePad({ onChange }: { onChange: (pngBytes: Uint8Array | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const dirty = useRef(false)

  function pos(e: React.PointerEvent) {
    const c = ref.current!
    const rect = c.getBoundingClientRect()
    // Map CSS pixels → the canvas's internal resolution (it may be scaled down on mobile).
    return {
      x: (e.clientX - rect.left) * (c.width / rect.width),
      y: (e.clientY - rect.top) * (c.height / rect.height),
    }
  }
  function down(e: React.PointerEvent) {
    drawing.current = true
    const ctx = ref.current!.getContext('2d')!
    const { x, y } = pos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }
  function move(e: React.PointerEvent) {
    if (!drawing.current) return
    dirty.current = true
    const ctx = ref.current!.getContext('2d')!
    const { x, y } = pos(e)
    ctx.lineTo(x, y)
    ctx.lineWidth = 2
    ctx.stroke()
  }
  async function up() {
    drawing.current = false
    if (!dirty.current) {
      onChange(null)
      return
    }
    const blob: Blob | null = await new Promise((r) => ref.current!.toBlob((b) => r(b), 'image/png'))
    if (blob) onChange(new Uint8Array(await blob.arrayBuffer()))
  }
  function clear() {
    const c = ref.current!
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height)
    dirty.current = false
    onChange(null)
  }
  return (
    <div className="space-y-2">
      <canvas
        ref={ref}
        width={400}
        height={150}
        className="w-full max-w-[400px] rounded border bg-white touch-none"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
      />
      <Button type="button" variant="outline" size="sm" onClick={clear}>Clear</Button>
    </div>
  )
}
