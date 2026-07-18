'use client'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { flatten } from '@/lib/pdf/flatten'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'

const tool = getTool('flatten-pdf')!

export default function FlattenPdfPage() {
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{}}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await flatten(buf)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'flattened') }
      }}
    />
  )
}
