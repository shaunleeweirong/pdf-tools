import { PDFDocument } from 'pdf-lib'

export interface PdfMeta {
  title: string
  author: string
  subject: string
  keywords: string
}

export async function readMetadata(buffer: Uint8Array): Promise<PdfMeta> {
  const doc = await PDFDocument.load(buffer)
  return {
    title: doc.getTitle() ?? '',
    author: doc.getAuthor() ?? '',
    subject: doc.getSubject() ?? '',
    keywords: doc.getKeywords() ?? '',
  }
}

export async function writeMetadata(buffer: Uint8Array, meta: PdfMeta): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer)
  doc.setTitle(meta.title)
  doc.setAuthor(meta.author)
  doc.setSubject(meta.subject)
  doc.setKeywords(meta.keywords.split(',').map((k) => k.trim()).filter(Boolean))
  return doc.save()
}
