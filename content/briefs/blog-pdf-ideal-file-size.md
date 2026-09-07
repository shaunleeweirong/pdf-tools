# Brief: What Is a Good PDF File Size for Sharing?

**targetQuery:** what is a good pdf file size for sharing
**secondary keywords:** pdf file size for email, pdf size limit, pdf too large, compress pdf for sharing
**intent:** informational
**id:** blog-pdf-ideal-file-size
**priority:** 2

## Search intent

The reader has a PDF and wants to know: is this size OK to send, or do I need to do something about it? They may be preparing to email it, upload it to a job portal, submit it to a school platform, or share it via cloud. They want a concrete answer per destination, not vague advice.

## Real questions people ask (from PAA / Reddit)

- What is the maximum PDF file size for email?
- Is 10 MB too large to email?
- Is 5 MB a big file for email?
- What PDF size do job portals accept?
- What size should a resume PDF be?
- Why is my scanned PDF so big?
- Does compression reduce PDF quality?
- When should I not compress a PDF?
- What happens if a PDF is too large to attach?

## Key facts to use (from tool-measurements.md)

- text-report.pdf: 20 pages of text = 23.5 KB (vector text is tiny)
- photo-deck.pdf: 6-page image deck = 913.4 KB
- Compress at Medium: 913.4 KB → 315.3 KB (-65.5%)
- Compress at High: 913.4 KB → 175.6 KB (-80.8%)
- Compress text PDF at Medium: 23.5 KB → 1400.8 KB (+5861%) - NEVER do this
- Second compression pass: 315.3 KB → 598.9 KB (+90%) - NEVER chain passes
- Gmail/Outlook.com both cap at 25 MB; Base64 adds ~33%, practical ceiling ~18 MB

## Competitor gaps

Most posts on this topic give vague advice ("keep it under 10 MB") without explaining WHY text PDFs should NOT be compressed or providing actual measured ratios. Our measured data and clear "it depends on content type" framing is the differentiation.

## Format

Blog post. H2 per question. One table for "use case → target size" quick reference. How-to section for reducing oversized PDFs. No body FAQ section (use faq frontmatter).

## Internal links

- [Compress PDF](/compress-pdf) - first mention
- [Split PDF](/split-pdf) - for text PDFs too large for email

## External links (1-3)

- Gmail attachment limit: https://support.google.com/mail/answer/6584
- (Optional) Wikipedia Base64 article for the encoding overhead note

## Recommended length

850 to 1100 words. Concise table format for the quick-reference guide.
