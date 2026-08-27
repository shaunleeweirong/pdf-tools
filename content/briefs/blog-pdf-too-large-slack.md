# Brief: pdf too large for slack attachment

**ID:** blog-pdf-too-large-slack  
**Target query:** pdf too large for slack attachment  
**Secondary keywords:** slack pdf file size limit, compress pdf for slack, pdf too big for slack, slack upload pdf limit  
**Search intent:** informational / problem-solution  
**Surface:** blog  
**Slug:** pdf-too-large-for-slack

## Real questions people ask (from PAA / Reddit / search)

1. What is the file size limit for Slack attachments?
2. Why won't my PDF upload to Slack?
3. How do I compress a PDF for Slack?
4. Should I compress or split my PDF for Slack?
5. How do I share a large PDF in Slack without uploading it?
6. My PDF is under 1 GB but Slack still won't let me upload it — why?
7. Will compressing my PDF make it small enough for Slack?

## Key facts

- Slack allows up to 1 GB per file on all plans (Free, Pro, Business+, Enterprise Grid)
- Free workspaces share 5 GB total storage — when full, uploads fail regardless of file size
- The real "too large" problem for most users is the workspace storage cap, not a per-file limit
- Compression works great for image-heavy/scanned PDFs; makes text PDFs dramatically larger
- Measurements (tool-measurements.md): 913.4 KB image deck → 315.3 KB at Medium (−65.5%), → 175.6 KB at High (−80.8%)
- Text report: 23.5 KB → 1.4 MB at Medium compression (+5861%)
- Second compression pass at same level: 315.3 KB → 598.9 KB (+90%) — never chain passes

## Competitor gap

Most posts about "PDF too large for Slack" just say "compress it" without explaining that this destroys text PDFs. Our E-E-A-T edge: we distinguish image vs text PDFs with real measurements, and we tell readers when NOT to compress.

## Format

- Blog post, ~850 words
- Answer-first intro with keyword in first sentence
- H2 sections for: Slack size limits, why PDFs get large, how to compress (image PDFs), don't compress text PDFs, split instead, share via cloud link, storage cap issue, privacy note
- FAQ in frontmatter (5 entries)

## Internal links

- [Compress PDF](/compress-pdf) — main tool, mentioned first
- [Split PDF](/split-pdf) — alternative for text PDFs

## Outbound links (high authority)

- Slack help article (official): for file size limit claim
- Wikipedia vector graphics: for explanation of why text PDFs are compact
