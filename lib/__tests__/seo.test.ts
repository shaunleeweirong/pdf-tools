import { describe, it, expect } from 'vitest'
import { TOOL_SLUGS } from '@/lib/tools'
import {
  SITE_URL,
  getToolSeo,
  buildToolMetadata,
  toolJsonLd,
  siteJsonLd,
} from '@/lib/seo'

describe('getToolSeo', () => {
  it('returns a non-empty title and description for every tool', () => {
    for (const slug of TOOL_SLUGS) {
      const seo = getToolSeo(slug)
      expect(seo.title.length).toBeGreaterThan(10)
      expect(seo.description.length).toBeGreaterThan(30)
    }
  })

  it('throws on an unknown slug', () => {
    expect(() => getToolSeo('does-not-exist')).toThrow()
  })
})

describe('buildToolMetadata', () => {
  it('sets a slug-relative canonical and title', () => {
    const m = buildToolMetadata('merge-pdf')
    expect(m.alternates?.canonical).toBe('/merge-pdf')
    expect(typeof m.title).toBe('string')
    expect(m.openGraph?.url).toBe('/merge-pdf')
  })
})

describe('toolJsonLd', () => {
  it('includes a free SoftwareApplication with an absolute url', () => {
    const g = toolJsonLd('merge-pdf')
    const app = g.find((n) => n['@type'] === 'SoftwareApplication') as any
    expect(app).toBeTruthy()
    expect(app.offers.price).toBe('0')
    expect(app.url).toBe(`${SITE_URL}/merge-pdf`)
  })

  it('adds an FAQPage when the tool has FAQ content', () => {
    const g = toolJsonLd('merge-pdf')
    expect(g.some((n) => n['@type'] === 'FAQPage')).toBe(true)
  })
})

describe('siteJsonLd', () => {
  it('includes WebSite and SoftwareApplication nodes', () => {
    const g = siteJsonLd()
    expect(g.some((n) => n['@type'] === 'WebSite')).toBe(true)
    expect(g.some((n) => n['@type'] === 'SoftwareApplication')).toBe(true)
  })
})
