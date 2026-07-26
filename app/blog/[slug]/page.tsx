import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getPost, getPostSlugs, formatPostDate } from '@/lib/blog'
import { blogPostingJsonLd, breadcrumbJsonLd, faqPageJsonLd, SITE_URL } from '@/lib/seo'
import { DEFAULT_AUTHOR } from '@/lib/authors'
import { getTool, type Tool } from '@/lib/tools'
import { mdxComponents } from '@/components/mdx'
import { AuthorCard } from '@/components/AuthorCard'

export const dynamicParams = false

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (!getPostSlugs().includes(slug)) return {}
  const { meta } = getPost(slug)
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords.length ? meta.keywords : undefined,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: meta.title,
      description: meta.description,
      url: `/blog/${slug}`,
      publishedTime: meta.date || undefined,
      modifiedTime: meta.updated || meta.date || undefined,
      authors: [DEFAULT_AUTHOR.name],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!getPostSlugs().includes(slug)) notFound()
  const { meta, body } = getPost(slug)
  const { content } = await compileMDX({
    source: body,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  })
  const relatedTools = meta.toolSlugs
    .map(getTool)
    .filter((t): t is Tool => t !== undefined)

  const jsonLd: Record<string, unknown>[] = [
    blogPostingJsonLd(meta),
    breadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: 'Blog', url: `${SITE_URL}/blog` },
      { name: meta.title, url: `${SITE_URL}/blog/${slug}` },
    ]),
  ]
  if (meta.faq.length > 0) jsonLd.push(faqPageJsonLd(meta.faq))

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      {jsonLd.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
      <article>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">Blog</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-foreground">
          {meta.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>
            By{' '}
            <Link
              href={`/author/${DEFAULT_AUTHOR.slug}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {DEFAULT_AUTHOR.name}
            </Link>
            , {DEFAULT_AUTHOR.jobTitle}
          </span>
          <span aria-hidden>·</span>
          <span>Published {formatPostDate(meta.date)}</span>
          {meta.updated && meta.updated !== meta.date && (
            <>
              <span aria-hidden>·</span>
              <span>Updated {formatPostDate(meta.updated)}</span>
            </>
          )}
        </div>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{meta.description}</p>
        <div className="mt-10">{content}</div>
        {meta.faq.length > 0 && (
          <div className="mt-14 border-t border-border pt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <dl className="mt-4 space-y-5">
              {meta.faq.map((item, i) => (
                <div key={i}>
                  <dt className="font-medium text-foreground">{item.q}</dt>
                  <dd className="mt-1 leading-relaxed text-muted-foreground">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <AuthorCard author={DEFAULT_AUTHOR} />

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Researched and drafted with AI assistance, then reviewed and approved by a human before
          publishing. Claims about our own tools are measured on real files rather than assumed.{' '}
          <Link href="/editorial-policy" className="underline underline-offset-4 hover:text-foreground">
            How we work
          </Link>
          .
        </p>
      </article>

      {relatedTools.length > 0 && (
        <div className="mt-14 border-t border-border pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Tools in this post
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {relatedTools.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/${t.slug}`}
                  className="inline-block border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-12">
        <Link href="/blog" className="text-brand underline-offset-4 hover:underline">
          ← All posts
        </Link>
      </p>
    </main>
  )
}
