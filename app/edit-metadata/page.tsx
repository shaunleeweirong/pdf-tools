'use client'
import { ToolLayout } from '@/components/ToolLayout'
import { getTool } from '@/lib/tools'
import { writeMetadata, type PdfMeta } from '@/lib/pdf/metadata'
import { pdfBlob, pdfFilename } from '@/lib/pdf/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tool = getTool('edit-metadata')!
const EMPTY: PdfMeta = { title: '', author: '', subject: '', keywords: '' }

export default function EditMetadataPage() {
  return (
    <ToolLayout
      tool={tool}
      defaultOpts={EMPTY}
      renderOptions={(opts, setOpts) => (
        <div className="grid gap-3">
          {(['title', 'author', 'subject', 'keywords'] as const).map((k) => (
            <div key={k} className="space-y-1">
              <Label className="capitalize">{k}</Label>
              <Input value={opts[k]} onChange={(e) => setOpts({ ...opts, [k]: e.target.value })} />
            </div>
          ))}
        </div>
      )}
      process={async (files, opts) => {
        const buf = new Uint8Array(await files[0].arrayBuffer())
        const bytes = await writeMetadata(buf, opts)
        return { blob: pdfBlob(bytes), filename: pdfFilename(files[0].name, 'metadata') }
      }}
    />
  )
}
