'use client'
import { saveAs } from 'file-saver'
import { Button } from '@/components/ui/button'
import type { PdfJobResult } from '@/lib/pdf/types'

export function DownloadResult({ result, onReset }: { result: PdfJobResult; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border p-8">
      <p className="font-medium">Done — {result.filename}</p>
      <div className="flex gap-3">
        <Button onClick={() => saveAs(result.blob, result.filename)}>Download</Button>
        <Button variant="outline" onClick={onReset}>
          Start over
        </Button>
      </div>
    </div>
  )
}
