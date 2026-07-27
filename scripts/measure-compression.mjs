/**
 * Measures the compress tool by driving the real site in a real browser.
 *
 * Compression rasterizes each page through a <canvas>, so it cannot run in
 * Node. This script loads http://localhost:3000/compress-pdf, uploads a corpus
 * file, picks a level, and records the exact size of the PDF blob the tool
 * produces, by wrapping the Blob constructor before the run.
 *
 * Requires a dev server on :3000 and playwright available on NODE_PATH.
 * Usage: node scripts/measure-compression.mjs <corpusDir>
 */
import fs from 'node:fs/promises'
import path from 'node:path'

// Playwright is not a project dependency (it is only needed for measurement).
// Point PLAYWRIGHT_MODULE at an external install if it is not resolvable here.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright')

const corpusDir = process.argv[2]
if (!corpusDir) {
  console.error('usage: node scripts/measure-compression.mjs <corpusDir>')
  process.exit(1)
}

// Override with a JSON array of {file, level} to measure other combinations,
// for example a second pass over an output this script already saved.
const RUNS = process.env.RUNS
  ? JSON.parse(process.env.RUNS)
  : [
      { file: 'photo-deck.pdf', level: 'high' },
      { file: 'photo-deck.pdf', level: 'medium' },
      { file: 'photo-deck.pdf', level: 'low' },
      { file: 'text-report.pdf', level: 'medium' },
      { file: 'mixed-document.pdf', level: 'medium' },
    ]

// PLAYWRIGHT_CHROMIUM lets an already-downloaded browser build be reused when
// the resolved playwright package expects a different revision.
const launchOpts = process.env.PLAYWRIGHT_CHROMIUM
  ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM }
  : {}
const browser = await chromium.launch(launchOpts)
const chromiumVersion = browser.version()
const results = []

for (const run of RUNS) {
  const page = await browser.newPage()
  await page.goto('http://localhost:3000/compress-pdf', { waitUntil: 'load' })
  // react-dropzone only sees the file once React has hydrated and attached its
  // change handler. Setting files before that silently does nothing.
  await page.getByRole('button', { name: 'Choose File' }).waitFor({ state: 'attached' })
  await page.waitForFunction(() => {
    const el = document.querySelector('input[type=file]')
    return el && Object.keys(el).some((k) => k.startsWith('__react'))
  })

  // Capture every application/pdf Blob the tool creates, with a timestamp.
  await page.addInitScript(() => {})
  await page.evaluate(() => {
    const OrigBlob = window.Blob
    window.__pdfBlobs = []
    function PatchedBlob(parts, opts) {
      const b = new OrigBlob(parts, opts)
      if (opts && opts.type === 'application/pdf') {
        window.__pdfBlobs.push({ size: b.size, at: performance.now() })
        window.__lastPdfBlob = b
      }
      return b
    }
    PatchedBlob.prototype = OrigBlob.prototype
    window.Blob = PatchedBlob
  })

  const inputPath = path.join(corpusDir, run.file)
  await page.setInputFiles('input[type=file]', inputPath)

  if (run.level !== 'medium') {
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: new RegExp(run.level, 'i') }).click()
  }

  const t0 = await page.evaluate(() => performance.now())
  await page.getByRole('button', { name: /^Compress PDF$/ }).click()
  await page.waitForFunction(() => window.__pdfBlobs.length > 0, null, { timeout: 120000 })

  const blobs = await page.evaluate(() => window.__pdfBlobs)
  const inputSize = (await fs.stat(inputPath)).size
  const outputSize = blobs[0].size

  // Save the output so it can be fed back in for a second-pass measurement.
  const outBytes = await page.evaluate(async () => {
    const b = window.__lastPdfBlob
    if (!b) return null
    return Array.from(new Uint8Array(await b.arrayBuffer()))
  })
  if (outBytes) {
    const outName = `${path.basename(run.file, '.pdf')}-${run.level}-pass.pdf`
    await fs.writeFile(path.join(corpusDir, outName), Buffer.from(outBytes))
  }

  results.push({
    file: run.file,
    level: run.level,
    inputKB: +(inputSize / 1024).toFixed(1),
    outputKB: +(outputSize / 1024).toFixed(1),
    changePct: +(((outputSize - inputSize) / inputSize) * 100).toFixed(1),
    ms: Math.round(blobs[0].at - t0),
  })

  await page.close()
}

await browser.close()

console.table(results)
console.log('\nJSON:\n' + JSON.stringify(results, null, 2))
console.log(`\nchromium ${chromiumVersion} · ${process.platform} ${process.arch} · ${new Date().toISOString()}`)
