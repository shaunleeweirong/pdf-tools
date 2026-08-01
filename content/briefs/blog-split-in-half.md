# Brief: how to split a pdf in half free

**targetQuery:** how to split a pdf in half free
**Secondary keywords:** split pdf into two parts free, divide pdf in half, split pdf by page count free, split pdf free online
**Intent:** informational / transactional — user has a multi-page PDF and wants to divide it into two separate files

## Real questions people ask (from PAA / Quora / Adobe forums)

1. How do I split a PDF into two equal halves?
2. What does "split in half" mean for a PDF — page count or slicing each page's layout?
3. Can I split a PDF without uploading it to a server?
4. How do I find the midpoint page number?
5. Does splitting reduce quality?
6. What format does the output come in?
7. What if my PDF has an odd number of pages?
8. Can the tool cut each page layout in half (scanned book spreads)?
9. How do I put the halves back together later?
10. Is it safe to split confidential documents with an online tool?

## Key distinction to surface

Two meanings of "split in half" confuse users:
- **Page-count split**: divide a 100-page PDF into two 50-page PDFs. This is what most people want.
- **Page-layout split**: each PDF "page" shows two book pages side by side (double-page spread). User wants to cut each page down the middle. Our tool does NOT do this.

Surfacing this distinction is a competitive gap — most articles don't make it clear, leading to frustration.

## Tool and code facts (from source)

- Split PDF tool: `'use client'` — runs entirely in browser via pdf-lib, no server upload.
- Uses `PDFDocument.copyPages()` — same as the merge tool.
- Output: a ZIP archive (`split.zip`) containing the individual PDFs.
- Form fields: `copyPages` copies page content but not the AcroForm layer, so interactive fields are stripped (same finding as merge). Recommend flattening filled forms before splitting.
- Merge measurement (tool-measurements.md): output came in marginally under sum of inputs (971.9 KB in, 970.5 KB out). Split does not have specific measurements yet; avoid quoting numbers.

## Competitor gaps

- Most articles don't explain the two meanings of "split in half."
- Few mention the ZIP output format.
- Privacy/no-upload angle is underplayed by competitors.

## Surface

Blog post. Format: answer-first intro, H2 sections per question, how-to numbered list.

## Internal links

- /split-pdf (primary tool)
- /merge-pdf (to recombine halves)
- /blog/merge-pdf-without-uploading (proof merging doesn't inflate size)

## Outbound links

- https://pdf-lib.js.org/ (the library used, open-source)
- https://en.wikipedia.org/wiki/PDF (explaining PDF format when discussing page copying)

## Slug

how-to-split-a-pdf-in-half-free
