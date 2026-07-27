import { ImageResponse } from 'next/og'
import { getPost, getPostSlugs } from '@/lib/blog'
import { DEFAULT_AUTHOR } from '@/lib/authors'

export const alt = 'pdf-tool blog post'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { meta } = getPost(slug)
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: '#0a0a0a',
          color: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '28px', height: '28px', background: '#0044ff' }} />
          <div style={{ fontSize: '30px', fontWeight: 700 }}>pdf-tool blog</div>
        </div>
        <div
          style={{
            fontSize: '62px',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: '1000px',
          }}
        >
          {meta.title}
        </div>
        <div style={{ fontSize: '26px', color: '#a1a1a1' }}>{`By ${DEFAULT_AUTHOR.name}`}</div>
      </div>
    ),
    { ...size },
  )
}
