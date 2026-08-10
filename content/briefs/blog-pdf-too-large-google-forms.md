# Research brief: pdf too large for google forms upload

**targetQuery:** pdf too large for google forms upload
**Secondary keywords:** google forms file size limit pdf, compress pdf for google forms, pdf too big for google forms, reduce pdf size google forms
**Search intent:** informational/transactional — person is mid-task, hitting an error, wants a fix fast
**Surface:** blog
**Recommended slug:** pdf-too-large-for-google-forms
**Length:** 850 to 950 words

## What people actually ask (PAA / Reddit / community)

- What is the file size limit for Google Forms uploads?
- Why is my PDF too large for Google Forms?
- How do I compress a PDF to upload to Google Forms?
- Can I split a PDF to upload it in parts to Google Forms?
- Why does Google Forms say file too large even for a small PDF?
- How do I increase the file upload limit in Google Forms?
- Will compressing my PDF work for Google Forms?

## Key facts

- Google Forms lets the form creator set max file size: 1 MB, 10 MB, 100 MB, 1 GB, or 10 GB per file (source: Google Forms settings UI, confirmed in multiple support threads)
- The default is often 1 MB, which a scanned document can easily exceed
- Files go into the form owner's Google Drive; the limit is set in the question settings
- Uploading respondent must be signed into a Google account

## Competitor gaps

Competitors cover: "compress your PDF with X tool" but miss the crucial warning:
- Compressing a TEXT-based PDF with a rasterizing tool makes it much larger (our measurement: 23.5 KB text report → 1.4 MB after compression)
- This is the most common "fix" that makes things worse
- We can be the post that actually explains WHEN compression helps and WHEN it doesn't

## What our measurements say (source: docs/marketing/tool-measurements.md)

- Image-heavy PDF at Medium compression: 913.4 KB → 315.3 KB (-65.5%)
- Image-heavy PDF at High compression: 913.4 KB → 175.6 KB (-80.8%)
- Text PDF at Medium: 23.5 KB → 1,400.8 KB (+5861%) — DO NOT recommend for text PDFs
- Second compression pass at Medium: 315.3 KB → 598.9 KB (+90%) — never do two passes

## Our tools to link

- /compress-pdf (main solution for image-heavy PDFs)
- /split-pdf (solution for text PDFs or when compression isn't enough)

## External credible links

- Google Workspace Forms product page
- WebAssembly.org (for the "runs in your browser" trust claim)

## Structure

1. Answer-first intro: diagnose the type, point to the right tool
2. H2: What is the file size limit in Google Forms?
3. H2: Why your PDF might be larger than you expect
4. H2: The fastest fix for image-heavy and scanned PDFs: compress it
5. H2: Do not compress text-based PDFs (and what to do instead)
6. H2: If the form creator set a very low limit
7. H2: A note on privacy
8. FAQ in frontmatter (not a body section)

## Gap vs competitors

Competitors all say "compress your PDF." None explain that compressing a text PDF makes it worse. Our post leads with the type-check, then gives the right tool for each type. This is the useful differentiation.
