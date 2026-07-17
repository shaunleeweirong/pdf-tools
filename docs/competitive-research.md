# PDF Tools — Competitive Research & Build Spec

*Compiled 2026-07-17. Sources: Smallpdf, iLovePDF, Adobe Acrobat, PDF24, Sejda, PDF2Go, Soda PDF, pdfFiller, DocHub, Foxit, Nitro, Xodo, PDFgear, Stirling PDF (open source), plus pricing/tech research. Full source URLs at bottom.*

Goal: a build spec for a new PDF web app that (a) covers every common tool the market considers table-stakes, and (b) improves on the incumbents. This doc has 7 parts:

1. Smallpdf full tool inventory
2. What competitors have that Smallpdf lacks (gap analysis)
3. Ranked must-have common tools (build priority)
4. Premium / AI features
5. Client-side vs server-side processing map
6. Monetization / business-model patterns
7. How to improve on all of this (differentiation strategy)

---

## 1. Smallpdf — Full Tool Inventory (~30+ tools)

**Compress / Optimize:** Compress PDF (their #1 tool, ~34% of usage), Flatten PDF.

**Convert to PDF:** PDF Converter, Word→PDF, Excel→PDF, PPT→PDF, JPG→PDF (also PNG/BMP/GIF/TIFF), TXT→PDF, RTF→PDF, ODT→PDF, ODP→PDF, ODS→PDF, HWP→PDF, HTML→PDF, EPUB→PDF, ZIP→PDF.

**Convert from PDF:** PDF→Word, PDF→Excel, PDF→PPT, PDF→JPG, PDF OCR (searchable scans).

**Organize:** Merge, Split, Organize (rearrange/delete/add/rotate), Rotate, Delete Pages, Extract Pages.

**View & Edit:** Edit PDF, PDF Annotator, PDF Form Filler, PDF Reader, Crop, Redact, Watermark, Number Pages.

**Security:** Protect (password/encrypt), Unlock, Redact, Flatten.

**Sign / eSign:** Sign PDF (draw/type/upload), Request Signatures (via Sign.com), LTV Timestamp (anti-tamper).

**AI PDF Assistant:** Chat with PDF (Q&A incl. scans), AI Summarizer, Translate PDF, AI Question Generator (quiz/test creation), agentic actions (AI executes ops from natural language).

**Mobile:** PDF Scanner (camera → PDF).

**Free vs Pro:** Free = ~2 tasks/day, ~5 MB file cap, 2 eSign/day, AI capped (4 docs + 30 prompts/day). Pro (~$9–15/mo, Teams ~$8–12/user/mo) = unlimited tasks, no size limit, no ads/watermarks, batch, strong compression, OCR, offline desktop, unlimited eSign.

**Platforms:** Web (primary), Windows desktop, iOS/Android, Chrome extension, Google Workspace + Dropbox + OneDrive integrations. (macOS desktop discontinued 2021.) GDPR + ISO 27001, files auto-deleted ~1hr.

---

## 2. Gap Analysis — What Competitors Have That Smallpdf Lacks

| Capability | Who has it | Notes |
|---|---|---|
| **Compare PDF** (diff two versions) | iLovePDF, Adobe Pro, PDF24, PDF2Go | Smallpdf has no compare tool |
| **Repair PDF** (recover corrupt) | iLovePDF, PDF24, Sejda, PDF2Go | — |
| **PDF → PDF/A** (archival) | iLovePDF, PDF24, PDF2Go | ISO archival standard |
| **PDF → Markdown** | iLovePDF (new) | structure-preserving |
| **Deskew** (straighten scans) | Sejda | scan cleanup |
| **Bates Numbering** (legal) | Sejda, Foxit, Adobe Pro | legal/discovery |
| **Split by text / bookmark / size** | Sejda | smart splitting |
| **Header & Footer** | Sejda, PDF24 | separate from page numbers |
| **N-up / Pages-per-sheet** | Sejda, PDF24, Stirling | print layout |
| **Grayscale / Flip / Resize** | Sejda | — |
| **Remove Annotations (batch)** | Sejda | — |
| **Workflows / automation** | Sejda, iLovePDF, Stirling (Pipelines) | chain tools |
| **Webpage/URL → PDF** | PDF24, Sejda, PDF2Go, Soda | Smallpdf only does HTML file |
| **Extract images (batch, zip)** | PDF24, Sejda, PDF2Go, Stirling | — |
| **PDF Overlay / stamp** | PDF24, Stirling | background/watermark merge |
| **Web-optimize / linearize** | PDF24 | fast web view |
| **Remove/Edit metadata** | PDF24, Sejda, Stirling | privacy |
| **Print Poster (tile large PDF)** | PDF2Go | — |
| **PDF Cleaner (strip images/vectors)** | PDF2Go | — |
| **PDF ↔ Speech (audio)** | PDF2Go (both directions) | TTS + transcription |
| **Spellcheck PDF** | PDF2Go | — |
| **Multi-signer eSign workflow** | Soda, Nitro, pdfFiller, DocHub, Adobe | Smallpdf's is basic (via Sign.com) |
| **Full form BUILDER** (make fillable) | pdfFiller, DocHub, iLovePDF Forms, Adobe Pro, Stirling | Smallpdf only fills, doesn't build |
| **AI Smart Redact (auto-PII)** | Foxit, Nitro | ML detects SSN/email/etc. |
| **AI data extraction → CSV/Excel** | Nitro, Foxit + parsers | invoices/tables |
| **Natural-language / agentic commands + MCP** | Foxit (industry-first MCP host) | live connect to Salesforce/Jira |
| **Liquid Mode (responsive reflow)** | Adobe | mobile reading |
| **Fax send/receive** | PDF24 | — |
| **Invoice / QR / password generators** | PDF24 | utility extras |
| **Developer API** | iLovePDF (iLoveAPI, 250 files/mo free), Adobe, Stirling | — |
| **Fully free + free desktop** | PDF24, Stirling, PDFgear | no limits/watermarks |

**Stirling PDF (open source, 50–60 tools)** is the single best reference for a complete self-hostable feature set — MIT-licensed, no file storage, has nearly everything above plus a no-code Pipelines automation editor and a private API.

---

## 3. Ranked Must-Have Common Tools (build priority)

### Tier 1 — Universal (in ALL major competitors; ship first)
1. **Merge PDF**
2. **Split PDF**
3. **Compress PDF**
4. **Rotate PDF**
5. **Delete / Remove pages**
6. **Reorder / Organize pages**
7. **Extract pages**
8. **PDF → Word** / **Word → PDF**
9. **PDF → JPG** / **JPG → PDF**
10. **PDF → Excel** / **Excel → PDF**
11. **PDF → PPT** / **PPT → PDF**
12. **Edit PDF** (text/image/annotate)
13. **Sign PDF / Fill & Sign**
14. **Fill PDF forms**
15. **Protect** (password) / **Unlock**
16. **Watermark**
17. **Page numbers**

### Tier 2 — Very common (most competitors; ship soon after)
18. **OCR** (searchable scans)
19. **Crop PDF**
20. **Redact PDF**
21. **HTML / URL → PDF**
22. **Compare PDF**
23. **Repair PDF**
24. **PDF → PDF/A**
25. **Flatten PDF**
26. **Extract images**
27. **Edit / remove metadata**
28. **N-up (pages per sheet)**

### Tier 3 — AI table-stakes (now expected everywhere)
29. **Chat with PDF** (Q&A)
30. **AI Summarize**
31. **Translate PDF**

### Tier 4 — Differentiators / niche (pick to stand out — see Part 7)
Deskew, Bates numbering, Split-by-text/bookmark/size, Header & Footer, Grayscale, Flip, Resize, Remove annotations, Workflows/Pipelines automation, PDF → Markdown, PDF ↔ Speech, Print Poster, PDF Cleaner, Spellcheck, Multi-signer eSign, Form Builder, AI Smart Redact, AI data extraction, agentic natural-language commands, Fax, Invoice/QR generators, Developer API.

---

## 4. Premium & AI Features

**Traditional premium gates:** unlimited tasks, larger files, batch/bulk, OCR, advanced compression, offline desktop, unlimited eSign, ad-free, priority processing, cloud storage, team seats/SSO.

**AI — now standard ("AI Assistant" tab everywhere):**
- **Chat/Q&A** — Adobe (cited answers + multi-doc), Foxit, Nitro, Smallpdf, iLovePDF, PDFgear, Xodo AskPDF, pdfFiller.
- **Summarize** — most universal AI feature; Adobe generative summary (headings/links/bullets) is the gold standard.
- **Translate** — Foxit (9+ langs), PDFgear (100+), Smallpdf, iLovePDF.
- **Generate documents from a prompt** — pdfFiller, Adobe, GenPDF, Inkfluence.
- **Data extraction → CSV/Excel/JSON** — Nitro, Foxit, + parsers (Textract, Lido, Docparser).
- **AI redaction (auto-PII)** — Foxit Smart Redact (~99% precision), Nitro.
- **AI form fill / auto-detect fields** — pdfFiller, Nitro, iLovePDF Forms.
- **Rewrite/enhance text** — Adobe, Foxit, Smallpdf, PDFgear.
- **Quiz/study generation** — Smallpdf Question Generator.
- **Agentic / natural-language commands** — Foxit Smart Command + industry-first **MCP host** (live Salesforce/Jira/ERP), Smallpdf agentic actions.
- **Audio** — Adobe (doc → narrated audio), PDF2Go (PDF↔Speech).
- **Liquid Mode** — Adobe responsive reflow.

**AI monetization:** credits (iLovePDF 2,000/yr), per-day caps (Smallpdf 30 prompts), or paid add-on (Adobe AI Assistant $4.99→$9.99/mo).

---

## 5. Client-side vs Server-side Processing Map

**Privacy/cost insight:** ~20 of the core manipulation tools can run 100% in-browser (files never uploaded) using **pdf-lib** (manipulation) + **pdf.js** (render/thumbnails). This is a genuine differentiator (privacy + instant + zero server cost). Heavy conversions/OCR/AI need a server.

| Operation | Where | Tool/Library |
|---|---|---|
| Merge, Split, Rotate, Delete/Extract/Reorder pages | **Client** | pdf-lib |
| Watermark, Page numbers, N-up, Flatten, Crop | **Client** | pdf-lib |
| Fill forms, basic Edit/annotate, Sign (overlay) | **Client** | pdf-lib + pdf.js |
| Render, thumbnails, preview | **Client** | pdf.js |
| Images → PDF; PDF → image | **Client** | pdf-lib / pdf.js→canvas |
| Extract images, edit metadata | **Client** | pdf-lib |
| Protect/encrypt, Unlock (known pwd) | **Client** (basic) / server for strong | qpdf (WASM or server) |
| **Compress** (quality) | **Server** (or heavy WASM) | Ghostscript / mupdf / qpdf |
| **Office ↔ PDF** (Word/Excel/PPT) | **Server** | LibreOffice headless |
| **OCR** | Server (quality/scale) or client (slow) | Tesseract / tesseract.js |
| **PDF → Word/Excel** (layout fidelity) | **Server** | commercial/LibreOffice |
| Repair, linearize/web-optimize | **Server** | Ghostscript / qpdf |
| **All AI features** | **Server** | LLM API (Claude) |

**Recommended architecture:** client-first for Tier-1 manipulation (privacy + free + fast), server (serverless functions) for conversion/OCR/compression/AI. Market it: "your files never leave your browser" for the client-side tools.

---

## 6. Monetization / Business-Model Patterns

| Product | Free tier | Paid | Model |
|---|---|---|---|
| **Smallpdf** | 2 tasks/day, ~5MB | Pro ~$9–15/mo; Teams ~$8–12/user/mo | Freemium, stingy free |
| **iLovePDF** | per-tool task/size limits | Premium ~€4/mo ($48/yr); Business custom | Freemium + **API** (250 files/mo free) |
| **Sejda** | **3 tasks/hr**, 50MB, 200pg (generous) | ~$7.50/mo | Freemium, generous |
| **Adobe** | ~1 use/tool/30-day window | Std $14.99, Pro $19.99/mo; AI add-on $9.99 | Pro subscription + AI add-on |
| **PDF24** | **100% free**, no limits/watermark | — (fax only) | Ad-supported + free desktop |
| **PDF2Go** | credit-based (30/day renew) | premium (higher caps, 64GB) | Credits |
| **Soda PDF** | 2 files/day or 3MB, downloads gated | ~$7–16.50/mo | Freemium, restrictive |
| **pdfFiller** | 30-day trial only (no free tier) | tiered + enterprise | Trial → subscription |

**Common patterns:** task limits (per hour/day), file-size caps, batch behind paywall, watermarks on free output, ads on free, AI credits, team seats + SSO for enterprise, developer API metering.

**Recommended for a new entrant:** freemium with a **generous, honest free tier** (client-side tools unlimited & free since they cost you nothing), Pro subscription (~$5–9/mo undercutting Adobe/Smallpdf) removing server-tool limits + batch + AI, plus a **developer API** tier and later team/SSO. Ad-supported free like PDF24 is viable but subscription is cleaner.

---

## 7. How to Improve on All of This — Differentiation Strategy

1. **Privacy-first, client-side core.** Run all Tier-1 tools in-browser — "files never leave your device." Instant, free, private. Beats Smallpdf/Adobe (upload everything) and matches PDF24's trust angle without needing a desktop app.
2. **Generous free tier.** Beat Smallpdf's 2/day. Client-side tools = unlimited free. Server tools = generous (Sejda-style 3/hr or a daily quota). No forced signup, no watermarks on core tools.
3. **One superset of tools.** No single competitor has everything — ship Tier 1–3 to match everyone, then cherry-pick Tier-4 winners (Deskew, Bates, Split-by-text, Workflows, PDF→Markdown, Compare, Repair, PDF/A) so you're a strict superset of Smallpdf + Sejda.
4. **Unified agentic AI assistant.** One chat box: "compress this and delete pages 3–5, then summarize." Natural-language commands that *execute* (Foxit Smart Command + Smallpdf agentic), powered by Claude. AI Summarize/Chat/Translate/Redact as table-stakes.
5. **Workflow automation.** Chain tools into reusable pipelines (Sejda Workflows / Stirling Pipelines) — a power-user + business hook.
6. **Developer API from day one.** iLoveAPI-style, generous free tier — a second revenue stream and growth channel.
7. **Modern, fast UX.** Batch drag-drop, keyboard shortcuts, mobile-first, dark mode, no ad clutter. Speed + polish is itself a differentiator vs. the cluttered incumbents.
8. **Trust & compliance.** GDPR, auto-delete, and for client-side tools, provably-private (no upload). Enterprise: SSO + audit later.

**Suggested tech stack:** Next.js (App Router) on Vercel; pdf-lib + pdf.js client-side; serverless functions for LibreOffice/Ghostscript/Tesseract (or a containerized worker) for conversion/OCR/compression; Claude API for AI; Stirling PDF is a viable open-source engine/reference to self-host for server tools.

---

## Sources
Smallpdf: smallpdf.com/pdf-tools, /ai-pdf, /esign-pdf, /download, /pricing. iLovePDF: ilovepdf.com, /pricing, /features, iloveapi.com. Adobe: adobe.com/acrobat/online, /acrobat/pricing, helpx.adobe.com, adobe.com/acrobat/generative-ai-pdf. PDF24: tools.pdf24.org/en, /all-tools, fax.pdf24.org. Sejda: sejda.com, /desktop, /upgrade. PDF2Go: pdf2go.com, /pricing. Soda PDF: sodapdf.com/online, tools.sodapdf.com. pdfFiller: pdffiller.com, blog.pdffiller.com. DocHub: dochub.com. Foxit: foxit.com/pdf-editor, /ai. Nitro: gonitro.com. Xodo: xodo.com/tools, /ask-pdf. PDFgear: pdfgear.com. Stirling PDF: github.com/Stirling-Tools/stirling-pdf, docs.stirlingpdf.com/functionality. Tech: pdf-lib.js.org, pdf.js, Ghostscript, LibreOffice, Tesseract.
