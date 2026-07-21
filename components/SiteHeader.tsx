import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          pdf<span className="text-brand">·</span>tool
        </Link>
        <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            All tools
          </Link>
          <Link href="/blog" className="transition-colors hover:text-foreground">
            Blog
          </Link>
        </nav>
      </div>
    </header>
  )
}
