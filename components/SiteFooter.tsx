import Link from 'next/link'
import { SITE_NAME } from '@/lib/seo'
import { FOUNDED_YEAR } from '@/lib/site'

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/editorial-policy', label: 'Editorial policy' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/contact', label: 'Contact' },
]

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <span className="inline-block size-1.5 bg-brand" aria-hidden />
          All tools run in your browser, your files never leave your device.
        </p>
        <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="mt-6 text-xs text-muted-foreground">
          &copy; {FOUNDED_YEAR} {SITE_NAME}
        </p>
      </div>
    </footer>
  )
}
