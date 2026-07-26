/**
 * Generates the sample PDF corpus used to measure pdf-tool's real behaviour.
 *
 * The numbers quoted in blog posts come from running these files through the
 * actual tools in a real browser. Regenerating the corpus and re-running the
 * measurement should reproduce them, which is the point: the claims are
 * checkable rather than illustrative.
 *
 * Usage: node scripts/generate-test-corpus.mjs <outDir> <photoDir>
 *
 * <photoDir> must hold at least six distinct .jpg files. See
 * docs/marketing/tool-measurements.md for how the reference set was produced.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const [outDir, photoDir] = process.argv.slice(2)
if (!outDir || !photoDir) {
  console.error('usage: node scripts/generate-test-corpus.mjs <outDir> <photoDir>')
  process.exit(1)
}

const PARAGRAPHS = [
  'This quarter the team shipped the document pipeline rework that had been on the roadmap since the start of the year. Throughput on the ingest path improved once the batching layer stopped waiting on individual acknowledgements.',
  'Support volume fell for the third month running. The largest single driver was the change to the upload error copy, which cut repeat tickets on the same session by a wide margin.',
  'Headcount was flat. Two contractors rolled off at the end of the period and their work was absorbed by the platform group without a change to the delivery schedule.',
  'Infrastructure spend rose slightly against plan. The increase is attributable to retention on the archive tier, which we extended after the compliance review asked for a longer window.',
  'Looking ahead, the priority is the migration off the legacy renderer. The work is scoped and the sequencing is agreed, but it depends on the storage change landing first.',
]

function wrap(text, font, size, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    const next = line ? `${line} ${w}` : w
    if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

/** A 20-page text-only report: body copy, headings, page numbers. No images. */
async function textReport() {
  const doc = await PDFDocument.create()
  const body = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const [W, H] = [595.28, 841.89] // A4 points
  const margin = 64
  const maxWidth = W - margin * 2

  for (let p = 1; p <= 20; p++) {
    const page = doc.addPage([W, H])
    let y = H - margin

    page.drawText(`Section ${p}: Operations Review`, { x: margin, y, size: 18, font: bold })
    y -= 34

    for (let i = 0; i < 5; i++) {
      const para = PARAGRAPHS[(p + i) % PARAGRAPHS.length]
      for (const line of wrap(para, body, 11, maxWidth)) {
        if (y < margin + 40) break
        page.drawText(line, { x: margin, y, size: 11, font: body })
        y -= 16
      }
      y -= 12
    }

    page.drawText(String(p), { x: W / 2, y: margin - 20, size: 9, font: body, color: rgb(0.4, 0.4, 0.4) })
  }
  return doc.save()
}

/**
 * A deck where every page is a full-bleed photograph.
 *
 * Each page uses a *distinct* JPEG. Embedding the same image repeatedly would
 * be deduplicated by pdf-lib into a single stream, which produces a file far
 * smaller than a real photo deck and would make any compression ratio measured
 * against it meaningless.
 */
async function photoDeck(photoFiles) {
  const doc = await PDFDocument.create()
  for (const bytes of photoFiles) {
    const jpg = await doc.embedJpg(bytes)
    const page = doc.addPage([720, 720])
    page.drawImage(jpg, { x: 0, y: 0, width: 720, height: 720 })
  }
  return doc.save()
}

/** A 3-page mixed document: text plus a small raster logo on each page. */
async function mixedDocument(photoBytes) {
  const doc = await PDFDocument.create()
  const body = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const jpg = await doc.embedJpg(photoBytes)
  const [W, H] = [595.28, 841.89]
  const margin = 64

  for (let p = 1; p <= 3; p++) {
    const page = doc.addPage([W, H])
    page.drawImage(jpg, { x: margin, y: H - margin - 48, width: 48, height: 48 })
    let y = H - margin - 80
    page.drawText(`Invoice ${1000 + p}`, { x: margin, y, size: 16, font: bold })
    y -= 28
    for (let i = 0; i < 4; i++) {
      const para = PARAGRAPHS[(p + i) % PARAGRAPHS.length]
      for (const line of wrap(para, body, 11, W - margin * 2)) {
        if (y < margin) break
        page.drawText(line, { x: margin, y, size: 11, font: body })
        y -= 16
      }
      y -= 12
    }
  }
  return doc.save()
}

const photoNames = (await fs.readdir(photoDir)).filter((f) => /\.jpe?g$/i.test(f)).sort()
if (photoNames.length < 6) {
  console.error(`${photoDir} holds ${photoNames.length} jpg files, need at least 6 distinct ones`)
  process.exit(1)
}
const photos = await Promise.all(photoNames.map((n) => fs.readFile(path.join(photoDir, n))))

await fs.mkdir(outDir, { recursive: true })
const files = {
  'text-report.pdf': await textReport(),
  'photo-deck.pdf': await photoDeck(photos.slice(0, 6)),
  'mixed-document.pdf': await mixedDocument(photos[0]),
}

for (const [name, bytes] of Object.entries(files)) {
  const target = path.join(outDir, name)
  await fs.writeFile(target, bytes)
  console.log(`${name.padEnd(22)} ${(bytes.length / 1024).toFixed(1)} KB`)
}
