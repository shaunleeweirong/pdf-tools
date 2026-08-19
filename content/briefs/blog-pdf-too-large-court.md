# Brief: pdf too large for court submission

**targetQuery**: pdf too large for court submission
**Secondary keywords**: court e-filing pdf size limit, cm/ecf file size limit, pacer pdf size limit, reduce pdf size for court filing
**Intent**: informational (problem/diagnostic)
**Surface**: blog

## Real questions people ask

- What is the file size limit for court e-filing?
- Why is my scanned exhibit so large?
- How do I compress a PDF for court filing?
- Can I split a PDF for court submission?
- Does page size (8.5x11) vs file size matter?

## Key facts

- Federal courts (CM/ECF/PACER): limits vary from 3 MB to 200 MB per court; most fall 25-50 MB
- State courts: typically 25-35 MB (Odyssey File and Serve)
- Two limits apply: per-document AND per-envelope (entire transaction)
- Scanning at 300 DPI color = ~2-3 MB/page; a 30-page appendix = 60-90 MB
- Scanning at 200 DPI black and white cuts size 80-90%

## Tool measurements (from docs/marketing/tool-measurements.md)

- Compress, image deck (6 pages): 913.4 KB → 315.3 KB Medium (-65.5%), → 175.6 KB High (-80.8%)
- Compress, text report (20 pages): 23.5 KB → 1.4 MB (+5861%) — NEVER compress text PDFs
- Compress twice: 315.3 KB → 598.9 KB Medium second pass (+90%) — never chain passes
- Merge: 971.9 KB in → 970.5 KB out (no inflation)

## Our tools to link

- /compress-pdf (scanned exhibits and image-heavy PDFs only)
- /split-pdf (text briefs, exhibits that exceed limit)
- /merge-pdf (if splitting and re-merging later)

## Competitor gap

Most competitor posts recommend compressing without warning that text PDFs get larger. Our post should clearly separate "scanned/image PDFs" from "text/word-processor PDFs" and give the right fix for each.

## Format

Blog how-to/diagnostic, ~900-1000 words. H2 sections: why the limit exists, what the limit is, causes, Fix 1 (compress scans), Fix 2 (don't compress text), Fix 3 (split), Fix 4 (re-scan). FAQ in frontmatter.
