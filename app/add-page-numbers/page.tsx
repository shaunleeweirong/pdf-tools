'use client'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { addPageNumbers } from '@/lib/pdf/pageNumbers'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'

const tool = getTool('add-page-numbers')!

export default function AddPageNumbersPage() {
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{}}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await addPageNumbers(buf)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'numbered') }
      }}
    />
  )
}
