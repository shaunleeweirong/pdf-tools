import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/site'
import { DEFAULT_AUTHOR } from '@/lib/authors'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'How to report a bug, correct something in an article, or reach the person who builds pdf-tool.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">Contact</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        One person builds and writes this site. Messages reach {DEFAULT_AUTHOR.name} directly.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        A tool is broken, or gave a bad result
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Get in touch using one of the routes below. It helps enormously to say which tool, which
        browser, and roughly what the file was: how many pages, whether it was a scan or a typed
        document, and how big it was. Please do not send the file itself if it has anything private
        in it, since a description is almost always enough to reproduce the problem.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        Something in an article is wrong
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Tell us and it gets fixed, with the change noted on the post. Accuracy on the blog is
        checked against real measurements rather than assumed, and outside corrections are part of
        that. The{' '}
        <Link href="/editorial-policy" className="text-foreground underline underline-offset-4">
          editorial policy
        </Link>{' '}
        explains how posts are researched, tested, and reviewed.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        How to reach us
      </h2>
      {CONTACT_EMAIL ? (
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Email{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-foreground underline underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>
          . Everything is read, and anything that turns out to be a real problem gets fixed.
        </p>
      ) : null}
      <ul className="mt-4 space-y-2 text-muted-foreground">
        {DEFAULT_AUTHOR.sameAs.map((url) => (
          <li key={url}>
            <a
              href={url}
              target="_blank"
              rel="me noopener noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              {new URL(url).hostname.replace(/^www\./, '')}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Messages go to {DEFAULT_AUTHOR.name} directly, so a reply may take a few days, but it will
        come from the person who can actually change the thing you are writing about.
      </p>
    </main>
  )
}
