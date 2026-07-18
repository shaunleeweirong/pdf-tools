'use client'
import { saveAs } from 'file-saver'
import { Button } from '@/components/ui/button'
import type { PdfJobResult } from '@/lib/pdf/types'

export function DownloadResult({ result, onReset }: { result: PdfJobResult; onReset: () => void }) {
  return (
    <div className="soft-raised flex flex-col items-center gap-4 rounded-xl p-8">
      <p className="flex items-center gap-2 font-medium">
        <span className="inline-block size-2 bg-brand" aria-hidden />
        Done — {result.filename}
      </p>
      <div className="flex gap-3">
        <Button onClick={() => saveAs(result.blob, result.filename)}>Download</Button>
        <Button variant="outline" onClick={onReset}>
          Start over
        </Button>
      </div>
    </div>
  )
}
