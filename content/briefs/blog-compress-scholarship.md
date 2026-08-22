# Brief: compress pdf for scholarship application free

**ID:** blog-compress-scholarship  
**targetQuery:** compress pdf for scholarship application free  
**Secondary keywords:** reduce pdf size scholarship, pdf too large scholarship upload, scholarship application pdf file size limit, compress pdf for scholarship free  
**Intent:** Transactional — student is actively filling out a scholarship application, has hit a file size error, and needs to fix it right now.  
**Surface:** Blog  
**Slug:** compress-pdf-for-scholarship-application-free

---

## Real questions from PAA / Reddit / portals

1. How do I compress a PDF for a scholarship application?
2. What is the file size limit for scholarship application uploads? (Common answers: 2 MB, 5 MB, 10 MB; some as low as 100 KB)
3. Which documents should I compress and which should I leave alone?
4. Will compressing my PDF make it unreadable / blurry?
5. What if the PDF is still too large after compressing?
6. How do I combine all my scholarship documents into one PDF?
7. Should I re-scan at lower resolution instead?

---

## Key facts (from tool-measurements.md)

- Our compressor rasterizes each page to JPEG.
- Image/scan PDF (913.4 KB): Medium → 315.3 KB (−65.5%), High → 175.6 KB (−80.8%), Low → 703.5 KB (−23.0%).
- Text PDF (23.5 KB): Medium → 1400.8 KB (+5861%). NEVER recommend compressing typed documents.
- Mixed doc (35 KB): Medium → 171.2 KB (+389%). Also grows.
- Merge does not inflate: three files summing to 971.9 KB merged to 970.5 KB.
- Second compression pass makes files LARGER at same level (315.3 KB → 598.9 KB at Medium). Tell users to go back to the original and use High instead.

---

## Competitor gaps we beat

- Competitors recommend compressing all PDFs — we tell users which docs to skip (typed essays get larger).
- Most guides suggest compressing twice — we explain this makes files bigger.
- We're in-browser with no sign-up; competitors (SmallPDF, Adobe) require accounts or have usage limits.

---

## Format

- Blog post, ~900 to 1000 words
- Answer-first intro (target keyword in sentence 1)
- H2 sections per real question
- How-to numbered list for the compression steps
- FAQ in frontmatter (not in body)
- 2 outbound links: Wikipedia/PDF + pdfa.org
- Internal links: /compress-pdf, /merge-pdf, /delete-pages, /flatten-pdf

---

## Get-it-done angle

Student has 30 minutes before the scholarship portal closes, gets a "file too large" error. They need to know: which of their documents to compress, which to leave alone, how to pick the compression level, and what to do if it's still too big.
