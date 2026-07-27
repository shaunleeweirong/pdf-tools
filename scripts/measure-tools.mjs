/**
 * Measures pdf-tool's real behaviour by importing the same modules the site
 * ships and running the corpus through them.
 *
 * Covers merge (pdf-lib) and protect/unlock (qpdf-wasm). Compression is not
 * covered here: it rasterizes pages through a <canvas>, so it only runs in a
 * real browser. Those numbers come from driving the site itself.
 *
 * Usage: node --experimental-strip-types scripts/measure-tools.mjs <corpusDir>
 */
import fs from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const corpusDir = process.argv[2]
if (!corpusDir) {
  console.error('usage: node --experimental-strip-types scripts/measure-tools.mjs <corpusDir>')
  process.exit(1)
}

// qpdf-wasm fetches its .wasm binary. Node's fetch rejects bare filesystem
// paths, so serve it from disk exactly as lib/pdf/__tests__/qpdf.spike.test.ts does.
const wasmBinary = readFileSync(path.resolve('node_modules/@jspawn/qpdf-wasm/qpdf.wasm'))
const origFetch = globalThis.fetch
globalThis.fetch = async (url, opts) => {
  const u = url.toString()
  if (u.endsWith('.wasm')) {
    return new Response(wasmBinary, { status: 200, headers: { 'Content-Type': 'application/wasm' } })
  }
  return origFetch(url, opts)
}

const { merge } = await import('../lib/pdf/merge.ts')
const { protect, unlock } = await import('../lib/pdf/qpdf.ts')

const kb = (n) => `${(n / 1024).toFixed(1)} KB`
const read = (name) => fs.readFile(path.join(corpusDir, name))

const results = []
function record(operation, input, inputBytes, outputBytes, ms, note = '') {
  results.push({
    operation,
    input,
    inputKB: +(inputBytes / 1024).toFixed(1),
    outputKB: +(outputBytes / 1024).toFixed(1),
    deltaPct: +(((outputBytes - inputBytes) / inputBytes) * 100).toFixed(1),
    ms: Math.round(ms),
    note,
  })
}

const text = new Uint8Array(await read('text-report.pdf'))
const photos = new Uint8Array(await read('photo-deck.pdf'))
const mixed = new Uint8Array(await read('mixed-document.pdf'))

// --- merge -----------------------------------------------------------------
{
  const inputs = [text, mixed]
  const sum = inputs.reduce((n, b) => n + b.length, 0)
  const t0 = performance.now()
  const out = await merge(inputs)
  record('merge (text + mixed)', '2 files', sum, out.length, performance.now() - t0)
}
{
  const inputs = [text, photos, mixed]
  const sum = inputs.reduce((n, b) => n + b.length, 0)
  const t0 = performance.now()
  const out = await merge(inputs)
  record('merge (all three)', '3 files', sum, out.length, performance.now() - t0)
}

// --- protect / unlock round trip -------------------------------------------
for (const [name, bytes] of [
  ['text-report.pdf', text],
  ['photo-deck.pdf', photos],
]) {
  const t0 = performance.now()
  const encrypted = await protect(bytes, 'correct horse battery staple')
  const tEnc = performance.now() - t0

  const t1 = performance.now()
  const decrypted = await unlock(encrypted, 'correct horse battery staple')
  const tDec = performance.now() - t1

  record('protect (AES-256)', name, bytes.length, encrypted.length, tEnc)
  record('unlock', name, encrypted.length, decrypted.length, tDec)

  let wrongPasswordRejected = false
  try {
    await unlock(encrypted, 'wrong password')
  } catch {
    wrongPasswordRejected = true
  }
  results.at(-1).note = wrongPasswordRejected
    ? 'wrong password rejected'
    : 'WARNING: wrong password accepted'
}

console.table(results)
console.log('\nJSON:\n' + JSON.stringify(results, null, 2))
console.log(
  `\nnode ${process.version} · ${process.platform} ${process.arch} · ${new Date().toISOString()}`,
)
void kb
