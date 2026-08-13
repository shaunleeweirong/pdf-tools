# Research brief: compress pdf for docusign

**targetQuery:** compress pdf for docusign upload free
**Secondary keywords:** docusign file size limit, reduce pdf size for docusign, pdf too large for docusign
**Intent:** transactional (user has a file to upload RIGHT NOW)
**Surface:** blog

## DocuSign file size limits (from official docs)

- Hard limit: 50 MB per file
- Recommended max: 5 MB for reliable uploads (timeouts on slower connections)
- Email attachment limit: 5 MB for the completed signed PDF; above that, DocuSign sends a download link instead
- API limit: 25 MB per doc, 200 MB per envelope

## The exact questions to answer

From community forums and search results:

1. What is DocuSign's file size limit?
2. How do I compress a PDF for DocuSign for free?
3. Can I compress a PDF after it's been signed in DocuSign?
4. Why does compressing a text contract make it bigger?
5. My PDF is too large for DocuSign — what should I do?
6. Should I compress before or after signing?
7. Which compression level should I use for DocuSign?

## Key insight: which PDFs to compress and which not to

Our compressor rasterizes every page to JPEG. This means:
- Scanned contracts and image-heavy PDFs: compress well (measured: 913.4 KB image deck -> 315.3 KB at Medium)
- Text-based contracts (Word/Docs exports): get BIGGER (measured: 23.5 KB text report -> 1.4 MB at Medium)

This is the most important thing a reader needs to know. Most guides ignore it.

## Competitor gaps

Competitors (smallpdf, ilovepdf, adobe online) tell users to "just compress the PDF" without distinguishing file types. We can own the honest angle: compress only if it's a scanned/image PDF; for text contracts, use print-to-PDF or split instead.

## Format

Blog post, how-to, ~850 words. Lead with file type identification (scan vs text), then steps, then edge cases.

## Internal links

- /compress-pdf (primary)
- /split-pdf (alternative for oversized text PDFs)
- /merge-pdf (note: merging barely adds size, so the problem is usually in source files)

## Outbound links

- DocuSign official file size limits page
- PDF digital signature validation standard reference (pdfa.org)
