# Brief: how to strip metadata from pdf for privacy free

**id:** blog-strip-pdf-metadata
**targetQuery:** how to strip metadata from pdf for privacy free
**secondaryKeywords:** remove pdf metadata, strip pdf metadata, remove author from pdf, pdf metadata privacy, clear pdf metadata free
**intent:** informational
**surface:** blog
**slug:** how-to-strip-metadata-from-pdf-for-privacy-free

## Search intent

Reader has a document they're about to share and has just realised (or been warned) it might contain their name, username, creation software, or timestamps they don't want visible. They want a free, fast way to either view what's there or wipe the fields before sending.

## Questions to answer (ordered by priority)

1. What metadata is hidden inside a PDF? (Author, Subject, Creator, Producer, CreationDate, ModDate, plus XMP)
2. What personal information can PDF metadata reveal? (Author = Windows username, Creator = software name, timestamps, internal classification tags)
3. How do I view PDF metadata before sharing? (Edit Metadata tool, Preview on macOS, Reader Ctrl+D)
4. How do I strip PDF metadata free in my browser? (step-by-step with Edit Metadata tool)
5. Does "print to PDF" remove metadata? (yes mostly, but not image EXIF inside the PDF)
6. What about XMP metadata? (second hidden store, some tools miss it)
7. Which fields should I always clear? (Author, Subject, Keywords, Creator, Producer, dates)

## Gap vs. competitors

Competitor posts (PDF24, Smallpdf, Adobe) send users to a cloud upload to "fix" a privacy problem, which adds a second privacy risk. Our angle: use a tool that keeps the file local. That's the structural advantage to lead with.

## Format

Blog post, ~900 words. Intro (answer-first) + H2 per question + closing checklist. FAQ in frontmatter (6 items). No body FAQ section.

## Internal links

- `/edit-metadata` (primary tool, multiple references)
- `/protect-pdf` (secondary, as a related security step)

## Outbound links (high authority, link where concept appears)

- Wikipedia / XMP Extensible Metadata Platform when explaining the XMP store
- wisblawg.law.wisc.edu/2006 guide when mentioning legal/court metadata risks
- pdfa.org resource index when mentioning ISO 32000 / PDF 2.0 standard

## E-E-A-T notes

- Do not quote any measured file size or timing for edit-metadata (not in tool-measurements.md)
- Can reference in-browser processing for protect-pdf and unlock-pdf (both say "in your browser" in their tool descriptions)
- Do not claim edit-metadata is client-side unless confirmed on the tool page
- The Author-leaks-username fact is widely documented and not a claim about our tools, so no measurement needed
