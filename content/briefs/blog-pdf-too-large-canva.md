# Brief: pdf too large for canva upload

**id:** blog-pdf-too-large-canva  
**targetQuery:** pdf too large for canva upload  
**surface:** blog  
**slug:** pdf-too-large-for-canva-upload  
**intent:** informational (problem-solution)  
**priority:** 2

## Secondary keywords

- canva pdf upload limit
- canva pdf file size limit
- compress pdf for canva
- canva import pdf too large
- pdf too big for canva

## Search intent

User has a PDF they want to import into Canva. Canva is rejecting it with a "file too large" or similar error. They want to know what the limit is and how to get their file under it. Fast, actionable answer required.

## Canva PDF limits (from official help center)

- **File size:** 300 MB
- **Pages:** up to 500 per design
- **Elements/images:** up to 1,400 per file
- **What happens on import:** Canva converts PDF pages to images internally (pages become rasterized images, text is not editable)

## Questions to answer (PAA / real user questions)

1. What is Canva's PDF upload file size limit? (300 MB)
2. Why is my PDF too large for Canva?
3. How do I compress a PDF to upload to Canva?
4. Does compressing a text PDF make it smaller? (No - it makes it bigger. Critical caveat.)
5. How do I split a PDF that's too large for Canva?
6. What if my PDF has too many pages for Canva?
7. How do I export from Canva at a smaller size? (PDF Standard vs PDF Print)

## Key research findings

- Canva converts PDF pages to images on import, so compression that rasterizes is appropriate for image-heavy PDFs
- Image-heavy PDFs: compression drops 913.4 KB to 315.3 KB at Medium (-65.5%) - cite from tool-measurements.md
- Text PDFs: compression makes them bigger (23.5 KB became 1.4 MB, 60x increase) - cite from tool-measurements.md
- Second-pass compression makes files larger (315.3 KB became 598.9 KB) - don't advise double-compressing
- Exporting from Canva as "PDF Standard" (not "PDF Print") reduces size at export time

## Competitor gaps

- Most articles recommend compression without flagging the text-PDF problem
- Few mention the page limit (500) or elements limit (1,400)
- None mention the PDF Standard vs PDF Print tip for Canva exports
- Our angle wins on honesty and specificity with real measurements

## Internal links

- [Compress PDF](/compress-pdf) - toolSlug: compress-pdf
- [Split PDF](/split-pdf) - toolSlug: split-pdf

## External links

- Canva Help Center: upload formats and requirements
- Canva Help Center: import and edit PDFs

## Format

Blog post. Answer-first. ~850 to 950 words. How-to steps for compress + split. Table for "which fix to use." FAQ in frontmatter (5 questions).
