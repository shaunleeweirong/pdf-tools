export interface Author {
  slug: string
  name: string
  jobTitle: string
  bio: string
  /** Path under public/, e.g. /authors/chris-p.jpg */
  image: string
  sameAs: string[]
  knowsAbout: string[]
}

export const AUTHORS: Author[] = [
  {
    slug: 'chris-p',
    name: 'Chris P.',
    jobTitle: 'Founder, pdf-tool',
    bio: 'Chris P. builds pdf-tool. A marketer and developer (ex-LinkedIn, ex-Oracle) with over a decade running growth and demand generation for B2B brands, he now writes about getting everyday PDF tasks done simply and privately.',
    image: '/authors/chris-p.jpg',
    sameAs: ['https://www.linkedin.com/in/sean-p/', 'https://github.com/shaunleeweirong'],
    knowsAbout: ['PDF tools', 'Web development', 'SEO', 'B2B marketing', 'Demand generation'],
  },
]

/** The single default author applied to every blog post. */
export const DEFAULT_AUTHOR = AUTHORS[0]

export function getAuthor(slug: string): Author | undefined {
  return AUTHORS.find((a) => a.slug === slug)
}
