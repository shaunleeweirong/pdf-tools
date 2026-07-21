'use client'
import type { Tool } from '@/lib/tools'
import { ToolWidget, type ProcessFn } from './ToolWidget'
import { ToolContent } from './ToolContent'

export type { ProcessFn }

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
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">{tool.name}</h1>
      <p className="mt-3 text-muted-foreground">{tool.description}</p>
      <p className="mt-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
        <span className="inline-block size-1.5 bg-brand" aria-hidden />
        Processed in your browser · never uploaded
      </p>

      <ToolWidget tool={tool} defaultOpts={defaultOpts} renderOptions={renderOptions} process={process} />

      <ToolContent slug={tool.slug} />
    </main>
  )
}
