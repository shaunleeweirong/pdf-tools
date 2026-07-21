import { describe, it, expect } from 'vitest'
import { USE_CASES, getUseCase } from '@/content/use-cases'
import { getTool } from '@/lib/tools'
import { buildUseCaseJsonLd, SITE_URL } from '@/lib/seo'

// Tools that have an embeddable runner in components/UseCaseTool. Keep in sync
// with RUNNERS there; this guard fails if a use-case targets a tool without one.
const EMBEDDABLE = new Set(['compress-pdf', 'merge-pdf', 'jpg-to-pdf', 'pdf-to-jpg'])

describe('use-cases data', () => {
  it('every use case has content and a valid, embeddable tool', () => {
    for (const uc of USE_CASES) {
      expect(getTool(uc.tool), `${uc.tool} is a real tool`).toBeTruthy()
      expect(EMBEDDABLE.has(uc.tool), `${uc.tool} has a runner`).toBe(true)
      expect(uc.intro.length).toBeGreaterThan(20)
      expect(uc.steps.length).toBeGreaterThan(0)
      expect(uc.faq.length).toBeGreaterThan(0)
      expect(uc.title.length).toBeGreaterThan(10)
    }
  })

  it('use-case slugs are unique', () => {
    const keys = USE_CASES.map((u) => `${u.tool}/${u.useCase}`)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('getUseCase resolves known and rejects unknown', () => {
    expect(getUseCase('compress-pdf', 'for-email')).toBeTruthy()
    expect(getUseCase('nope', 'nope')).toBeUndefined()
  })
})

describe('buildUseCaseJsonLd', () => {
  it('emits SoftwareApplication + HowTo + FAQPage with an absolute url', () => {
    const uc = getUseCase('compress-pdf', 'for-email')!
    const g = buildUseCaseJsonLd(uc)
    const types = g.map((n) => n['@type'])
    expect(types).toContain('SoftwareApplication')
    expect(types).toContain('HowTo')
    expect(types).toContain('FAQPage')
    const app = g.find((n) => n['@type'] === 'SoftwareApplication') as { url: string }
    expect(app.url).toBe(`${SITE_URL}/compress-pdf/for-email`)
  })
})
