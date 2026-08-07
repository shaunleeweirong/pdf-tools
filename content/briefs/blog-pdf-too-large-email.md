# Research Brief: PDF File Too Large to Send by Email

**targetQuery:** pdf file too large to send by email  
**Secondary keywords:** pdf too big for email, email attachment size limit pdf, compress pdf for email, split pdf for email  
**Intent:** informational  
**Surface:** blog  
**Slug:** pdf-file-too-large-to-send-by-email  

## Search intent

Reader has a PDF they need to email right now. It's bouncing or the attach button is blocked. They want to know why and how to fix it quickly.

## Real questions people ask (PAA / forums)

1. What is the email attachment size limit for Gmail / Outlook?
2. Why is my PDF too large to email?
3. How do I compress a PDF to send by email?
4. Will compressing my PDF always make it smaller?
5. What if compression doesn't help enough?
6. Can I zip a PDF to get around the size limit?
7. What makes a scanned PDF so large?
8. What's the fastest way to fix a PDF that's too big to send?

## Competitor gaps

- Most articles push compression as the universal fix without warning that it makes text PDFs much bigger.
- Few explain Base64 encoding and why the practical ceiling is ~18 MB, not 25 MB.
- None mention that a second compression pass makes files bigger.

## Our angle / gap we beat

- We have measured data: what the compressor actually does to image PDFs vs text PDFs.
- We explicitly tell readers when NOT to compress (text documents), which is unusual and trustworthy.
- We link to concrete tools: Compress PDF, Split PDF, Merge PDF.

## Internal link targets

- /compress-pdf (Compress PDF tool)
- /split-pdf (Split PDF tool)
- /merge-pdf (Merge PDF tool)

## Key measured facts (from docs/marketing/tool-measurements.md)

- Gmail and Outlook.com cap at 25 MB; Base64 adds ~33%, practical ceiling ~18 MB.
- Image deck (913.4 KB): Medium → 315.3 KB (−65.5%); High → 175.6 KB (−80.8%).
- Text report (23.5 KB): Medium → 1,400.8 KB (+5861%). Do NOT compress text PDFs.
- Second pass at Medium: 315.3 KB → 598.9 KB (+90%). Never compress twice.
- Merging: 971.9 KB in → 970.5 KB out. Doesn't inflate.

## Format

Blog post. How-to with numbered fix sections. FAQ in frontmatter.  
Length: 800+ words.
