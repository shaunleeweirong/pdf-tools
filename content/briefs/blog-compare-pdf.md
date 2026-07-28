# Research brief: how to compare two pdf files free

**targetQuery:** how to compare two pdf files free  
**Slug:** how-to-compare-two-pdf-files-free  
**Secondary keywords:** compare pdf files online free, compare pdf without uploading, compare pdf versions, pdf diff tool free  
**Search intent:** Informational — user has two versions of a document (contract, report, proposal) and wants to spot what changed.  
**Surface:** blog  

## Real questions from PAA / Reddit / Quora

1. How do I compare two PDF files and see the differences?
2. Can I compare PDFs without uploading them to a server?
3. What is the difference between visual and text-based PDF comparison?
4. How do I compare scanned PDF files?
5. How do I compare a specific page (not the first page)?
6. Does Adobe Acrobat compare PDFs for free?
7. Will comparing PDFs change or damage my files?
8. What if the PDFs are password-protected?

## Competitor angles

- Most competitors (PDF24, iLovePDF, Draftable) offer full multi-page text comparison but upload files to their servers.
- Adobe Acrobat Pro is the paid market leader; many searchers are looking to avoid it.
- ihatepdf.cv markets itself as fully in-browser and no-upload for privacy-conscious users.

## Our gap / angle

Our Compare PDF tool does a visual, first-page pixel comparison entirely in the browser (confirmed: `diffFirstPage` in `lib/pdf/render.ts` uses PDF.js + canvas, `'use client'`, page copy says "Compared in your browser; nothing is uploaded."). Key differentiators:
- No upload, no account, free
- Works on scanned PDFs (pixel comparison, not text extraction)
- Limitation to be honest about: first page only

Use the two-step workaround for comparing non-first pages: Extract Pages first, then compare.

## Internal links

- `/compare-pdf` (primary)
- `/extract-pages` (workaround for non-first pages)
- `/split-pdf` (alternative page extraction)
- `/unlock-pdf` (handle encrypted PDFs before comparison)

## Outbound links

- Wikipedia OCR article (when explaining scan limitations)
- Draftable (for full-document text comparison)
- PDF24 Compare (free multi-page text diff)

## Recommended format

Blog post, ~900 words. Sections: what comparison does (visual vs text), when to use each, step-by-step with our tool, workaround for specific pages, scanned PDFs, full-doc alternatives, things comparison doesn't do.
