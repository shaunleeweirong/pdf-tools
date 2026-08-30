# Brief: pdf too large for indeed job application

**ID:** blog-pdf-too-large-indeed  
**targetQuery:** pdf too large for indeed job application  
**Secondary keywords:** indeed resume upload limit, reduce resume pdf size, compress resume pdf, pdf file too large to upload job application  
**Intent:** transactional — reader is mid-application, blocked, wants a fix now  
**Surface:** blog  
**Slug:** pdf-too-large-for-indeed-job-application

## Real questions to answer (from PAA/Reddit/Quora)

1. What is Indeed's file size limit for resume uploads?
2. Why is my resume PDF so large?
3. How do I know if my PDF is text-based or a scanned image?
4. Should I compress my resume PDF? Will it make it blurry?
5. How do I reduce a PDF file size without losing quality?
6. What is the best format for an Indeed resume?
7. Does re-exporting from Word actually shrink the file?
8. Can I split a long resume PDF before uploading?

## Key facts (measured / confirmed)

- Our compressor rasterizes pages to JPEG. A text PDF (23.5 KB) became 1.4 MB after compression — roughly 60x larger. Never recommend compressing a text-based resume.
- Compressing twice inflates the file (315.3 KB → 598.9 KB at Medium). Recommend starting over from original if first pass is insufficient.
- Merging strips interactive form fields (not relevant here but keep in mind for job apps with fillable forms).
- Most sources report Indeed's upload limit at ~5 MB. Official confirmation is hard to nail down; attribute to "widely reported" and link ATS context.
- Text-based resume exported correctly from Word/Google Docs: typically under 200 KB.
- High-res photo or scanned resume: can easily reach 5–20 MB.

## Competitor gaps we beat

- SmallPDF/iLovePDF: generic "compress it!" advice with no warning that text PDFs will get larger.
- Most posts don't explain the text-vs-image distinction.
- Our angle: be honest about when our tool helps and when it doesn't; tell readers to check their file type first. This is the E-E-A-T differentiator.

## Format

- Blog how-to with the "check file type first" as the organizing concept
- Step-by-step list for each fix
- FAQ in frontmatter (not body)
- ~900 to 1100 words

## Internal links

- /compress-pdf — for scanned/image-heavy resumes
- /split-pdf — for long CVs or multi-page portfolios

## External authority links

- Microsoft Word export documentation
- Wikipedia: Applicant tracking system
- Official PDF spec / ISO 32000 not needed here

## The "get it done" angle

Reader is on the Indeed upload page, getting an error. They have a job they want to apply to right now. The post should give them a 60-second diagnosis (text or image?) and then send them down the right path.
