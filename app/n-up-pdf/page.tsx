'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { nUp } from '@/lib/pdf/nup'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const tool = getTool('n-up-pdf')!

export default function NUpPdfPage() {
  const [n, setN] = useState('2')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ n }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Pages per sheet</Label>
          <Select value={n} onValueChange={(v) => v !== null && setN(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await nUp(buf, parseInt(n, 10) as 2 | 4)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'n-up') }
      }}
    />
  )
}
