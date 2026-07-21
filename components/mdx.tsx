import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

// Branded element components for MDX blog bodies (rendered by next-mdx-remote).
// The post's H1/date/description are rendered by the page; MDX bodies start at H2.

function Anchor({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  const cls = 'text-brand underline-offset-4 hover:underline'
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
      {children}
    </a>
  )
}

export const mdxComponents = {
  h2: (p: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="mt-10 text-2xl font-semibold tracking-tight text-foreground" {...p} />
  ),
  h3: (p: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mt-8 text-xl font-semibold tracking-tight text-foreground" {...p} />
  ),
  p: (p: ComponentPropsWithoutRef<'p'>) => (
    <p className="mt-4 leading-relaxed text-muted-foreground" {...p} />
  ),
  ul: (p: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground" {...p} />
  ),
  ol: (p: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground" {...p} />
  ),
  li: (p: ComponentPropsWithoutRef<'li'>) => <li className="leading-relaxed" {...p} />,
  a: Anchor,
  strong: (p: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold text-foreground" {...p} />
  ),
  blockquote: (p: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="mt-6 border-l-2 border-brand pl-4 italic text-muted-foreground" {...p} />
  ),
  code: (p: ComponentPropsWithoutRef<'code'>) => <code className="font-mono text-sm" {...p} />,
  pre: (p: ComponentPropsWithoutRef<'pre'>) => (
    <pre className="mt-6 overflow-x-auto border border-border p-4 font-mono text-sm" {...p} />
  ),
  hr: () => <hr className="my-10 border-border" />,
  table: (p: ComponentPropsWithoutRef<'table'>) => (
    <table className="mt-6 w-full border-collapse text-sm" {...p} />
  ),
  th: (p: ComponentPropsWithoutRef<'th'>) => (
    <th className="border border-border px-3 py-2 text-left font-semibold text-foreground" {...p} />
  ),
  td: (p: ComponentPropsWithoutRef<'td'>) => (
    <td className="border border-border px-3 py-2 text-muted-foreground" {...p} />
  ),
}
