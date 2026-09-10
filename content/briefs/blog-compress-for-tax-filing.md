# Brief: compress pdf for tax filing free

**targetQuery:** compress pdf for tax filing free
**Intent:** transactional
**Priority:** 2
**Surface:** blog
**Status:** briefed

## Search intent

Someone is trying to upload a PDF to an IRS portal, tax software (TaxAct, TurboTax), or a state tax site and getting a "file too large" error. They want a quick fix.

## Key questions to answer

1. What are the IRS and common tax software file size limits?
2. Does compression actually help with tax PDFs?
3. What types of tax PDFs benefit from compression vs. hurt by it?
4. What should you do for digital returns (W-2s, 1099s) that are "large"?
5. How do you tell if your PDF is scanned vs. digital?
6. Step-by-step: how to compress a scanned tax PDF

## Key research findings

- IRS Document Upload Tool: 15 MB per file, up to 40 files, PDFs max 120 pages
- TaxAct caps PDF attachments around 5 MB
- Scanned receipts/supporting docs are image PDFs -- compression helps significantly
- Digital returns, W-2s, 1099s are text-only -- our compressor will make them 60x bigger
- tool-measurements.md: photo-deck 913.4 KB -> 315.3 KB at Medium (-65.5%), 175.6 KB at High (-80.8%)
- tool-measurements.md: text-report 23.5 KB -> 1,400.8 KB at Medium (+5861%!)
- Never chain compression passes: Medium output re-compressed becomes 598.9 KB (+90%)

## The editorial angle

Unlike most "compress tax PDF" articles, we'll honestly tell readers WHEN NOT TO COMPRESS. That honesty earns trust and matches the measured facts. For text-heavy returns, split or delete pages instead.

## Internal links

- [Compress PDF tool](/compress-pdf) -- for scanned/image-heavy tax documents
- [Split PDF](/split-pdf) -- to extract only needed pages from large digital returns
- [Merge PDF](/merge-pdf) -- to combine multiple tax attachments into one

## Outbound links (high-authority)

- https://www.irs.gov/payments/irs-document-upload-tool -- IRS official portal guidance
- TaxAct support for reducing PDF size

## Format

Blog post, >= 800 words. Answer-first intro. Sections: IRS limits, when to compress, when NOT to, how to tell scanned vs digital, step-by-step.
