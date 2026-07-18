'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { unlock } from '@/lib/pdf/qpdf'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('unlock-pdf')!

export default function UnlockPdfPage() {
  const [password, setPassword] = useState('')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ password }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Current password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await unlock(buf, password)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'unlocked') }
      }}
    />
  )
}
