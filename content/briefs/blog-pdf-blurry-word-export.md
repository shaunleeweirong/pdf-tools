# Research Brief: why is pdf blurry after converting from word free

**targetQuery:** why is pdf blurry after converting from word free
**Secondary keywords:** word to pdf blurry images, word to pdf image quality, pdf blurry text word, fix blurry pdf from word, save as pdf vs print to pdf quality
**Search intent:** informational / troubleshooting
**Surface:** blog post
**Format:** problem-diagnosis + how-to

## Real questions people ask

From PAA / Adobe community / Microsoft Q&A:
- Why do images look blurry in my Word-to-PDF?
- Why does text look blurry after Print to PDF?
- How do I stop Word from compressing images when I export to PDF?
- Is Save As PDF better quality than Print to PDF?
- Should I compress the PDF to make it sharper?
- What DPI/resolution should images be in Word?
- Why is the PDF blurry on screen but fine when printed (or vice versa)?
- Does this happen on Word 365 / new versions too?

## Competitor gaps

Competitor posts (Smallpdf, WildAndFree, doctoprint) all cover the Word settings fix but:
- None clearly explain the two separate compression passes (docx save + PDF export)
- None warn that running a PDF compressor on a text document will make it WORSE
- None link the compression advice to measurable data

Our advantage: we can cite real numbers from tool-measurements.md and explicitly warn when NOT to compress.

## Key facts from tool-measurements.md

- text-report.pdf (20 pages, body text only): 23.5 KB -> 1400.8 KB at Medium compression (+5861%)
- Compressor rasterizes every page to JPEG, so text becomes a photograph of text
- Image-heavy PDFs (photo-deck.pdf) shrink 65.5% at Medium, 80.8% at High
- Do NOT compress a text PDF to fix blurriness: it gets much larger and blurrier

## Structure

1. Answer-first intro: Word compresses images by default, PDF export adds another pass
2. H2: Why Word makes images blurry in PDFs (220 ppi default, two compression passes)
3. H2: Save As PDF vs Print to PDF (vector text preservation)
4. H2: How to fix blurry images in Word before export (step-by-step settings fix)
5. H2: When to use the Optimize For setting (Standard vs Minimum size)
6. H2: Should you compress the PDF afterward? (warning + when it helps)
7. H2: My PDF looks fine on screen but blurry when printed (resolution vs DPI)
8. H2: Why does this happen on new versions of Word too? (default behavior)

## Internal links
- /compress-pdf (Compress PDF tool) - mention with strong caveat for text PDFs
- /merge-pdf (Merge PDF tool) - for combining smaller documents

## Outbound links (credible sources)
- support.google.com/mail/answer/6584 (Gmail 25 MB limit)
- support.microsoft.com Word image compression settings docs
