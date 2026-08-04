# Research Brief: how to lock a pdf so it can't be edited free

**targetQuery:** how to lock a pdf so it can't be edited free
**Secondary keywords:** lock pdf from editing, prevent pdf editing, make pdf read only, protect pdf from editing free
**Search intent:** informational + transactional (user wants a step-by-step free method)
**Surface:** blog
**Slug:** how-to-lock-a-pdf-so-it-cant-be-edited-free

## Real questions from PAA / Reddit / Quora

1. How do you lock a PDF so it can't be edited?
2. What's the difference between a password to open a PDF and permission restrictions?
3. Can you lock a PDF from editing without Adobe Acrobat?
4. Does adding a PDF password actually stop someone from editing it?
5. How do you make a PDF read-only for free?
6. What happens when you flatten a PDF — does that stop editing?
7. Is there a free online tool to lock a PDF without signing up?

## Approaches competitors cover (gaps we can beat)

- **SysTools / Wondershare / FlippingBook:** Cover Adobe Acrobat, Mac Preview, and paid tools. Rarely explain WHY password protection works differently from permission restrictions.
- **Smallpdf:** Prompts sign-up for the free tier; paid tier for permission restrictions.
- **Gap we own:** Completely free, no account required, in-browser. We can also clearly explain:
  - The two types of PDF locks (open password vs. permission restrictions)
  - The flatten approach for stopping form-field edits (our flatten-pdf tool)
  - When password protection is and isn't the right tool

## Key facts to include (from tool-measurements.md)

- Our protect-pdf tool uses AES-256 encryption (via qpdf-wasm)
- Encrypting a 23.5 KB PDF adds about 1 KB overhead (+4.8%) — negligible for email size limits
- Encryption takes about 426 ms
- Wrong passwords are rejected (verified in testing)
- Unlocking returns the file to within ~100 bytes of its original size

## What to recommend honestly

- **For "lock so no one can open it":** Use protect-pdf (adds AES-256 open password)
- **For "lock form fields so they stay filled":** Use flatten-pdf before sharing (flattening bakes field values into the page)
- **Honest caveat:** Password-based locks can be removed by anyone who knows the password (that's the point), and low-quality PDF passwords can be brute-forced. For sensitive documents, consider whether encryption alone is sufficient.
- **Scope of our tool:** Our protect-pdf adds an open password (requires the password to view the file at all). It does not add selective permission restrictions (like "allow viewing but not editing") without requiring the password to open.

## Format recommendation

Blog post, 800 to 1000 words.

- Answer-first intro: target keyword + direct answer in first ~50 words
- H2: What does "locking" a PDF actually mean? (two-types explanation)
- H2: How to lock a PDF so it can't be edited (step-by-step, our tool)
- H2: How to lock PDF form fields so filled values can't be changed (flatten approach)
- H2: Does locking a PDF really stop editing?
- FAQ in frontmatter (not body)

## Internal links

- [Protect PDF](/protect-pdf)
- [Flatten PDF](/flatten-pdf)
- [Unlock PDF](/unlock-pdf)

## Credible outbound links to include

- PDF specification / ISO 32000 standard for context on encryption
- Wikipedia on AES-256 when explaining what the encryption actually is
