'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { extractPages } from '@/lib/pdf/extractPages'
import { parseRanges } from '@/lib/pdf/split'
import { getPageCount } from '@/lib/pdf/render'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('extract-pages')!

export default function ExtractPagesPage() {
  const [spec, setSpec] = useState('1-2')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ spec }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Pages to extract (e.g. 1-2,5)</Label>
          <Input value={spec} onChange={(e) => setSpec(e.target.value)} />
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const count = await getPageCount(buf)
        const idx = parseRanges(spec, count).flat()
        const bytes = await extractPages(buf, idx)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'extracted') }
      }}
    />
  )
}
