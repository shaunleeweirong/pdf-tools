import type { MetadataRoute } from 'next'
import { buildSitemap, SITE_URL } from '@/lib/seo'
import { getAllPosts } from '@/lib/blog'
import { USE_CASES } from '@/content/use-cases'
import { AUTHORS } from '@/lib/authors'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const blog: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.7 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
  const useCases: MetadataRoute.Sitemap = USE_CASES.map((u) => ({
    url: `${SITE_URL}/${u.tool}/${u.useCase}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))
  const authors: MetadataRoute.Sitemap = AUTHORS.map((a) => ({
    url: `${SITE_URL}/author/${a.slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))
  // Trust pages. Rarely change, but they need to be discoverable: they are what
  // a reader (or a quality rater) looks for to work out who is behind the site.
  const trust: MetadataRoute.Sitemap = [
    '/about',
    '/editorial-policy',
    '/privacy',
    '/contact',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'yearly' as const,
    priority: 0.4,
  }))
  return [...buildSitemap(), ...blog, ...useCases, ...authors, ...trust]
}
