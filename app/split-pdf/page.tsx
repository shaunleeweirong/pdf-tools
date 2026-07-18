'use client'
import { useState } from 'react'
import JSZip from 'jszip'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { split, parseRanges } from '@/lib/pdf/split'
import { getPageCount } from '@/lib/pdf/render'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('split-pdf')!

export default function SplitPdfPage() {
  const [ranges, setRanges] = useState('1-1')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ ranges }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Page ranges (e.g. 1-3,5)</Label>
          <Input value={ranges} onChange={(e) => setRanges(e.target.value)} />
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const count = await getPageCount(buf)
        const outs = await split(buf, parseRanges(ranges, count))
        const zip = new JSZip()
        outs.forEach((b, i) => zip.file(`split-${i + 1}.pdf`, b))
        const blob = await zip.generateAsync({ type: 'blob' })
        return { blob, filename: 'split.zip' }
      }}
    />
  )
}
