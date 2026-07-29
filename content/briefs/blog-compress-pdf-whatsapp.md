# Research brief: compress pdf for whatsapp

**targetQuery:** compress pdf for whatsapp
**Secondary keywords:** pdf too large for whatsapp, reduce pdf size for whatsapp, send large pdf whatsapp, whatsapp pdf size limit
**Intent:** informational — person wants to send a PDF on WhatsApp; it's either slow, failing, or they just want to be efficient
**Surface:** blog post

## Questions to answer (from PAA / search)

1. What is the PDF file size limit on WhatsApp?
2. Does my PDF need to be compressed before I can send it on WhatsApp?
3. When does compression actually help vs. make things worse?
4. How do I compress a PDF for WhatsApp on iPhone or Android (step by step)?
5. Which compression level should I use?
6. Should I compress the same PDF twice to get it smaller?
7. What if compression still doesn't make the file small enough?

## Key research findings

- WhatsApp raised the document (non-video) attachment limit to 2 GB in 2022/2023. The old 16 MB limit only applies to videos shared via the Gallery. PDFs go as documents, not gallery media.
- Most "PDF too large for WhatsApp" problems are actually slow-download-on-mobile-data problems, not true size rejections.
- The real reason to compress: smaller files load faster on a 4G/5G connection and don't fail mid-transfer on patchy signal.

## Competitor gaps

- Most competitor pages (smallpdf, ilovepdf) don't distinguish between image-heavy and text PDFs. They recommend compression for every PDF, which is wrong.
- Our compress tool rasterizes pages to JPEG. This is excellent for scans and photo decks, terrible for text documents (23.5 KB text PDF grew to 1,400.8 KB — measured).
- No competitor warns against double-compression, which makes files bigger (315.3 KB -> 598.9 KB).
- Our tool is in-browser — files never leave the device. This is a meaningful trust cue, especially for signed contracts and confidential documents being shared on WhatsApp.

## Measured data to use (from docs/marketing/tool-measurements.md)

| Level | Before | After | Change |
|---|---|---|---|
| High | 913.4 KB | 175.6 KB | -80.8% |
| Medium | 913.4 KB | 315.3 KB | -65.5% |
| Low | 913.4 KB | 703.5 KB | -23.0% |
| Text PDF (Medium) | 23.5 KB | 1,400.8 KB | +5,861% |

Double-compression (Medium then Medium): 315.3 KB became 598.9 KB (+90%)

## Internal link targets

- /compress-pdf (primary tool)
- /split-pdf (alternative for large text documents)

## Recommended format

Blog post. Answer-first intro. H2 sections per question above. One how-to numbered list. Compression level table. No body FAQ section (use frontmatter faq). ~900 words.

## Reader's job to be done

Send a specific PDF to someone on WhatsApp right now, without the transfer failing or taking 5 minutes.
