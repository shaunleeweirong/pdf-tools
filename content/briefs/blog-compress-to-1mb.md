# Brief: compress pdf to 1mb free

**targetQuery:** compress pdf to 1mb free
**Secondary keywords:** reduce pdf size to 1mb, pdf too large to upload 1mb, shrink pdf to 1mb, pdf under 1mb for email, compress pdf for portal upload
**Intent:** transactional / informational (person is blocked by an upload or email limit right now)
**Surface:** blog
**Topic ID:** blog-compress-to-1mb

## Why this exists / the reader's task

A user has a PDF they need to attach to a job application portal, submit to a government or visa form, or send via email, and they've hit a 1MB ceiling. They want to clear it today, ideally without installing anything or creating an account.

## Real questions to answer (PAA / Quora / Reddit)

1. How can I compress a PDF to 1MB for free, no sign-up?
2. Why does the upload portal only allow 1MB? (job portals, govt forms, visa submissions)
3. Will compression work for my PDF, or will it make it bigger?
4. How do I tell if my PDF is a scan/image or a text document?
5. At what starting file size can compression realistically reach 1MB?
6. Does compressing twice make the file smaller?
7. What if my file is still over 1MB after compression?
8. Is it safe to put a sensitive document (passport, payslip) through an online tool?

## Competitor angles and gaps

- Most competitors (Smallpdf, Adobe) say "just upload and compress." They don't warn you that compression blows up text PDFs.
- None cite real before/after numbers from actual tests.
- Gap we win: honest about when compression works vs. doesn't; real measured numbers; fully in-browser with no file upload.

## Recommended format

Blog how-to, ~850-1000 words. Lead with the direct answer + the key caveat (scan vs. text). One how-to list. Real measurement table from tool-measurements.md. FAQ in frontmatter.

## Internal links

- /compress-pdf (primary tool)
- /split-pdf (when compression alone isn't enough)

## External links (1-3)

- Wikipedia: rasterisation (for the technical explanation of why text bloats)
- Wikipedia: dots per inch (DPI, when discussing scan resolution)

## Key facts from tool-measurements.md (never invent numbers)

- photo-deck.pdf (913.4 KB, 6 image pages): High -> 175.6 KB (-80.8%), Medium -> 315.3 KB (-65.5%), Low -> 703.5 KB (-23.0%)
- text-report.pdf (23.5 KB): Medium -> 1400.8 KB (+5861%) — DO NOT compress text PDFs
- Second pass at same level: 315.3 KB -> 598.9 KB (+90%) — never compress twice
- Protect/unlock: +1KB overhead, no practical effect on file size limits

## What file sizes realistically reach 1MB with this tool

- High compression (-80.8%): files under ~5.2 MB can land under 1MB
- Medium compression (-65.5%): files under ~2.9 MB can land under 1MB
- Low compression (-23.0%): files under ~1.3 MB can land under 1MB

(These are calculated from measured ratios on an image-heavy PDF — only valid for image-heavy PDFs, not text docs.)

## Draft guidance

- Scan vs text check is the most important thing to tell the reader first (after the answer sentence).
- Be explicit that the tool rasterizes, and why that helps images but destroys text.
- Give realistic expectations: "if your file is image-heavy and under about 5MB, High compression will likely get you there."
- Alternatives when compression isn't enough: split out only the pages you need, scan at lower DPI from the start.
- Do not recommend compressing twice. Explain why.
- Privacy is a trust cue, not the headline: mention once where it matters (sensitive docs).
