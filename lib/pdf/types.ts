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
export function pdfBlob(bytes: Uint8Array<ArrayBuffer>): Blob {
  return new Blob([bytes], { type: 'application/pdf' })
}
