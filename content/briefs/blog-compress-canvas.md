# Brief: compress pdf for canvas lms upload free

**targetQuery:** compress pdf for canvas lms upload free
**Secondary keywords:** canvas lms pdf size limit, reduce pdf size canvas, canvas file upload limit pdf, pdf too large for canvas submission
**Search intent:** transactional — student or teacher trying to get a PDF under a Canvas assignment limit right now
**Surface:** blog post

## The questions to answer (PAA / community / Reddit)

1. What is the Canvas file size limit for PDF uploads?
2. Why is my PDF too large to upload to Canvas?
3. How do I compress a PDF for Canvas LMS (step-by-step)?
4. Why does compression make my PDF bigger instead of smaller?
5. What if my PDF is still too large after compressing?
6. Does compressing hurt readability for the professor/grader?
7. What about scanned assignment packets — how much can those be reduced?

## Key findings from research

- Canvas default per-file limit: 500 MB (rarely the issue)
- Turnitin-linked assignments: 20 MB hard cap, 400 page max (very common pain point)
- Instructor-set limits vary: 8 MB, 10 MB common in assignment instructions
- Course storage: 1.5 to 2 GB total per course
- Most students hit limits with scanned lab reports, photographed assignments, design portfolios

## Critical constraint from tool measurements (MUST communicate)

- Our compressor rasterizes every page to JPEG
- Image-heavy PDFs: 913.4 KB → 315.3 KB at Medium (−65.5%) — great result
- Image-heavy PDFs: 913.4 KB → 175.6 KB at High (−80.8%)
- Text-only report: 23.5 KB → 1.4 MB at Medium (+5,861%) — makes it ~60x bigger
- Never compress a text PDF with this tool
- Never compress twice (315.3 KB → 598.9 KB on second Medium pass)

## Competitor gaps

- Most guides don't warn about the text-PDF problem clearly
- Most guides recommend compressing everything, which is wrong advice for typed essays
- Our editorial stance (tell people when NOT to use a tool) is a differentiator

## Recommended format

Blog post, ~900 words. Lead with the conditional: works for image PDFs, hurts text PDFs. How-to list for image PDFs. Alternative paths for text PDFs. Internal links to compress-pdf, possibly merge-pdf.

## Internal links

- /compress-pdf (primary)
- /merge-pdf (for context on splitting)

## Outbound links (credible sources)

- Yale Canvas file storage quotas: https://help.canvas.yale.edu/a/914638-file-storage-quotas-in-canvas
- Wikipedia on rasterization or PDF format for the technical explanation
- Turnitin file requirements page if accessible
