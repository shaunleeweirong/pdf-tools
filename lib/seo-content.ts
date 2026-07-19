export interface FaqItem {
  q: string
  a: string
}

export interface ToolSeoOverride {
  title?: string
  description?: string
  faq?: FaqItem[]
}

// Bespoke, outcome-framed copy for the highest-value tools.
// Tools without an entry fall back to registry-derived copy (see lib/seo.ts).
// Adding more entries is ongoing content work (Weeks 3+).
export const SEO_CONTENT: Record<string, ToolSeoOverride> = {
  'merge-pdf': {
    title: 'Merge PDF free — combine PDF files in your browser',
    description:
      'Combine several PDFs into one file in seconds. Free, no sign-up and no watermark — merged right in your browser.',
    faq: [
      { q: 'Is merging PDFs free?', a: 'Yes — no sign-up, no watermark and no daily limit.' },
      { q: 'Are my files uploaded?', a: 'No. Merge PDF runs in your browser, so your files stay on your device.' },
    ],
  },
  'split-pdf': {
    title: 'Split PDF free — extract pages into separate files',
    description:
      'Split a PDF into separate files or page ranges in seconds. Free, no sign-up, done right in your browser.',
    faq: [
      { q: 'Can I pick specific pages?', a: 'Yes — choose the page ranges you want and download them as new PDFs.' },
    ],
  },
  'compress-pdf': {
    title: 'Compress PDF free — shrink a PDF to email it',
    description:
      'Reduce PDF file size so it will finally attach to an email. Free, no sign-up, compressed in your browser.',
    faq: [
      { q: 'How small can it get?', a: 'This light in-browser compressor works best on image-heavy PDFs; results vary by file.' },
    ],
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG free — convert PDF pages to images',
    description:
      'Turn every page of a PDF into a JPG image in seconds. Free, no sign-up, converted in your browser.',
    faq: [],
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF free — turn images into a PDF',
    description:
      'Combine JPG and PNG images into a single PDF, one image per page. Free, no sign-up, made in your browser.',
    faq: [],
  },
  'rotate-pdf': {
    title: 'Rotate PDF free — fix sideways pages online',
    description:
      'Rotate PDF pages 90°, 180° or 270° and save. Free, no sign-up, rotated right in your browser.',
    faq: [],
  },
  'protect-pdf': {
    title: 'Password protect a PDF free — encrypt in your browser',
    description:
      'Add a password and encrypt a PDF in seconds. Free, no sign-up — the file is encrypted in your browser.',
    faq: [],
  },
  'edit-pdf': {
    title: 'Edit PDF free — change text and add notes online',
    description:
      'Edit existing text, or add text and boxes to any page. Free, no sign-up, edited right in your browser.',
    faq: [],
  },
}
