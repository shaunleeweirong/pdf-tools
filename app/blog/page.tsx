import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPosts, formatPostDate } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog — free PDF tips & how-tos',
  description:
    'How-tos and guides for getting PDF tasks done — free, no sign-up, right in your browser.',
  alternates: { canonical: '/blog' },
}

export default function BlogIndex() {
  const posts = getAllPosts()

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">Blog</h1>
      <p className="mt-3 text-muted-foreground">
        How-tos and guides for getting PDF tasks done — free and right in your browser.
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No posts yet.</p>
      ) : (
        <ul className="mt-10 space-y-8">
          {posts.map((p) => (
            <li key={p.slug} className="border-t border-border pt-6">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {formatPostDate(p.date)}
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                <Link href={`/blog/${p.slug}`} className="transition-colors hover:text-brand">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{p.description}</p>
              <Link
                href={`/blog/${p.slug}`}
                className="mt-3 inline-block text-sm text-brand underline-offset-4 hover:underline"
              >
                Read →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
