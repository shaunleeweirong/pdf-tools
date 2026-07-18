'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { crop } from '@/lib/pdf/crop'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('crop-pdf')!

export default function CropPdfPage() {
  const [m, setM] = useState('20')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ m }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Uniform margin to trim (points)</Label>
          <Input type="number" value={m} onChange={(e) => setM(e.target.value)} />
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const v = parseFloat(m) || 0
        const bytes = await crop(buf, { top: v, right: v, bottom: v, left: v })
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'cropped') }
      }}
    />
  )
}
