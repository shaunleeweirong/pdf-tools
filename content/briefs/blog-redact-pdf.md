# Research Brief: How to Redact Text in a PDF Free

**targetQuery:** how to redact text in a pdf free
**Secondary keywords:** redact pdf free, black out text in pdf, remove sensitive information from pdf, pdf redaction no adobe
**Intent:** informational (people want to know both how to do it AND which method is actually safe)
**Surface:** blog
**Topic ID:** blog-redact-pdf

## Real questions people ask (PAA / Reddit / Quora mining)

1. Is a black box over text permanent redaction?
2. Can people see through redacted black boxes in a PDF?
3. How do I permanently remove text from a PDF for free?
4. Can I redact a PDF without uploading it to any server?
5. What is the difference between visual and true PDF redaction?
6. Does flattening a PDF make redactions permanent?
7. Do I need Adobe Acrobat to redact a PDF?
8. How do I redact a PDF on Mac / Windows / iPhone for free?

## Key insight from research

High-profile failures (e.g. court documents, government filings) have happened because people drew black boxes over text in PDFs and the text could be copied straight out. This is a widespread misconception. The distinction between visual/cosmetic redaction and true redaction is the most valuable thing this post can teach.

## Competitor gaps

- Most tools say "upload here and redact" without explaining the visual vs true distinction
- Few explain WHY a black box fails (PDF content streams, separate text layer)
- Almost none offer the rasterization workaround as a free permanent approach

## Our angle (the gap we fill)

- Explain the visual vs true distinction clearly (most competitors skip this)
- Offer the edit-pdf tool for cosmetic black boxes (quick, in-browser)
- Offer the rasterization method (pdf-to-jpg + image editor + jpg-to-pdf) as a free permanent alternative
- Be honest: for legally/medically sensitive documents, neither a simple black box nor our tools replace certified redaction software with audit trails

## Internal link targets
- /edit-pdf (draw black boxes)
- /pdf-to-jpg (rasterization step 1)
- /jpg-to-pdf (rasterization step 3)
- /flatten-pdf (explain what flattening does NOT do)

## Outbound link targets
- https://pdfa.org/resource/iso-32000-2/ (PDF specification, explains content layer)
- https://en.wikipedia.org/wiki/JPEG (explains pixel-only storage, no text layer)
- https://www.hhs.gov/hipaa/for-professionals/privacy/index.html (HIPAA reference for medical docs)

## Format
Blog how-to, ~850 words body. Explain the problem, then give two methods. Include a comparison table. FAQ in frontmatter.

## Facts from tool-measurements.md I can use
- edit-pdf runs "in your browser" (from lib/tools.ts description)
- The compressor rasterizes pages to JPEG (can use this to explain WHY rasterization destroys text)
- No direct measurements for pdf-to-jpg or jpg-to-pdf; facts about JPEG format are standard knowledge
