# Brief: how to compress a pdf for google slides

**targetQuery**: how to compress a pdf for google slides  
**Secondary keywords**: pdf too large for google slides, insert pdf in google slides, reduce pdf size for presentation, compress pdf presentation  
**Intent**: task-completion — user wants to get a PDF into Google Slides without the presentation becoming slow or oversized  
**Surface**: blog  
**Format**: how-to with step list + FAQ in frontmatter  
**Estimated length**: 850–950 words  

## Real questions (from PAA / Quora / Google Community)

1. Why can't I insert a PDF directly into Google Slides?
2. Why is my Google Slides presentation slow or too large after inserting images?
3. How do I compress a PDF before using it in Google Slides?
4. Does compressing a text PDF help for Google Slides?
5. What is the file size limit for Google Slides?
6. What format should images be in for Google Slides (JPG vs PNG)?
7. Can I just link to the PDF instead of inserting it?
8. Should I compress a PDF twice to make it smaller?

## Competitor gaps

- Most "insert PDF into Google Slides" posts cover methods but ignore file size impact
- None explain that rasterizing-to-JPEG compressors (like ours) are well-suited here because you're converting to images anyway
- None warn that compressing text-only PDFs makes them larger
- None explain the "compress twice" trap

## Our angle

- Free, no sign-up, files stay in the browser
- Critical insight: our compressor rasterizes to JPEG, which is actually the correct prep step before converting PDF pages to images for Slides insertion
- Clear warning: text-only PDFs should NOT be compressed — send as a Drive link instead

## Internal links

- /compress-pdf (Compress PDF tool)
- /pdf-to-jpg (PDF to JPG tool)

## Outbound links

- Google Drive file size documentation (support.google.com/drive/answer/37603)
- PDF format reference (Wikipedia or ISO 32000 if needed)

## Measured facts to use (from tool-measurements.md)

- Photo-deck 913.4 KB → 315.3 KB at Medium (−65.5%)
- Photo-deck 913.4 KB → 175.6 KB at High (−80.8%)
- Text-report 23.5 KB → 1,400.8 KB at Medium (+5861%) — never compress text PDFs
- Compressing twice: 315.3 KB → 598.9 KB at Medium (+90%) — never recommend
