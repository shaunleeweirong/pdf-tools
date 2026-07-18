import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold">pdf-tool</Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">All tools</Link>
      </div>
    </header>
  )
}
