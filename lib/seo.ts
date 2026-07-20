import type { Metadata, MetadataRoute } from 'next'
import { getTool, TOOL_SLUGS } from '@/lib/tools'
import { SEO_CONTENT, type FaqItem } from '@/lib/seo-content'

export const SITE_NAME = 'pdf-tool'
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pdf-tool-blue.vercel.app'
).replace(/\/$/, '')
export const TAGLINE =
  'Every PDF tool you need — get it done in seconds, free and in your browser.'

export interface ToolSeo {
  name: string
  title: string
  description: string
  intro: string
  steps: string[]
  faq: FaqItem[]
}

export function getToolSeo(slug: string): ToolSeo {
  const tool = getTool(slug)
  if (!tool) throw new Error(`Unknown tool slug: ${slug}`)
  const override = SEO_CONTENT[slug]
  const description =
    override?.description ??
    `${tool.description} 100% free, no sign-up — processed right in your browser.`
  return {
    name: tool.name,
    title: override?.title ?? `${tool.name} online — free, in your browser`,
    description,
    intro: override?.intro ?? description,
    steps: override?.steps ?? [],
    faq: override?.faq ?? [],
  }
}

export function buildToolMetadata(slug: string): Metadata {
  const { title, description } = getToolSeo(slug)
  const path = `/${slug}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE_NAME, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export function toolJsonLd(slug: string): Record<string, unknown>[] {
  const { name, description, steps, faq } = getToolSeo(slug)
  const graph: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: `${name} — ${SITE_NAME}`,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      url: `${SITE_URL}/${slug}`,
      description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  ]
  if (steps.length > 0) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to ${name.toLowerCase()}`,
      description,
      step: steps.map((text, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        text,
      })),
    })
  }
  if (faq.length > 0) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }
  return graph
}

// Owned brand profiles for entity recognition (ChatGPT/Bing). Add each URL as
// the profile is created (X, LinkedIn, GitHub, Product Hunt, Crunchbase…).
export const SAME_AS: string[] = []

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    description: TAGLINE,
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  }
}

export function siteJsonLd(): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: TAGLINE,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      url: SITE_URL,
      description: TAGLINE,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    organizationJsonLd(),
  ]
}

export function buildSitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: SITE_URL, lastModified, changeFrequency: 'weekly', priority: 1 },
    ...TOOL_SLUGS.map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}

export function buildRobots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

export function buildRootMetadata(): Metadata {
  const title = 'Free PDF tools — get it done in your browser'
  const description =
    'Merge, split, compress, convert, edit and sign PDFs. Free, no sign-up, and processed right in your browser.'
  const verification: NonNullable<Metadata['verification']> = {}
  if (process.env.GOOGLE_SITE_VERIFICATION) {
    verification.google = process.env.GOOGLE_SITE_VERIFICATION
  }
  if (process.env.BING_SITE_VERIFICATION) {
    verification.other = { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
  }
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${SITE_NAME}` },
    description,
    applicationName: SITE_NAME,
    openGraph: { type: 'website', siteName: SITE_NAME, title, description },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
    ...(Object.keys(verification).length ? { verification } : {}),
  }
}
