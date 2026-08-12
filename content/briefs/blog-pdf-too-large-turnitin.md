# Brief: PDF Too Large for Turnitin Submission

**ID:** blog-pdf-too-large-turnitin
**targetQuery:** pdf too large for turnitin submission
**Secondary keywords:** turnitin file size limit, reduce pdf size for turnitin, turnitin pdf too big, compress pdf for turnitin
**Intent:** informational (student troubleshooting)
**Status:** briefed

## Search intent

Student has a PDF that Turnitin is rejecting as oversized (or they're expecting rejection at deadline). They want to fix it quickly. Secondary intent: understanding the limits before submitting.

## Turnitin file requirements (verified from official guides)

- Maximum file size: 100 MB (many institutions set lower internal limits; aim for under 40 MB)
- Maximum pages: 800 pages
- Minimum selectable text: 20 words
- Rejected: PDFs containing only images of text, PDF forms, PDF portfolios, PDFs with embedded files

Source: guides.turnitin.com/hc/en-us/articles/23929463501965

## Real questions people ask (PAA / Reddit / Quora)

- Why is my PDF too large for Turnitin?
- What is the Turnitin file size limit?
- How do I compress a PDF for Turnitin without it being rejected?
- Can I split my dissertation into parts for Turnitin?
- Turnitin says my PDF is image-only — what does that mean?
- How do I reduce PDF size without losing text?

## The critical nuance for our tools

Browser compressors (including ours) rasterize pages to JPEG. This:
1. Makes text PDFs BIGGER (23.5 KB text report -> 1.4 MB, measured)
2. Removes the selectable text layer (Turnitin then rejects as image-only)

This is a case where recommending our compress tool uncritically would harm the reader. The post must explain this limitation clearly and redirect to better approaches (delete pages, split, re-export from source).

Our compress tool IS appropriate for image-heavy PDFs (portfolios, photo decks with embedded figures) where the content is already images — but not for typed essays/dissertations.

## Competitor gaps

Competitor posts recommend compression without explaining rasterization risk. This is our differentiation: honest advice about when compression helps vs. hurts for Turnitin specifically.

## Recommended structure

1. Short answer-first intro (remove pages / re-export, not compress)
2. Why PDFs get large for Turnitin (images, export settings)
3. Turnitin requirements (actual numbers)
4. Compression nuance (rasterization risk for Turnitin)
5. How-to steps (delete pages, split, re-export from source)
6. What to do if Turnitin says image-only (OCR)

## Internal link targets

- /compress-pdf (with caveat about rasterization)
- /delete-pages (primary recommendation)
- /split-pdf (secondary recommendation)
- /extract-pages (alternative to delete)

## External link targets

- guides.turnitin.com official file requirements
- Wikipedia OCR article (for OCR explanation)

## Format

Blog post, ~900 words, how-to structure with numbered steps in sub-sections.
