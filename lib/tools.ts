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
]

export const TOOL_SLUGS = TOOLS.map((t) => t.slug)

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug)
}
