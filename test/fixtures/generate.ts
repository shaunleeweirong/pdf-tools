import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = __dirname

async function main() {
  // blank-1p.pdf
  const blank = await PDFDocument.create()
  blank.addPage([300, 400])
  writeFileSync(join(DIR, 'blank-1p.pdf'), await blank.save())

  // multi-5p.pdf with labeled pages
  const multi = await PDFDocument.create()
  const font = await multi.embedFont(StandardFonts.Helvetica)
  for (let i = 1; i <= 5; i++) {
    const page = multi.addPage([300, 400])
    page.drawText(`Page ${i}`, { x: 50, y: 350, size: 24, font, color: rgb(0, 0, 0) })
  }
  writeFileSync(join(DIR, 'multi-5p.pdf'), await multi.save())

  // form.pdf with a text field
  const formDoc = await PDFDocument.create()
  const fPage = formDoc.addPage([300, 400])
  const form = formDoc.getForm()
  const tf = form.createTextField('fullName')
  tf.addToPage(fPage, { x: 50, y: 300, width: 200, height: 24 })
  writeFileSync(join(DIR, 'form.pdf'), await formDoc.save())

  // red-100x100.png (raw PNG via a tiny generator)
  const png = await PDFDocument.create() // reuse pdf-lib? no — write a PNG manually below
  void png
  writeFileSync(join(DIR, 'red-100x100.png'), Buffer.from(RED_PNG_BASE64, 'base64'))

  console.log('fixtures written to', DIR)
}

// 100x100 solid red PNG, base64 (generated once, static).
const RED_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAt0lEQVR4nO3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwYwAAWn5xEwAAAABJRU5ErkJggg=='

main()
