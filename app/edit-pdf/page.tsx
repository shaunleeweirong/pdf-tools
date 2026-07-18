'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { applyAnnotations, type Annotation } from '@/lib/pdf/annotate'
import { PdfAnnotator } from '@/components/PdfAnnotator'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'

const tool = getTool('edit-pdf')!

export default function EditPdfPage() {
  const [annos, setAnnos] = useState<Annotation[]>([])
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{}}
      renderOptions={(_o, _s, files) => <PdfAnnotator file={files[0]} onChange={setAnnos} />}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await applyAnnotations(buf, annos)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'edited') }
      }}
    />
  )
}
