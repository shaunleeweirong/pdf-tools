'use client'
import JSZip from 'jszip'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { getPageCount, renderPageToImageBlob } from '@/lib/pdf/render'

const tool = getTool('pdf-to-jpg')!

export default function PdfToJpgPage() {
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{}}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const count = await getPageCount(buf)
        const zip = new JSZip()
        for (let i = 0; i < count; i++) {
          const blob = await renderPageToImageBlob(buf, i, 2, 'image/jpeg')
          zip.file(`page-${i + 1}.jpg`, blob)
        }
        const out = await zip.generateAsync({ type: 'blob' })
        return { blob: out, filename: 'images.zip' }
      }}
    />
  )
}
