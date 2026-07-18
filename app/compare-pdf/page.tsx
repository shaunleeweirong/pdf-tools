'use client'
import { useState } from 'react'
import { getTool } from '@/lib/tools'
import { FileDropzone } from '@/components/FileDropzone'
import { Button } from '@/components/ui/button'
import { diffFirstPage } from '@/lib/pdf/render'

const tool = getTool('compare-pdf')!

export default function ComparePdfPage() {
  const [files, setFiles] = useState<File[]>([])
  const [img, setImg] = useState<string>('')
  const [busy, setBusy] = useState(false)
  async function run() {
    setBusy(true)
    const [a, b] = await Promise.all(files.slice(0, 2).map(async (f) => new Uint8Array(await f.arrayBuffer())))
    setImg(await diffFirstPage(a, b))
    setBusy(false)
  }
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">{tool.name}</h1>
      <p className="mt-2 text-muted-foreground">{tool.description}</p>
      <p className="mt-1 text-xs text-muted-foreground">Compared in your browser; nothing is uploaded.</p>
      <div className="mt-8 space-y-4">
        <FileDropzone accept={tool.accept} multiple onFiles={setFiles} />
        {files.length >= 2 && <Button onClick={run} disabled={busy}>Compare</Button>}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {img && <img src={img} alt="Difference" className="w-full rounded border" />}
      </div>
    </main>
  )
}
