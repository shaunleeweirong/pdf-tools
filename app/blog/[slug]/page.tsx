import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getPost, getPostSlugs, formatPostDate } from '@/lib/blog'
import { blogPostingJsonLd } from '@/lib/seo'
import { getTool, type Tool } from '@/lib/tools'
import { mdxComponents } from '@/components/mdx'

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
    openGraph: { type: 'article', title: meta.title, description: meta.description, url: `/blog/${slug}` },
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

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd(meta)) }}
      />
      <article>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {formatPostDate(meta.date)}
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-foreground">
          {meta.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{meta.description}</p>
        <div className="mt-10">{content}</div>
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
