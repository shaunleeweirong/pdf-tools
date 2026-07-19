import type { Metadata } from 'next'
import { siteJsonLd } from '@/lib/seo'
import { ToolGrid } from '@/components/ToolGrid'
import { PaperStack } from '@/components/PaperStack'

export const metadata: Metadata = { alternates: { canonical: '/' } }

export default function Home() {
  return (
    <main className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
      {siteJsonLd().map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
      <div
        aria-hidden
        className="hero-grid pointer-events-none absolute inset-x-0 top-0 -z-20 h-[520px]"
      />
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-[440px]"
      />
      <section className="mb-16 grid items-center gap-12 lg:mb-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="hero-in hero-in-1 mb-6 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
            <span className="inline-block size-2 bg-brand" aria-hidden />
            22 tools · free · no sign-up
          </p>
          <h1 className="hero-in hero-in-2 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-foreground sm:text-5xl sm:leading-[1.05] lg:text-6xl">
            Get it done — every PDF tool you need,{' '}
            <span className="font-display pr-[0.18em] text-[1.1em] font-normal italic text-brand">
              free
            </span>
          </h1>
          <p className="hero-in hero-in-3 mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted-foreground lg:mx-0">
            Merge, split, compress, convert, edit and sign in seconds. No account, no watermarks, no
            waiting — and the in-browser tools never upload your files.
          </p>
        </div>
        <div className="hero-in hero-in-4 hidden justify-center md:flex">
          <PaperStack />
        </div>
      </section>
      <ToolGrid />
    </main>
  )
}
