import { ImageResponse } from 'next/og'

export const size = { width: 256, height: 256 }
export const contentType = 'image/png'

// Brand favicon / app icon (also referenced as the Organization logo in JSON-LD).
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0044ff',
          color: '#fafafa',
          fontSize: '160px',
          fontWeight: 700,
        }}
      >
        P
      </div>
    ),
    { ...size },
  )
}
