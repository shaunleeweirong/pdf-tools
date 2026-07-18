/**
 * qpdf-wasm loader: encrypt and decrypt PDFs entirely in-browser (client-side only).
 *
 * Uses @jspawn/qpdf-wasm v0.0.2 — a qpdf CLI compiled to WebAssembly via Emscripten.
 *
 * Why the glue is loaded from /qpdf/ at runtime (not bundled):
 *   qpdf.mjs / qpdf.js rely on UMD-style global side effects — qpdf.js writes the
 *   factory to `globalThis.exports.Module` (set up by browser.js), and qpdf.mjs reads
 *   it back. A bundler (Turbopack/webpack) rewrites the module's bare `exports`/`module`
 *   bindings to its own module scope, so the browser UMD branch never runs and the
 *   factory ends up undefined ("createModule is not defined"). It also statically
 *   parses the process-guarded `import("path")`/`import("module")` and fails the client
 *   build on Node built-ins. Both problems disappear when the glue runs as real
 *   top-level browser scripts. So we ship qpdf.mjs/qpdf.js/browser.js from public/qpdf/
 *   and import the ESM entry at runtime via a non-literal specifier the bundler does
 *   not parse. See scripts/copy-qpdf.mjs for how these files are kept in sync.
 *
 * Browser loading: dynamic-import /qpdf/qpdf.mjs; the factory fetches /qpdf.wasm.
 * Node/test loading: import the package's ESM entry directly (Node takes the
 *   process-guarded path); patch globalThis.fetch to supply the wasm binary from disk
 *   (see lib/pdf/__tests__/qpdf.spike.test.ts for the test helper).
 *
 * API surface used: mod.FS.writeFile / mod.callMain / mod.FS.readFile
 * Encrypt args: --encrypt <user-pw> <owner-pw> 256 -- in.pdf out.pdf
 * Decrypt args: --password=<pw> --decrypt in.pdf out.pdf
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let modPromise: Promise<any> | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadFactory(): Promise<QpdfFactory> {
  if (typeof window !== 'undefined') {
    // Browser: load the glue served from public/qpdf/ as real top-level scripts.
    // The specifier is built at runtime so Turbopack/webpack never parses it and
    // never tries to bundle the package's Node-built-in imports.
    const url = new URL('/qpdf/qpdf.mjs', window.location.origin).href
    const mod = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url)) as {
      default: QpdfFactory
    }
    return mod.default
  }
  // Node / Vitest: resolve the package's real ESM entry (takes the process branch).
  return (await import('@jspawn/qpdf-wasm/qpdf.mjs')).default
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function load(): Promise<any> {
  if (!modPromise) {
    modPromise = (async () => {
      const factory = await loadFactory()
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
