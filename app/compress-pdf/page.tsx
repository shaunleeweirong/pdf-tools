'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { rasterizeToJpegPdfBytes } from '@/lib/pdf/render'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const tool = getTool('compress-pdf')!
const LEVELS: Record<string, { q: number; s: number }> = {
  high: { q: 0.5, s: 1.2 },
  medium: { q: 0.7, s: 1.5 },
  low: { q: 0.85, s: 2 },
}

export default function CompressPdfPage() {
  const [level, setLevel] = useState('medium')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ level }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Compression level</Label>
          <Select value={level} onValueChange={(v) => { if (v) setLevel(v) }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High (smallest)</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low (best quality)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Note: this is a light, in-browser compression that rasterizes pages. Text becomes an image.
          </p>
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const { q, s } = LEVELS[level]
        const bytes = await rasterizeToJpegPdfBytes(buf, q, s)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'compressed') }
      }}
    />
  )
}
