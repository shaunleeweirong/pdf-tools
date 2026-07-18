'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { rotate } from '@/lib/pdf/rotate'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const tool = getTool('rotate-pdf')!

export default function RotatePdfPage() {
  const [deg, setDeg] = useState('90')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ deg }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Rotation</Label>
          <Select value={deg} onValueChange={(v) => v !== null && setDeg(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="90">90° clockwise</SelectItem>
              <SelectItem value="180">180°</SelectItem>
              <SelectItem value="270">270° clockwise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await rotate(buf, parseInt(deg, 10))
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'rotated') }
      }}
    />
  )
}
