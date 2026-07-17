# pdf-tool — MVP Design Spec (Phase 1)

*Date: 2026-07-17. Status: approved for planning. Working name: `pdf-tool` (placeholder). Companion research: `docs/competitive-research.md`.*

## 1. Overview

`pdf-tool` is a web-based PDF toolkit (a Smallpdf/iLovePDF-style product) intended to become a paid SaaS. It is built in phases:

- **Phase 1 (this spec):** an anonymous, no-login, **100% in-browser** PDF toolkit covering a superset of the *free* tools offered across Smallpdf, iLovePDF, PDF24, and Sejda. No backend, no accounts, no per-use cost to operate. Core value + marketing message: **"Your files never leave your browser."**
- **Phase 2 (future, out of scope here):** paid server-side converters (PDF↔Word/Excel/PPT, OCR, strong compression, batch), user accounts, and a Stripe Pro subscription. Phase 1 is architected so these bolt on without a rewrite.

### Goals
- Ship a fast, private, genuinely useful free PDF toolkit that matches or exceeds competitors' *free* tiers on breadth.
- Zero operating cost in Phase 1 (all processing client-side).
- SEO-friendly per-tool pages (the primary traffic channel for this category).
- Clean, isolated, testable tool modules that Phase 2 server tools can mirror.

### Non-goals (Phase 1)
- No accounts, login, or user data storage.
- No server-side processing, no backend, no database.
- No billing/monetization mechanics yet (structure is ready; features come in Phase 2).
- No AI features (chat/summarize/translate/agentic) — explicitly dropped by product decision.
- No heavy conversions that require server binaries (PDF↔Office, high-fidelity OCR, strong compression) — these are Phase 2 paid tools.

## 2. Phase 1 Tool List (all client-side)

All 21 tools below run entirely in the browser. Library/approach noted for each.

### Organize
| Tool | Route | Approach |
|---|---|---|
| Merge PDF | `/merge-pdf` | pdf-lib — copy pages from N docs into one |
| Split PDF | `/split-pdf` | pdf-lib — by range/every-page; multi-output zipped via JSZip |
| Extract pages | `/extract-pages` | pdf-lib — pick pages → new PDF |
| Delete pages | `/delete-pages` | pdf-lib — remove selected pages |
| Organize / Reorder | `/organize-pdf` | pdf.js thumbnails + drag-to-reorder → pdf-lib rebuild |
| Rotate PDF | `/rotate-pdf` | pdf-lib — rotate one/all pages |

### Convert
| Tool | Route | Approach |
|---|---|---|
| Images → PDF | `/jpg-to-pdf` | pdf-lib — embed JPG/PNG (other formats via canvas re-encode) |
| PDF → JPG/PNG | `/pdf-to-jpg` | pdf.js render page → canvas → image; multi-page zipped |

### Page tools
| Tool | Route | Approach |
|---|---|---|
| Watermark (text/image) | `/watermark-pdf` | pdf-lib — draw text/image overlay |
| Page numbers | `/add-page-numbers` | pdf-lib — draw numbering (position/format options) |
| Crop PDF | `/crop-pdf` | pdf-lib — set CropBox (visual selection via pdf.js) |
| N-up (pages per sheet) | `/n-up-pdf` | pdf-lib — place multiple pages per sheet |
| Flatten PDF | `/flatten-pdf` | pdf-lib — flatten form fields/annotations |
| Edit metadata | `/edit-metadata` | pdf-lib — read/write title/author/subject/keywords |

### Forms & sign
| Tool | Route | Approach |
|---|---|---|
| Fill forms | `/fill-form` | pdf-lib form API — detect + fill fields |
| Sign PDF | `/sign-pdf` | canvas signature (draw/type/upload) → pdf-lib place on page |

### Edit
| Tool | Route | Approach |
|---|---|---|
| Annotate / Edit | `/edit-pdf` | pdf.js render + canvas overlay (text, shapes, highlight, freehand, images) → pdf-lib save |

### Stretch (approved for v1)
| Tool | Route | Approach |
|---|---|---|
| Extract images | `/extract-images` | pdf.js — pull embedded images, zip |
| Compare PDF | `/compare-pdf` | pdf.js render both → visual pixel diff, side-by-side |
| Light compress | `/compress-pdf` | canvas image re-encode + pdf-lib re-save (basic). NOTE: *strong* compression is a Phase 2 paid tool |
| Protect PDF | `/protect-pdf` | **qpdf-wasm** — encrypt/add password (pdf-lib cannot encrypt) |
| Unlock PDF | `/unlock-pdf` | **qpdf-wasm** — remove password (when known) |

**Risk flag:** Protect/Unlock depend on a working in-browser WASM build of qpdf (`qpdf-wasm` or equivalent). If integration proves unstable, these two tools fall back to Phase 2 (server). All other tools have no such dependency. `Annotate/Edit` and `Compare` are the highest-effort of the confident/stretch set.

## 3. Tech Stack
- **Framework:** Next.js (App Router) + TypeScript + React.
- **UI:** Tailwind CSS + shadcn/ui.
- **PDF engines:** `pdf-lib` (create/modify), `pdfjs-dist` (render, thumbnails, rasterize), `qpdf-wasm` (encrypt/decrypt only).
- **Helpers:** `jszip` + `file-saver` (bundle/download multi-file outputs), `react-dropzone` (file input).
- **Performance:** run heavy operations in **Web Workers** to keep the UI responsive.
- **Hosting:** Vercel (static/edge; no server functions needed in Phase 1).
- **No** database, backend, or auth in Phase 1.

## 4. App Structure

```
app/
  page.tsx                 # homepage: hero + searchable tool grid by category
  (tools)/
    merge-pdf/page.tsx     # one route per tool (SEO slug)
    split-pdf/page.tsx
    ...                    # all 21 tools
  layout.tsx               # global layout, nav, footer
components/
  ToolLayout.tsx           # shared: dropzone → options → process → download
  FileDropzone.tsx
  PageThumbnailGrid.tsx    # drag-to-reorder page thumbnails (pdf.js)
  DownloadResult.tsx
  ProgressIndicator.tsx
  ToolCard.tsx             # homepage grid card
lib/
  pdf/
    merge.ts               # pure fn: (files, opts) => Promise<Blob>
    split.ts
    rotate.ts
    watermark.ts
    ...                    # one module per operation
    render.ts              # shared pdf.js render helpers (thumbnails, rasterize)
    workerClient.ts        # dispatch ops to Web Worker
  tools.ts                 # tool registry: slug, name, category, description, icon
workers/
  pdf.worker.ts            # runs lib/pdf ops off the main thread
```

**Design principles:**
- Each `lib/pdf/*` module is a **pure function** — `File(s) + options → Blob/Uint8Array` — with no UI dependencies, unit-testable in isolation, and mirror-able by a Phase 2 server implementation behind the same interface.
- A single **tool registry** (`lib/tools.ts`) drives the homepage grid, nav, and per-tool page metadata — add a tool by adding a registry entry + a `lib/pdf` module + a route.
- One reusable `ToolLayout` gives every tool the same drop → configure → process → download flow.

## 5. Data Flow & Privacy
1. User selects/drops file(s) → held in browser memory (`File`/`ArrayBuffer`).
2. Operation dispatched to a Web Worker running the relevant `lib/pdf` function.
3. Result returned as a `Blob` → offered as a download (single file, or zipped for multi-output).
4. **Nothing is uploaded.** No network calls carry file data. This is enforced by architecture (no backend) and surfaced as the product's primary trust/marketing claim.

## 6. Testing Strategy
- **Unit tests (Vitest)** for every `lib/pdf/*` operation using small fixture PDFs: assert page counts (merge/split/delete/extract), rotation angles, watermark/number presence, metadata round-trips, encrypt/decrypt (qpdf-wasm), etc.
- Fixtures: a handful of sample PDFs (single-page, multi-page, form, image-heavy, password-protected) under `test/fixtures/`.
- Implementation follows TDD (test-first) per operation.
- Light component/smoke tests for `ToolLayout` flow; full E2E deferred.

## 7. Monetization (Phase 2 preview — for architectural context only)
Not built in Phase 1, but the structure anticipates:
- **Accounts** (Clerk or Supabase Auth) + **Stripe** subscription (Pro).
- **Free tier limits** enforced once accounts exist (task/day, file size, batch off).
- **Pro-gated server tools** (PDF↔Office via LibreOffice, OCR via Tesseract, strong compress via Ghostscript, batch) behind Next.js API routes / a separate worker container — mirroring the `lib/pdf` interfaces.
- Suggested pricing to revisit then: Pro ~$5–9/mo (undercutting Smallpdf/Adobe); later a developer API tier.

## 8. Open Items / Risks
- **qpdf-wasm** integration (Protect/Unlock) — verify a stable browser build early; fall back to Phase 2 if not.
- **Annotate/Edit** and **Compare** are the most complex tools — may be sequenced last within Phase 1.
- **Light compress** sets modest expectations vs. server-grade compression (that's Phase 2 Pro).
- **Product name** — placeholder `pdf-tool`; finalize before public launch.
- Large-file handling in-browser (memory) — mitigate with Web Workers + reasonable soft size hints.

## 9. References
- Competitive research & ranked tool list: `docs/competitive-research.md`
- Libraries: pdf-lib (pdf-lib.js.org), pdf.js (mozilla/pdf.js), qpdf-wasm, JSZip, shadcn/ui.
