'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { reorder } from '@/lib/pdf/reorder'
import { renderThumbnails } from '@/lib/pdf/render'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Button } from '@/components/ui/button'

const tool = getTool('organize-pdf')!

export default function OrganizePdfPage() {
  const [order, setOrder] = useState<number[]>([])
  const [thumbs, setThumbs] = useState<string[]>([])

  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{}}
      renderOptions={(_o, _s, files) => (
        <ThumbEditor files={files} thumbs={thumbs} setThumbs={setThumbs} order={order} setOrder={setOrder} />
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const finalOrder = order.length ? order : (await renderThumbnails(buf)).map((_, i) => i)
        const bytes = await reorder(buf, finalOrder)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'organized') }
      }}
    />
  )
}

function ThumbEditor({
  files, thumbs, setThumbs, order, setOrder,
}: {
  files: File[]; thumbs: string[]; setThumbs: (t: string[]) => void; order: number[]; setOrder: (o: number[]) => void
}) {
  async function load() {
    const buf = new Uint8Array(await files[0].arrayBuffer())
    const t = await renderThumbnails(buf)
    setThumbs(t)
    setOrder(t.map((_, i) => i))
  }
  function move(from: number, to: number) {
    const next = [...order]
    const [x] = next.splice(from, 1)
    next.splice(to, 0, x)
    setOrder(next)
  }
  function remove(pos: number) {
    setOrder(order.filter((_, i) => i !== pos))
  }
  return (
    <div className="space-y-3">
      {thumbs.length === 0 ? (
        <Button type="button" variant="outline" onClick={load}>Load page thumbnails</Button>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {order.map((pageIdx, pos) => (
            <figure key={pos} className="rounded border p-1 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbs[pageIdx]} alt={`Page ${pageIdx + 1}`} className="w-full" />
              <figcaption className="mt-1 flex justify-center gap-1 text-xs">
                <button type="button" onClick={() => move(pos, Math.max(0, pos - 1))}>&#9664;</button>
                <span>{pageIdx + 1}</span>
                <button type="button" onClick={() => move(pos, Math.min(order.length - 1, pos + 1))}>&#9654;</button>
                <button type="button" onClick={() => remove(pos)}>&#10005;</button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}
