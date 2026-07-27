import type { Metadata } from 'next'
import Link from 'next/link'
import { DEFAULT_AUTHOR } from '@/lib/authors'
import { SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Editorial policy',
  description:
    'How articles on pdf-tool are researched, drafted, tested against real measurements, reviewed by a human, and corrected. Includes our use of AI.',
  alternates: { canonical: '/editorial-policy' },
}

const UPDATED = '27 July 2026'

export default function EditorialPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">Editorial policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated {UPDATED}</p>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        How articles here get made, who is answerable for them, and where AI fits in. Written
        plainly, because a policy that needs decoding is not a disclosure.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        Who is responsible
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Every article is published under{' '}
        <Link
          href={`/author/${DEFAULT_AUTHOR.slug}`}
          className="text-foreground underline underline-offset-4"
        >
          {DEFAULT_AUTHOR.name}
        </Link>
        , who reviews and approves each one before it goes live and is accountable for what it
        says. A byline here means a person read it and stands behind it, not that a person typed
        every word.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        How we use AI
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        We use AI to research topics and produce first drafts. Specifically: to find the questions
        people actually ask about a problem, to gather what existing pages do and do not answer,
        and to turn that into a draft.
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        No draft publishes itself. Every one waits in a review queue until a human opens it, reads
        it, and approves, rejects, or sends it back with notes. Nothing reaches the site on a
        schedule or without that step.
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        We are telling you this because you should be able to weigh it. The risk with AI-written
        how-to content is that it produces confident, fluent instructions that were never checked
        against the thing they describe. That failure mode is real, and the next section is how we
        guard against it.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        Claims about our tools are measured, not assumed
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        When an article says what one of our tools does to a file, that comes from running the tool
        on a known file and recording the result. We keep a fixed set of test documents and a
        script that drives the real site in a real browser, so the numbers in a post are
        reproducible rather than illustrative.
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        This has already changed what we publish. Testing showed our in-browser compressor makes
        text-only PDFs much larger rather than smaller, because it rasterizes pages to images. That
        is the opposite of what most compression advice assumes, so articles that had repeated the
        common wisdom were corrected to say when compression is the wrong move.
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Where we have not tested something, we do not imply that we have. Facts about the wider
        world, such as an attachment limit set by an email provider or how a PDF standard works, are
        linked to the primary source so you can check them yourself.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        Corrections
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        If something here is wrong, we want to know and we will fix it. Substantive corrections are
        noted on the article and the updated date changes. We do not quietly edit a claim and leave
        the original date in place. Reach us through the{' '}
        <Link href="/contact" className="text-foreground underline underline-offset-4">
          contact page
        </Link>
        .
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        What we will not do
      </h2>
      <ul className="mt-4 space-y-2 leading-relaxed text-muted-foreground">
        <li>Invent test results, benchmarks, or user numbers.</li>
        <li>
          Recommend one of our own tools for a job it does badly. {SITE_NAME} articles say when to
          use something else, including a competitor or a built-in feature of your operating
          system.
        </li>
        <li>Publish paid placements or affiliate links dressed up as recommendations.</li>
        <li>Pad an article to hit a word count.</li>
      </ul>
    </main>
  )
}
