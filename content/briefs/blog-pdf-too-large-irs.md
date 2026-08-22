# Brief: pdf file too large for irs submission

**targetQuery:** pdf file too large for irs submission
**Secondary keywords:** irs pdf file size limit, reduce pdf size irs, split pdf irs submission, irs document upload tool file size, compress pdf for irs
**Intent:** Informational / transactional
**Surface:** Blog
**Slug:** pdf-too-large-for-irs
**Priority:** 2

## The real questions to answer

From PAA, search autocomplete, and forum discussions:

1. What is the IRS file size limit for PDF uploads?
2. Why is my scanned tax document so large?
3. How do I shrink a PDF for the IRS Document Upload Tool?
4. Can I compress a PDF form for IRS submission?
5. Should I split my PDF into multiple files for IRS?
6. What about file size limits in TurboTax / H&R Block / tax software?
7. Are there scanning tips to keep IRS documents small?

## Key facts (verified)

- IRS Document Upload Tool: 15 MB per file, max 120 pages per PDF, up to 40 files
- MeF (Modernized e-File) business returns: 60 MB per individual PDF, 1 GB total attachment limit
- Accepted formats: JPEG, PNG, PDF

## Our tool angle (critical nuance from measurements)

- **DO NOT recommend compression for IRS forms (text PDFs).** Our compressor rasterizes pages to JPEG. A 23.5 KB text report became 1.4 MB after compression. IRS forms are text-based: compressing them makes them bigger.
- **DO recommend compression for scanned image-heavy documents** (e.g., a scan of receipts). An image deck measured 913.4 KB and shrank to 315.3 KB at Medium (65.5% reduction).
- **Split PDF is the right answer for most IRS submissions.** It works for both text and scanned docs without quality degradation. A document over 15 MB can be split into parts, each uploaded separately.
- Privacy angle matters here: sensitive tax documents should not go to a random cloud service. Both our tools run entirely in-browser.

## Competitor gaps

- Most posts recommend compression for all PDFs, without distinguishing text vs. image content.
- Our post should be the honest one: tell the reader when compression will make things worse, and direct them to split instead.
- Few posts mention the IRS Document Upload Tool's 40-file / 120-page-per-PDF specifics.

## Recommended structure

- Answer-first intro: state the IRS limit in the first sentence, give the fix immediately
- H2: What are the IRS file size limits? (15 MB DUT, 60 MB MeF)
- H2: Two fixes, and how to pick the right one (split vs. compress)
- H2: When to compress (scanned/image-heavy PDFs only)
- H2: When to split instead (text forms, contracts, any non-image PDF)
- H2: How to split a PDF for IRS submission (how-to steps)
- H2: Scanning tips to stay under the limit next time
- FAQ in frontmatter (no body FAQ section)

## Internal links

- /compress-pdf (for scanned docs)
- /split-pdf (primary recommendation)

## Outbound authority links

- IRS Document Upload Tool: irs.gov/help/irs-document-upload-tool
- IRS MeF attachment guidance: irs.gov/e-file-providers/...
- Wikipedia or IRS.gov on PDF format

## Get-it-done angle

Reader is trying to upload supporting documents to the IRS right now and hitting an error. They need a fast, free solution that doesn't require installing software or giving a tax document to an unknown cloud service.
