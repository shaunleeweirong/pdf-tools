# Research Brief: how to make a pdf fillable free online

**targetQuery**: how to make a pdf fillable free online
**Secondary keywords**: create fillable pdf free, add form fields to pdf, make pdf fillable without acrobat, convert pdf to fillable form
**Search intent**: informational (user wants to add interactive form fields to an existing static PDF)
**Date researched**: 2026-08-14

## Real questions people ask (PAA / Quora / Reddit)

From search results and Quora:
1. How do I make a PDF fillable without Adobe Acrobat?
2. How do I make a fillable PDF formable but not editable (fill-only, not edit-text)?
3. How do I make a fillable PDF permanent after filling?
4. How do I convert a Word document to a fillable PDF without Acrobat?
5. What tools let me add text fields, checkboxes, radio buttons, dropdowns?
6. Is it safe to upload my PDF to an online tool (privacy concern)?
7. What is the difference between a fillable PDF and a regular PDF?
8. Can I make a PDF fillable without uploading to a server?
9. My PDF is a scanned image, can I make it fillable?
10. I already have a fillable PDF, how do I fill it out?

## Competitor angles and gaps

**Top ranking pages**: Adobe, PDF24, Sejda, smallpdf, ContentSnare
- All cover the "how to add fields" workflow (upload, click to place fields, download)
- Most assume users want to CREATE fields, not FILL them
- Few pages clarify the key distinction between making fillable vs filling
- Virtually none mention privacy/client-side concerns clearly
- Adobe page requires sign-in to Acrobat

**Gap we beat**:
- Clear upfront distinction between "make fillable" (create fields) and "fill a form" (fill existing fields)
- Privacy angle: recommend client-side tools for sensitive docs
- Honest "when not to use our tool" (our fill-form is for filling, not creating fields)
- Flatten-after-filling workflow (our flatten-pdf tool)
- Merging warning: filled form fields are stripped by pdf-lib copyPages; flatten first

## Recommended format

Blog post, ~900 words.

## Internal link targets

- `/fill-form` (Fill PDF Form - detect and fill existing fields)
- `/flatten-pdf` (Flatten PDF - make filled values permanent)
- `/merge-pdf` (Merge PDF - context: flatten first before merging)

## External links to include

- ISO 32000 standard (PDF specification) - iso.org
- Wikipedia on rasterisation or interactive forms (as appropriate)

## The "get it done" angle

Reader has a static PDF (maybe a form they received or created) and wants their recipients to be able to type into it. They need to add text boxes and checkboxes so people can fill it out digitally. Fastest path: PDF24 or Sejda, free, no sign-up.

## Key claims to make (all traceable to tool-measurements.md or lib/tools.ts)

- Our fill-form tool "detects form fields and fills them in" (from lib/tools.ts)
- Our flatten-pdf tool "makes form fields and annotations non-editable" (from lib/tools.ts)
- Merging strips form fields (from tool-measurements.md: "merge() uses pdf-lib's copyPages, which copies page content rather than the document's AcroForm")
- Do NOT claim specific performance numbers for fill-form or flatten-pdf (not yet measured)
