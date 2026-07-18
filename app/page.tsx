import { ToolGrid } from '@/components/ToolGrid'

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <section className="mb-14 flex flex-col items-center text-center">
        <p className="mb-6 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
          <span className="inline-block size-2 bg-brand" aria-hidden />
          22 tools · 100% in your browser
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-foreground sm:text-5xl sm:leading-[1.05] lg:text-6xl">
          Every PDF tool you need,{' '}
          <span className="font-display pr-[0.18em] text-[1.1em] font-normal italic text-brand">
            free
          </span>{' '}
          &amp; private
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Merge, split, convert, edit, sign and more. Nothing is uploaded — every file is processed
          right on your device.
        </p>
      </section>
      <ToolGrid />
    </main>
  )
}
