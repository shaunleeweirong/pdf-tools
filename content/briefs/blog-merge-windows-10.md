# Research brief: how to merge pdf on windows 10 free

**targetQuery:** how to merge pdf on windows 10 free
**Secondary keywords:** combine pdf windows 10, merge pdf windows 10 without software, free pdf merger windows 10
**Intent:** informational
**Surface:** blog

## Key finding

Windows 10 has no built-in PDF merger. Microsoft Edge (default PDF viewer) can open, annotate, and print PDFs but cannot combine them. The "Print to PDF" printer also cannot merge existing PDFs. This differs from macOS where Preview handles it natively.

## Real questions people ask (PAA / Reddit / Quora)

- Does Windows 10 have a built-in PDF merge tool?
- How do I combine PDF files in Windows 10 without Adobe?
- Can I merge PDFs without installing software on Windows 10?
- Will merging PDFs make the file larger?
- What happens to form fields when I merge PDFs?
- Is it safe to use an online PDF merger?
- Does the method work on Windows 11 too?

## Competitor angles + our gap

Competitors (Adobe, Dropbox, pdfgear) cover this topic but push sign-ups or installs. Our gap: free browser tool with no sign-up, no install. Also: we can state specific merge file-size data (971.9 KB → 970.5 KB) as verified proof, which competitors don't have.

## Format

Blog how-to, ~900 words. Two methods: browser tool (method 1) and free desktop app PDFsam Basic (method 2). Include measured file-size data from tool-measurements.md. Warn about form fields needing flattening first.

## Internal links

- /merge-pdf (primary)
- /flatten-pdf (for form-field warning)
- /compress-pdf (mentioned for post-merge size reduction, with caveat)

## External links

- https://pdfsam.org/pdfsam-basic/ - official site for PDFsam Basic (open-source desktop app)
- https://en.wikipedia.org/wiki/PDF - for PDF format reference if needed

## Measured facts to use

- 971.9 KB (3 files) → 970.5 KB merged (-0.1%): merging doesn't inflate
- Merging strips interactive form fields (flatten first with /flatten-pdf)
- Gmail + Outlook cap at 25 MB; Base64 encoding adds ~33%, so practical ceiling is ~18 MB
- Compressor rasterizes to JPEG: bad for text PDFs, good for image/scan PDFs
