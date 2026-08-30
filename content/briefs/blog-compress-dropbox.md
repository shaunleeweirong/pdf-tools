# Brief: compress pdf for dropbox upload free

**id:** blog-compress-dropbox  
**targetQuery:** compress pdf for dropbox upload free  
**Secondary keywords:** dropbox pdf size limit, reduce pdf size for dropbox, compress pdf dropbox, dropbox storage full pdf  
**Intent:** transactional  
**Surface:** blog  
**Slug:** compress-pdf-for-dropbox-free

## Search intent

Reader is trying to upload a PDF to Dropbox but is hitting storage limits on the free (Basic) plan, or wants to save space and speed up sync. They want a fast, free, no-sign-up solution.

## Real questions to answer

From PAA and research:
1. Why compress a PDF before uploading to Dropbox?
2. Does Dropbox have a file size limit for PDFs?
3. Does Dropbox compress files automatically?
4. What kinds of PDFs compress well (and which don't)?
5. How to compress a PDF for Dropbox step by step
6. Which compression level should I pick?
7. What if compressing makes my PDF bigger, not smaller?
8. Can I compress a PDF twice to make it smaller?

## Key facts

- Dropbox Basic (free) = 2 GB total storage, the lowest among major providers (Google Drive: 15 GB, OneDrive: 5 GB)
- Dropbox upload limit: 350 GB per file on web, 2 TB via desktop app; storage quota is the real constraint
- Dropbox does NOT compress files; stores them exactly as uploaded
- Our compressor rasterizes pages to JPEG:
  - Image-heavy (photo-deck.pdf, 913.4 KB): Medium → 315.3 KB (-65.5%), High → 175.6 KB (-80.8%)
  - Text-only (text-report.pdf, 23.5 KB): Medium → 1.4 MB (+5861%) — DO NOT COMPRESS TEXT PDFs
  - Second pass at same level: 315.3 KB → 598.9 KB (+90%) — never compress twice

## Competitor gaps

Competitor pages push compression for all PDFs without warning users about text-only PDFs getting bigger. Our angle: honest advice (text PDFs get bigger; tell readers when to use Split PDF or zip instead), plus privacy cue (in-browser, file never leaves device).

## Format

Blog post, ~850-1000 words. Answer-first intro, then H2 sections. FAQ in frontmatter only.

## Internal links

- /compress-pdf (primary tool)
- /split-pdf (alternative for text-only PDFs)

## Outbound links (high-authority)

- https://www.dropbox.com/basic (Dropbox Basic plan page)
- https://help.dropbox.com/sync/upload-limitations (Dropbox upload limits official help)
- https://help.dropbox.com/storage-space/over-quota (Dropbox over-quota explanation)
