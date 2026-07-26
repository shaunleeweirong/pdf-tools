import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { AUTHORS, getAuthor } from '@/lib/authors'
import { getAllPosts, formatPostDate } from '@/lib/blog'
import { profilePageJsonLd } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return AUTHORS.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const author = getAuthor(slug)
  if (!author) return {}
  return {
    title: `${author.name} — ${author.jobTitle}`,
    description: author.bio,
    alternates: { canonical: `/author/${slug}` },
  }
}

function profileHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = getAuthor(slug)
  if (!author) notFound()
  const posts = getAllPosts() // single author → all posts

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd(author)) }}
      />
      <div className="flex items-center gap-5">
        <Image
          src={author.image}
          alt={author.name}
          width={80}
          height={80}
          className="size-20 shrink-0 rounded-full border border-border object-cover"
        />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{author.name}</h1>
          <p className="mt-1 text-muted-foreground">{author.jobTitle}</p>
        </div>
      </div>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{author.bio}</p>

      {author.sameAs.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {author.sameAs.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="me noopener noreferrer"
              className="inline-block border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
            >
              {profileHost(url)}
            </a>
          ))}
        </div>
      )}

      {author.knowsAbout.length > 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Writes about:</span>{' '}
          {author.knowsAbout.join(', ')}
        </p>
      )}

      <div className="mt-14 border-t border-border pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Posts by {author.name}
        </h2>
        <ul className="mt-4 space-y-4">
          {posts.map((p) => (
            <li key={p.slug} className="flex flex-wrap items-baseline gap-x-3">
              <Link href={`/blog/${p.slug}`} className="text-foreground hover:text-brand">
                {p.title}
              </Link>
              <span className="text-sm text-muted-foreground">{formatPostDate(p.date)}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
