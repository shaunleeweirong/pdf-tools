'use client'
import JSZip from 'jszip'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { extractPageImages } from '@/lib/pdf/render'

const tool = getTool('extract-images')!

export default function ExtractImagesPage() {
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{}}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const blobs = await extractPageImages(buf)
        const zip = new JSZip()
        blobs.forEach((b, i) => zip.file(`image-${i + 1}.png`, b))
        const out = await zip.generateAsync({ type: 'blob' })
        return { blob: out, filename: 'images.zip' }
      }}
    />
  )
}
