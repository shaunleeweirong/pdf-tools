# Research Brief: how to rotate a pdf and save it

**targetQuery:** how to rotate a pdf and save it
**Secondary keywords:** rotate pdf permanently, rotate pdf and save permanently, rotate single page pdf, free pdf rotation no sign up, rotate pdf without adobe
**Search intent:** Informational (task completion) — user has a sideways or upside-down PDF and wants the rotation to stick when saved.
**Surface:** Blog

## The core pain point

Free PDF viewers (Adobe Acrobat Reader, Google Chrome, Microsoft Edge, Firefox, Safari) let users rotate the view but do NOT write the change to the file. When users close and reopen the PDF, it reverts to the original orientation. This is the #1 frustration — the viewer lies to them by showing a rotate button that doesn't actually save.

The technical reason: PDF page orientation is stored as a `/Rotate` entry in the page dictionary. View-only readers apply a session-level transform but never write this entry back to the file on disk.

## Questions to answer (from PAA/Reddit/community forums)

1. Why doesn't rotating a PDF save permanently in Adobe Reader / Chrome / Edge?
2. How do I rotate a PDF and have the rotation save permanently?
3. Can I rotate just one page in a PDF (not all pages)?
4. Is there a free way to rotate a PDF without signing up?
5. Does rotating a PDF affect the image/text quality?
6. How do I rotate a PDF on Mac (without Acrobat)?
7. How do I rotate a PDF on Windows?
8. What's the difference between "rotate view" and rotating the actual file?

## Competitor angles + gaps

- Competitors (ilovepdf, smallpdf, adobe online): mostly focus on "upload and rotate" — they don't clearly explain WHY the rotation wasn't saving before.
- Gap: explain the viewer vs. editor distinction up front so the reader understands the problem, then show them the free in-browser solution.
- Our privacy/free/in-browser angle: files never leave the browser, no sign-up.

## Format

Blog post, how-to. ~850 words. H2 sections per question. Include a how-to list + FAQ section.

## Internal link targets

- /rotate-pdf (Rotate PDF tool) — primary
- /organize-pdf (Organize PDF) — secondary for reordering pages
- /merge-pdf (Merge PDF) — mention if they've combined sideways pages

## The "get it done" angle

Reader landed here because their PDF keeps reverting to sideways. They want it fixed in 2 minutes, for free, without creating an account.
