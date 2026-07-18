'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { deletePages } from '@/lib/pdf/deletePages'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('delete-pages')!

export default function DeletePagesPage() {
  const [spec, setSpec] = useState('1')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ spec }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Pages to delete (e.g. 1,3,5)</Label>
          <Input value={spec} onChange={(e) => setSpec(e.target.value)} />
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const idx = spec.split(',').map((s) => parseInt(s.trim(), 10) - 1).filter((n) => n >= 0)
        const bytes = await deletePages(buf, idx)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'edited') }
      }}
    />
  )
}
