# Brief: how to tell if a pdf has been edited or altered free

**targetQuery:** how to tell if a pdf has been edited or altered free
**Secondary keywords:** detect pdf tampering, check pdf modification date, pdf metadata check, broken digital signature pdf
**Intent:** informational
**Surface:** blog
**Format:** how-to guide with checklist

## Questions to answer (from PAA / Adobe Community)

1. How do I check if a PDF was modified after it was sent to me?
2. Does the modification date prove a PDF was altered?
3. What does the creating-application field tell you?
4. How do I compare two PDF versions?
5. How do digital signatures detect tampering?
6. How can I protect my own PDF so edits are detectable?
7. What can and cannot be determined for free?

## Key findings

- Metadata check (Ctrl+D / Cmd+D) shows creation date, modification date, author, creating app — useful first signal, not conclusive
- Metadata itself can be rewritten by anyone with a PDF editor
- Creating-application mismatch is often the real giveaway (bank statement showing "Adobe Acrobat" is suspicious)
- Visual comparison against a trusted original is strong signal — our Compare PDF tool works for first-page visual diffs
- Digital signatures (cryptographic hash) are the only reliable tamper-evidence built into PDF
- Broken signature in Acrobat Reader = file changed after signing
- Printed-and-rescanned docs create fresh metadata, so this approach does not help there

## Competitor gaps

- Most articles skip the creating-application field
- Most don't explain that metadata itself can be faked
- Most don't explain the limitations of each method clearly

## Our angle

Privacy/free/in-browser. Our tools (edit-metadata, compare-pdf, protect-pdf) cover the three main actions a reader might take.

## Internal links

- /edit-metadata (view metadata)
- /compare-pdf (visual comparison)
- /protect-pdf (AES-256 in-browser encryption)

## External links (1-3)

- Wikipedia: https://en.wikipedia.org/wiki/Digital_signature
- Adobe Acrobat Reader (free download): https://get.adobe.com/reader/
- Diffchecker PDF diff: https://www.diffchecker.com/pdf-diff/

## Tool claims traceable to tool-measurements.md

- protect-pdf uses AES-256 (confirmed in measurements)
- compare-pdf highlights visual differences on first page (product description in lib/tools.ts)
- edit-metadata shows title, author, subject, keywords (product description in lib/tools.ts; dates shown are standard PDF metadata fields)
