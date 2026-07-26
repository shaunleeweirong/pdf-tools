/**
 * Facts about who runs the site and how to reach them.
 *
 * These feed the About, Contact and Privacy pages and the Organization
 * structured data. Keep them true: a contact route that does not work is worse
 * than no contact route at all.
 */

/**
 * Public contact address. Unset by default on purpose, so a placeholder can
 * never ship. Set NEXT_PUBLIC_CONTACT_EMAIL to publish one; until then the
 * Contact page points at the repo, which is a real and monitored channel.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null

/** Public source repository. Issues here are a working contact channel. */
export const REPO_URL = 'https://github.com/shaunleeweirong/pdf-tools'

/** The year the site started publishing, for the About page and copyright. */
export const FOUNDED_YEAR = 2026

/**
 * The libraries that actually do the work, named on the About page so readers
 * can verify the client-side claim rather than take it on faith.
 */
export const STACK = [
  { name: 'pdf-lib', url: 'https://pdf-lib.js.org/', role: 'merging, splitting, rotating and page edits' },
  { name: 'pdf.js', url: 'https://mozilla.github.io/pdf.js/', role: 'rendering pages, used by compression and image export' },
  { name: 'qpdf (WebAssembly)', url: 'https://qpdf.sourceforge.io/', role: 'AES-256 password protection and removal' },
] as const
