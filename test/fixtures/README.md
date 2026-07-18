# Test Fixtures

Generated PDF and image fixtures for unit and integration tests.

## Files

- `blank-1p.pdf` — 1-page blank PDF (300×400 pt)
- `multi-5p.pdf` — 5-page PDF, each page labeled "Page N"
- `form.pdf` — PDF with one text field named `fullName`
- `red-100x100.png` — solid red 100×100 PNG image

## Regenerating

```bash
npx tsx test/fixtures/generate.ts
```
