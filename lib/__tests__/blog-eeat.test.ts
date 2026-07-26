import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { getAllPosts, getPost, getPostSlugs } from '@/lib/blog'

/**
 * E-E-A-T guardrails for published posts.
 *
 * These encode the requirements from docs/marketing/tool-measurements.md and
 * the editorial policy page, so a future draft cannot quietly regress them.
 * Every rule here failed on at least one live post before it was added.
 */

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const raw = (slug: string) => fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), 'utf8')

describe('blog E-E-A-T requirements', () => {
  it('has posts to check', () => {
    expect(getPostSlugs().length).toBeGreaterThan(0)
  })

  it('every post carries an FAQ, which is what emits FAQPage schema', () => {
    const missing = getAllPosts()
      .filter((p) => p.faq.length === 0)
      .map((p) => p.slug)
    expect(missing, `posts with no faq frontmatter: ${missing.join(', ')}`).toEqual([])
  })

  it('every post declares a last-updated date for dateModified', () => {
    const missing = getPostSlugs().filter((slug) => !/^updated:/m.test(raw(slug)))
    expect(missing, `posts with no updated date: ${missing.join(', ')}`).toEqual([])
  })

  it('every post cites at least one outbound source', () => {
    const missing = getPostSlugs().filter((slug) => !/\]\(https?:\/\//.test(raw(slug)))
    expect(missing, `posts with no outbound link: ${missing.join(', ')}`).toEqual([])
  })

  it('no post duplicates its FAQ in the body, which would double the schema', () => {
    const dupes = getPostSlugs().filter((slug) => /^##\s+Frequently asked/im.test(raw(slug)))
    expect(dupes, `posts with a body FAQ section: ${dupes.join(', ')}`).toEqual([])
  })

  it('no post uses em-dashes or en-dashes', () => {
    const offenders = getPostSlugs().filter((slug) => /[—–]/.test(raw(slug)))
    expect(offenders, `posts containing dashes: ${offenders.join(', ')}`).toEqual([])
  })

  it('every post is substantial enough to be worth publishing', () => {
    const thin = getPostSlugs()
      .map((slug) => ({ slug, words: getPost(slug).body.trim().split(/\s+/).length }))
      .filter((p) => p.words < 800)
    expect(thin, `posts under 800 words: ${thin.map((p) => `${p.slug} (${p.words})`).join(', ')}`)
      .toEqual([])
  })

  /**
   * Measured in July 2026: the compressor rasterizes pages, so it enlarges text
   * PDFs rather than shrinking them, and a second pass enlarges any PDF. Posts
   * repeatedly claimed the opposite. Catch the specific phrasings that were wrong.
   */
  it('no post claims compression is lossless or harmless for text PDFs', () => {
    const patterns = [
      /text[^.]{0,60}not affected by compression/i,
      /compress[^.]{0,60}text[^.]{0,40}(no visible quality change|quality is preserved)/i,
      /vector data[^.]{0,80}not affected/i,
    ]
    const offenders = getPostSlugs().filter((slug) =>
      patterns.some((re) => re.test(raw(slug))),
    )
    expect(offenders, `posts with a disproven compression claim: ${offenders.join(', ')}`).toEqual(
      [],
    )
  })

  it('no post recommends compressing the same file twice', () => {
    const patterns = [
      /run.{0,40}(compressed|through).{0,40}(again|second time)/i,
      /each pass (reduces|removes)/i,
    ]
    const offenders = getPostSlugs().filter((slug) => {
      const text = raw(slug)
      // Allowed when the post is explicitly warning against it.
      if (/do not compress (the same file )?twice|do not run it through a second time/i.test(text)) {
        return false
      }
      return patterns.some((re) => re.test(text))
    })
    expect(offenders, `posts recommending a second pass: ${offenders.join(', ')}`).toEqual([])
  })
})
