import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #3a1a10 0%, #6b2314 55%, #a52d15 100%)',
          fontFamily: 'sans-serif',
          padding: '64px',
        }}
      >
        <span style={{ fontSize: 72, marginBottom: 22 }}>🛕</span>
        <span
          style={{
            display: 'flex',
            color: 'white',
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 18,
          }}
        >
          Temple Heritage
        </span>
        <span style={{ display: 'flex', color: '#f0ddc8', fontSize: 30, maxWidth: 820 }}>
          Discover India&apos;s temples, festivals and personalized pilgrimage journeys
        </span>
      </div>
    ),
    { ...size }
  )
}
