# Research Brief: how to merge pdf in google chrome free

**targetQuery:** how to merge pdf in google chrome free
**Secondary keywords:** merge pdf chrome, combine pdf chrome browser, merge pdf without extension, merge pdf in browser free
**Search intent:** informational / transactional — person is sitting in Chrome right now and wants to merge PDFs without leaving the browser or installing anything

## Real questions people ask

From PAA and search autocomplete:
1. Can you merge PDFs in Chrome without downloading anything?
2. Does Chrome have a built-in PDF merger?
3. How do I combine PDFs in Chrome without uploading them to a server?
4. What is the easiest free way to merge PDFs in Chrome?
5. Are Chrome extensions safe for merging PDFs?
6. Will the merged file be larger than the originals?
7. What happens to form fields when I merge PDFs?

## Competitor gaps

- Most articles list several online tools but don't explain *why* some tools never upload your files (in-browser JavaScript processing).
- None of the articles explain the form-field-stripping issue.
- Most skip the "will my merged file be bigger?" question entirely.
- Most articles include Chrome extensions as if they are the primary solution, but extensions require extra permissions.

## Our angle / win

- We run entirely in the browser tab (pdf-lib, client-side) so files never leave the device.
- Free, no sign-up.
- We can cite real measured data: merging 971.9 KB in produced 970.5 KB out (−0.1%).
- We can give honest advice about when NOT to use merge (unflatten forms first).

## Internal links

- `/merge-pdf` — the main tool (primary)
- `/compress-pdf` — if the merged file is still large
- `/flatten-pdf` if need to flatten forms before merging (if tool exists — check tools list)

## Recommended format

Blog how-to post, ~900 words, covering:
- Answer-first intro (Chrome's built-in viewer can't merge; here's how to do it in a browser tab)
- H2: Does Chrome have a built-in way to merge PDFs?
- H2: The fastest way to merge PDFs in Chrome (step-by-step)
- H2: Can I merge PDFs in Chrome without uploading them?
- H2: What about Chrome extensions?
- H2: Will the merged file be larger than the originals?
- H2: One thing to know if you're merging a filled form
- faq: in frontmatter (3-5 items)

## Outbound links to include

- Chrome PDF viewer: https://support.google.com/chrome/answer/6213030 (confirm Chrome's viewer is read-only)
- pdf-lib: https://pdf-lib.js.org/ (the JS library doing client-side merging)
- Wikipedia PDF article: https://en.wikipedia.org/wiki/PDF (brief context on the format)
