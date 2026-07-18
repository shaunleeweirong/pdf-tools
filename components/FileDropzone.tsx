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
