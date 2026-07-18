/** Minimal ambient declaration for @jspawn/qpdf-wasm (no @types package exists). */
declare module '@jspawn/qpdf-wasm' {
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

  const factory: QpdfFactory
  export default factory
}
