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
]

export const TOOL_SLUGS = TOOLS.map((t) => t.slug)

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug)
}
