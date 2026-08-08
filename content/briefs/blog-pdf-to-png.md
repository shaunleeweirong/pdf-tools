# Brief: pdf to png free online

**id**: blog-pdf-to-png
**targetQuery**: pdf to png free online
**Secondary keywords**: convert pdf to png, pdf to png converter, pdf pages to png, pdf to png no sign up
**Intent**: Transactional/how-to — user wants to convert a PDF to PNG images right now, in a browser, without installing software or creating an account.
**Surface**: Blog
**Recommended slug**: pdf-to-png-free-online

## Questions to answer (from PAA / Reddit / competitor research)

1. How do I convert a PDF to PNG online for free? (primary how-to)
2. What is the difference between PNG and JPG when converting from PDF?
3. When should I choose PNG over JPG?
4. Why is my PNG file bigger than the original PDF?
5. Does converting PDF to PNG lose quality?
6. Can I convert just one page of a PDF to PNG?
7. Does PNG keep transparency from the PDF?

## Our angle / what we beat

- Competitors (PDF24, EZGif, FreeConvert, Drawboard) mostly upload files to a server. Our `/extract-images` tool uses PDF.js and runs entirely in-browser — files never leave the device.
- Output: one numbered PNG per page, zipped for easy download.
- No sign-up, no watermarks, no file size limits visible to user.
- Gap in competitor content: most pages don't explain clearly WHY PNG files are larger than the PDF, or when PNG is the wrong choice.

## Tool facts (confirmed from source code)

- `extract-images` (slug) calls `renderPageToImageBlob(pdfBytes, i, 2, 'image/png')` — each page rendered as PNG at scale 2.
- `pdf-to-jpg` (slug) calls `renderPageToImageBlob(buf, i, 2, 'image/jpeg')` — each page rendered as JPEG at scale 2.
- Both tools use PDF.js for rendering (in-browser, client-side).
- Both tools output a ZIP file with one image per page.
- NOT in tool-measurements.md: no measured file sizes or DPI figures for either tool. Do not quote specific numbers for these tools.

## Format and length

Blog how-to post. Lead with the step-by-step, then cover PNG vs JPG, then why PNG is bigger, then transparency and single-page workflow. FAQ in frontmatter only. ~900 words.

## Internal links

- `/extract-images` — the PDF to PNG tool
- `/pdf-to-jpg` — the JPG alternative
- `/split-pdf` — for converting one page

## Outbound links (1 to 3, high-authority only)

- Mozilla PDF.js project page (explains the rendering engine)
- Wikipedia: Lossless compression (explains why PNG is bigger)
- W3C PNG specification (authoritative source for transparency support)
