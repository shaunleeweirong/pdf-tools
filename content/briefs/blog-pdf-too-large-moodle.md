# Brief: pdf too large for moodle upload

**targetQuery:** pdf too large for moodle upload
**Secondary keywords:** compress pdf for moodle, moodle file size limit, reduce pdf size moodle, moodle assignment upload limit, moodle pdf error
**Intent:** informational (student submitting assignment, hit upload error)
**Surface:** blog
**ID:** blog-pdf-too-large-moodle

## Search intent

A student (or occasionally an instructor) tried to upload a PDF to Moodle (assignment submission, file resource, quiz attachment) and got a "file too large" error. They want to either shrink the PDF or understand why the limit is so low and what to do about it.

## Real questions from PAA / research

1. What is Moodle's file size limit for PDFs?
2. Why is my Moodle upload limit so low (1 MB on MoodleCloud)?
3. How do I compress a PDF for Moodle without Adobe?
4. Will compressing my PDF make it worse quality?
5. Can I split my assignment into multiple files on Moodle?
6. How do I ask my instructor/admin to raise the Moodle upload limit?
7. Why does my PDF get bigger after I compress it?

## Key facts from research

- Moodle has layered file size limits: PHP server level (upload_max_filesize, post_max_size) -> site admin level -> course level -> activity/assignment level. The effective cap is the lowest value across all four layers.
- MoodleCloud default: 1 MB site-wide upload limit (overrides everything). Admins can raise it to 250 MB.
- Self-hosted Moodle: PHP default often 8 MB or 2 MB depending on distro; Moodle site default varies; institutions commonly set 10 MB to 100 MB.
- Common institutional advice: aim to keep files under 10 MB for optimal upload performance; most institutions cap at 100 MB.
- Students can't change admin settings themselves - they need to contact admin or instructor.
- Instructors can change the limit at the activity level (up to the site and PHP max).

## Competitor gaps

Most pages either: (a) explain admin settings only (not useful for students), or (b) give generic "compress your PDF" advice without distinguishing image-based vs text-based PDFs. The gap we fill: explaining that compression works for scanned/image PDFs but makes text PDFs dramatically larger, with real numbers. Also: Moodle-specific layered limit explanation for students.

## Recommended format

Blog post, informational, approx 900 words. Audience: students. Avoid admin instructions unless briefly noted. Lead with the student fix.

## Internal links

- [Compress PDF tool](/compress-pdf) - main recommendation for image-heavy PDFs
- [Split PDF tool](/split-pdf) - for splitting multi-page submissions
- [Extract Pages tool](/extract-pages) - for pulling out just the pages you need

## External links to use

- Reference to Moodle's official documentation on file upload size (cite by URL: docs.moodle.org)
- Wikipedia: JPEG (explaining rasterization)

## E-E-A-T notes

- Use measured numbers from tool-measurements.md only
- Do NOT recommend compression for text-based PDFs (they get much larger)
- Mention the two-pass trap: compressing twice increases file size
