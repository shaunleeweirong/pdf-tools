# Research Brief: how to share a large pdf file for free

**id:** blog-share-large-pdf
**targetQuery:** how to share a large pdf file for free
**secondaryKeywords:** pdf too large to email, send large pdf file, share pdf without uploading, pdf attachment too big, email large pdf gmail
**searchIntent:** transactional/informational — reader has a PDF that won't attach to email and wants the fastest fix
**surface:** blog
**date:** 2026-08-07

## Real questions people ask (PAA / Reddit / Quora)

1. Why won't my PDF attach to email?
2. What is the email attachment size limit for Gmail and Outlook?
3. How do I compress a PDF to send by email for free?
4. Can I send a PDF through Google Drive for free?
5. How do I share a large PDF without email?
6. What is WeTransfer and is it free for PDFs?
7. How do I split a large PDF into smaller files?
8. Will compressing a PDF ruin the quality?

## Competitor angles + gaps

Most competitor pages (Adobe, TitanFile, pdf.net) recommend compression as the first/only fix without noting that:
- Compression only helps if the PDF contains images or scans
- Text PDFs actually get bigger when compressed with a rasterizing tool (this is our killer differentiator backed by measurements)
- They push upload-based SaaS tools that require accounts; we're in-browser, no sign-up

Our angle: be specific about WHICH method to use depending on what is in the PDF.

## Recommended format

- Blog post (how-to / problem→solution)
- 800 to 1000 words
- Sections: why PDFs hit email limits → compression (with caveat) → cloud share link → WeTransfer → split PDF → FAQ

## Internal link targets

- [Compress PDF](/compress-pdf) — for image-heavy or scanned PDFs
- [Split PDF](/split-pdf) — for breaking up long documents
- [Merge PDF](/merge-pdf) — mention that merging doesn't inflate size if someone has split and wants to recombine

## External sources to cite

- Gmail 25 MB attachment limit: https://support.google.com/mail/answer/6584
- RFC 2045 / Wikipedia on Base64 encoding overhead
- WeTransfer free tier documentation

## Measurements to use (from docs/marketing/tool-measurements.md)

- Compression, photo-deck.pdf at High: 913.4 KB → 175.6 KB (−80.8%)
- Compression, photo-deck.pdf at Medium: 913.4 KB → 315.3 KB (−65.5%)
- Compression, text-report.pdf at Medium: 23.5 KB → 1400.8 KB (+5861%) — MUST WARN about this
- Merging does not inflate: 971.9 KB in → 970.5 KB out
- Email limits: Gmail and Outlook.com both cap at 25 MB; Base64 adds ~33%, so practical ceiling ~18 MB

## Get-it-done angle

Reader has a PDF they need to get to someone right now. They tried emailing it and got bounced. They want the fastest free fix with no sign-up.
