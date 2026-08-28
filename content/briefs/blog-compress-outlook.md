# Research brief: compress-pdf-for-outlook-email-free

**targetQuery:** how to compress pdf for outlook email free  
**Secondary keywords:** compress pdf outlook, reduce pdf size for outlook, pdf too large for outlook, outlook attachment size limit  
**Intent:** transactional (user has a PDF that's too large and needs to send it right now)  
**Surface:** blog  
**ID:** blog-compress-outlook  
**Slug:** compress-pdf-for-outlook-email-free

## The real questions people ask

From PAA, search autocomplete, and Adobe Community forums:

1. What is Outlook's attachment size limit?
2. Why is my PDF too large to send in Outlook?
3. How do I make a PDF smaller for Outlook without losing quality?
4. Does compressing a PDF change how it looks?
5. What do I do if the PDF is still too large after compression?
6. Can I compress a PDF twice to get it smaller?
7. Should I send a link instead of attaching the PDF?

## Outlook size limits (sourced from search results / Microsoft Q&A)

- Outlook desktop (internet accounts: POP3, IMAP): 20 MB default
- Outlook.com: 34 MB
- Exchange Server / corporate: often 10 MB, set by IT admin
- Exchange Online (Microsoft 365): up to 150 MB, but recipient's server also applies
- Effective limit is the lower of sender and recipient — aim for under 10 MB for safety when sending to unknown recipients

## What we know from tool-measurements.md

- Image-heavy PDF (photo-deck.pdf, 913.4 KB): Medium → 315.3 KB (-65.5%), High → 175.6 KB (-80.8%)
- Text-only PDF (text-report.pdf, 23.5 KB): Medium → 1.4 MB (+5861%) — NEVER recommend compression for text PDFs
- Compressing twice: 315.3 KB → 598.9 KB (+90%) at same level — NEVER recommend second pass
- Merging doesn't inflate (971.9 KB in → 970.5 KB out)

## Competitor gaps

Smallpdf and PDF Candy pages on this topic:
- Recommend compression universally without warning that text PDFs get bigger
- Don't mention the "can you select text?" test for identifying PDF type
- Don't cover the "split and send separately" alternative
- Don't explain the two-pass problem

Our angle: honest about when compression fails, practical alternatives when it does.

## Format

- Blog how-to
- 800-900 words
- Answer-first intro (target keyword in first sentence)
- H2 sections: Outlook limits, text vs. image PDF warning, step-by-step, alternatives, quality question
- FAQ in frontmatter (5 entries)
- Internal links: /compress-pdf (primary), /split-pdf (alternative)
- Outbound links: Microsoft Support page for Outlook attachment limits (1 link)
