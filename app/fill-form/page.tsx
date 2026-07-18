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
