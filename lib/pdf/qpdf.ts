/**
 * qpdf-wasm loader: encrypt and decrypt PDFs entirely in-browser (client-side only).
 *
 * Uses @jspawn/qpdf-wasm v0.0.2 — a qpdf CLI compiled to WebAssembly via Emscripten.
 * The wasm binary must be served from /qpdf.wasm (copy public/qpdf.wasm in build).
 *
 * Browser loading: the module fetches /qpdf.wasm via URL (served from Next.js public/).
 * Node/test loading: patch globalThis.fetch to return the wasm binary from disk
 *   (see lib/pdf/__tests__/qpdf.spike.test.ts for the test helper).
 *
 * API surface used: mod.FS.writeFile / mod.callMain / mod.FS.readFile
 * Encrypt args: --encrypt <user-pw> <owner-pw> 256 -- in.pdf out.pdf
 * Decrypt args: --password=<pw> --decrypt in.pdf out.pdf
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let modPromise: Promise<any> | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function load(): Promise<any> {
  if (!modPromise) {
    modPromise = (async () => {
      // Dynamic import with turbopackIgnore to prevent Turbopack from statically
      // bundling @jspawn/qpdf-wasm. The package conditionally imports Node builtins
      // (fs, path, module) at module eval time, which fail in a browser build.
      // At runtime this executes only in the browser (inside an event handler),
      // where the wasm loader uses the XHR path instead. webpackIgnore is also set
      // for compatibility if the webpack bundler is used.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const factory = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ '@jspawn/qpdf-wasm' as any)).default
      const mod = await factory({
        // In the browser: serve qpdf.wasm from /qpdf.wasm (Next.js public/).
        // In Node/tests: the caller must patch globalThis.fetch to supply the wasm binary.
        locateFile: (file: string) =>
          typeof window !== 'undefined' ? `/${file}` : file,
      })
      await mod.ready
      return mod
    })()
  }
  return modPromise
}

/**
 * Encrypt a PDF with a 256-bit AES password (user + owner password set to the same value).
 * Returns the encrypted PDF bytes.
 *
 * Client-side only — do NOT call from Server Components or Node API routes.
 */
export async function protect(input: Uint8Array, password: string): Promise<Uint8Array> {
  const mod = await load()
  mod.FS.writeFile('in.pdf', input)
  try {
    const exit = mod.callMain(['--encrypt', password, password, '256', '--', 'in.pdf', 'out.pdf'])
    if (exit !== 0) throw new Error(`qpdf encrypt failed with exit code ${exit}`)
    const out = mod.FS.readFile('out.pdf') as Uint8Array
    return out
  } finally {
    try { mod.FS.unlink('in.pdf') } catch { /* ignore */ }
    try { mod.FS.unlink('out.pdf') } catch { /* ignore */ }
  }
}

/**
 * Remove a known user/owner password from a PDF and return the decrypted bytes.
 *
 * Client-side only — do NOT call from Server Components or Node API routes.
 */
export async function unlock(input: Uint8Array, password: string): Promise<Uint8Array> {
  const mod = await load()
  mod.FS.writeFile('in.pdf', input)
  try {
    const exit = mod.callMain([`--password=${password}`, '--decrypt', 'in.pdf', 'out.pdf'])
    if (exit !== 0) throw new Error(`qpdf decrypt failed (wrong password?) exit code ${exit}`)
    const out = mod.FS.readFile('out.pdf') as Uint8Array
    return out
  } finally {
    try { mod.FS.unlink('in.pdf') } catch { /* ignore */ }
    try { mod.FS.unlink('out.pdf') } catch { /* ignore */ }
  }
}
