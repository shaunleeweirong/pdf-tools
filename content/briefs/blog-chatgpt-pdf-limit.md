# Brief: what is the maximum pdf size chatgpt can read

**targetQuery:** what is the maximum pdf size chatgpt can read
**Secondary keywords:** chatgpt pdf limit, chatgpt pdf file size, upload pdf to chatgpt, chatgpt pdf too large
**Search intent:** informational (people hitting upload errors or doing due diligence before uploading a large PDF)
**Surface:** blog

## Real questions from PAA / search

- What is the maximum PDF size ChatGPT can accept?
- Why does ChatGPT reject my PDF even though it is under 512 MB?
- Does compressing a PDF help with ChatGPT uploads?
- How does ChatGPT compare to Claude and Gemini on PDF limits?
- Do free vs Plus users have different file limits?
- Why does ChatGPT truncate my document without warning?

## Key research findings

- Hard limit: 512 MB per file. ChatGPT rejects above this.
- Token cap: 2 million tokens per text/document file. This is the practical ceiling for most users.
- Practical sweet spot: under 10 MB for reliable, fast uploads.
- ChatGPT Free: ~3 uploads per day. Plus: 80 per 3 hrs, 10 per message, up to 20 per message on web (Feb 2026).
- Claude: 500 MB web / 32 MB API / 100 pages visual analysis.
- Gemini: 100 MB per file, 10 per prompt.
- Scanned PDFs (image-heavy) are the ones that usually hit size limits.
- Text-only PDFs usually hit the token limit, not the file size limit.

## Competitor gaps

Competitors cover the 512 MB limit but do not explain the token cap clearly, and none warn that compressing a text PDF can make it bigger. Our honest disclaimer about compression is a differentiator.

## Our tool angle

- Compress PDF: use for image-heavy/scanned PDFs. Measured: 913.4 KB image deck -> 175.6 KB at High (-80.8%). DO NOT recommend for text PDFs (23.5 KB text report -> 1.4 MB after compression in testing).
- Split PDF: better option for text-heavy documents that exceed the token cap.

## Internal links

- /compress-pdf
- /split-pdf

## External links

- https://support.claude.com/en/articles/8241126-upload-files-to-claude (Claude help center - official)
- https://en.wikipedia.org/wiki/PDF (Wikipedia - PDF format)

## Recommended format

Blog post, ~900 words. Answer-first intro. H2s per question. Comparison table for AI tools. Warning box about compression making text PDFs bigger.
