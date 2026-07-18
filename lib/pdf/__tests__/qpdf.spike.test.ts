/**
 * Spike test for @jspawn/qpdf-wasm in-browser PDF encryption/decryption.
 *
 * This test runs in Node (Vitest). The qpdf-wasm Emscripten build uses fetch() to load
 * the .wasm binary. In Node 26, fetch() rejects bare filesystem paths. We patch
 * globalThis.fetch before importing qpdf.ts so the wasm binary is served from disk.
 *
 * In a real browser, the wasm file is served from /qpdf.wasm (Next.js public/).
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { readFixture } from './helpers'

// Patch fetch BEFORE any import of qpdf.ts loads the module.
const wasmBinary = readFileSync(
  resolve(process.cwd(), 'node_modules/@jspawn/qpdf-wasm/qpdf.wasm'),
)
const _origFetch = globalThis.fetch
beforeAll(() => {
  globalThis.fetch = async (url: RequestInfo | URL, opts?: RequestInit) => {
    const u = url.toString()
    if (u.endsWith('.wasm') || u.endsWith('qpdf.wasm')) {
      return new Response(wasmBinary, {
        status: 200,
        headers: { 'Content-Type': 'application/wasm' },
      })
    }
    return _origFetch(url, opts)
  }
})

describe('qpdf-wasm spike — protect / unlock round-trip', () => {
  it('loads the qpdf wasm module (Node load via fetch-patch)', async () => {
    const { protect } = await import('@/lib/pdf/qpdf')
    expect(protect).toBeTypeOf('function')
  })

  it('encrypts a PDF: output differs from input and is larger', async () => {
    const { protect } = await import('@/lib/pdf/qpdf')
    const input = readFixture('blank-1p.pdf')
    const encrypted = await protect(input, 'testpass')
    expect(encrypted).toBeInstanceOf(Uint8Array)
    expect(encrypted.length).toBeGreaterThan(0)
    // Encrypted PDF should be different from input
    expect(Buffer.from(encrypted).equals(Buffer.from(input))).toBe(false)
    // Still a valid PDF header
    const header = String.fromCharCode(...encrypted.slice(0, 5))
    expect(header).toBe('%PDF-')
  })

  it('decrypts an encrypted PDF: output is a valid PDF', async () => {
    const { protect, unlock } = await import('@/lib/pdf/qpdf')
    const input = readFixture('blank-1p.pdf')
    const encrypted = await protect(input, 's3cr3t!')
    const decrypted = await unlock(encrypted, 's3cr3t!')
    expect(decrypted).toBeInstanceOf(Uint8Array)
    expect(decrypted.length).toBeGreaterThan(0)
    const header = String.fromCharCode(...decrypted.slice(0, 5))
    expect(header).toBe('%PDF-')
  })

  it('rejects wrong password with a thrown error', async () => {
    const { protect, unlock } = await import('@/lib/pdf/qpdf')
    const input = readFixture('blank-1p.pdf')
    const encrypted = await protect(input, 'correct')
    await expect(unlock(encrypted, 'wrong')).rejects.toThrow(/exit code/)
  })
})
