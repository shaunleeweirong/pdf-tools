import { ToolGrid } from '@/components/ToolGrid'

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <section className="mb-16 flex flex-col items-center text-center sm:mb-20">
        <p className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <span className="inline-block size-2 bg-brand" aria-hidden />
          22 tools · 100% in your browser
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.03] tracking-[-0.03em] text-foreground sm:text-6xl">
          Every PDF tool you need,{' '}
          <span className="font-display text-[1.15em] font-normal italic text-brand">free</span> &amp;
          private
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
