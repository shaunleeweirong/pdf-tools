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
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    category: 'Organize',
    description: 'Extract page ranges from a PDF into separate files.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'Organize',
    description: 'Rotate all pages of a PDF by 90°, 180° or 270°.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'delete-pages',
    name: 'Delete Pages',
    category: 'Organize',
    description: 'Remove one or more pages from a PDF.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'extract-pages',
    name: 'Extract Pages',
    category: 'Organize',
    description: 'Pick specific pages and save them as a new PDF.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'organize-pdf',
    name: 'Organize PDF',
    category: 'Organize',
    description: 'Reorder or remove pages visually, then save.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'watermark-pdf',
    name: 'Watermark PDF',
    category: 'Page tools',
    description: 'Stamp text across every page of a PDF.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'add-page-numbers',
    name: 'Add Page Numbers',
    category: 'Page tools',
    description: 'Insert page numbers into a PDF.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'crop-pdf',
    name: 'Crop PDF',
    category: 'Page tools',
    description: 'Trim margins off every page of a PDF.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'n-up-pdf',
    name: 'Pages Per Sheet',
    category: 'Page tools',
    description: 'Place 2 or 4 pages onto each sheet (N-up).',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'flatten-pdf',
    name: 'Flatten PDF',
    category: 'Page tools',
    description: 'Make form fields and annotations non-editable.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'edit-metadata',
    name: 'Edit Metadata',
    category: 'Edit',
    description: 'View and change a PDF’s title, author, subject and keywords.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'jpg-to-pdf',
    name: 'Images to PDF',
    category: 'Convert',
    description: 'Turn JPG and PNG images into a PDF, one image per page.',
    accept: ['image/jpeg', 'image/png'],
    multiple: true,
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'Convert',
    description: 'Convert each page of a PDF into a JPG image.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'fill-form',
    name: 'Fill PDF Form',
    category: 'Forms & sign',
    description: 'Detect form fields and fill them in.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'sign-pdf',
    name: 'Sign PDF',
    category: 'Forms & sign',
    description: 'Draw a signature and place it on the first page.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'extract-images',
    name: 'Extract Images',
    category: 'Edit',
    description: 'Export each page of a PDF as a high-resolution image.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'compare-pdf',
    name: 'Compare PDF',
    category: 'Edit',
    description: 'Highlight visual differences between the first pages of two PDFs.',
    accept: ['application/pdf'],
    multiple: true,
  },
  {
    slug: 'edit-pdf',
    name: 'Edit PDF',
    category: 'Edit',
    description: 'Edit existing text, or add text and boxes, on any page — in your browser.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    category: 'Organize',
    description: 'Reduce file size (light, in-browser). Best for image-heavy PDFs.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'protect-pdf',
    name: 'Protect PDF',
    category: 'Security',
    description: 'Add a password and encrypt a PDF — in your browser.',
    accept: ['application/pdf'],
    multiple: false,
  },
  {
    slug: 'unlock-pdf',
    name: 'Unlock PDF',
    category: 'Security',
    description: 'Remove a known password from a PDF — in your browser.',
    accept: ['application/pdf'],
    multiple: false,
  },
]

export const TOOL_SLUGS = TOOLS.map((t) => t.slug)

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug)
}
