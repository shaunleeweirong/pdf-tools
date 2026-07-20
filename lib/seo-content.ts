export interface FaqItem {
  q: string
  a: string
}

export interface ToolSeoOverride {
  title?: string
  description?: string
  /** Answer-first lead paragraph shown at the top of the tool page (first ~50 words matter for AI extraction). */
  intro?: string
  /** How-to steps, rendered as a visible ordered list and as HowTo JSON-LD. */
  steps?: string[]
  faq?: FaqItem[]
}

// Outcome-framed, answer-first copy per tool. `intro` + `steps` + `faq` are
// rendered visibly on the tool page (components/ToolContent) AND drive HowTo /
// FAQPage JSON-LD (lib/seo). Tools without an entry fall back to registry copy.
export const SEO_CONTENT: Record<string, ToolSeoOverride> = {
  'merge-pdf': {
    title: 'Merge PDF free — combine PDF files in your browser',
    description:
      'Combine several PDFs into one file in seconds. Free, no sign-up and no watermark — merged right in your browser.',
    intro:
      'To merge PDF files, drop them into the box below, drag them into the order you want, and click Merge. Your PDFs combine into a single document in seconds — free, no sign-up, and processed entirely in your browser, so nothing is uploaded.',
    steps: [
      'Drop your PDF files into the upload box, or click to browse and select them.',
      'Drag the files into the order you want them combined.',
      'Click Merge PDF to join them into one document.',
      'Download your merged PDF — no account or watermark.',
    ],
    faq: [
      { q: 'Is merging PDFs free?', a: 'Yes — no sign-up, no watermark and no daily limit.' },
      { q: 'Are my files uploaded to a server?', a: 'No. Merge PDF runs in your browser, so your files never leave your device.' },
      { q: 'Is there a limit on how many PDFs I can merge?', a: 'No fixed limit — combine as many PDFs as your browser can hold in memory.' },
    ],
  },
  'split-pdf': {
    title: 'Split PDF free — extract pages into separate files',
    description:
      'Split a PDF into separate files or page ranges in seconds. Free, no sign-up, done right in your browser.',
    intro:
      'To split a PDF, drop your file in, choose the page ranges you want, and click Split. Each range is saved as its own PDF in seconds — free, no sign-up, and processed in your browser so your file stays private.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Enter the page ranges you want to split out (for example 1-3, 4-8).',
      'Click Split PDF to create a separate file for each range.',
      'Download your split PDFs.',
    ],
    faq: [
      { q: 'Can I pick specific pages?', a: 'Yes — enter the exact page ranges you want and each becomes its own PDF.' },
      { q: 'Are my files uploaded?', a: 'No. Splitting happens in your browser; your file is never sent to a server.' },
    ],
  },
  'rotate-pdf': {
    title: 'Rotate PDF free — fix sideways pages online',
    description:
      'Rotate PDF pages 90°, 180° or 270° and save. Free, no sign-up, rotated right in your browser.',
    intro:
      'To rotate a PDF, drop your file in, choose 90°, 180° or 270°, and click Rotate. Every page turns to the right orientation and downloads in seconds — free, no sign-up, and handled in your browser.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Choose how far to rotate: 90°, 180° or 270°.',
      'Click Rotate PDF to apply it to every page.',
      'Download your corrected PDF.',
    ],
    faq: [
      { q: 'Will the rotation be saved permanently?', a: 'Yes — the downloaded PDF keeps the new orientation everywhere it opens.' },
      { q: 'Are my files uploaded?', a: 'No. Rotation runs in your browser, so your file never leaves your device.' },
    ],
  },
  'delete-pages': {
    title: 'Delete pages from a PDF free — remove pages online',
    description:
      'Remove unwanted pages from a PDF in seconds. Free, no sign-up, done right in your browser.',
    intro:
      'To delete pages from a PDF, drop your file in, enter the page numbers to remove, and click Delete. The remaining pages are saved as a new PDF in seconds — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Enter the page numbers you want to remove.',
      'Click Delete Pages to strip them out.',
      'Download the trimmed PDF.',
    ],
    faq: [
      { q: 'Does deleting pages change the original file?', a: 'No — you download a new PDF; the original on your device is untouched.' },
      { q: 'Are my files uploaded?', a: 'No. Everything happens in your browser.' },
    ],
  },
  'extract-pages': {
    title: 'Extract pages from a PDF free — save pages as a new PDF',
    description:
      'Pick specific pages from a PDF and save them as a new file. Free, no sign-up, in your browser.',
    intro:
      'To extract pages from a PDF, drop your file in, choose the pages you want to keep, and click Extract. Just those pages are saved as a new PDF in seconds — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Enter the pages you want to keep (for example 2, 5-7).',
      'Click Extract Pages to build a new PDF from them.',
      'Download your new PDF.',
    ],
    faq: [
      { q: 'What is the difference between extract and split?', a: 'Extract keeps a chosen set of pages in one new file; split breaks a PDF into several files by range.' },
      { q: 'Are my files uploaded?', a: 'No. Extraction runs entirely in your browser.' },
    ],
  },
  'organize-pdf': {
    title: 'Organize PDF free — reorder and remove pages online',
    description:
      'Reorder, rotate or delete PDF pages visually, then save. Free, no sign-up, in your browser.',
    intro:
      'To organize a PDF, drop your file in, drag the page thumbnails into a new order (or remove the ones you do not need), and save. Your rearranged PDF downloads in seconds — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Drag the page thumbnails to reorder them, and remove any you do not need.',
      'Click save to rebuild the PDF in the new order.',
      'Download your organized PDF.',
    ],
    faq: [
      { q: 'Can I reorder and delete pages at the same time?', a: 'Yes — drag pages into a new order and drop unwanted ones in a single pass.' },
      { q: 'Are my files uploaded?', a: 'No. Organizing happens in your browser.' },
    ],
  },
  'watermark-pdf': {
    title: 'Add a watermark to a PDF free — stamp text online',
    description:
      'Stamp custom text across every page of a PDF. Free, no sign-up, watermarked in your browser.',
    intro:
      'To watermark a PDF, drop your file in, type the text you want stamped, and click Watermark. The text is placed across every page and your PDF downloads in seconds — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Type the watermark text you want (for example "Confidential" or "Draft").',
      'Click Watermark PDF to stamp it across every page.',
      'Download your watermarked PDF.',
    ],
    faq: [
      { q: 'Can I watermark every page at once?', a: 'Yes — your text is stamped across all pages in one step.' },
      { q: 'Are my files uploaded?', a: 'No. The watermark is applied in your browser.' },
    ],
  },
  'add-page-numbers': {
    title: 'Add page numbers to a PDF free — number pages online',
    description:
      'Insert page numbers into a PDF in seconds. Free, no sign-up, numbered in your browser.',
    intro:
      'To add page numbers to a PDF, drop your file in and click Add Page Numbers. Sequential numbers are placed on every page and your PDF downloads in seconds — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Click Add Page Numbers to place a number on every page.',
      'Download your numbered PDF.',
    ],
    faq: [
      { q: 'Do the numbers appear on every page?', a: 'Yes — pages are numbered in sequence from the first page.' },
      { q: 'Are my files uploaded?', a: 'No. Numbering happens in your browser.' },
    ],
  },
  'crop-pdf': {
    title: 'Crop a PDF free — trim margins online',
    description:
      'Trim the margins off every page of a PDF. Free, no sign-up, cropped in your browser.',
    intro:
      'To crop a PDF, drop your file in, set how much margin to trim, and click Crop. Every page is trimmed to the same box and your PDF downloads in seconds — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Set the margin you want to trim from each edge.',
      'Click Crop PDF to apply it to every page.',
      'Download your cropped PDF.',
    ],
    faq: [
      { q: 'Does cropping delete the content in the margins?', a: 'Cropping hides the trimmed area from view; the page box is resized rather than the content re-flowed.' },
      { q: 'Are my files uploaded?', a: 'No. Cropping runs in your browser.' },
    ],
  },
  'n-up-pdf': {
    title: 'Pages per sheet (N-up) free — 2 or 4 PDF pages per page',
    description:
      'Place 2 or 4 PDF pages onto each sheet to save paper. Free, no sign-up, in your browser.',
    intro:
      'To put multiple PDF pages on one sheet, drop your file in, choose 2 or 4 pages per sheet, and click Pages Per Sheet. Your pages are tiled onto fewer sheets for printing and download in seconds — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Choose how many pages to place on each sheet (2 or 4).',
      'Click Pages Per Sheet to build the N-up PDF.',
      'Download your print-ready PDF.',
    ],
    faq: [
      { q: 'What is N-up used for?', a: 'It fits several pages onto one sheet to save paper when printing handouts or drafts.' },
      { q: 'Are my files uploaded?', a: 'No. The layout is built in your browser.' },
    ],
  },
  'flatten-pdf': {
    title: 'Flatten a PDF free — make forms and annotations permanent',
    description:
      'Flatten form fields and annotations so they can no longer be edited. Free, no sign-up, in your browser.',
    intro:
      'To flatten a PDF, drop your file in and click Flatten. Form fields and annotations are baked into the page so they can no longer be changed, and your PDF downloads in seconds — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Click Flatten PDF to merge form fields and annotations into the page.',
      'Download your flattened PDF.',
    ],
    faq: [
      { q: 'Why flatten a PDF?', a: 'Flattening locks in filled fields and comments so the file looks the same everywhere and cannot be edited.' },
      { q: 'Are my files uploaded?', a: 'No. Flattening happens in your browser.' },
    ],
  },
  'edit-metadata': {
    title: 'Edit PDF metadata free — change title, author and keywords',
    description:
      "View and change a PDF's title, author, subject and keywords. Free, no sign-up, in your browser.",
    intro:
      "To edit a PDF's metadata, drop your file in, update the title, author, subject or keywords, and save. The new details are written into the file and it downloads in seconds — free, no sign-up, and processed in your browser.",
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Edit the title, author, subject and keyword fields.',
      'Click save to write the new metadata into the file.',
      'Download your updated PDF.',
    ],
    faq: [
      { q: 'What is PDF metadata?', a: 'It is the hidden document info — title, author, subject and keywords — that apps and search use to identify a file.' },
      { q: 'Are my files uploaded?', a: 'No. Metadata is edited in your browser.' },
    ],
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF free — turn images into a PDF',
    description:
      'Combine JPG and PNG images into a single PDF, one image per page. Free, no sign-up, made in your browser.',
    intro:
      'To convert images to a PDF, drop your JPG or PNG files in, arrange them in order, and click Images to PDF. Each image becomes a page in a single PDF that downloads in seconds — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your JPG or PNG images into the upload box, or click to browse.',
      'Drag the images into the page order you want.',
      'Click Images to PDF to combine them into one document.',
      'Download your new PDF.',
    ],
    faq: [
      { q: 'Which image formats work?', a: 'JPG and PNG images are supported, one image per page.' },
      { q: 'Are my images uploaded?', a: 'No. The PDF is built in your browser, so your images stay on your device.' },
    ],
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG free — convert PDF pages to images',
    description:
      'Turn every page of a PDF into a JPG image in seconds. Free, no sign-up, converted in your browser.',
    intro:
      'To convert a PDF to JPG, drop your file in and click PDF to JPG. Every page is rendered to a JPG image and downloaded as a zip in seconds — free, no sign-up, and processed in your browser so your file stays private.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Click PDF to JPG to render each page as an image.',
      'Download the images (a zip when there is more than one page).',
    ],
    faq: [
      { q: 'Do I get one image per page?', a: 'Yes — each PDF page becomes its own JPG, delivered as a zip for multi-page files.' },
      { q: 'Are my files uploaded?', a: 'No. Rendering happens in your browser.' },
    ],
  },
  'fill-form': {
    title: 'Fill a PDF form free — type into form fields online',
    description:
      'Detect PDF form fields and type your answers in. Free, no sign-up, filled in your browser.',
    intro:
      'To fill a PDF form, drop your file in, type into the detected fields, and save. Your answers are written into the form and the completed PDF downloads in seconds — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your fillable PDF into the upload box, or click to browse.',
      'Type your answers into the detected form fields.',
      'Click save to write your answers into the PDF.',
      'Download your completed form.',
    ],
    faq: [
      { q: 'Does it work on any PDF form?', a: 'It fills PDFs that contain real form fields; scanned or flat forms may not have detectable fields.' },
      { q: 'Are my answers uploaded?', a: 'No. The form is filled in your browser, so your data stays on your device.' },
    ],
  },
  'sign-pdf': {
    title: 'Sign a PDF free — add your signature online',
    description:
      'Draw your signature and place it on a PDF. Free, no sign-up, signed in your browser.',
    intro:
      'To sign a PDF, drop your file in, draw your signature, and place it on the page. The signed PDF downloads in seconds — free, no sign-up, and processed in your browser so your document stays private.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Draw your signature in the signature pad.',
      'Place the signature where you want it on the page.',
      'Download your signed PDF.',
    ],
    faq: [
      { q: 'Is a drawn signature legally valid?', a: 'A drawn signature is widely accepted for everyday agreements; check requirements for formal or regulated documents.' },
      { q: 'Are my files uploaded?', a: 'No. Signing happens in your browser.' },
    ],
  },
  'extract-images': {
    title: 'Extract images from a PDF free — export pages as images',
    description:
      'Export each page of a PDF as a high-resolution image. Free, no sign-up, in your browser.',
    intro:
      'To extract images from a PDF, drop your file in and click Extract Images. Each page is exported as a high-resolution image and downloaded as a zip in seconds — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Click Extract Images to render each page to a high-resolution image.',
      'Download the images as a zip.',
    ],
    faq: [
      { q: 'Does it pull out embedded photos or whole pages?', a: 'It exports each page as a high-resolution image, ideal for reusing page artwork.' },
      { q: 'Are my files uploaded?', a: 'No. Extraction runs in your browser.' },
    ],
  },
  'compare-pdf': {
    title: 'Compare two PDFs free — highlight the differences',
    description:
      'Highlight visual differences between two PDF versions. Free, no sign-up, in your browser.',
    intro:
      'To compare two PDFs, drop both files in and click Compare. The visual differences between the pages are highlighted so you can spot changes instantly — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop the two PDF versions into the upload box.',
      'Click Compare PDF to line the pages up.',
      'Review the highlighted differences and download the result.',
    ],
    faq: [
      { q: 'What kind of differences does it show?', a: 'It highlights visual changes between the pages so edits and additions stand out.' },
      { q: 'Are my files uploaded?', a: 'No. The comparison runs in your browser.' },
    ],
  },
  'edit-pdf': {
    title: 'Edit PDF free — change text and add notes online',
    description:
      'Edit existing text, or add text and boxes to any page. Free, no sign-up, edited right in your browser.',
    intro:
      'To edit a PDF, drop your file in, then change existing text or add new text and boxes on any page. Your edited PDF downloads in seconds — free, no sign-up, and processed in your browser so your document stays private.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Switch between edit and add mode to change existing text or add new text and boxes.',
      'Make your changes on any page.',
      'Download your edited PDF.',
    ],
    faq: [
      { q: 'Can I edit text that is already in the PDF?', a: 'Yes — you can replace existing text in place, as well as add new text and boxes.' },
      { q: 'Are my files uploaded?', a: 'No. Editing happens in your browser.' },
    ],
  },
  'compress-pdf': {
    title: 'Compress PDF free — shrink a PDF to email it',
    description:
      'Reduce PDF file size so it will finally attach to an email. Free, no sign-up, compressed in your browser.',
    intro:
      'To compress a PDF, drop your file in and click Compress. The file size is reduced so it fits email and upload limits, and your smaller PDF downloads in seconds — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Click Compress PDF to reduce the file size.',
      'Download your smaller PDF.',
    ],
    faq: [
      { q: 'How small can it get?', a: 'This light in-browser compressor works best on image-heavy PDFs; results vary by file.' },
      { q: 'Are my files uploaded?', a: 'No. Compression runs in your browser, so your file stays on your device.' },
    ],
  },
  'protect-pdf': {
    title: 'Password protect a PDF free — encrypt in your browser',
    description:
      'Add a password and encrypt a PDF in seconds. Free, no sign-up — the file is encrypted in your browser.',
    intro:
      'To password protect a PDF, drop your file in, set a password, and click Protect. The PDF is encrypted so only people with the password can open it, and it downloads in seconds — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your PDF into the upload box, or click to browse.',
      'Enter the password you want to protect the file with.',
      'Click Protect PDF to encrypt it.',
      'Download your password-protected PDF.',
    ],
    faq: [
      { q: 'What encryption is used?', a: 'The PDF is encrypted so it cannot be opened without the password you set.' },
      { q: 'Are my files uploaded?', a: 'No. Encryption happens in your browser, so your file and password never leave your device.' },
    ],
  },
  'unlock-pdf': {
    title: 'Unlock a PDF free — remove a known password',
    description:
      'Remove a password you know from a PDF. Free, no sign-up, unlocked in your browser.',
    intro:
      'To unlock a PDF, drop your file in, enter the password you already know, and click Unlock. The password is removed so the file opens freely, and it downloads in seconds — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your password-protected PDF into the upload box.',
      'Enter the password you already know for the file.',
      'Click Unlock PDF to remove the password.',
      'Download your unlocked PDF.',
    ],
    faq: [
      { q: 'Can this crack a password I do not know?', a: 'No — you must know the password. This tool removes protection you are entitled to remove, not bypass it.' },
      { q: 'Are my files uploaded?', a: 'No. Unlocking happens in your browser.' },
    ],
  },
}
