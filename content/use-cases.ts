export interface UseCaseFaq {
  q: string
  a: string
}

export interface UseCase {
  /** Tool slug — must have a runner in components/UseCaseTool. */
  tool: string
  /** URL segment, e.g. "for-email" → /compress-pdf/for-email */
  useCase: string
  h1: string
  title: string
  description: string
  intro: string
  steps: string[]
  faq: UseCaseFaq[]
  keywords: string[]
}

export const USE_CASES: UseCase[] = [
  {
    tool: 'compress-pdf',
    useCase: 'for-email',
    h1: 'Compress a PDF for email',
    title: 'Compress PDF for email free — shrink it under the limit',
    description:
      'Make a PDF small enough to attach to an email. Free, no sign-up — compressed right in your browser.',
    intro:
      'To compress a PDF for email, drop it in below and click Compress — the file shrinks to fit typical 20–25 MB attachment limits in a few seconds, free and entirely in your browser, so nothing is uploaded.',
    steps: [
      'Drop your PDF into the box above (or click to browse).',
      'Pick a compression level — Medium is a good default.',
      'Click Compress PDF and wait a moment.',
      'Download the smaller file and attach it to your email.',
    ],
    faq: [
      { q: 'What size can a PDF be for email?', a: 'Gmail and Outlook cap attachments around 20–25 MB; compress anything larger.' },
      { q: 'Are my files uploaded?', a: 'No — compression runs in your browser, so the file never leaves your device.' },
    ],
    keywords: ['compress pdf for email', 'reduce pdf size for email', 'pdf too big to email'],
  },
  {
    tool: 'compress-pdf',
    useCase: 'for-uploading',
    h1: 'Compress a PDF for uploading',
    title: 'Compress PDF for upload free — meet the file-size limit',
    description:
      'Shrink a PDF to get under an upload size limit on forms and portals. Free, in your browser.',
    intro:
      'To compress a PDF for an upload that rejects large files, drop it in and click Compress. It reduces the file size so it clears the form or portal limit — free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your PDF into the box above.',
      'Choose a compression level (try Medium first, then High if needed).',
      'Click Compress PDF.',
      'Download the smaller file and upload it.',
    ],
    faq: [
      { q: 'Why do upload forms reject my PDF?', a: 'Most set a maximum file size; a scan-heavy PDF often exceeds it until compressed.' },
      { q: 'Is it private?', a: 'Yes — the file is compressed on your device and never uploaded to us.' },
    ],
    keywords: ['compress pdf for upload', 'reduce pdf size for upload', 'pdf file too large to upload'],
  },
  {
    tool: 'merge-pdf',
    useCase: 'combine-two-pdfs',
    h1: 'Combine two PDFs into one',
    title: 'Combine two PDFs into one free — merge in your browser',
    description:
      'Join two PDF files into a single document in seconds. Free, no sign-up, merged in your browser.',
    intro:
      'To combine two PDFs into one, drop both files in, put them in the order you want, and click Merge — you get a single document in seconds, free and entirely in your browser.',
    steps: [
      'Drop both PDFs into the box above.',
      'Drag them into the order you want.',
      'Click Merge PDF.',
      'Download the combined document.',
    ],
    faq: [
      { q: 'Can I combine more than two?', a: 'Yes — add as many PDFs as you like; they merge in the order you set.' },
      { q: 'Are my files uploaded?', a: 'No — merging happens in your browser.' },
    ],
    keywords: ['combine two pdfs', 'merge two pdf files', 'join two pdfs into one'],
  },
  {
    tool: 'merge-pdf',
    useCase: 'for-printing',
    h1: 'Merge PDFs for printing',
    title: 'Merge PDFs for printing free — one file, one print job',
    description:
      'Combine several PDFs into one file so you can print them in a single job. Free, in your browser.',
    intro:
      'To merge PDFs for printing, drop your files in, arrange the order, and click Merge — one combined file prints as a single job, so the pages stay in order. Free, no sign-up, done in your browser.',
    steps: [
      'Drop your PDFs into the box above.',
      'Drag them into the print order you want.',
      'Click Merge PDF.',
      'Download the file and send it to your printer.',
    ],
    faq: [
      { q: 'Will the page order be kept when printing?', a: 'Yes — the merged file prints in exactly the order you arranged.' },
      { q: 'Are my files uploaded?', a: 'No — everything happens in your browser.' },
    ],
    keywords: ['merge pdf for printing', 'combine pdfs to print', 'print multiple pdfs as one'],
  },
  {
    tool: 'jpg-to-pdf',
    useCase: 'from-phone-photos',
    h1: 'Turn phone photos into a PDF',
    title: 'Phone photos to PDF free — combine images into one file',
    description:
      'Turn photos from your phone into a single PDF, one image per page. Free, no sign-up, in your browser.',
    intro:
      'To turn phone photos into a PDF, drop your JPG or PNG images in, arrange them in order, and click Images to PDF — each photo becomes a page in one shareable file, free and in your browser.',
    steps: [
      'Drop your photos (JPG or PNG) into the box above.',
      'Drag them into the page order you want.',
      'Click Images to PDF.',
      'Download your new PDF.',
    ],
    faq: [
      { q: 'Can I combine several photos into one PDF?', a: 'Yes — add all of them and each becomes a page in a single PDF.' },
      { q: 'Are my photos uploaded?', a: 'No — the PDF is built in your browser, so your images stay on your device.' },
    ],
    keywords: ['phone photos to pdf', 'jpg to pdf from photos', 'combine photos into pdf'],
  },
  {
    tool: 'jpg-to-pdf',
    useCase: 'scanned-pages',
    h1: 'Combine scanned pages into a PDF',
    title: 'Scanned images to PDF free — combine pages into one document',
    description:
      'Turn scanned page images into a single PDF document in order. Free, no sign-up, in your browser.',
    intro:
      'To combine scanned pages into a PDF, drop the scanned images in, put them in reading order, and click Images to PDF — you get one document instead of a folder of loose images, free and in your browser.',
    steps: [
      'Drop your scanned images into the box above.',
      'Drag them into reading order.',
      'Click Images to PDF.',
      'Download the combined PDF.',
    ],
    faq: [
      { q: 'Which image formats work?', a: 'JPG and PNG scans are supported, one image per page.' },
      { q: 'Are my scans uploaded?', a: 'No — the document is assembled in your browser.' },
    ],
    keywords: ['scanned images to pdf', 'combine scans into pdf', 'scanned pages to one pdf'],
  },
  {
    tool: 'pdf-to-jpg',
    useCase: 'for-social-media',
    h1: 'Turn a PDF into images for social media',
    title: 'PDF to JPG for social media free — export pages as images',
    description:
      'Convert PDF pages into JPG images you can post to social media. Free, no sign-up, in your browser.',
    intro:
      'To turn a PDF into images for social media, drop it in and click PDF to JPG — every page becomes a JPG you can upload to Instagram, LinkedIn or anywhere images are accepted. Free and in your browser.',
    steps: [
      'Drop your PDF into the box above.',
      'Click PDF to JPG.',
      'Download the images (a zip for multi-page PDFs).',
      'Post them wherever you need.',
    ],
    faq: [
      { q: 'Do I get one image per page?', a: 'Yes — each page becomes its own JPG.' },
      { q: 'Are my files uploaded?', a: 'No — the pages are rendered to images in your browser.' },
    ],
    keywords: ['pdf to jpg for instagram', 'pdf to image for social media', 'convert pdf to images to post'],
  },
  {
    tool: 'pdf-to-jpg',
    useCase: 'save-as-images',
    h1: 'Save a PDF as images',
    title: 'Save PDF as JPG images free — export every page',
    description:
      'Export each page of a PDF as a JPG image and download them. Free, no sign-up, in your browser.',
    intro:
      'To save a PDF as images, drop it in and click PDF to JPG — each page is exported as a JPG and downloaded, handy for reusing a page as a picture. Free, no sign-up, and processed in your browser.',
    steps: [
      'Drop your PDF into the box above.',
      'Click PDF to JPG to render each page.',
      'Download the images as a zip.',
    ],
    faq: [
      { q: 'What quality are the images?', a: 'Pages are rendered at a high resolution suitable for reuse on screen.' },
      { q: 'Are my files uploaded?', a: 'No — rendering happens in your browser.' },
    ],
    keywords: ['save pdf as jpg', 'export pdf pages as images', 'pdf to images download'],
  },
]

export function getUseCase(tool: string, useCase: string): UseCase | undefined {
  return USE_CASES.find((u) => u.tool === tool && u.useCase === useCase)
}
