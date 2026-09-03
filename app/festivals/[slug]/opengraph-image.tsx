import { ImageResponse } from 'next/og'
import { festivals } from '@/data/festivals'
import { slugify } from '@/lib/slug'
import { resolveImageUrl } from '@/lib/site-url'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const festival = festivals.find((f) => slugify(f.name) === slug)

  const name = festival?.name ?? 'Temple Heritage'
  const place = festival?.place ?? "India's Sacred Heritage"
  const month = festival?.month ?? ''
  // festival.imageUrl is sometimes a relative /festivals/... path —
  // ImageResponse fetches this over the network, so it has to be absolute.
  const image = resolveImageUrl(festival?.imageUrl)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#3a1a10',
          fontFamily: 'sans-serif',
        }}
      >
        {image && (
          <img
            src={image}
            alt=""
            width={1200}
            height={630}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background:
              'linear-gradient(0deg, rgba(30,12,7,0.92) 0%, rgba(30,12,7,0.55) 45%, rgba(30,12,7,0.25) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            width: '100%',
            height: '100%',
            padding: '56px 64px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <span style={{ fontSize: 26 }}>🪔</span>
            <span style={{ fontSize: 22, color: '#ffc05a', fontWeight: 700, letterSpacing: 1 }}>
              TEMPLE HERITAGE · FESTIVAL
            </span>
          </div>
          {month && (
            <span
              style={{
                display: 'flex',
                color: '#ffc05a',
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              {month}
            </span>
          )}
          <span
            style={{
              display: 'flex',
              color: 'white',
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: 20,
              maxWidth: 1000,
            }}
          >
            {name}
          </span>
          <span style={{ display: 'flex', color: '#f0ddc8', fontSize: 28 }}>
            {place}
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
