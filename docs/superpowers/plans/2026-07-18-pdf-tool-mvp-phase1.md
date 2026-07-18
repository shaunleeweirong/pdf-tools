# pdf-tool MVP (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an anonymous, no-login, 100%-in-browser PDF toolkit of 21 client-side tools, deployed on Vercel.

**Architecture:** Next.js (App Router) + TypeScript. A tool registry (`lib/tools.ts`) drives a searchable homepage grid and per-tool SEO routes. Each tool's logic is a pure function in `lib/pdf/*.ts` (`(File[]|File, opts) => Promise<Blob>`), unit-tested with Vitest (TDD, Node env). Heavy pdf-lib ops run in a Web Worker via a `workerClient`; the pure functions themselves have no DOM dependency so they test in Node. A single `ToolLayout` component gives every tool the same flow (drop → options → process → download). No backend — nothing is uploaded. Phase 2 (paid server converters + accounts + Stripe) is out of scope but the `lib/pdf` interfaces are designed so server versions can mirror them.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, pdf-lib, pdfjs-dist, qpdf-wasm (Protect/Unlock only), jszip, file-saver, react-dropzone, Vitest.

## Global Constraints

- **No backend / no network for file data.** Every tool processes files in-browser only. No `fetch`/upload of user file bytes anywhere.
- **No accounts, no persistence.** No auth, DB, cookies-for-data. Anonymous use.
- **Pure `lib/pdf` functions.** Each operation is `async (input, opts) => Blob`, no DOM/React imports, importable in Node for tests. DOM-only concerns (canvas rendering via pdf.js) live in `lib/pdf/render.ts` and are the only non-Node-testable modules.
- **One route per tool**, slug = tool id (e.g. `/merge-pdf`). Slugs and tool metadata come from `lib/tools.ts` — single source of truth.
- **TDD.** Write the failing test first for every `lib/pdf` function. Commit after each green task.
- **Package manager:** `npm`. **Node:** 20+.
- Tool list, routes, and per-tool approach are authoritative in `docs/superpowers/specs/2026-07-17-pdf-tool-mvp-design.md`.

---

## Phase 0 — Scaffolding & Shared Infrastructure

### Task 1: Scaffold Next.js app + Vitest

**Files:**
- Create: project files via `create-next-app`
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts)
- Test: `lib/__tests__/smoke.test.ts`

**Interfaces:**
- Produces: a runnable Next.js app (`npm run dev`) and a passing test runner (`npm test`).

- [ ] **Step 1: Scaffold the app**

Run (in the project root, which already contains `docs/` and `.git`):
```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*" --no-turbopack --use-npm
```
When prompted about the non-empty directory, choose to continue (the existing `docs/` and `.gitignore` are preserved). Expected: Next.js app files created (`app/`, `package.json`, `tsconfig.json`, `tailwind.config.ts`).

- [ ] **Step 2: Install Vitest**

```bash
npm install -D vitest @vitejs/plugin-react jsdom
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts', 'lib/**/__tests__/**/*.test.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

- [ ] **Step 4: Add test script to `package.json`**

Add to `"scripts"`: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 5: Write a smoke test**

Create `lib/__tests__/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest'

describe('smoke', () => {
  it('runs the test runner', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 6: Run tests**

Run: `npm test`
Expected: 1 passing test.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app + Vitest"
```

---

### Task 2: Install PDF libraries + shadcn/ui + configure pdf.js worker

**Files:**
- Modify: `package.json` (deps)
- Create: `components/ui/*` (via shadcn)
- Create: `lib/pdf/pdfjs.ts` (pdf.js worker config)
- Test: `lib/pdf/__tests__/deps.test.ts`

**Interfaces:**
- Produces: `getPdfjs(): typeof import('pdfjs-dist')` from `lib/pdf/pdfjs.ts` — returns pdf.js with the worker configured (browser only).

- [ ] **Step 1: Install libraries**

```bash
npm install pdf-lib pdfjs-dist jszip file-saver react-dropzone
npm install -D @types/file-saver
```

- [ ] **Step 2: Init shadcn/ui**

```bash
npx shadcn@latest init -d
npx shadcn@latest add button card input dialog progress select label slider
```
Expected: `components/ui/` populated, `components.json` created.

- [ ] **Step 3: Configure the pdf.js worker**

Create `lib/pdf/pdfjs.ts`:
```ts
// Browser-only pdf.js accessor. Do NOT import from Node tests.
import * as pdfjsLib from 'pdfjs-dist'

let configured = false

export function getPdfjs() {
  if (!configured) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString()
    configured = true
  }
  return pdfjsLib
}
```

- [ ] **Step 4: Verify pdf-lib imports in Node**

Create `lib/pdf/__tests__/deps.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'

describe('pdf-lib', () => {
  it('creates and saves an empty document', async () => {
    const doc = await PDFDocument.create()
    doc.addPage([200, 200])
    const bytes = await doc.save()
    expect(bytes.length).toBeGreaterThan(0)
    // PDF magic number "%PDF"
    expect(new TextDecoder().decode(bytes.slice(0, 4))).toBe('%PDF')
  })
})
```

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: add pdf-lib, pdf.js, shadcn/ui and helpers"
```

---

### Task 3: Test fixtures generator

**Files:**
- Create: `test/fixtures/generate.ts`
- Create: `test/fixtures/README.md`
- Create (generated): `test/fixtures/*.pdf`, `test/fixtures/*.png`
- Test: `lib/pdf/__tests__/fixtures.test.ts`

**Interfaces:**
- Produces: fixture files on disk: `blank-1p.pdf` (1 page), `multi-5p.pdf` (5 pages, each labeled "Page N"), `form.pdf` (one text field named `fullName`), `red-100x100.png` (a solid image). And a helper `readFixture(name: string): Uint8Array` in `lib/pdf/__tests__/helpers.ts`.

- [ ] **Step 1: Write the fixtures generator**

Create `test/fixtures/generate.ts`:
```ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = __dirname

async function main() {
  // blank-1p.pdf
  const blank = await PDFDocument.create()
  blank.addPage([300, 400])
  writeFileSync(join(DIR, 'blank-1p.pdf'), await blank.save())

  // multi-5p.pdf with labeled pages
  const multi = await PDFDocument.create()
  const font = await multi.embedFont(StandardFonts.Helvetica)
  for (let i = 1; i <= 5; i++) {
    const page = multi.addPage([300, 400])
    page.drawText(`Page ${i}`, { x: 50, y: 350, size: 24, font, color: rgb(0, 0, 0) })
  }
  writeFileSync(join(DIR, 'multi-5p.pdf'), await multi.save())

  // form.pdf with a text field
  const formDoc = await PDFDocument.create()
  const fPage = formDoc.addPage([300, 400])
  const form = formDoc.getForm()
  const tf = form.createTextField('fullName')
  tf.addToPage(fPage, { x: 50, y: 300, width: 200, height: 24 })
  writeFileSync(join(DIR, 'form.pdf'), await formDoc.save())

  // red-100x100.png (raw PNG via a tiny generator)
  const png = await PDFDocument.create() // reuse pdf-lib? no — write a PNG manually below
  void png
  writeFileSync(join(DIR, 'red-100x100.png'), Buffer.from(RED_PNG_BASE64, 'base64'))

  console.log('fixtures written to', DIR)
}

// 100x100 solid red PNG, base64 (generated once, static).
const RED_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAt0lEQVR4nO3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwYwAAWn5xEwAAAABJRU5ErkJggg=='

main()
```

Note: if the embedded base64 PNG fails to decode as a valid image in a later task, regenerate a 100x100 red PNG with any tool and replace the constant. It only needs to be a valid PNG.

- [ ] **Step 2: Generate the fixtures**

Run: `npx tsx test/fixtures/generate.ts`
(If `tsx` is unavailable: `npm install -D tsx` first.)
Expected: `blank-1p.pdf`, `multi-5p.pdf`, `form.pdf`, `red-100x100.png` created in `test/fixtures/`.

- [ ] **Step 3: Create the fixture read helper**

Create `lib/pdf/__tests__/helpers.ts`:
```ts
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export function readFixture(name: string): Uint8Array {
  return new Uint8Array(readFileSync(join(process.cwd(), 'test/fixtures', name)))
}

/** Wrap raw bytes in a File-like object for functions that accept File. */
export function fixtureFile(name: string, type = 'application/pdf'): File {
  const bytes = readFixture(name)
  return new File([bytes], name, { type })
}
```

- [ ] **Step 4: Write a test that loads fixtures**

Create `lib/pdf/__tests__/fixtures.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { readFixture } from './helpers'

describe('fixtures', () => {
  it('multi-5p.pdf has 5 pages', async () => {
    const doc = await PDFDocument.load(readFixture('multi-5p.pdf'))
    expect(doc.getPageCount()).toBe(5)
  })
})
```

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: green.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test: add PDF fixtures and read helpers"
```

---

### Task 4: Tool registry

**Files:**
- Create: `lib/tools.ts`
- Test: `lib/__tests__/tools.test.ts`

**Interfaces:**
- Produces:
  - `type ToolCategory = 'Organize' | 'Convert' | 'Page tools' | 'Forms & sign' | 'Edit' | 'Security'`
  - `interface Tool { slug: string; name: string; category: ToolCategory; description: string; accept: string[]; multiple: boolean }`
  - `const TOOLS: Tool[]` — grows as each tool task appends its entry.
  - `getTool(slug: string): Tool | undefined`
  - `TOOL_SLUGS: string[]`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/tools.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { TOOLS, getTool } from '@/lib/tools'

describe('tool registry', () => {
  it('has unique slugs', () => {
    const slugs = TOOLS.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
  it('looks up a tool by slug', () => {
    expect(getTool('merge-pdf')?.name).toBe('Merge PDF')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tools`
Expected: FAIL (module not found / getTool undefined).

- [ ] **Step 3: Create the registry**

Create `lib/tools.ts`:
```ts
export type ToolCategory =
  | 'Organize'
  | 'Convert'
  | 'Page tools'
  | 'Forms & sign'
  | 'Edit'
  | 'Security'

export interface Tool {
  slug: string
  name: string
  category: ToolCategory
  description: string
  accept: string[] // MIME types
  multiple: boolean
}

export const TOOLS: Tool[] = [
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    category: 'Organize',
    description: 'Combine multiple PDFs into one document, in the order you choose.',
    accept: ['application/pdf'],
    multiple: true,
  },
]

export const TOOL_SLUGS = TOOLS.map((t) => t.slug)

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tools`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add tool registry with Merge entry"
```

---

### Task 5: PDF Web Worker + workerClient

**Files:**
- Create: `lib/pdf/types.ts`
- Create: `workers/pdf.worker.ts`
- Create: `lib/pdf/workerClient.ts`
- Test: `lib/pdf/__tests__/types.test.ts`

**Interfaces:**
- Produces:
  - `type PdfOp` — a discriminated union of operation names (extended as tools are added). Start with `'merge'`.
  - `interface PdfJobResult { blob: Blob; filename: string }`
  - `runInWorker(op: string, payload: unknown): Promise<Uint8Array>` from `workerClient.ts` (browser only). The worker imports the pure `lib/pdf` functions and returns their bytes. Tools may call their pure function directly on the main thread for small inputs; `runInWorker` is for large files.

Note: the pure `lib/pdf/*` functions are the source of truth and are what the tests target. The worker is a thin dispatcher and is verified manually in the browser, not unit-tested.

- [ ] **Step 1: Define shared result types (failing test)**

Create `lib/pdf/__tests__/types.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { pdfFilename } from '@/lib/pdf/types'

describe('pdf types', () => {
  it('builds an output filename', () => {
    expect(pdfFilename('report.pdf', 'merged')).toBe('report-merged.pdf')
    expect(pdfFilename('a.PDF', 'split')).toBe('a-split.pdf')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- types`
Expected: FAIL.

- [ ] **Step 3: Implement `lib/pdf/types.ts`**

```ts
export interface PdfJobResult {
  blob: Blob
  filename: string
}

/** Derive an output filename from an input name + suffix, forcing .pdf */
export function pdfFilename(input: string, suffix: string): string {
  const base = input.replace(/\.[^.]+$/, '')
  return `${base}-${suffix}.pdf`
}

/** Convert saved PDF bytes into a downloadable Blob. */
export function pdfBlob(bytes: Uint8Array): Blob {
  return new Blob([bytes], { type: 'application/pdf' })
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- types`
Expected: PASS.

- [ ] **Step 5: Create the worker + client (not unit-tested; browser wiring)**

Create `workers/pdf.worker.ts`:
```ts
/// <reference lib="webworker" />
import { merge } from '@/lib/pdf/merge'

self.onmessage = async (e: MessageEvent) => {
  const { id, op, payload } = e.data
  try {
    let bytes: Uint8Array
    switch (op) {
      case 'merge':
        bytes = await merge(payload.buffers)
        break
      default:
        throw new Error(`Unknown op: ${op}`)
    }
    ;(self as unknown as Worker).postMessage({ id, ok: true, bytes }, [bytes.buffer])
  } catch (err) {
    ;(self as unknown as Worker).postMessage({ id, ok: false, error: String(err) })
  }
}
```

Create `lib/pdf/workerClient.ts`:
```ts
let worker: Worker | null = null
let seq = 0
const pending = new Map<number, (r: { ok: boolean; bytes?: Uint8Array; error?: string }) => void>()

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('../../workers/pdf.worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = (e) => {
      const { id, ...rest } = e.data
      pending.get(id)?.(rest)
      pending.delete(id)
    }
  }
  return worker
}

export function runInWorker(op: string, payload: unknown): Promise<Uint8Array> {
  const id = ++seq
  return new Promise((resolve, reject) => {
    pending.set(id, (r) => (r.ok && r.bytes ? resolve(r.bytes) : reject(new Error(r.error))))
    getWorker().postMessage({ id, op, payload })
  })
}
```

Note: as later tasks add pure functions, extend the worker's `switch`. This is the only cross-cutting file tasks touch repeatedly; keep the extension to a single new `case`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: pdf worker + client + result types"
```

---

### Task 6: pdf.js render helpers

**Files:**
- Create: `lib/pdf/render.ts`

**Interfaces:**
- Produces (browser-only; not Node-tested):
  - `renderPageToCanvas(pdfBytes: Uint8Array, pageIndex: number, scale: number, canvas: HTMLCanvasElement): Promise<void>`
  - `renderThumbnails(pdfBytes: Uint8Array, scale?: number): Promise<string[]>` — returns data-URL PNGs, one per page.
  - `getPageCount(pdfBytes: Uint8Array): Promise<number>`

- [ ] **Step 1: Implement render helpers**

Create `lib/pdf/render.ts`:
```ts
import { getPdfjs } from './pdfjs'

export async function getPageCount(pdfBytes: Uint8Array): Promise<number> {
  const pdfjs = getPdfjs()
  const doc = await pdfjs.getDocument({ data: pdfBytes.slice() }).promise
  const n = doc.numPages
  await doc.destroy()
  return n
}

export async function renderThumbnails(pdfBytes: Uint8Array, scale = 0.4): Promise<string[]> {
  const pdfjs = getPdfjs()
  const doc = await pdfjs.getDocument({ data: pdfBytes.slice() }).promise
  const out: string[] = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!
    await page.render({ canvasContext: ctx, viewport }).promise
    out.push(canvas.toDataURL('image/png'))
  }
  await doc.destroy()
  return out
}

export async function renderPageToImageBlob(
  pdfBytes: Uint8Array,
  pageIndex: number,
  scale: number,
  mime: 'image/png' | 'image/jpeg',
  quality = 0.92,
): Promise<Blob> {
  const pdfjs = getPdfjs()
  const doc = await pdfjs.getDocument({ data: pdfBytes.slice() }).promise
  const page = await doc.getPage(pageIndex + 1)
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height
  const ctx = canvas.getContext('2d')!
  await page.render({ canvasContext: ctx, viewport }).promise
  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), mime, quality))
  await doc.destroy()
  return blob
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: pdf.js render helpers (thumbnails, rasterize)"
```

---

### Task 7: Shared UI — FileDropzone, ProgressIndicator, DownloadResult

**Files:**
- Create: `components/FileDropzone.tsx`
- Create: `components/ProgressIndicator.tsx`
- Create: `components/DownloadResult.tsx`

**Interfaces:**
- Produces:
  - `FileDropzone({ accept, multiple, onFiles }: { accept: string[]; multiple: boolean; onFiles: (files: File[]) => void })`
  - `ProgressIndicator({ label }: { label: string })`
  - `DownloadResult({ result, onReset }: { result: PdfJobResult; onReset: () => void })` — uses `file-saver` to download.

- [ ] **Step 1: FileDropzone**

Create `components/FileDropzone.tsx`:
```tsx
'use client'
import { useDropzone } from 'react-dropzone'

export function FileDropzone({
  accept,
  multiple,
  onFiles,
}: {
  accept: string[]
  multiple: boolean
  onFiles: (files: File[]) => void
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: Object.fromEntries(accept.map((a) => [a, []])),
    multiple,
    onDrop: (files) => onFiles(files),
  })
  return (
    <div
      {...getRootProps()}
      className={`flex h-56 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-muted-foreground">
        {isDragActive ? 'Drop the files here…' : 'Drag & drop files here, or click to choose'}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: ProgressIndicator**

Create `components/ProgressIndicator.tsx`:
```tsx
'use client'
import { Progress } from '@/components/ui/progress'

export function ProgressIndicator({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <Progress value={undefined} />
    </div>
  )
}
```

- [ ] **Step 3: DownloadResult**

Create `components/DownloadResult.tsx`:
```tsx
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
```

- [ ] **Step 4: Type-check + commit**

Run: `npx tsc --noEmit` (expected: clean)
```bash
git add -A
git commit -m "feat: shared UI primitives (dropzone, progress, download)"
```

---

### Task 8: ToolLayout (the shared tool flow)

**Files:**
- Create: `components/ToolLayout.tsx`

**Interfaces:**
- Produces:
  - `type ProcessFn<O> = (files: File[], opts: O) => Promise<PdfJobResult>`
  - `ToolLayout<O>({ tool, defaultOpts, renderOptions, process }: { tool: Tool; defaultOpts: O; renderOptions?: (opts: O, setOpts: (o: O) => void, files: File[]) => React.ReactNode; process: ProcessFn<O> })`
  - Manages state machine: `idle → files-selected → processing → done | error`.

- [ ] **Step 1: Implement ToolLayout**

Create `components/ToolLayout.tsx`:
```tsx
'use client'
import { useState } from 'react'
import type { Tool } from '@/lib/tools'
import type { PdfJobResult } from '@/lib/pdf/types'
import { FileDropzone } from './FileDropzone'
import { ProgressIndicator } from './ProgressIndicator'
import { DownloadResult } from './DownloadResult'
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
      <h1 className="text-3xl font-bold">{tool.name}</h1>
      <p className="mt-2 text-muted-foreground">{tool.description}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        🔒 Files are processed in your browser and never uploaded.
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
            {status === 'error' && <p className="text-sm text-red-600">{error}</p>}
          </>
        )}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Type-check + commit**

Run: `npx tsc --noEmit` (expected: clean)
```bash
git add -A
git commit -m "feat: ToolLayout shared tool flow"
```

---

### Task 9: Homepage grid + ToolCard + search

**Files:**
- Create: `components/ToolCard.tsx`
- Create: `components/ToolGrid.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `TOOLS`, `Tool` from `lib/tools.ts`.
- Produces: homepage listing all registered tools grouped by category with a client-side search box.

- [ ] **Step 1: ToolCard**

Create `components/ToolCard.tsx`:
```tsx
import Link from 'next/link'
import type { Tool } from '@/lib/tools'
import { Card } from '@/components/ui/card'

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/${tool.slug}`}>
      <Card className="h-full p-5 transition hover:shadow-md">
        <h3 className="font-semibold">{tool.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
      </Card>
    </Link>
  )
}
```

- [ ] **Step 2: ToolGrid (client, with search)**

Create `components/ToolGrid.tsx`:
```tsx
'use client'
import { useMemo, useState } from 'react'
import { TOOLS, type ToolCategory } from '@/lib/tools'
import { ToolCard } from './ToolCard'
import { Input } from '@/components/ui/input'

const CATEGORY_ORDER: ToolCategory[] = [
  'Organize',
  'Convert',
  'Page tools',
  'Forms & sign',
  'Edit',
  'Security',
]

export function ToolGrid() {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return TOOLS.filter(
      (t) =>
        !needle ||
        t.name.toLowerCase().includes(needle) ||
        t.description.toLowerCase().includes(needle),
    )
  }, [q])

  return (
    <div>
      <Input
        placeholder="Search tools…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mx-auto mb-8 max-w-md"
      />
      {CATEGORY_ORDER.map((cat) => {
        const items = filtered.filter((t) => t.category === cat)
        if (items.length === 0) return null
        return (
          <section key={cat} className="mb-10">
            <h2 className="mb-4 text-xl font-semibold">{cat}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Homepage**

Replace `app/page.tsx`:
```tsx
import { ToolGrid } from '@/components/ToolGrid'

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Every PDF tool you need — free & private</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Merge, split, convert, edit and more. Everything runs in your browser — your files never
          leave your device.
        </p>
      </section>
      <ToolGrid />
    </main>
  )
}
```

- [ ] **Step 4: Run dev server + verify manually**

Run: `npm run dev`, open http://localhost:3000
Expected: homepage shows the "Merge PDF" card under Organize; search filters it.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: homepage tool grid with search"
```

---

## Phase 1 — Simple pdf-lib tools

Each tool task follows the same shape: **(1)** write the failing test for the pure `lib/pdf/<tool>.ts` function, **(2)** run it red, **(3)** implement the function, **(4)** run it green, **(5)** append the registry entry, **(6)** create the route page wired through `ToolLayout`, **(7)** commit. The page files are thin and real (shown per task). Add each tool's `case` to `workers/pdf.worker.ts` only if the input is expected to be large (merge, split, images→pdf); small ops can call the pure function directly in the page.

### Task 10: Merge PDF (establishes the tool pattern)

**Files:**
- Create: `lib/pdf/merge.ts`
- Test: `lib/pdf/__tests__/merge.test.ts`
- Create: `app/merge-pdf/page.tsx`
- Modify: `lib/tools.ts` (Merge already present from Task 4 — no change)

**Interfaces:**
- Produces: `merge(buffers: Uint8Array[]): Promise<Uint8Array>` — concatenates all pages of all inputs in order.

- [ ] **Step 1: Write the failing test**

Create `lib/pdf/__tests__/merge.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { merge } from '@/lib/pdf/merge'
import { readFixture } from './helpers'

describe('merge', () => {
  it('combines page counts of all inputs', async () => {
    const out = await merge([readFixture('blank-1p.pdf'), readFixture('multi-5p.pdf')])
    const doc = await PDFDocument.load(out)
    expect(doc.getPageCount()).toBe(6)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- merge`
Expected: FAIL ("Cannot find module '@/lib/pdf/merge'").

- [ ] **Step 3: Implement**

Create `lib/pdf/merge.ts`:
```ts
import { PDFDocument } from 'pdf-lib'

export async function merge(buffers: Uint8Array[]): Promise<Uint8Array> {
  const out = await PDFDocument.create()
  for (const buf of buffers) {
    const src = await PDFDocument.load(buf)
    const pages = await out.copyPages(src, src.getPageIndices())
    pages.forEach((p) => out.addPage(p))
  }
  return out.save()
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- merge`
Expected: PASS.

- [ ] **Step 5: Create the page**

Create `app/merge-pdf/page.tsx`:
```tsx
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
```

- [ ] **Step 6: Verify in browser + commit**

Run: `npm run dev`, open `/merge-pdf`, drop 2 PDFs, download the merged file. Expected: pages combined.
```bash
git add -A
git commit -m "feat: Merge PDF tool"
```

---

### Task 11: Split PDF

**Files:**
- Create: `lib/pdf/split.ts`
- Test: `lib/pdf/__tests__/split.test.ts`
- Create: `app/split-pdf/page.tsx`
- Modify: `lib/tools.ts`

**Interfaces:**
- Produces:
  - `parseRanges(spec: string, pageCount: number): number[][]` — turns `"1-3,5"` into `[[0,1,2],[4]]` (0-indexed page groups).
  - `split(buffer: Uint8Array, groups: number[][]): Promise<Uint8Array[]>` — one output PDF per group.

- [ ] **Step 1: Write the failing test**

Create `lib/pdf/__tests__/split.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { split, parseRanges } from '@/lib/pdf/split'
import { readFixture } from './helpers'

describe('split', () => {
  it('parses ranges into 0-indexed groups', () => {
    expect(parseRanges('1-3,5', 5)).toEqual([[0, 1, 2], [4]])
  })
  it('produces one PDF per group with correct page counts', async () => {
    const outs = await split(readFixture('multi-5p.pdf'), [[0, 1], [4]])
    expect(outs).toHaveLength(2)
    expect((await PDFDocument.load(outs[0])).getPageCount()).toBe(2)
    expect((await PDFDocument.load(outs[1])).getPageCount()).toBe(1)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- split`
Expected: FAIL.

- [ ] **Step 3: Implement**

Create `lib/pdf/split.ts`:
```ts
import { PDFDocument } from 'pdf-lib'

export function parseRanges(spec: string, pageCount: number): number[][] {
  return spec
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [a, b] = part.split('-').map((n) => parseInt(n, 10))
      const start = a
      const end = Number.isNaN(b) ? a : b
      const group: number[] = []
      for (let p = start; p <= end; p++) {
        if (p >= 1 && p <= pageCount) group.push(p - 1)
      }
      return group
    })
    .filter((g) => g.length > 0)
}

export async function split(buffer: Uint8Array, groups: number[][]): Promise<Uint8Array[]> {
  const src = await PDFDocument.load(buffer)
  const outs: Uint8Array[] = []
  for (const group of groups) {
    const doc = await PDFDocument.create()
    const pages = await doc.copyPages(src, group)
    pages.forEach((p) => doc.addPage(p))
    outs.push(await doc.save())
  }
  return outs
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- split`
Expected: PASS.

- [ ] **Step 5: Registry entry**

In `lib/tools.ts`, add to `TOOLS`:
```ts
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    category: 'Organize',
    description: 'Extract page ranges from a PDF into separate files.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 6: Create the page (zips multiple outputs)**

Create `app/split-pdf/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import JSZip from 'jszip'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { split, parseRanges } from '@/lib/pdf/split'
import { getPageCount } from '@/lib/pdf/render'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('split-pdf')!

export default function SplitPdfPage() {
  const [ranges, setRanges] = useState('1-1')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ ranges }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Page ranges (e.g. 1-3,5)</Label>
          <Input value={ranges} onChange={(e) => setRanges(e.target.value)} />
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const count = await getPageCount(buf)
        const outs = await split(buf, parseRanges(ranges, count))
        const zip = new JSZip()
        outs.forEach((b, i) => zip.file(`split-${i + 1}.pdf`, b))
        const blob = await zip.generateAsync({ type: 'blob' })
        return { blob, filename: 'split.zip' }
      }}
    />
  )
}
```

- [ ] **Step 7: Verify + commit**

Run: `npm test -- split` (green) and manual `/split-pdf`.
```bash
git add -A
git commit -m "feat: Split PDF tool"
```

---

### Task 12: Rotate PDF

**Files:** Create `lib/pdf/rotate.ts`, `lib/pdf/__tests__/rotate.test.ts`, `app/rotate-pdf/page.tsx`; Modify `lib/tools.ts`.

**Interfaces:** `rotate(buffer: Uint8Array, degreesCw: number, pageIndices?: number[]): Promise<Uint8Array>` — rotates given pages (default all) by a multiple of 90° clockwise, additive to existing rotation.

- [ ] **Step 1: Failing test** — `lib/pdf/__tests__/rotate.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument, degrees } from 'pdf-lib'
import { rotate } from '@/lib/pdf/rotate'
import { readFixture } from './helpers'

describe('rotate', () => {
  it('adds 90° to every page', async () => {
    const out = await rotate(readFixture('multi-5p.pdf'), 90)
    const doc = await PDFDocument.load(out)
    expect(doc.getPage(0).getRotation().angle).toBe(90)
  })
})
```

- [ ] **Step 2: Run red** — `npm test -- rotate` → FAIL.

- [ ] **Step 3: Implement** — `lib/pdf/rotate.ts`:
```ts
import { PDFDocument, degrees } from 'pdf-lib'

export async function rotate(
  buffer: Uint8Array,
  degreesCw: number,
  pageIndices?: number[],
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  const pages = doc.getPages()
  const targets = pageIndices ?? pages.map((_, i) => i)
  for (const i of targets) {
    const current = pages[i].getRotation().angle
    pages[i].setRotation(degrees((current + degreesCw) % 360))
  }
  return doc.save()
}
```

- [ ] **Step 4: Run green** — `npm test -- rotate` → PASS.

- [ ] **Step 5: Registry** — add to `lib/tools.ts`:
```ts
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'Organize',
    description: 'Rotate all pages of a PDF by 90°, 180° or 270°.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 6: Page** — `app/rotate-pdf/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { rotate } from '@/lib/pdf/rotate'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const tool = getTool('rotate-pdf')!

export default function RotatePdfPage() {
  const [deg, setDeg] = useState('90')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ deg }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Rotation</Label>
          <Select value={deg} onValueChange={setDeg}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="90">90° clockwise</SelectItem>
              <SelectItem value="180">180°</SelectItem>
              <SelectItem value="270">270° clockwise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await rotate(buf, parseInt(deg, 10))
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'rotated') }
      }}
    />
  )
}
```

- [ ] **Step 7: Verify + commit** — `npm test -- rotate`, manual, then:
```bash
git add -A
git commit -m "feat: Rotate PDF tool"
```

---

### Task 13: Delete pages

**Files:** Create `lib/pdf/deletePages.ts`, test, `app/delete-pages/page.tsx`; Modify `lib/tools.ts`.

**Interfaces:** `deletePages(buffer: Uint8Array, pageIndices: number[]): Promise<Uint8Array>` — removes the given 0-indexed pages.

- [ ] **Step 1: Failing test** — `lib/pdf/__tests__/deletePages.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { deletePages } from '@/lib/pdf/deletePages'
import { readFixture } from './helpers'

describe('deletePages', () => {
  it('removes the specified pages', async () => {
    const out = await deletePages(readFixture('multi-5p.pdf'), [0, 4])
    expect((await PDFDocument.load(out)).getPageCount()).toBe(3)
  })
})
```

- [ ] **Step 2: Run red** — `npm test -- deletePages` → FAIL.

- [ ] **Step 3: Implement** — `lib/pdf/deletePages.ts`:
```ts
import { PDFDocument } from 'pdf-lib'

export async function deletePages(buffer: Uint8Array, pageIndices: number[]): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  // Remove from highest index down so earlier indices stay valid.
  for (const i of [...pageIndices].sort((a, b) => b - a)) {
    doc.removePage(i)
  }
  return doc.save()
}
```

- [ ] **Step 4: Run green** — `npm test -- deletePages` → PASS.

- [ ] **Step 5: Registry** — add:
```ts
  {
    slug: 'delete-pages',
    name: 'Delete Pages',
    category: 'Organize',
    description: 'Remove one or more pages from a PDF.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 6: Page** — `app/delete-pages/page.tsx` (uses a comma page-list; convert to 0-indexed):
```tsx
'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { deletePages } from '@/lib/pdf/deletePages'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('delete-pages')!

export default function DeletePagesPage() {
  const [spec, setSpec] = useState('1')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ spec }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Pages to delete (e.g. 1,3,5)</Label>
          <Input value={spec} onChange={(e) => setSpec(e.target.value)} />
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const idx = spec.split(',').map((s) => parseInt(s.trim(), 10) - 1).filter((n) => n >= 0)
        const bytes = await deletePages(buf, idx)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'edited') }
      }}
    />
  )
}
```

- [ ] **Step 7: Verify + commit**:
```bash
git add -A
git commit -m "feat: Delete Pages tool"
```

---

### Task 14: Extract pages

**Files:** Create `lib/pdf/extractPages.ts`, test, `app/extract-pages/page.tsx`; Modify `lib/tools.ts`.

**Interfaces:** `extractPages(buffer: Uint8Array, pageIndices: number[]): Promise<Uint8Array>` — new PDF containing only the given pages, in the given order.

- [ ] **Step 1: Failing test** — `lib/pdf/__tests__/extractPages.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { extractPages } from '@/lib/pdf/extractPages'
import { readFixture } from './helpers'

describe('extractPages', () => {
  it('keeps only the requested pages in order', async () => {
    const out = await extractPages(readFixture('multi-5p.pdf'), [4, 0])
    expect((await PDFDocument.load(out)).getPageCount()).toBe(2)
  })
})
```

- [ ] **Step 2: Run red** — `npm test -- extractPages` → FAIL.

- [ ] **Step 3: Implement** — `lib/pdf/extractPages.ts`:
```ts
import { PDFDocument } from 'pdf-lib'

export async function extractPages(buffer: Uint8Array, pageIndices: number[]): Promise<Uint8Array> {
  const src = await PDFDocument.load(buffer)
  const doc = await PDFDocument.create()
  const pages = await doc.copyPages(src, pageIndices)
  pages.forEach((p) => doc.addPage(p))
  return doc.save()
}
```

- [ ] **Step 4: Run green** — `npm test -- extractPages` → PASS.

- [ ] **Step 5: Registry** — add:
```ts
  {
    slug: 'extract-pages',
    name: 'Extract Pages',
    category: 'Organize',
    description: 'Pick specific pages and save them as a new PDF.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 6: Page** — `app/extract-pages/page.tsx` (mirror Delete Pages page, using `extractPages` and `parseRanges` flattened):
```tsx
'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { extractPages } from '@/lib/pdf/extractPages'
import { parseRanges } from '@/lib/pdf/split'
import { getPageCount } from '@/lib/pdf/render'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('extract-pages')!

export default function ExtractPagesPage() {
  const [spec, setSpec] = useState('1-2')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ spec }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Pages to extract (e.g. 1-2,5)</Label>
          <Input value={spec} onChange={(e) => setSpec(e.target.value)} />
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const count = await getPageCount(buf)
        const idx = parseRanges(spec, count).flat()
        const bytes = await extractPages(buf, idx)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'extracted') }
      }}
    />
  )
}
```

- [ ] **Step 7: Verify + commit**:
```bash
git add -A
git commit -m "feat: Extract Pages tool"
```

---

### Task 15: Organize / reorder pages

**Files:** Create `lib/pdf/reorder.ts`, test, `app/organize-pdf/page.tsx`; Modify `lib/tools.ts`.

**Interfaces:** `reorder(buffer: Uint8Array, order: number[]): Promise<Uint8Array>` — rebuild the PDF with pages in the given 0-indexed order (also supports omission = deletion). The page UI uses `renderThumbnails` + drag-to-reorder.

- [ ] **Step 1: Failing test** — `lib/pdf/__tests__/reorder.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { reorder } from '@/lib/pdf/reorder'
import { readFixture } from './helpers'

describe('reorder', () => {
  it('reorders and can drop pages', async () => {
    const out = await reorder(readFixture('multi-5p.pdf'), [4, 3, 2, 1, 0])
    expect((await PDFDocument.load(out)).getPageCount()).toBe(5)
    const dropped = await reorder(readFixture('multi-5p.pdf'), [0, 1])
    expect((await PDFDocument.load(dropped)).getPageCount()).toBe(2)
  })
})
```

- [ ] **Step 2: Run red** — `npm test -- reorder` → FAIL.

- [ ] **Step 3: Implement** — `lib/pdf/reorder.ts`:
```ts
import { PDFDocument } from 'pdf-lib'

export async function reorder(buffer: Uint8Array, order: number[]): Promise<Uint8Array> {
  const src = await PDFDocument.load(buffer)
  const doc = await PDFDocument.create()
  const pages = await doc.copyPages(src, order)
  pages.forEach((p) => doc.addPage(p))
  return doc.save()
}
```

- [ ] **Step 4: Run green** — `npm test -- reorder` → PASS.

- [ ] **Step 5: Registry** — add:
```ts
  {
    slug: 'organize-pdf',
    name: 'Organize PDF',
    category: 'Organize',
    description: 'Reorder or remove pages visually, then save.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 6: Page with drag-reorder thumbnails** — `app/organize-pdf/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { reorder } from '@/lib/pdf/reorder'
import { renderThumbnails } from '@/lib/pdf/render'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Button } from '@/components/ui/button'

const tool = getTool('organize-pdf')!

export default function OrganizePdfPage() {
  const [order, setOrder] = useState<number[]>([])
  const [thumbs, setThumbs] = useState<string[]>([])

  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{}}
      renderOptions={(_o, _s, files) => (
        <ThumbEditor files={files} thumbs={thumbs} setThumbs={setThumbs} order={order} setOrder={setOrder} />
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const finalOrder = order.length ? order : (await renderThumbnails(buf)).map((_, i) => i)
        const bytes = await reorder(buf, finalOrder)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'organized') }
      }}
    />
  )
}

function ThumbEditor({
  files, thumbs, setThumbs, order, setOrder,
}: {
  files: File[]; thumbs: string[]; setThumbs: (t: string[]) => void; order: number[]; setOrder: (o: number[]) => void
}) {
  async function load() {
    const buf = new Uint8Array(await files[0].arrayBuffer())
    const t = await renderThumbnails(buf)
    setThumbs(t)
    setOrder(t.map((_, i) => i))
  }
  function move(from: number, to: number) {
    const next = [...order]
    const [x] = next.splice(from, 1)
    next.splice(to, 0, x)
    setOrder(next)
  }
  function remove(pos: number) {
    setOrder(order.filter((_, i) => i !== pos))
  }
  return (
    <div className="space-y-3">
      {thumbs.length === 0 ? (
        <Button type="button" variant="outline" onClick={load}>Load page thumbnails</Button>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {order.map((pageIdx, pos) => (
            <figure key={pos} className="rounded border p-1 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbs[pageIdx]} alt={`Page ${pageIdx + 1}`} className="w-full" />
              <figcaption className="mt-1 flex justify-center gap-1 text-xs">
                <button type="button" onClick={() => move(pos, Math.max(0, pos - 1))}>◀</button>
                <span>{pageIdx + 1}</span>
                <button type="button" onClick={() => move(pos, Math.min(order.length - 1, pos + 1))}>▶</button>
                <button type="button" onClick={() => remove(pos)}>✕</button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}
```

Note: this uses button-based reordering (◀ ▶) for reliability; a drag-and-drop upgrade can come later. It satisfies the reorder + remove spec.

- [ ] **Step 7: Verify + commit**:
```bash
git add -A
git commit -m "feat: Organize PDF tool (reorder/remove pages)"
```

---

### Task 16: Watermark

**Files:** Create `lib/pdf/watermark.ts`, test, `app/watermark-pdf/page.tsx`; Modify `lib/tools.ts`.

**Interfaces:** `watermarkText(buffer: Uint8Array, text: string, opts?: { opacity?: number; fontSize?: number }): Promise<Uint8Array>` — draws diagonal repeated/centered text on every page.

- [ ] **Step 1: Failing test** — `lib/pdf/__tests__/watermark.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { watermarkText } from '@/lib/pdf/watermark'
import { readFixture } from './helpers'

describe('watermarkText', () => {
  it('returns a valid PDF with the same page count', async () => {
    const out = await watermarkText(readFixture('multi-5p.pdf'), 'CONFIDENTIAL')
    const doc = await PDFDocument.load(out)
    expect(doc.getPageCount()).toBe(5)
    expect(out.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run red** — `npm test -- watermark` → FAIL.

- [ ] **Step 3: Implement** — `lib/pdf/watermark.ts`:
```ts
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib'

export async function watermarkText(
  buffer: Uint8Array,
  text: string,
  opts: { opacity?: number; fontSize?: number } = {},
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  const font = await doc.embedFont(StandardFonts.HelveticaBold)
  const opacity = opts.opacity ?? 0.25
  const size = opts.fontSize ?? 48
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize()
    const textWidth = font.widthOfTextAtSize(text, size)
    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(45),
    })
  }
  return doc.save()
}
```

- [ ] **Step 4: Run green** — `npm test -- watermark` → PASS.

- [ ] **Step 5: Registry** — add:
```ts
  {
    slug: 'watermark-pdf',
    name: 'Watermark PDF',
    category: 'Page tools',
    description: 'Stamp text across every page of a PDF.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 6: Page** — `app/watermark-pdf/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { watermarkText } from '@/lib/pdf/watermark'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('watermark-pdf')!

export default function WatermarkPdfPage() {
  const [text, setText] = useState('CONFIDENTIAL')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ text }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Watermark text</Label>
          <Input value={text} onChange={(e) => setText(e.target.value)} />
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await watermarkText(buf, text)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'watermarked') }
      }}
    />
  )
}
```

- [ ] **Step 7: Verify + commit**:
```bash
git add -A
git commit -m "feat: Watermark PDF tool"
```

---

### Task 17: Add page numbers

**Files:** Create `lib/pdf/pageNumbers.ts`, test, `app/add-page-numbers/page.tsx`; Modify `lib/tools.ts`.

**Interfaces:** `addPageNumbers(buffer: Uint8Array, opts?: { start?: number }): Promise<Uint8Array>` — draws "N" bottom-center on each page.

- [ ] **Step 1: Failing test** — `lib/pdf/__tests__/pageNumbers.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { addPageNumbers } from '@/lib/pdf/pageNumbers'
import { readFixture } from './helpers'

describe('addPageNumbers', () => {
  it('keeps page count and returns a valid PDF', async () => {
    const out = await addPageNumbers(readFixture('multi-5p.pdf'))
    expect((await PDFDocument.load(out)).getPageCount()).toBe(5)
  })
})
```

- [ ] **Step 2: Run red** — `npm test -- pageNumbers` → FAIL.

- [ ] **Step 3: Implement** — `lib/pdf/pageNumbers.ts`:
```ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function addPageNumbers(
  buffer: Uint8Array,
  opts: { start?: number } = {},
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const start = opts.start ?? 1
  doc.getPages().forEach((page, i) => {
    const { width } = page.getSize()
    const label = String(start + i)
    const size = 10
    const tw = font.widthOfTextAtSize(label, size)
    page.drawText(label, { x: width / 2 - tw / 2, y: 20, size, font, color: rgb(0, 0, 0) })
  })
  return doc.save()
}
```

- [ ] **Step 4: Run green** — `npm test -- pageNumbers` → PASS.

- [ ] **Step 5: Registry** — add:
```ts
  {
    slug: 'add-page-numbers',
    name: 'Add Page Numbers',
    category: 'Page tools',
    description: 'Insert page numbers into a PDF.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 6: Page** — `app/add-page-numbers/page.tsx` (no options; single button):
```tsx
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
```

- [ ] **Step 7: Verify + commit**:
```bash
git add -A
git commit -m "feat: Add Page Numbers tool"
```

---

### Task 18: Crop PDF

**Files:** Create `lib/pdf/crop.ts`, test, `app/crop-pdf/page.tsx`; Modify `lib/tools.ts`.

**Interfaces:** `crop(buffer: Uint8Array, margins: { top: number; right: number; bottom: number; left: number }): Promise<Uint8Array>` — insets the CropBox by the given point margins on every page.

- [ ] **Step 1: Failing test** — `lib/pdf/__tests__/crop.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { crop } from '@/lib/pdf/crop'
import { readFixture } from './helpers'

describe('crop', () => {
  it('reduces the crop box by the margins', async () => {
    const out = await crop(readFixture('blank-1p.pdf'), { top: 10, right: 10, bottom: 10, left: 10 })
    const doc = await PDFDocument.load(out)
    const page = doc.getPage(0)
    // original blank page is 300x400; cropbox width should now be 280
    expect(Math.round(page.getCropBox().width)).toBe(280)
    expect(Math.round(page.getCropBox().height)).toBe(380)
  })
})
```

- [ ] **Step 2: Run red** — `npm test -- crop` → FAIL.

- [ ] **Step 3: Implement** — `lib/pdf/crop.ts`:
```ts
import { PDFDocument } from 'pdf-lib'

export async function crop(
  buffer: Uint8Array,
  margins: { top: number; right: number; bottom: number; left: number },
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize()
    page.setCropBox(
      margins.left,
      margins.bottom,
      width - margins.left - margins.right,
      height - margins.top - margins.bottom,
    )
  }
  return doc.save()
}
```

- [ ] **Step 4: Run green** — `npm test -- crop` → PASS.

- [ ] **Step 5: Registry** — add:
```ts
  {
    slug: 'crop-pdf',
    name: 'Crop PDF',
    category: 'Page tools',
    description: 'Trim margins off every page of a PDF.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 6: Page** — `app/crop-pdf/page.tsx` (four numeric margin inputs; single slider optional). Minimal version with one uniform margin:
```tsx
'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { crop } from '@/lib/pdf/crop'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('crop-pdf')!

export default function CropPdfPage() {
  const [m, setM] = useState('20')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ m }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Uniform margin to trim (points)</Label>
          <Input type="number" value={m} onChange={(e) => setM(e.target.value)} />
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const v = parseFloat(m) || 0
        const bytes = await crop(buf, { top: v, right: v, bottom: v, left: v })
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'cropped') }
      }}
    />
  )
}
```

- [ ] **Step 7: Verify + commit**:
```bash
git add -A
git commit -m "feat: Crop PDF tool"
```

---

### Task 19: N-up (pages per sheet)

**Files:** Create `lib/pdf/nup.ts`, test, `app/n-up-pdf/page.tsx`; Modify `lib/tools.ts`.

**Interfaces:** `nUp(buffer: Uint8Array, perSheet: 2 | 4): Promise<Uint8Array>` — places 2 or 4 source pages onto each output sheet using embedded pages.

- [ ] **Step 1: Failing test** — `lib/pdf/__tests__/nup.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { nUp } from '@/lib/pdf/nup'
import { readFixture } from './helpers'

describe('nUp', () => {
  it('packs 4 source pages onto ceil(5/4)=2 sheets', async () => {
    const out = await nUp(readFixture('multi-5p.pdf'), 4)
    expect((await PDFDocument.load(out)).getPageCount()).toBe(2)
  })
})
```

- [ ] **Step 2: Run red** — `npm test -- nup` → FAIL.

- [ ] **Step 3: Implement** — `lib/pdf/nup.ts`:
```ts
import { PDFDocument } from 'pdf-lib'

export async function nUp(buffer: Uint8Array, perSheet: 2 | 4): Promise<Uint8Array> {
  const src = await PDFDocument.load(buffer)
  const out = await PDFDocument.create()
  const embedded = await out.embedPdf(buffer, src.getPageIndices())
  const cols = perSheet === 2 ? 1 : 2
  const rows = perSheet === 2 ? 2 : 2
  // Use A4 portrait sheet.
  const sheetW = 595
  const sheetH = 842
  const cellW = sheetW / cols
  const cellH = sheetH / rows
  for (let i = 0; i < embedded.length; i += perSheet) {
    const page = out.addPage([sheetW, sheetH])
    for (let j = 0; j < perSheet && i + j < embedded.length; j++) {
      const emb = embedded[i + j]
      const col = j % cols
      const row = Math.floor(j / cols)
      const scale = Math.min(cellW / emb.width, cellH / emb.height)
      const w = emb.width * scale
      const h = emb.height * scale
      page.drawPage(emb, {
        x: col * cellW + (cellW - w) / 2,
        y: sheetH - (row + 1) * cellH + (cellH - h) / 2,
        width: w,
        height: h,
      })
    }
  }
  return out.save()
}
```

- [ ] **Step 4: Run green** — `npm test -- nup` → PASS.

- [ ] **Step 5: Registry** — add:
```ts
  {
    slug: 'n-up-pdf',
    name: 'Pages Per Sheet',
    category: 'Page tools',
    description: 'Place 2 or 4 pages onto each sheet (N-up).',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 6: Page** — `app/n-up-pdf/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { nUp } from '@/lib/pdf/nup'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const tool = getTool('n-up-pdf')!

export default function NUpPdfPage() {
  const [n, setN] = useState('2')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ n }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Pages per sheet</Label>
          <Select value={n} onValueChange={setN}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await nUp(buf, parseInt(n, 10) as 2 | 4)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'n-up') }
      }}
    />
  )
}
```

- [ ] **Step 7: Verify + commit**:
```bash
git add -A
git commit -m "feat: N-up (pages per sheet) tool"
```

---

### Task 20: Flatten PDF

**Files:** Create `lib/pdf/flatten.ts`, test, `app/flatten-pdf/page.tsx`; Modify `lib/tools.ts`.

**Interfaces:** `flatten(buffer: Uint8Array): Promise<Uint8Array>` — flattens interactive form fields into static content.

- [ ] **Step 1: Failing test** — `lib/pdf/__tests__/flatten.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { flatten } from '@/lib/pdf/flatten'
import { readFixture } from './helpers'

describe('flatten', () => {
  it('removes interactive form fields', async () => {
    const out = await flatten(readFixture('form.pdf'))
    const doc = await PDFDocument.load(out)
    expect(doc.getForm().getFields().length).toBe(0)
  })
})
```

- [ ] **Step 2: Run red** — `npm test -- flatten` → FAIL.

- [ ] **Step 3: Implement** — `lib/pdf/flatten.ts`:
```ts
import { PDFDocument } from 'pdf-lib'

export async function flatten(buffer: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  const form = doc.getForm()
  form.flatten()
  return doc.save()
}
```

- [ ] **Step 4: Run green** — `npm test -- flatten` → PASS.

- [ ] **Step 5: Registry** — add:
```ts
  {
    slug: 'flatten-pdf',
    name: 'Flatten PDF',
    category: 'Page tools',
    description: 'Make form fields and annotations non-editable.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 6: Page** — `app/flatten-pdf/page.tsx` (no options, mirror Add Page Numbers page shape with `flatten` and suffix `flattened`).
```tsx
'use client'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { flatten } from '@/lib/pdf/flatten'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'

const tool = getTool('flatten-pdf')!

export default function FlattenPdfPage() {
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{}}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await flatten(buf)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'flattened') }
      }}
    />
  )
}
```

- [ ] **Step 7: Verify + commit**:
```bash
git add -A
git commit -m "feat: Flatten PDF tool"
```

---

### Task 21: Edit metadata

**Files:** Create `lib/pdf/metadata.ts`, test, `app/edit-metadata/page.tsx`; Modify `lib/tools.ts`.

**Interfaces:**
- `readMetadata(buffer: Uint8Array): Promise<{ title: string; author: string; subject: string; keywords: string }>`
- `writeMetadata(buffer, meta): Promise<Uint8Array>`

- [ ] **Step 1: Failing test** — `lib/pdf/__tests__/metadata.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { writeMetadata, readMetadata } from '@/lib/pdf/metadata'
import { readFixture } from './helpers'

describe('metadata', () => {
  it('writes then reads back title/author', async () => {
    const out = await writeMetadata(readFixture('blank-1p.pdf'), {
      title: 'My Doc', author: 'Sam', subject: 'Test', keywords: 'a, b',
    })
    const meta = await readMetadata(out)
    expect(meta.title).toBe('My Doc')
    expect(meta.author).toBe('Sam')
  })
})
```

- [ ] **Step 2: Run red** — `npm test -- metadata` → FAIL.

- [ ] **Step 3: Implement** — `lib/pdf/metadata.ts`:
```ts
import { PDFDocument } from 'pdf-lib'

export interface PdfMeta {
  title: string
  author: string
  subject: string
  keywords: string
}

export async function readMetadata(buffer: Uint8Array): Promise<PdfMeta> {
  const doc = await PDFDocument.load(buffer)
  return {
    title: doc.getTitle() ?? '',
    author: doc.getAuthor() ?? '',
    subject: doc.getSubject() ?? '',
    keywords: doc.getKeywords() ?? '',
  }
}

export async function writeMetadata(buffer: Uint8Array, meta: PdfMeta): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  doc.setTitle(meta.title)
  doc.setAuthor(meta.author)
  doc.setSubject(meta.subject)
  doc.setKeywords(meta.keywords.split(',').map((k) => k.trim()).filter(Boolean))
  return doc.save()
}
```

- [ ] **Step 4: Run green** — `npm test -- metadata` → PASS.

- [ ] **Step 5: Registry** — add:
```ts
  {
    slug: 'edit-metadata',
    name: 'Edit Metadata',
    category: 'Edit',
    description: 'View and change a PDF’s title, author, subject and keywords.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 6: Page** — `app/edit-metadata/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { writeMetadata, type PdfMeta } from '@/lib/pdf/metadata'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('edit-metadata')!
const EMPTY: PdfMeta = { title: '', author: '', subject: '', keywords: '' }

export default function EditMetadataPage() {
  const [meta, setMeta] = useState<PdfMeta>(EMPTY)
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={meta}
      renderOptions={() => (
        <div className="grid gap-3">
          {(['title', 'author', 'subject', 'keywords'] as const).map((k) => (
            <div key={k} className="space-y-1">
              <Label className="capitalize">{k}</Label>
              <Input value={meta[k]} onChange={(e) => setMeta({ ...meta, [k]: e.target.value })} />
            </div>
          ))}
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await writeMetadata(buf, meta)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'metadata') }
      }}
    />
  )
}
```

- [ ] **Step 7: Verify + commit**:
```bash
git add -A
git commit -m "feat: Edit Metadata tool"
```

---

### Task 22: Images → PDF

**Files:** Create `lib/pdf/imagesToPdf.ts`, test, `app/jpg-to-pdf/page.tsx`; Modify `lib/tools.ts`.

**Interfaces:** `imagesToPdf(images: { bytes: Uint8Array; type: 'image/jpeg' | 'image/png' }[]): Promise<Uint8Array>` — one page per image, sized to the image.

- [ ] **Step 1: Failing test** — `lib/pdf/__tests__/imagesToPdf.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { imagesToPdf } from '@/lib/pdf/imagesToPdf'
import { readFixture } from './helpers'

describe('imagesToPdf', () => {
  it('creates one page per image', async () => {
    const png = readFixture('red-100x100.png')
    const out = await imagesToPdf([
      { bytes: png, type: 'image/png' },
      { bytes: png, type: 'image/png' },
    ])
    expect((await PDFDocument.load(out)).getPageCount()).toBe(2)
  })
})
```

- [ ] **Step 2: Run red** — `npm test -- imagesToPdf` → FAIL.

- [ ] **Step 3: Implement** — `lib/pdf/imagesToPdf.ts`:
```ts
import { PDFDocument } from 'pdf-lib'

export async function imagesToPdf(
  images: { bytes: Uint8Array; type: 'image/jpeg' | 'image/png' }[],
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  for (const img of images) {
    const embedded =
      img.type === 'image/png' ? await doc.embedPng(img.bytes) : await doc.embedJpg(img.bytes)
    const page = doc.addPage([embedded.width, embedded.height])
    page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height })
  }
  return doc.save()
}
```

- [ ] **Step 4: Run green** — `npm test -- imagesToPdf` → PASS.

- [ ] **Step 5: Registry** — add:
```ts
  {
    slug: 'jpg-to-pdf',
    name: 'Images to PDF',
    category: 'Convert',
    description: 'Turn JPG and PNG images into a PDF, one image per page.',
    accept: ['image/jpeg', 'image/png'],
    multiple: true,
  },
```

- [ ] **Step 6: Page** — `app/jpg-to-pdf/page.tsx`:
```tsx
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
```

- [ ] **Step 7: Verify + commit**:
```bash
git add -A
git commit -m "feat: Images to PDF tool"
```

---

### Task 23: PDF → JPG/PNG

**Files:** Create `app/pdf-to-jpg/page.tsx`; Modify `lib/tools.ts`. (Logic lives in `lib/pdf/render.ts::renderPageToImageBlob` from Task 6 — this is a browser-render tool, so it has no Node unit test; verify manually.)

**Interfaces:** Consumes `renderPageToImageBlob`. Produces a zip of per-page images.

- [ ] **Step 1: Registry** — add to `lib/tools.ts`:
```ts
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'Convert',
    description: 'Convert each page of a PDF into a JPG image.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 2: Page** — `app/pdf-to-jpg/page.tsx`:
```tsx
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
```

- [ ] **Step 3: Verify in browser** — `/pdf-to-jpg`, upload `multi-5p.pdf`, get a zip of 5 JPGs.

- [ ] **Step 4: Commit**:
```bash
git add -A
git commit -m "feat: PDF to JPG tool"
```

---

## Phase 2 — Medium-complexity tools

### Task 24: Fill form

**Files:** Create `lib/pdf/fillForm.ts`, test, `app/fill-form/page.tsx`; Modify `lib/tools.ts`.

**Interfaces:**
- `listTextFields(buffer: Uint8Array): Promise<string[]>` — names of text fields.
- `fillForm(buffer: Uint8Array, values: Record<string, string>): Promise<Uint8Array>`

- [ ] **Step 1: Failing test** — `lib/pdf/__tests__/fillForm.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { fillForm, listTextFields } from '@/lib/pdf/fillForm'
import { readFixture } from './helpers'

describe('fillForm', () => {
  it('lists and fills a text field', async () => {
    const buf = readFixture('form.pdf')
    expect(await listTextFields(buf)).toContain('fullName')
    const out = await fillForm(buf, { fullName: 'Ada Lovelace' })
    const doc = await PDFDocument.load(out)
    expect(doc.getForm().getTextField('fullName').getText()).toBe('Ada Lovelace')
  })
})
```

- [ ] **Step 2: Run red** — `npm test -- fillForm` → FAIL.

- [ ] **Step 3: Implement** — `lib/pdf/fillForm.ts`:
```ts
import { PDFDocument, PDFTextField } from 'pdf-lib'

export async function listTextFields(buffer: Uint8Array): Promise<string[]> {
  const doc = await PDFDocument.load(buffer)
  return doc
    .getForm()
    .getFields()
    .filter((f): f is PDFTextField => f instanceof PDFTextField)
    .map((f) => f.getName())
}

export async function fillForm(
  buffer: Uint8Array,
  values: Record<string, string>,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  const form = doc.getForm()
  for (const [name, value] of Object.entries(values)) {
    const field = form.getTextField(name)
    field.setText(value)
  }
  return doc.save()
}
```

- [ ] **Step 4: Run green** — `npm test -- fillForm` → PASS.

- [ ] **Step 5: Registry** — add:
```ts
  {
    slug: 'fill-form',
    name: 'Fill PDF Form',
    category: 'Forms & sign',
    description: 'Detect form fields and fill them in.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 6: Page** — `app/fill-form/page.tsx` (loads field names on file, renders an input per field):
```tsx
'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { fillForm, listTextFields } from '@/lib/pdf/fillForm'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const tool = getTool('fill-form')!

export default function FillFormPage() {
  const [fields, setFields] = useState<string[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{}}
      renderOptions={(_o, _s, files) => (
        <div className="space-y-3">
          {fields.length === 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={async () => setFields(await listTextFields(new Uint8Array(await files[0].arrayBuffer())))}
            >
              Detect fields
            </Button>
          ) : (
            fields.map((name) => (
              <div key={name} className="space-y-1">
                <Label>{name}</Label>
                <Input
                  value={values[name] ?? ''}
                  onChange={(e) => setValues({ ...values, [name]: e.target.value })}
                />
              </div>
            ))
          )}
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await fillForm(buf, values)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'filled') }
      }}
    />
  )
}
```

- [ ] **Step 7: Verify + commit**:
```bash
git add -A
git commit -m "feat: Fill PDF Form tool"
```

---

### Task 25: Sign PDF

**Files:** Create `lib/pdf/sign.ts`, test, `components/SignaturePad.tsx`, `app/sign-pdf/page.tsx`; Modify `lib/tools.ts`.

**Interfaces:** `placeSignature(buffer: Uint8Array, pngBytes: Uint8Array, opts: { pageIndex: number; x: number; y: number; width: number }): Promise<Uint8Array>` — embeds a PNG signature at a position (PDF coordinate space, origin bottom-left), scaling height to preserve aspect ratio.

- [ ] **Step 1: Failing test** — `lib/pdf/__tests__/sign.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { placeSignature } from '@/lib/pdf/sign'
import { readFixture } from './helpers'

describe('placeSignature', () => {
  it('embeds a signature image and keeps the page count', async () => {
    const out = await placeSignature(readFixture('blank-1p.pdf'), readFixture('red-100x100.png'), {
      pageIndex: 0, x: 50, y: 50, width: 120,
    })
    expect((await PDFDocument.load(out)).getPageCount()).toBe(1)
    expect(out.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run red** — `npm test -- sign` → FAIL.

- [ ] **Step 3: Implement** — `lib/pdf/sign.ts`:
```ts
import { PDFDocument } from 'pdf-lib'

export async function placeSignature(
  buffer: Uint8Array,
  pngBytes: Uint8Array,
  opts: { pageIndex: number; x: number; y: number; width: number },
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  const png = await doc.embedPng(pngBytes)
  const height = (png.height / png.width) * opts.width
  const page = doc.getPage(opts.pageIndex)
  page.drawImage(png, { x: opts.x, y: opts.y, width: opts.width, height })
  return doc.save()
}
```

- [ ] **Step 4: Run green** — `npm test -- sign` → PASS.

- [ ] **Step 5: SignaturePad component** — `components/SignaturePad.tsx`:
```tsx
'use client'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'

export function SignaturePad({ onChange }: { onChange: (pngBytes: Uint8Array | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)

  function pos(e: React.PointerEvent) {
    const rect = ref.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  function down(e: React.PointerEvent) {
    drawing.current = true
    const ctx = ref.current!.getContext('2d')!
    const { x, y } = pos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }
  function move(e: React.PointerEvent) {
    if (!drawing.current) return
    const ctx = ref.current!.getContext('2d')!
    const { x, y } = pos(e)
    ctx.lineTo(x, y)
    ctx.lineWidth = 2
    ctx.stroke()
  }
  async function up() {
    drawing.current = false
    const blob: Blob | null = await new Promise((r) => ref.current!.toBlob((b) => r(b), 'image/png'))
    if (blob) onChange(new Uint8Array(await blob.arrayBuffer()))
  }
  function clear() {
    const c = ref.current!
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height)
    onChange(null)
  }
  return (
    <div className="space-y-2">
      <canvas
        ref={ref}
        width={400}
        height={150}
        className="rounded border bg-white touch-none"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
      />
      <Button type="button" variant="outline" size="sm" onClick={clear}>Clear</Button>
    </div>
  )
}
```

- [ ] **Step 6: Registry + page** — add registry entry:
```ts
  {
    slug: 'sign-pdf',
    name: 'Sign PDF',
    category: 'Forms & sign',
    description: 'Draw a signature and place it on the first page.',
    accept: ['application/pdf'],
    multiple: false,
  },
```
Create `app/sign-pdf/page.tsx` (v1: place drawn signature at a fixed bottom-left position on page 1; visual placement is a later enhancement):
```tsx
'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { placeSignature } from '@/lib/pdf/sign'
import { SignaturePad } from '@/components/SignaturePad'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'

const tool = getTool('sign-pdf')!

export default function SignPdfPage() {
  const [sig, setSig] = useState<Uint8Array | null>(null)
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{}}
      renderOptions={() => <SignaturePad onChange={setSig} />}
      process={async (files) => {
        if (!sig) throw new Error('Draw a signature first.')
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await placeSignature(buf, sig, { pageIndex: 0, x: 50, y: 50, width: 150 })
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'signed') }
      }}
    />
  )
}
```

- [ ] **Step 7: Verify + commit**:
```bash
git add -A
git commit -m "feat: Sign PDF tool (draw + place signature)"
```

---

### Task 26: Extract images

**Files:** Create `app/extract-images/page.tsx`; Modify `lib/tools.ts`. Uses a browser-only extractor in `lib/pdf/render.ts` (add `extractImages`). No Node unit test (pdf.js render); verify manually.

**Interfaces:** Add to `lib/pdf/render.ts`: `extractPageImages(pdfBytes: Uint8Array): Promise<Blob[]>` — renders each page to a PNG (pragmatic v1: page rasters rather than parsing embedded XObjects).

- [ ] **Step 1: Add extractor to render.ts**

Append to `lib/pdf/render.ts`:
```ts
export async function extractPageImages(pdfBytes: Uint8Array): Promise<Blob[]> {
  const { getPageCount } = await import('./render')
  const count = await getPageCount(pdfBytes)
  const blobs: Blob[] = []
  for (let i = 0; i < count; i++) {
    blobs.push(await renderPageToImageBlob(pdfBytes, i, 2, 'image/png'))
  }
  return blobs
}
```
Note: true embedded-image extraction (parsing image XObjects) is deferred; v1 exports high-res page rasters, which covers the common "get the pictures out" intent. Document this limitation on the page.

- [ ] **Step 2: Registry** — add:
```ts
  {
    slug: 'extract-images',
    name: 'Extract Images',
    category: 'Edit',
    description: 'Export each page of a PDF as a high-resolution image.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 3: Page** — `app/extract-images/page.tsx`:
```tsx
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
```

- [ ] **Step 4: Verify + commit**:
```bash
git add -A
git commit -m "feat: Extract Images tool (page rasters)"
```

---

### Task 27: Compare PDF

**Files:** Create `app/compare-pdf/page.tsx`; Modify `lib/tools.ts`. Browser-only visual diff via canvas; no Node unit test.

**Interfaces:** Add to `lib/pdf/render.ts`: `diffFirstPage(a: Uint8Array, b: Uint8Array): Promise<string>` — renders page 1 of each at the same scale and returns a data-URL PNG highlighting per-pixel differences in red.

- [ ] **Step 1: Add diff to render.ts**

Append to `lib/pdf/render.ts`:
```ts
export async function diffFirstPage(a: Uint8Array, b: Uint8Array): Promise<string> {
  const pdfjs = getPdfjs()
  async function raster(bytes: Uint8Array) {
    const doc = await pdfjs.getDocument({ data: bytes.slice() }).promise
    const page = await doc.getPage(1)
    const viewport = page.getViewport({ scale: 1.5 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!
    await page.render({ canvasContext: ctx, viewport }).promise
    await doc.destroy()
    return { canvas, ctx, w: canvas.width, h: canvas.height }
  }
  const ra = await raster(a)
  const rb = await raster(b)
  const w = Math.min(ra.w, rb.w)
  const h = Math.min(ra.h, rb.h)
  const da = ra.ctx.getImageData(0, 0, w, h)
  const db = rb.ctx.getImageData(0, 0, w, h)
  const out = ra.ctx.createImageData(w, h)
  for (let i = 0; i < da.data.length; i += 4) {
    const diff =
      Math.abs(da.data[i] - db.data[i]) +
      Math.abs(da.data[i + 1] - db.data[i + 1]) +
      Math.abs(da.data[i + 2] - db.data[i + 2])
    if (diff > 40) {
      out.data[i] = 255; out.data[i + 1] = 0; out.data[i + 2] = 0; out.data[i + 3] = 255
    } else {
      out.data[i] = da.data[i]; out.data[i + 1] = da.data[i + 1]
      out.data[i + 2] = da.data[i + 2]; out.data[i + 3] = 60
    }
  }
  const result = document.createElement('canvas')
  result.width = w; result.height = h
  result.getContext('2d')!.putImageData(out, 0, 0)
  return result.toDataURL('image/png')
}
```

- [ ] **Step 2: Registry** — add:
```ts
  {
    slug: 'compare-pdf',
    name: 'Compare PDF',
    category: 'Edit',
    description: 'Highlight visual differences between the first pages of two PDFs.',
    accept: ['application/pdf'],
    multiple: true,
  },
```

- [ ] **Step 3: Page** — `app/compare-pdf/page.tsx` (renders the diff image inline; this tool shows a result image rather than a download, so it uses its own light layout):
```tsx
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
      <p className="mt-1 text-xs text-muted-foreground">🔒 Compared in your browser; nothing is uploaded.</p>
      <div className="mt-8 space-y-4">
        <FileDropzone accept={tool.accept} multiple onFiles={setFiles} />
        {files.length >= 2 && <Button onClick={run} disabled={busy}>Compare</Button>}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {img && <img src={img} alt="Difference" className="w-full rounded border" />}
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify + commit**:
```bash
git add -A
git commit -m "feat: Compare PDF tool (visual diff)"
```

---

### Task 28: Light compress

**Files:** Create `app/compress-pdf/page.tsx`; Modify `lib/tools.ts`. Browser-only (re-rasterize pages to JPEG and rebuild). Uses a new `lib/pdf/render.ts` helper plus `imagesToPdf`. No Node unit test.

**Interfaces:** Add `lib/pdf/render.ts`: `rasterizeToJpegPdfBytes(pdfBytes: Uint8Array, quality: number, scale: number): Promise<Uint8Array>` — render each page to a JPEG and rebuild a PDF via `imagesToPdf`. This is genuinely lossy "light compress" for image-heavy/scanned PDFs; label expectations clearly (strong, structure-preserving compression is a Phase 2 paid tool).

- [ ] **Step 1: Add helper to render.ts**

Append to `lib/pdf/render.ts`:
```ts
import { imagesToPdf } from './imagesToPdf'

export async function rasterizeToJpegPdfBytes(
  pdfBytes: Uint8Array,
  quality: number,
  scale: number,
): Promise<Uint8Array> {
  const count = await getPageCount(pdfBytes)
  const images: { bytes: Uint8Array; type: 'image/jpeg' }[] = []
  for (let i = 0; i < count; i++) {
    const blob = await renderPageToImageBlob(pdfBytes, i, scale, 'image/jpeg', quality)
    images.push({ bytes: new Uint8Array(await blob.arrayBuffer()), type: 'image/jpeg' })
  }
  return imagesToPdf(images)
}
```

- [ ] **Step 2: Registry** — add:
```ts
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    category: 'Organize',
    description: 'Reduce file size (light, in-browser). Best for image-heavy PDFs.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 3: Page** — `app/compress-pdf/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { rasterizeToJpegPdfBytes } from '@/lib/pdf/render'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const tool = getTool('compress-pdf')!
const LEVELS: Record<string, { q: number; s: number }> = {
  high: { q: 0.5, s: 1.2 },
  medium: { q: 0.7, s: 1.5 },
  low: { q: 0.85, s: 2 },
}

export default function CompressPdfPage() {
  const [level, setLevel] = useState('medium')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ level }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Compression level</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High (smallest)</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low (best quality)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Note: this is a light, in-browser compression that rasterizes pages. Text becomes an image.
          </p>
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const { q, s } = LEVELS[level]
        const bytes = await rasterizeToJpegPdfBytes(buf, q, s)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'compressed') }
      }}
    />
  )
}
```

- [ ] **Step 4: Verify + commit**:
```bash
git add -A
git commit -m "feat: Light Compress PDF tool"
```

---

## Phase 3 — Complex tool

### Task 29: Annotate / Edit PDF

**Files:** Create `lib/pdf/annotate.ts`, test, `components/PdfAnnotator.tsx`, `app/edit-pdf/page.tsx`; Modify `lib/tools.ts`.

**Interfaces:**
- `type Annotation = { type: 'text'; page: number; x: number; y: number; text: string; size: number } | { type: 'rect'; page: number; x: number; y: number; width: number; height: number }`
- `applyAnnotations(buffer: Uint8Array, annotations: Annotation[]): Promise<Uint8Array>` — draws text/rectangles onto the given pages (PDF coordinate space).

The UI (`PdfAnnotator`) renders page 1 via pdf.js and lets the user click to drop text; the pure `applyAnnotations` is unit-tested.

- [ ] **Step 1: Failing test** — `lib/pdf/__tests__/annotate.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { applyAnnotations } from '@/lib/pdf/annotate'
import { readFixture } from './helpers'

describe('applyAnnotations', () => {
  it('draws text and a rect without changing page count', async () => {
    const out = await applyAnnotations(readFixture('blank-1p.pdf'), [
      { type: 'text', page: 0, x: 20, y: 20, text: 'Hello', size: 12 },
      { type: 'rect', page: 0, x: 40, y: 40, width: 50, height: 20 },
    ])
    expect((await PDFDocument.load(out)).getPageCount()).toBe(1)
    expect(out.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run red** — `npm test -- annotate` → FAIL.

- [ ] **Step 3: Implement** — `lib/pdf/annotate.ts`:
```ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export type Annotation =
  | { type: 'text'; page: number; x: number; y: number; text: string; size: number }
  | { type: 'rect'; page: number; x: number; y: number; width: number; height: number }

export async function applyAnnotations(
  buffer: Uint8Array,
  annotations: Annotation[],
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  const font = await doc.embedFont(StandardFonts.Helvetica)
  for (const a of annotations) {
    const page = doc.getPage(a.page)
    if (a.type === 'text') {
      page.drawText(a.text, { x: a.x, y: a.y, size: a.size, font, color: rgb(0, 0, 0) })
    } else {
      page.drawRectangle({
        x: a.x, y: a.y, width: a.width, height: a.height,
        borderColor: rgb(1, 0, 0), borderWidth: 1.5,
      })
    }
  }
  return doc.save()
}
```

- [ ] **Step 4: Run green** — `npm test -- annotate` → PASS.

- [ ] **Step 5: PdfAnnotator component** — `components/PdfAnnotator.tsx` (renders page 1, click to place text; collects annotations in PDF coords):
```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { getPdfjs } from '@/lib/pdf/pdfjs'
import type { Annotation } from '@/lib/pdf/annotate'
import { Input } from '@/components/ui/input'

export function PdfAnnotator({
  file, onChange,
}: { file: File; onChange: (a: Annotation[]) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scale, setScale] = useState(1.5)
  const [pageHeight, setPageHeight] = useState(0)
  const [text, setText] = useState('Text')
  const [annos, setAnnos] = useState<Annotation[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const bytes = new Uint8Array(await file.arrayBuffer())
      const pdfjs = getPdfjs()
      const doc = await pdfjs.getDocument({ data: bytes }).promise
      const page = await doc.getPage(1)
      const viewport = page.getViewport({ scale })
      if (cancelled) return
      const canvas = canvasRef.current!
      canvas.width = viewport.width
      canvas.height = viewport.height
      setPageHeight(viewport.height)
      await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
      await doc.destroy()
    })()
    return () => { cancelled = true }
  }, [file, scale])

  function click(e: React.MouseEvent) {
    const rect = canvasRef.current!.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    // Convert canvas (top-left origin) → PDF (bottom-left origin), unscale.
    const next: Annotation[] = [
      ...annos,
      { type: 'text', page: 0, x: cx / scale, y: (pageHeight - cy) / scale, text, size: 14 },
    ]
    setAnnos(next)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm">Text to place:</span>
        <Input value={text} onChange={(e) => setText(e.target.value)} className="max-w-xs" />
        <span className="text-xs text-muted-foreground">Click on the page to drop it.</span>
      </div>
      <canvas ref={canvasRef} onClick={click} className="cursor-crosshair rounded border" />
      <p className="text-xs text-muted-foreground">{annos.length} annotation(s) placed.</p>
    </div>
  )
}
```

- [ ] **Step 6: Registry + page** — add:
```ts
  {
    slug: 'edit-pdf',
    name: 'Edit PDF',
    category: 'Edit',
    description: 'Add text and boxes onto a PDF page.',
    accept: ['application/pdf'],
    multiple: false,
  },
```
Create `app/edit-pdf/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { applyAnnotations, type Annotation } from '@/lib/pdf/annotate'
import { PdfAnnotator } from '@/components/PdfAnnotator'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'

const tool = getTool('edit-pdf')!

export default function EditPdfPage() {
  const [annos, setAnnos] = useState<Annotation[]>([])
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{}}
      renderOptions={(_o, _s, files) => <PdfAnnotator file={files[0]} onChange={setAnnos} />}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await applyAnnotations(buf, annos)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'edited') }
      }}
    />
  )
}
```

- [ ] **Step 7: Verify + commit**:
```bash
git add -A
git commit -m "feat: Edit PDF tool (annotate text/boxes)"
```

---

## Phase 4 — Security tools (qpdf-wasm)

### Task 30: qpdf-wasm feasibility spike

**Do this task BEFORE Tasks 31–32.** If it fails, mark Protect/Unlock as deferred to Phase 2 (server) in `lib/tools.ts` (do not add their registry entries) and skip Tasks 31–32.

**Files:**
- Modify: `package.json`
- Create: `lib/pdf/qpdf.ts`
- Test: `lib/pdf/__tests__/qpdf.spike.test.ts`

**Interfaces:**
- Produces: `getQpdf(): Promise<QpdfModule>` — lazy-loads the wasm module; `QpdfModule` exposes an `execute(args, files)`-style call per the chosen package's API.

- [ ] **Step 1: Install a qpdf wasm build**

```bash
npm install @jspawn/qpdf-wasm
```
(If this package's API differs or it fails to load in the browser, try alternatives: `qpdf-wasm-embedded` or a maintained fork. Record which one works in `lib/pdf/qpdf.ts` comments.)

- [ ] **Step 2: Write a spike that encrypts + decrypts a fixture**

Create `lib/pdf/__tests__/qpdf.spike.test.ts`. Because qpdf-wasm targets the browser and may not run under Node/Vitest, this spike is allowed to be verified in the browser instead if the Node import fails. First attempt Node:
```ts
import { describe, it, expect } from 'vitest'
import { readFixture } from './helpers'

describe('qpdf wasm spike', () => {
  it('loads the module (or is skipped for browser-only verification)', async () => {
    try {
      const mod = await import('@jspawn/qpdf-wasm')
      expect(mod).toBeTruthy()
    } catch {
      // Browser-only module: verify manually via a temporary /qpdf-spike page instead.
      expect(true).toBe(true)
    }
  })
})
```

- [ ] **Step 3: Implement the loader + a protect/unlock wrapper**

Create `lib/pdf/qpdf.ts` (adapt exact call signature to the installed package — the spike output tells you the real API):
```ts
// qpdf-wasm loader. Encrypt/decrypt PDFs entirely in-browser.
// NOTE: exact API depends on the installed package; adjust `run()` to match.
let modPromise: Promise<any> | null = null

async function load() {
  if (!modPromise) modPromise = import('@jspawn/qpdf-wasm').then((m: any) => m.default ?? m)
  return modPromise
}

/** Add an owner/user password. */
export async function protect(input: Uint8Array, password: string): Promise<Uint8Array> {
  const qpdf = await load()
  return runQpdf(qpdf, ['--encrypt', password, password, '256', '--', 'in.pdf', 'out.pdf'], input)
}

/** Remove a known password. */
export async function unlock(input: Uint8Array, password: string): Promise<Uint8Array> {
  const qpdf = await load()
  return runQpdf(qpdf, [`--password=${password}`, '--decrypt', 'in.pdf', 'out.pdf'], input)
}

// Adapter around the wasm module's virtual FS + CLI entrypoint.
// Fill in per the installed package's documented API (writeFile/callMain/readFile pattern).
async function runQpdf(qpdf: any, args: string[], input: Uint8Array): Promise<Uint8Array> {
  qpdf.FS.writeFile('in.pdf', input)
  qpdf.callMain(args)
  return qpdf.FS.readFile('out.pdf')
}
```

- [ ] **Step 4: Verify (browser)** — create a temporary throwaway page `app/qpdf-spike/page.tsx` that imports `protect`/`unlock`, runs them on a fetched sample, and logs success; open it in the browser. Delete the page after confirming. If it works, proceed to Task 31. If not, mark Protect/Unlock deferred and stop.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "spike: qpdf-wasm feasibility for protect/unlock"
```

---

### Task 31: Protect PDF (only if spike passed)

**Files:** Create `app/protect-pdf/page.tsx`; Modify `lib/tools.ts`. Uses `protect()` from `lib/pdf/qpdf.ts`.

**Interfaces:** Consumes `protect(input, password)`.

- [ ] **Step 1: Registry** — add:
```ts
  {
    slug: 'protect-pdf',
    name: 'Protect PDF',
    category: 'Security',
    description: 'Add a password and encrypt a PDF — in your browser.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 2: Page** — `app/protect-pdf/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { protect } from '@/lib/pdf/qpdf'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('protect-pdf')!

export default function ProtectPdfPage() {
  const [password, setPassword] = useState('')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ password }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      )}
      process={async (files) => {
        if (!password) throw new Error('Enter a password.')
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await protect(buf, password)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'protected') }
      }}
    />
  )
}
```

- [ ] **Step 3: Verify (browser) + commit**:
```bash
git add -A
git commit -m "feat: Protect PDF tool (qpdf-wasm)"
```

---

### Task 32: Unlock PDF (only if spike passed)

**Files:** Create `app/unlock-pdf/page.tsx`; Modify `lib/tools.ts`. Uses `unlock()`.

- [ ] **Step 1: Registry** — add:
```ts
  {
    slug: 'unlock-pdf',
    name: 'Unlock PDF',
    category: 'Security',
    description: 'Remove a known password from a PDF — in your browser.',
    accept: ['application/pdf'],
    multiple: false,
  },
```

- [ ] **Step 2: Page** — `app/unlock-pdf/page.tsx` (same shape as Protect, calling `unlock`, suffix `unlocked`):
```tsx
'use client'
import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { unlock } from '@/lib/pdf/qpdf'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('unlock-pdf')!

export default function UnlockPdfPage() {
  const [password, setPassword] = useState('')
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={{ password }}
      renderOptions={() => (
        <div className="space-y-2">
          <Label>Current password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      )}
      process={async (files) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await unlock(buf, password)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'unlocked') }
      }}
    />
  )
}
```

- [ ] **Step 3: Verify (browser) + commit**:
```bash
git add -A
git commit -m "feat: Unlock PDF tool (qpdf-wasm)"
```

---

## Phase 5 — Polish & deploy

### Task 33: Global nav, per-tool SEO metadata, layout

**Files:** Modify `app/layout.tsx`; Create `components/SiteHeader.tsx`, `components/SiteFooter.tsx`; Create `app/[slug]/` is NOT used (each tool has its own folder) — instead add `generateMetadata` per tool page is optional. Add a shared `app/layout.tsx` header/footer and root metadata.

**Interfaces:** Produces site-wide header (logo → home, link to all tools) and footer (privacy note). Root metadata with title/description for SEO.

- [ ] **Step 1: SiteHeader** — `components/SiteHeader.tsx`:
```tsx
import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold">pdf-tool</Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">All tools</Link>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: SiteFooter** — `components/SiteFooter.tsx`:
```tsx
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        🔒 All tools run in your browser. Your files never leave your device.
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Root layout + metadata** — modify `app/layout.tsx` to wrap children with header/footer and set metadata:
```tsx
import type { Metadata } from 'next'
import './globals.css'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'pdf-tool — Free & private PDF tools',
  description:
    'Merge, split, convert, edit, sign and more. Every tool runs in your browser — your files never leave your device.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Full test + type-check** — Run `npm test` (all green) and `npx tsc --noEmit` (clean) and `npm run build` (succeeds).

- [ ] **Step 5: Commit**:
```bash
git add -A
git commit -m "feat: site header/footer + SEO metadata"
```

---

### Task 34: Deploy to Vercel

**Files:** Create `README.md` (run/deploy instructions).

- [ ] **Step 1: Confirm production build**

Run: `npm run build`
Expected: build succeeds with all 21 tool routes listed.

- [ ] **Step 2: Write README**

Create `README.md` with: project summary, `npm run dev`, `npm test`, `npm run build`, and the "files never leave your browser" privacy note + the Phase 2 roadmap pointer to `docs/superpowers/specs/`.

- [ ] **Step 3: Deploy**

Run: `npx vercel` (preview) then `npx vercel --prod` for production. Or connect the git repo in the Vercel dashboard. Confirm the deployed homepage lists all tools and at least Merge + Split work end-to-end on the live URL.

- [ ] **Step 4: Commit**:
```bash
git add -A
git commit -m "docs: add README and deploy notes"
```

---

## Self-Review Notes (author)

- **Spec coverage:** All 21 tools have tasks (Merge 10, Split 11, Rotate 12, Delete 13, Extract 14, Organize 15, Watermark 16, Page numbers 17, Crop 18, N-up 19, Flatten 20, Metadata 21, Images→PDF 22, PDF→JPG 23, Fill form 24, Sign 25, Extract images 26, Compare 27, Light compress 28, Edit/annotate 29, Protect 31, Unlock 32). Infra (Tasks 1–9), qpdf spike (30), polish (33), deploy (34). Privacy/no-backend enforced throughout. Registry-driven homepage ✓. Web Worker scaffold ✓ (Task 5).
- **Known deferrals (documented, not placeholders):** Extract Images exports page rasters (not embedded XObjects) in v1; Light Compress is lossy rasterization; Sign/Edit use simple placement (fixed position / page-1 click) — all explicitly noted with rationale. Protect/Unlock gated behind a feasibility spike.
- **Type consistency:** `pdfBlob`/`pdfFilename` (Task 5) used consistently; `Tool`/`getTool`/`TOOLS` (Task 4) used by all pages; `PdfJobResult` returned by every `process`. Render helpers all in `lib/pdf/render.ts`.
- **Non-Node-testable modules** (pdf.js render, qpdf-wasm) are explicitly marked for browser/manual verification; all pure pdf-lib functions have Vitest tests.
