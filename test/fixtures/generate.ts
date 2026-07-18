import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { deflateSync } from 'node:zlib'

const DIR = __dirname

/** CRC-32 table for PNG chunk checksums */
const CRC_TABLE: number[] = (() => {
  const table: number[] = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c
  }
  return table
})()

function crc32(buf: Uint8Array): number {
  let crc = 0xffffffff
  for (const byte of buf) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function pngChunk(type: string, data: Uint8Array): Buffer {
  const typeBytes = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const crcInput = Buffer.concat([typeBytes, data])
  const crcVal = Buffer.alloc(4)
  crcVal.writeUInt32BE(crc32(new Uint8Array(crcInput)), 0)
  return Buffer.concat([len, typeBytes, data, crcVal])
}

/**
 * Generate a valid PNG buffer containing a solid-color image.
 * Uses raw (filter type 0) scanlines, deflate-compressed IDAT.
 */
function makeRedPng(width: number, height: number): Buffer {
  // IHDR: width, height, bit depth 8, color type 2 (RGB), compression 0, filter 0, interlace 0
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 2  // color type: RGB
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  // Build raw scanlines: each row = filter byte (0) + RGB pixels
  const rowSize = 1 + width * 3
  const raw = Buffer.alloc(height * rowSize)
  for (let y = 0; y < height; y++) {
    const offset = y * rowSize
    raw[offset] = 0 // filter type: None
    for (let x = 0; x < width; x++) {
      raw[offset + 1 + x * 3 + 0] = 255 // R
      raw[offset + 1 + x * 3 + 1] = 0   // G
      raw[offset + 1 + x * 3 + 2] = 0   // B
    }
  }

  const idat = deflateSync(raw)

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    signature,
    pngChunk('IHDR', new Uint8Array(ihdr)),
    pngChunk('IDAT', new Uint8Array(idat)),
    pngChunk('IEND', new Uint8Array(0)),
  ])
}

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

  // red-100x100.png — programmatically generated valid solid-red PNG
  writeFileSync(join(DIR, 'red-100x100.png'), makeRedPng(100, 100))

  console.log('fixtures written to', DIR)
}

main()
