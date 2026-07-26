import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { DEFAULT_AUTHOR } from '@/lib/authors'
import { REPO_URL, STACK } from '@/lib/site'
import { SITE_NAME } from '@/lib/seo'
import { TOOL_SLUGS } from '@/lib/tools'

export const metadata: Metadata = {
  title: 'About pdf-tool',
  description:
    'Who builds pdf-tool, how the tools work, why they are free, and what happens to your files. Every tool runs in your browser.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">About {SITE_NAME}</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        {SITE_NAME} is a set of {TOOL_SLUGS.length} free PDF tools that run entirely inside your
        browser. No account, no upload queue, no watermark on the way out.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        Who builds it
      </h2>
      <div className="mt-5 flex items-start gap-5">
        <Image
          src={DEFAULT_AUTHOR.image}
          alt={DEFAULT_AUTHOR.name}
          width={64}
          height={64}
          className="size-16 shrink-0 rounded-full border border-border object-cover"
        />
        <p className="leading-relaxed text-muted-foreground">
          {DEFAULT_AUTHOR.bio}{' '}
          <Link
            href={`/author/${DEFAULT_AUTHOR.slug}`}
            className="text-foreground underline underline-offset-4"
          >
            More about {DEFAULT_AUTHOR.name}
          </Link>
          .
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        How the tools actually work
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        When you drop a file in, it is read by JavaScript running on your own machine. The work
        happens there and the result is handed straight back to you as a download. Your file is
        never sent to a server, which is why the tools keep working if you go offline after the
        page has loaded.
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        That is not a promise you have to take on trust. The heavy lifting is done by open source
        libraries you can look up, and the site itself is public:
      </p>
      <ul className="mt-4 space-y-2 text-muted-foreground">
        {STACK.map((s) => (
          <li key={s.name}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              {s.name}
            </a>{' '}
            for {s.role}.
          </li>
        ))}
      </ul>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        The source is at{' '}
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-4"
        >
          github.com/shaunleeweirong/pdf-tools
        </a>
        . Open your browser devtools on any tool page and watch the network tab while you run a
        job: nothing leaves.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        Why it is free
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Running in your browser means there are no per-file server costs to recover, so the tools
        here cost nothing to offer and nothing to use. There is no paid tier today and no account
        to create. If server-side tools are ever added, the ones that upload your file will say so
        plainly on the page, because the distinction is the whole point.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        What we do not do
      </h2>
      <ul className="mt-4 space-y-2 leading-relaxed text-muted-foreground">
        <li>No analytics, no tracking pixels, no third party scripts.</li>
        <li>No accounts, so nothing to sign up for and nothing to delete.</li>
        <li>No file storage, because files are never received in the first place.</li>
        <li>No watermarks, page limits, or daily caps.</li>
      </ul>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        The full detail is on the{' '}
        <Link href="/privacy" className="text-foreground underline underline-offset-4">
          privacy page
        </Link>
        , and how the writing here gets made and checked is on the{' '}
        <Link href="/editorial-policy" className="text-foreground underline underline-offset-4">
          editorial policy page
        </Link>
        .
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        Getting in touch
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Corrections and bug reports are genuinely welcome, especially on the blog. See the{' '}
        <Link href="/contact" className="text-foreground underline underline-offset-4">
          contact page
        </Link>
        .
      </p>
    </main>
  )
}
