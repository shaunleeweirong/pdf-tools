import { describe, it, expect } from 'vitest'
import { TOOL_SLUGS } from '@/lib/tools'
import {
  SITE_URL,
  getToolSeo,
  buildToolMetadata,
  toolJsonLd,
  siteJsonLd,
  buildSitemap,
  buildRobots,
  buildRootMetadata,
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

describe('buildSitemap', () => {
  it('lists the homepage and every tool with absolute URLs', () => {
    const s = buildSitemap()
    expect(s[0].url).toBe(SITE_URL)
    for (const slug of TOOL_SLUGS) {
      expect(s.some((e) => e.url === `${SITE_URL}/${slug}`)).toBe(true)
    }
    expect(s).toHaveLength(TOOL_SLUGS.length + 1)
  })
})

describe('buildRobots', () => {
  it('allows all crawlers and points at the sitemap', () => {
    const r = buildRobots()
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules
    expect(rule.allow).toBe('/')
    expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`)
  })
})

describe('buildRootMetadata', () => {
  it('sets metadataBase and a title template', () => {
    const m = buildRootMetadata()
    expect(m.metadataBase?.toString()).toContain('http')
    expect((m.title as { template?: string }).template).toContain('%s')
    expect(m.robots).toEqual({ index: true, follow: true })
  })
})
