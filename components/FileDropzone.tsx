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
      className={`flex h-56 cursor-pointer items-center justify-center rounded-xl p-8 text-center transition-colors ${
        isDragActive
          ? 'border-2 border-brand bg-brand/10 text-foreground'
          : 'soft-inset'
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-muted-foreground">
        {isDragActive ? 'Drop the files here…' : 'Drag & drop files here, or click to choose'}
      </p>
    </div>
  )
}
