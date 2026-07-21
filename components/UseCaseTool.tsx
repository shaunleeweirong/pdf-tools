'use client'
import { useState } from 'react'
import JSZip from 'jszip'
import { getTool } from '@/lib/tools'
import { ToolWidget } from './ToolWidget'
import { rasterizeToJpegPdfBytes, getPageCount, renderPageToImageBlob } from '@/lib/pdf/render'
import { imagesToPdf } from '@/lib/pdf/imagesToPdf'
import { merge } from '@/lib/pdf/merge'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

// Embeddable tool widgets for programmatic use-case pages. Each mirrors the
// run-wiring of the matching app/<slug>/page.tsx; kept in sync manually. A
// future cleanup could unify tool pages + these onto one registry.

const COMPRESS_LEVELS: Record<string, { q: number; s: number }> = {
  high: { q: 0.5, s: 1.2 },
  medium: { q: 0.7, s: 1.5 },
  low: { q: 0.85, s: 2 },
}

function CompressRunner() {
  const [level, setLevel] = useState('medium')
  return (
    <ToolWidget
      tool={getTool('compress-pdf')!}
      defaultOpts={{ level }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Compression level</Label>
          <Select value={level} onValueChange={(v) => { if (v) setLevel(v) }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High (smallest)</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low (best quality)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const { q, s } = COMPRESS_LEVELS[level]
        const bytes = await rasterizeToJpegPdfBytes(buf, q, s)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'compressed') }
      }}
    />
  )
}

function MergeRunner() {
  return (
    <ToolWidget
      tool={getTool('merge-pdf')!}
      defaultOpts={{}}
      process={async (files) => {
        const buffers = await Promise.all(
          files.map(async (f) => new Uint8Array(await f.arrayBuffer())),
        )
        const bytes = await merge(buffers)
        return { blob: pdfBlob(bytes), filename: 'merged.pdf' }
      }}
    />
  )
}

function JpgToPdfRunner() {
  return (
    <ToolWidget
      tool={getTool('jpg-to-pdf')!}
      defaultOpts={{}}
      process={async (files) => {
        const images = await Promise.all(
          files.map(async (f) => ({
            bytes: new Uint8Array(await f.arrayBuffer()),
            type: (f.type === 'image/png' ? 'image/png' : 'image/jpeg') as 'image/png' | 'image/jpeg',
          })),
        )
        const bytes = await imagesToPdf(images)
        return { blob: pdfBlob(bytes), filename: 'images.pdf' }
      }}
    />
  )
}

function PdfToJpgRunner() {
  return (
    <ToolWidget
      tool={getTool('pdf-to-jpg')!}
      defaultOpts={{}}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const count = await getPageCount(buf)
        const zip = new JSZip()
        for (let i = 0; i < count; i++) {
          const blob = await renderPageToImageBlob(buf, i, 2, 'image/jpeg')
          zip.file(`page-${i + 1}.jpg`, blob)
        }
        const out = await zip.generateAsync({ type: 'blob' })
        return { blob: out, filename: 'images.zip' }
      }}
    />
  )
}

const RUNNERS: Record<string, React.ComponentType> = {
  'compress-pdf': CompressRunner,
  'merge-pdf': MergeRunner,
  'jpg-to-pdf': JpgToPdfRunner,
  'pdf-to-jpg': PdfToJpgRunner,
}

/** Tool slugs that can be embedded on a programmatic use-case page. */
export const USE_CASE_TOOL_SLUGS = Object.keys(RUNNERS)

export function UseCaseTool({ slug }: { slug: string }) {
  const Runner = RUNNERS[slug]
  return Runner ? <Runner /> : null
}
