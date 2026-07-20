import { describe, it, expect } from 'vitest'
import { TOOL_SLUGS } from '@/lib/tools'
import { getToolSeo, toolJsonLd, siteJsonLd, organizationJsonLd, SITE_URL } from '@/lib/seo'

describe('getToolSeo content', () => {
  it('returns a non-empty intro for every tool', () => {
    for (const slug of TOOL_SLUGS) {
      expect(getToolSeo(slug).intro.length, `${slug} intro`).toBeGreaterThan(20)
    }
  })

  it('every tool has visible how-to steps and at least one FAQ', () => {
    for (const slug of TOOL_SLUGS) {
      const seo = getToolSeo(slug)
      expect(seo.steps.length, `${slug} steps`).toBeGreaterThan(0)
      expect(seo.faq.length, `${slug} faq`).toBeGreaterThan(0)
    }
  })
})

describe('toolJsonLd HowTo', () => {
  it('includes a HowTo with positioned steps when the tool has steps', () => {
    const g = toolJsonLd('merge-pdf')
    const howto = g.find((n) => n['@type'] === 'HowTo') as
      | { step: Array<{ '@type': string; position: number }> }
      | undefined
    expect(howto).toBeTruthy()
    expect(Array.isArray(howto!.step)).toBe(true)
    expect(howto!.step[0]['@type']).toBe('HowToStep')
    expect(howto!.step[0].position).toBe(1)
  })
})

describe('organization schema', () => {
  it('organizationJsonLd carries name, url and logo', () => {
    const org = organizationJsonLd() as { '@type': string; url: string; logo: string }
    expect(org['@type']).toBe('Organization')
    expect(org.url).toBe(SITE_URL)
    expect(org.logo).toContain(SITE_URL)
  })

  it('siteJsonLd includes the Organization node', () => {
    expect(siteJsonLd().some((n) => n['@type'] === 'Organization')).toBe(true)
  })
})
