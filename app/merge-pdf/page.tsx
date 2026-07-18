'use client'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { merge } from '@/lib/pdf/merge'
import { pdfBlob } from '@/lib/pdf/types'

const tool = getTool('merge-pdf')!

export default function MergePdfPage() {
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{}}
      process={async (files) => {
        const buffers = await Promise.all(files.map(async (f) => new Uint8Array(await f.arrayBuffer())))
        const bytes = await merge(buffers)
        return { blob: pdfBlob(bytes), filename: 'merged.pdf' }
      }}
    />
  )
}
