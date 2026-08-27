# Brief: what does flatten a pdf mean

**id:** blog-what-does-flatten-pdf-mean
**targetQuery:** what does flatten a pdf mean
**secondaryKeywords:** flatten pdf, flatten pdf meaning, what is flatten pdf, flatten pdf form fields, flatten vs compress pdf, when to flatten a pdf
**intent:** informational
**surface:** blog
**slug:** what-does-flatten-a-pdf-mean
**priority:** 2

## Search intent

Someone who just saw the word "flatten" on a PDF tool, in an email from a court, or in a form submission guide. They want a plain-language explanation, not a step-by-step for a specific platform.

## Real questions to answer (PAA / Adobe Community / forum mining)

1. What does it mean to flatten a PDF? (the core definition)
2. What happens when you flatten a PDF? (what gets removed vs what stays)
3. What is affected by flattening? (forms, annotations, comments, signatures, layers)
4. Does flattening change how a PDF looks? (no, visual appearance is preserved)
5. When should you flatten a PDF? (before merging, printing, court filing, sharing)
6. Is flattening the same as compressing? (no, completely different)
7. Is flattening reversible? (no, save your original)
8. Why do courts require flattened PDFs?

## Competitor gaps

Smallpdf and Adobe both cover this but mostly focus on how-to steps for Acrobat. They skip:
- A clear analogy explaining what "layers" actually are
- The distinction between flatten and compress (common confusion)
- The specific real-world consequence: our measured finding that merging strips form fields
- The "when NOT to flatten" angle (digital signatures, documents you still need to edit)

## Recommended format

Blog post, ~900 to 1000 words. Answer-first intro. H2 sections one per question. Internal FAQ in frontmatter only.

## Internal links
- /flatten-pdf (Flatten PDF tool)
- /merge-pdf (Merge PDF - to explain the flatten-before-merging context)

## Outbound links (credible sources)
- Wikipedia on PDF forms (AcroForms) or PDF layers
- PDF Association (pdfa.org) or ISO 32000 reference

## Key measured claims to use
- Merging strips interactive form fields (measured: filled field "applicant.name" was absent from the output after merge)
- Merge output size is marginally smaller than sum of inputs (971.9 KB in, 970.5 KB out)
- Do NOT claim flatten tool reduces file size (not measured for /flatten-pdf)
