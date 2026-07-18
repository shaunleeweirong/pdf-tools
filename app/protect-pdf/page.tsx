'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { protect } from '@/lib/pdf/qpdf'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('protect-pdf')!

export default function ProtectPdfPage() {
  const [password, setPassword] = useState('')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ password }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      )}
      process={async (files) => {
        if (!password) throw new Error('Enter a password.')
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await protect(buf, password)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'protected') }
      }}
    />
  )
}
