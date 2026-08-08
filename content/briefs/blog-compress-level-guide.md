# Research brief: what compression level to use when compressing a pdf

**targetQuery:** what compression level to use when compressing a pdf  
**Secondary keywords:** pdf compression level, high medium low pdf compression, pdf compression settings, best pdf compression level  
**Search intent:** informational — reader has a PDF they want to compress and doesn't know which setting to pick  
**Surface:** blog  
**Slug:** what-compression-level-to-use-when-compressing-a-pdf

## Real questions people ask (PAA / Reddit / forums)

- What does High compression do vs Medium vs Low?
- When should I use High compression on a PDF?
- Will High compression make images blurry?
- Does compression work the same on all PDFs?
- Will compressing a text PDF make it smaller?
- Why did my PDF get bigger after I compressed it?
- Can I compress a PDF twice to get a smaller file?
- What type of PDF benefits most from compression?
- What is the best PDF compression level for email?

## Key measured data (from docs/marketing/tool-measurements.md)

All numbers below are first-hand measured results — cite them exactly.

| Level | Before | After | Change |
|---|---|---|---|
| High (smallest) | 913.4 KB | 175.6 KB | -80.8% |
| Medium | 913.4 KB | 315.3 KB | -65.5% |
| Low (best quality) | 913.4 KB | 703.5 KB | -23.0% |
| Text report (Medium) | 23.5 KB | 1,400.8 KB | +5861% |
| Mixed doc (Medium) | 35.0 KB | 171.2 KB | +389% |
| Double compression (Medium again) | 315.3 KB | 598.9 KB | +90% |

**The key finding competitors miss:** in-browser compressors rasterize pages to JPEG. This makes image-heavy PDFs much smaller and text PDFs dramatically larger. A 23.5 KB text report grew to 1.4 MB.

## Competitor gaps

- Most articles recommend "start with Medium" without explaining WHY — we explain the rasterization mechanism.
- No competitor specifically warns that text PDFs get bigger; most imply all PDFs shrink.
- No competitor has first-hand measured numbers per level.
- "Compress twice" myth is common on Reddit — we can bust it with data.

## Recommended structure

1. Answer-first intro: pick level based on file type, not file size
2. H2: What the three compression levels actually do (table of measured results)
3. H2: When to use High compression
4. H2: When to use Medium compression
5. H2: When to use Low compression (best quality)
6. H2: The one type of PDF you should never compress (text documents)
7. H2: Why compressing twice makes things worse
8. H2: How to compress a PDF to the right size (numbered how-to list)
9. Quick reference table at end

**Length:** 800 to 1000 words  
**Internal links:** /compress-pdf  
**Outbound links:** Wikipedia/Rasterization, Wikipedia/Vector_graphics, support.google.com (Gmail 25 MB limit)  
**faq frontmatter:** 5 entries covering level choice, text PDFs, double compression, what shrinks most, why files get bigger
