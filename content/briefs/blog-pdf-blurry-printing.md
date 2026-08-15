# Brief: why does my pdf look blurry when printed

**targetQuery:** why does my pdf look blurry when printed  
**secondaryKeywords:** pdf blurry when printed, fix blurry pdf, pdf print quality, blurry text pdf print  
**intent:** informational  
**surface:** blog  
**slug:** why-does-my-pdf-look-blurry-when-printed  

## Search intent

Reader has a PDF that looks sharp on screen but prints fuzzy, pixelated, or blurry. They want a diagnosis (why?) and a fix (what do I do?). The query is usually post-event: they already compressed or scanned the file and noticed the degradation on paper.

## Real questions (PAA / Adobe community / search)

1. Why does my PDF look blurry when printed but fine on screen?
2. Does compressing a PDF make it print blurry?
3. My PDF text is pixelated when printed — what happened?
4. How do I fix a blurry-when-printed PDF?
5. What DPI should a PDF be for printing?
6. Why does my scanned PDF look blurry?
7. Does the "Print as Image" setting affect quality?

## Competitor angles and gaps

- Most posts (minitool, filero, creatorformat) list resolution and scanning as causes but say little or nothing about rasterizing compression tools.
- None have first-hand measured data. They recommend "avoid aggressive compression" without explaining the mechanism (rasterization).
- Our angle: we have measured data from running our own compressor on a text PDF. The finding is concrete and surprising: a 23.5 KB text report grew to 1.4 MB after medium compression. That's because the tool rasterizes every page to JPEG, turning vector text into a photograph of text. When printed, that photograph of text can look blurry.
- We can be uniquely honest: tell readers exactly when NOT to compress, and give the alternative (split-pdf or zip).

## Facts traced to tool-measurements.md

- Our compressor rasterizes every page to JPEG (stated in measurements and on the tool page).
- text-report.pdf: 23.5 KB → 1.4 MB at Medium (a 60x increase, not a reduction).
- photo-deck.pdf: 913.4 KB → 315.3 KB at Medium (65.5% reduction).
- Compressing twice: 315.3 KB → 598.9 KB at Medium (nearly doubles, do not do it).
- Merging does not change file size meaningfully (971.9 KB → 970.5 KB).

## Recommended format

Blog post, ~900 words. Cause-by-cause structure. A short how-to list at the end. FAQ in frontmatter.

## Internal links

- /compress-pdf (mention it and explain when it helps vs. when to avoid it)
- /split-pdf (alternative for text PDFs that are too large)

## External links (1–3)

- PDF standard and rasterization: Wikipedia on PDF or ISO 32000
- Print resolution: some authority on 300 DPI standard for print
- JPEG compression artifact explanation: Wikipedia on JPEG or a standards body page
