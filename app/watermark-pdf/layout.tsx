import type { Metadata } from 'next'
import { buildToolMetadata, toolJsonLd } from '@/lib/seo'

const SLUG = 'watermark-pdf'

export const metadata: Metadata = buildToolMetadata(SLUG)

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {toolJsonLd(SLUG).map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
      {children}
    </>
  )
}
