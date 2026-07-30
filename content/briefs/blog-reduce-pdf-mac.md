# Brief: how to reduce pdf file size on mac free

**targetQuery:** how to reduce pdf file size on mac free
**Secondary keywords:** compress pdf mac free, reduce pdf size mac, compress pdf on mac without adobe, mac pdf compressor
**Intent:** informational — reader has a PDF too large to email or upload, they're on a Mac, they want a free fix without Adobe Acrobat.

## Real questions from PAA / autocomplete / Apple forums

- How do I compress a PDF on Mac using Preview?
- Why did my PDF get bigger after using "Reduce File Size" in Preview?
- How do I reduce PDF size on Mac without Adobe Acrobat?
- How do I reduce PDF size on Mac without losing quality?
- What is the best free PDF compressor for Mac?
- What to do when compression doesn't work on a Mac PDF?
- Should I compress a PDF twice to make it smaller?

## Mac built-in option (Preview)

File > Export > Quartz Filter > Reduce File Size. No install, no account. Apple docs warn quality may vary. Works by rasterizing pages via Quartz/CoreGraphics — same rasterization problem as browser tools: text-only PDFs get significantly larger.

## Browser tool option (our competitive win)

Compress PDF tool runs in Chrome/Firefox/Safari on Mac, fully in-browser, no server upload. Offers three quality levels (Low/Medium/High) vs Preview's single "Reduce File Size" option. Privacy-forward: files never leave the device.

## The critical warning (E-E-A-T differentiator)

Measured in Chromium on macOS Apple silicon:
- Image-heavy 6-page PDF: 913.4 KB -> 315.3 KB at Medium (-65.5%)
- 20-page text report: 23.5 KB -> 1.4 MB at Medium (+5861%)
- Mixed text+logo: 35.0 KB -> 171.2 KB at Medium (+389%)

Compressing twice makes it worse: 315.3 KB -> 598.9 KB at same level.

Preview's Quartz filter has the same rasterization approach; no measured numbers for Preview specifically, so only describe our tool's results.

## Competitor gaps

- Most pages tell the reader to just compress without warning about text PDFs.
- None explain when to skip compression and split/re-export instead.
- Most push desktop app installs.

## Internal links

- /compress-pdf (primary)
- /split-pdf (alternative for text PDFs)

## Outbound links

- https://support.apple.com/guide/preview/reduce-the-size-of-a-pdf-prvw1509/mac (Apple official docs)
- https://en.wikipedia.org/wiki/JPEG (JPEG rasterization concept)
- https://support.google.com/mail/answer/6584 (Gmail 25 MB attachment limit)

## Format

Blog post, ~850 words. H2 per real question. How-to steps for both Preview and browser tool. Decision guide for which to pick. FAQ in frontmatter only.
