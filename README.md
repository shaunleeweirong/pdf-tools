# pdf-tool

Free, private PDF tools that run entirely in your browser. **Your files never leave your device** — there is no backend, no upload, no server processing.

Built with Next.js 16, pdf-lib, pdf.js, and qpdf-wasm.

## Privacy

All processing happens locally using WebAssembly and the browser's native APIs. Files are never uploaded to any server.

## Tools (22)

| Category | Tools |
|---|---|
| **Organize** | Merge PDF, Split PDF, Rotate PDF, Delete Pages, Extract Pages, Organize PDF, Compress PDF |
| **Page tools** | Watermark PDF, Add Page Numbers, Crop PDF, Pages Per Sheet, Flatten PDF |
| **Edit** | Edit Metadata, Extract Images, Compare PDF, Edit PDF |
| **Convert** | Images to PDF, PDF to JPG |
| **Forms & sign** | Fill PDF Form, Sign PDF |
| **Security** | Protect PDF, Unlock PDF |

## Development

```bash
npm install
npm run dev       # start dev server at http://localhost:3000
npm test          # run unit tests (Vitest, 29 tests)
npm run build     # production build (must exit 0)
npx tsc --noEmit  # type check
```

## Production build

```bash
npm run build
# Outputs a fully static site — all 24 routes prerender as static HTML.
```

## Deployment

This project outputs a standard Next.js static/server build and can be deployed to any Node.js host or CDN.

**Vercel (recommended):**

```bash
# Preview deployment
npx vercel

# Production deployment
npx vercel --prod
```

Or connect the repository in the [Vercel dashboard](https://vercel.com/new) — no additional configuration required. The `public/qpdf.wasm` file is served as a static asset automatically.

**Other hosts:**

```bash
npm run build
# Serve the .next/ output with `next start`, or export to static HTML:
npx next export   # if all pages are static (they are in this project)
```

## Phase 2 roadmap

See [`docs/superpowers/specs/`](./docs/superpowers/specs/) for planned features including OCR, advanced compression, batch processing, and additional format conversions.

## Tech stack

- [Next.js 16](https://nextjs.org/) with Turbopack
- [pdf-lib](https://pdf-lib.js.org/) — PDF creation and manipulation
- [pdf.js (pdfjs-dist)](https://mozilla.github.io/pdf.js/) — PDF rendering and rasterization
- [@jspawn/qpdf-wasm](https://github.com/jsscheller/qpdf-wasm) — encrypt/decrypt PDFs via qpdf compiled to WebAssembly
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Vitest](https://vitest.dev/) for unit tests
