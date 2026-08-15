# Research Brief: How to Compress a Scanned PDF Free

**Topic ID:** blog-compress-scanned-pdf
**Target Query:** "how to compress a scanned pdf free"
**Secondary keywords:** compress scanned pdf, reduce scanned pdf size, scanned pdf too large, scanned document too large to send
**Search intent:** Informational + Transactional
**Surface:** Blog
**Status:** briefed

## Real questions (from PAA, Adobe forums, Quora, HP support)

1. Why is my scanned PDF so large?
2. How do I compress a scanned PDF without losing quality?
3. Does compressing a scanned PDF make it blurry?
4. What compression level should I use for a scanned PDF?
5. Can I compress a scanned PDF online free without uploading to a server?
6. Should I scan in color or grayscale to keep file sizes down?
7. Does compressing twice help reduce the size further?
8. When does compression not help a scanned PDF?

## Key facts from tool-measurements.md (cite these, not guesses)

- Our compressor rasterizes every page to JPEG. For scanned PDFs (already images), this works extremely well.
- photo-deck.pdf (913.4 KB, image-heavy, 6 pages):
  - High (smallest): 913.4 KB -> 175.6 KB, -80.8%, 788 ms
  - Medium: 913.4 KB -> 315.3 KB, -65.5%, 820 ms
  - Low (best quality): 913.4 KB -> 703.5 KB, -23.0%, 853 ms
- text-report.pdf (text-only, 23.5 KB): Medium -> 1,400.8 KB (+5861%). DO NOT recommend compression for text PDFs.
- Double-compression: 315.3 KB -> 598.9 KB at same level again (+90%). Warn readers off this.
- All processing is in-browser. Files never reach a server.

## Competitor angles + gaps

- Smallpdf, Adobe, and PDFgear all require uploads and in some cases sign-ups.
- Most competitors don't distinguish between text PDFs and scanned PDFs -- huge gap.
- Competitors can't cite real measured data; we can.
- Privacy is a meaningful differentiator: confidential scans (medical, tax, legal) stay on the device.

## Recommended format

How-to blog post with a 3-row compression level table backed by real measurements. ~900 words.

## Internal links

- /compress-pdf (primary call to action)
- /delete-pages (trim pages before compressing large scans)
- /split-pdf (split a large scanned document into smaller parts)

## External links (credible outbound)

- Wikipedia: PDF (explain that PDFs can store vector text or raster images)
- Wikipedia: JPEG compression (explain why JPEG works well for raster images)

## "Get it done" angle

Reader has a large scanned PDF from a flatbed scanner, a phone scan app, or a colleague, and needs to send it by email, upload to a portal, or just free up storage. They want to shrink it quickly, for free, without installing software. Ideally without uploading a confidential document to an unknown server.
