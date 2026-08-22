# Brief: pdf too large for sharepoint upload

**targetQuery:** pdf too large for sharepoint upload  
**Secondary keywords:** sharepoint file size limit, compress pdf for sharepoint, sharepoint pdf upload error, pdf too large sharepoint fix  
**Intent:** informational / problem-solving  
**Surface:** blog  
**Slug:** pdf-too-large-for-sharepoint-upload

## Real questions people ask

- Why is my PDF too large for SharePoint?
- What is the SharePoint file size limit?
- How do I fix the PDF too large error in SharePoint?
- How to compress a PDF for SharePoint upload?
- What if my PDF is too large even after compression?
- Does SharePoint have a 50 MB file size limit?
- Why does SharePoint say file exceeds the limit?

## What we know (from research)

- SharePoint Online (Microsoft 365 cloud): 250 GB per file - rarely the issue for normal PDFs
- SharePoint Server (on-premises): defaults to 50 MB, admin must raise it
- WebClient/WebDAV: 50 MB Windows default limit when using mapped drives / File Explorer
- Org-set policies: IT can restrict tenant-wide or library-level
- List attachments: tighter limit than document libraries
- Thumbnails/previews not generated for files over 100 MB in SharePoint Online

## Measured facts we can quote (from tool-measurements.md)

- Image-heavy PDF compression: 913.4 KB → 315.3 KB at Medium (-65.5%), 175.6 KB at High (-80.8%)
- Text PDF compression: 23.5 KB → 1,400.8 KB at Medium (+5861%) — compression makes text PDFs much larger
- Compressing twice: 315.3 KB → 598.9 KB at same level (+90%) — never chain passes
- Merging doesn't inflate output (971.9 KB in, 970.5 KB out)

## Competitor gap

Competitor posts recommend compression universally without noting it harms text PDFs. Our measured data lets us give genuinely accurate, conditional advice.

## Internal links

- /compress-pdf (for image-heavy PDFs)
- /split-pdf (for text PDFs or when compression isn't enough)

## Outbound links (authority)

- Microsoft SharePoint Online limits page: learn.microsoft.com/en-us/office365/servicedescriptions/sharepoint-online-service-description/sharepoint-online-limits
- Microsoft WebClient registry fix article (appeared in Q&A search results)

## Recommended structure

1. Intro (answer-first: yes, fixable, depends on PDF type)
2. Why SharePoint rejects large PDFs (Online vs on-premises, org policy, WebClient)
3. The critical split: images vs text content
4. How-to for image-heavy PDFs (compress steps with real numbers)
5. What to do for text PDFs (split or zip)
6. Admin-level solutions (IT route)
7. Summary table
8. FAQ in frontmatter
