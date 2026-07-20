import { ImageResponse } from 'next/og'

export const alt = 'pdf-tool — free PDF tools, get it done in your browser'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0a0a0a',
          color: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '36px', height: '36px', background: '#0044ff' }} />
          <div style={{ fontSize: '44px', fontWeight: 700, letterSpacing: '-0.02em' }}>pdf-tool</div>
        </div>
        <div
          style={{
            marginTop: '44px',
            fontSize: '68px',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: '900px',
          }}
        >
          Get it done — every PDF tool you need, free.
        </div>
        <div style={{ marginTop: '32px', fontSize: '30px', color: '#a1a1a1' }}>
          Merge, split, compress, convert, edit & sign — right in your browser.
        </div>
      </div>
    ),
    { ...size },
  )
}
