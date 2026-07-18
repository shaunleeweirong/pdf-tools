'use client'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { imagesToPdf } from '@/lib/pdf/imagesToPdf'
import { pdfBlob } from '@/lib/pdf/types'

const tool = getTool('jpg-to-pdf')!

export default function JpgToPdfPage() {
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{}}
      process={async (files) => {
        const images = await Promise.all(
          files.map(async (f) => ({
            bytes: new Uint8Array(await f.arrayBuffer()),
            type: (f.type === 'image/png' ? 'image/png' : 'image/jpeg') as 'image/png' | 'image/jpeg',
          })),
        )
        const bytes = await imagesToPdf(images)
        return { blob: pdfBlob(bytes), filename: 'images.pdf' }
      }}
    />
  )
}
