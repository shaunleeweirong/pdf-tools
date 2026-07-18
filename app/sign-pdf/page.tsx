'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { placeSignature } from '@/lib/pdf/sign'
import { SignaturePad } from '@/components/SignaturePad'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'

const tool = getTool('sign-pdf')!

export default function SignPdfPage() {
  const [sig, setSig] = useState<Uint8Array | null>(null)
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{}}
      renderOptions={() => <SignaturePad onChange={setSig} />}
      process={async (files) => {
        if (!sig) throw new Error('Draw a signature first.')
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await placeSignature(buf, sig, { pageIndex: 0, x: 50, y: 50, width: 150 })
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'signed') }
      }}
    />
  )
}
