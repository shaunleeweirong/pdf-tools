#!/usr/bin/env node
/**
 * Copy the @jspawn/qpdf-wasm browser glue + wasm binary into public/ so they can be
 * served as real top-level scripts and fetched at runtime by lib/pdf/qpdf.ts.
 *
 * Why: the package's ESM/UMD glue relies on global side effects (qpdf.js writes the
 * factory to globalThis.exports.Module) that a bundler (Turbopack/webpack) breaks by
 * rewriting the module-scoped `exports`/`module` bindings, and it statically references
 * Node built-ins (path/module/fs) that fail a client build. Serving the untouched glue
 * from public/ and importing it at runtime sidesteps both problems entirely.
 *
 * Run automatically via the `prebuild` npm script; safe to run manually.
 */
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'node_modules/@jspawn/qpdf-wasm')
const publicDir = resolve(root, 'public')
const qpdfDir = resolve(publicDir, 'qpdf')

mkdirSync(qpdfDir, { recursive: true })

// ESM entry + Emscripten glue + browser shim -> public/qpdf/
for (const f of ['qpdf.mjs', 'qpdf.js', 'browser.js']) {
  copyFileSync(resolve(src, f), resolve(qpdfDir, f))
}
// wasm binary -> public/qpdf.wasm (locateFile in lib/pdf/qpdf.ts resolves to /qpdf.wasm)
copyFileSync(resolve(src, 'qpdf.wasm'), resolve(publicDir, 'qpdf.wasm'))

console.log('[copy-qpdf] copied qpdf glue -> public/qpdf/ and qpdf.wasm -> public/')
