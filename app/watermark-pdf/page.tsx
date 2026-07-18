'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { watermarkText } from '@/lib/pdf/watermark'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('watermark-pdf')!

export default function WatermarkPdfPage() {
  const [text, setText] = useState('CONFIDENTIAL')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ text }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Watermark text</Label>
          <Input value={text} onChange={(e) => setText(e.target.value)} />
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await watermarkText(buf, text)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'watermarked') }
      }}
    />
  )
}
