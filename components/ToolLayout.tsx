'use client'
import { useState } from 'react'
import type { Tool } from '@/lib/tools'
import type { PdfJobResult } from '@/lib/pdf/types'
import { FileDropzone } from './FileDropzone'
import { ProgressIndicator } from './ProgressIndicator'
import { DownloadResult } from './DownloadResult'
import { ToolContent } from './ToolContent'
import { Button } from '@/components/ui/button'

export type ProcessFn<O> = (files: File[], opts: O) => Promise<PdfJobResult>

export function ToolLayout<O>({
  tool,
  defaultOpts,
  renderOptions,
  process,
}: {
  tool: Tool
  defaultOpts: O
  renderOptions?: (opts: O, setOpts: (o: O) => void, files: File[]) => React.ReactNode
  process: ProcessFn<O>
}) {
  const [files, setFiles] = useState<File[]>([])
  const [opts, setOpts] = useState<O>(defaultOpts)
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<PdfJobResult | null>(null)
  const [error, setError] = useState<string>('')

  async function run() {
    setStatus('processing')
    setError('')
    try {
      const r = await process(files, opts)
      setResult(r)
      setStatus('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setStatus('error')
    }
  }

  function reset() {
    setFiles([])
    setOpts(defaultOpts)
    setResult(null)
    setStatus('idle')
    setError('')
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">{tool.name}</h1>
      <p className="mt-3 text-muted-foreground">{tool.description}</p>
      <p className="mt-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
        <span className="inline-block size-1.5 bg-brand" aria-hidden />
        Processed in your browser · never uploaded
      </p>

      <div className="mt-8 space-y-6">
        {status === 'done' && result ? (
          <DownloadResult result={result} onReset={reset} />
        ) : status === 'processing' ? (
          <ProgressIndicator label={`Processing ${tool.name}…`} />
        ) : (
          <>
            <FileDropzone accept={tool.accept} multiple={tool.multiple} onFiles={setFiles} />
            {files.length > 0 && (
              <>
                <ul className="text-sm">
                  {files.map((f, i) => (
                    <li key={i} className="text-muted-foreground">
                      {f.name}
                    </li>
                  ))}
                </ul>
                {renderOptions?.(opts, setOpts, files)}
                <Button onClick={run} disabled={files.length === 0}>
                  {tool.name}
                </Button>
              </>
            )}
            {status === 'error' && <p className="text-sm text-destructive">{error}</p>}
          </>
        )}
      </div>

      <ToolContent slug={tool.slug} />
    </main>
  )
}
