# Research brief: how to crop pdf pages on iphone free

**id:** blog-crop-pdf-iphone
**targetQuery:** how to crop pdf pages on iphone free
**Secondary keywords:** crop pdf iphone, trim pdf margins iphone, crop pdf ios, crop pdf without app iphone
**Intent:** informational
**Priority:** 2
**Date:** 2026-09-20

## Key questions to answer

1. Can I crop PDF pages on iPhone without downloading an app?
2. How do I use the built-in iPhone Markup tool to crop a PDF?
3. What iOS version supports PDF page cropping natively?
4. How do browser-based crop tools compare to the native option?
5. What does cropping actually do inside a PDF file (crop box vs. hard render)?
6. Does cropping reduce PDF file size?
7. When should I crop instead of splitting, compressing, or extracting pages?

## Research findings

### Real questions people ask (PAA / Reddit / MacRumors)
- "Does iPhone Files app support PDF cropping?"
- "How do I trim white margins from a PDF on iPhone?"
- "What's the difference between cropping and splitting a PDF?"
- "Does cropping a PDF reduce file size?"
- "Can I crop only one page of a PDF on iPhone?"

### Key facts
- Apple added PDF editing (including crop) to iPhone starting in iOS 16 via the Markup interface.
  Source: https://support.apple.com/guide/iphone/add-delete-rotate-move-or-crop-pdf-pages-iphbf4977cff/ios
- The native Markup cropper works one page at a time and sets a new crop box (not a hard render).
- Browser-based tools in Safari work on any iOS version, require no download, and can crop all pages in one pass.
- A PDF page's "crop box" is defined in the ISO 32000 standard. Setting it hides outside content in most viewers.
- Our crop-pdf tool description: "Trim margins off every page of a PDF." (lib/tools.ts)
- File size / quality claims for crop-pdf are NOT in tool-measurements.md (not yet measured). Make no size/quality claims.
- Compress tool rasterizes to JPEG: good for image-heavy PDFs, bad for text PDFs (text-report 23.5 KB -> 1400.8 KB at Medium).

### Competitor gap
Most competitor articles push third-party paid apps. Our angle: iOS 16+ built-in option + free in-browser tool, no download, no server upload.

### Internal links
- /crop-pdf (primary)
- /compress-pdf (with rasterization caveat)
- /merge-pdf, /split-pdf, /extract-pages (for comparison table)

### External links
- Apple support for PDF cropping on iPhone: https://support.apple.com/guide/iphone/add-delete-rotate-move-or-crop-pdf-pages-iphbf4977cff/ios
- Wikipedia on PDF (page box types / ISO 32000): https://en.wikipedia.org/wiki/PDF

### Recommended format
Blog post, how-to, ~900 to 1000 words. Step-by-step for native iPhone option, step-by-step for browser tool, educational section on what cropping does, comparison table, tips section.
