# Brief: pdf too large for blackboard upload

**targetQuery:** pdf too large for blackboard upload
**Secondary keywords:** reduce pdf size blackboard, compress pdf for blackboard, blackboard file size limit, blackboard pdf upload limit
**Search intent:** Informational / problem-solution. Student hit a Blackboard upload wall, needs a fix before the deadline.
**Surface:** Blog post
**Recommended slug:** pdf-too-large-for-blackboard-upload

---

## Questions people actually ask (from PAA / Reddit / university support pages)

1. What is Blackboard's file size limit for PDFs?
2. Why is my PDF so large when I only wrote a few pages?
3. How do I reduce my PDF size for a Blackboard assignment?
4. Does compressing a PDF work for Blackboard submissions?
5. My handwritten notes scan is too big — how do I compress it?
6. Can I split my assignment into multiple files on Blackboard?
7. Why does my PDF get bigger after I try to compress it?
8. What if compression still doesn't get me under the limit?

---

## Competitor gap

Most university IT guides recommend "compress with Acrobat" (paid) or use Mac Preview's Quartz filter (Mac only). None are upfront about the fact that compression makes text PDFs bigger. Our post should lead with that nuance — it's the critical decision point readers are missing.

---

## Key facts (from docs/marketing/tool-measurements.md)

- Image-heavy PDF (6 pages, raster images): 913.4 KB -> 315.3 KB at Medium (-65.5%), 175.6 KB at High (-80.8%)
- Text-only PDF (20 pages): 23.5 KB -> 1.4 MB at Medium (+5861%) — NEVER compress text PDFs
- Mixed document: 35.0 KB -> 171.2 KB at Medium (+389%)
- Second compression pass: 315.3 KB -> 598.9 KB at Medium (nearly doubles)
- Our tool rasterizes pages to JPEG — great for scanned work, harmful for text documents

---

## Blackboard limits (from research)

Limits are institution-set, not global:
- GRCC: 25 MB
- UMBC: 75 MB
- Most institutions (following Blackboard 2024 guidance): 250 MB
- Drake: 256 MB
- Some assignment submissions: up to 2560 MB

---

## Internal link targets

- /compress-pdf (primary — for scanned/image-heavy PDFs)
- /split-pdf (secondary — if splitting is better)
- /extract-pages (tertiary — extracting relevant pages)

---

## Recommended format

Problem-solution blog post, ~900 words. Answer-first intro. H2 sections per question.
FAQ in frontmatter (5-6 items). No separate FAQ body section.

---

## "Get it done" angle

Student has an assignment due. They need under the limit now, not a lesson in PDF theory. Lead with the fix, then explain the caveat (compression hurts text PDFs).
