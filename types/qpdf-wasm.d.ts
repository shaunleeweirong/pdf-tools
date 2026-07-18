/** Minimal ambient declaration for @jspawn/qpdf-wasm (no @types package exists). */
interface QpdfFS {
  writeFile(path: string, data: Uint8Array): void
  readFile(path: string): Uint8Array
  unlink(path: string): void
}

interface QpdfModule {
  ready: Promise<void>
  FS: QpdfFS
  callMain(args: string[]): number
}

type QpdfFactory = (opts?: { locateFile?: (file: string) => string }) => Promise<QpdfModule>

declare module '@jspawn/qpdf-wasm' {
  const factory: QpdfFactory
  export default factory
}

// The ESM entry is imported by its explicit subpath so the bundler resolves and
// bundles it instead of leaving a bare-specifier runtime import (see lib/pdf/qpdf.ts).
declare module '@jspawn/qpdf-wasm/qpdf.mjs' {
  const factory: QpdfFactory
  export default factory
}
