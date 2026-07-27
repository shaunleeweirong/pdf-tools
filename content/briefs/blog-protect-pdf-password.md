# Research Brief: how to password protect a pdf free

**targetQuery:** how to password protect a pdf free
**Secondary keywords:** password protect pdf without acrobat, encrypt pdf free, pdf password protection, secure pdf with password
**Search intent:** informational / transactional — reader has a PDF with sensitive content and wants to lock it right now, free, without installing software
**Surface:** blog

## Real questions to answer (from PAA / Reddit / research)

1. How do I password protect a PDF without Acrobat?
2. Is PDF password protection actually secure? (AES-256 vs older RC4)
3. What's the difference between a user password and a permissions/owner password?
4. Will adding a password change the file size or slow down the PDF?
5. Can I protect a PDF on iPhone or Android without an app?
6. Can I remove the password later?
7. When should I NOT use a PDF password? (widely shared docs, recipients on old readers)

## Competitor gaps

- Most guides list desktop methods (LibreOffice, Mac Preview, Word) but bury or skip the in-browser no-upload angle
- Few explain what encryption standard is actually used — readers don't know if their doc is safe
- Most don't explain file-size impact or processing time
- None make the "files never leave your browser" point clearly for privacy-sensitive content (which is exactly the use case — tax docs, contracts, medical records)

## Our angle / differentiator

- Free, no sign-up, in-browser (files never uploaded to a server)
- AES-256 encryption (qpdf-wasm, same standard as financial/government systems)
- Measured overhead: ~1 KB fixed regardless of file size (+4.8% on a 23.5 KB text doc; +0.1% on a 913 KB image deck)
- Works on any device including iPhone and Android — just open the browser

## Internal links

- /protect-pdf (primary)
- /unlock-pdf (for removing the password later)

## Format

Blog post. ~900 words. Answer-first intro. H2s per question above. Short how-to steps list. FAQ in frontmatter only.
