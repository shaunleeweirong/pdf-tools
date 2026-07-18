// Browser-only pdf.js accessor. Do NOT import from Node tests.
// pdfjs-dist references DOMMatrix and other browser globals at module evaluation
// time. Using a lazy dynamic import here prevents it from being evaluated during
// Next.js SSR prerender (which runs in Node, where DOMMatrix is not defined).

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pdfjsPromise: Promise<any> | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPdfjs(): Promise<any> {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const lib = await import('pdfjs-dist')
      if (!lib.GlobalWorkerOptions.workerSrc) {
        lib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url,
        ).toString()
      }
      return lib
    })()
  }
  return pdfjsPromise
}
