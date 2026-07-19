import {
  Combine,
  Scissors,
  RotateCw,
  FileMinus2,
  FileOutput,
  LayoutGrid,
  Image as ImageIcon,
  Images,
  Stamp,
  Hash,
  Crop,
  Grid2x2,
  Layers,
  Tags,
  SquarePen,
  FormInput,
  Signature,
  ImageDown,
  GitCompare,
  Minimize2,
  Lock,
  LockOpen,
  FileText,
  type LucideIcon,
} from 'lucide-react'
import type { ToolCategory } from '@/lib/tools'

// One recognizable line icon per tool.
const ICONS: Record<string, LucideIcon> = {
  'merge-pdf': Combine,
  'split-pdf': Scissors,
  'rotate-pdf': RotateCw,
  'delete-pages': FileMinus2,
  'extract-pages': FileOutput,
  'organize-pdf': LayoutGrid,
  'jpg-to-pdf': ImageIcon,
  'pdf-to-jpg': Images,
  'watermark-pdf': Stamp,
  'add-page-numbers': Hash,
  'crop-pdf': Crop,
  'n-up-pdf': Grid2x2,
  'flatten-pdf': Layers,
  'edit-metadata': Tags,
  'edit-pdf': SquarePen,
  'fill-form': FormInput,
  'sign-pdf': Signature,
  'extract-images': ImageDown,
  'compare-pdf': GitCompare,
  'compress-pdf': Minimize2,
  'protect-pdf': Lock,
  'unlock-pdf': LockOpen,
}

// Color-coded by category, so the tint also signals the group.
const CATEGORY_COLOR: Record<ToolCategory, string> = {
  Organize: '#4d84ff',
  Convert: '#22c55e',
  'Page tools': '#f59e0b',
  'Forms & sign': '#a855f7',
  Edit: '#2dd4bf',
  Security: '#fb7185',
}

export function ToolIcon({ slug, category }: { slug: string; category: ToolCategory }) {
  const Icon = ICONS[slug] ?? FileText
  const color = CATEGORY_COLOR[category]
  return (
    <span
      aria-hidden
      className="flex size-9 shrink-0 items-center justify-center rounded-lg"
      style={{ color, backgroundColor: `${color}1f`, boxShadow: `inset 0 0 0 1px ${color}33` }}
    >
      <Icon className="size-[18px]" strokeWidth={2} />
    </span>
  )
}
