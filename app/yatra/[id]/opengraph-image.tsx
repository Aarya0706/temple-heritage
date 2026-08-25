import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: yatra } = await supabase
    .from('yatra_plans')
    .select('title, itinerary')
    .eq('id', id)
    .eq('is_public', true)
    .maybeSingle()

  const title = yatra?.title ?? 'A Yatra on Temple Heritage'
  const days = yatra?.itinerary?.days ?? []
  const dayCount = days.length
  const from: string = yatra?.itinerary?.from ?? ''
  const region: string = yatra?.itinerary?.displayRegion ?? yatra?.itinerary?.region ?? ''
  const stops: string[] = Array.from(
    new Set(days.map((d: { title?: string }) => d?.title).filter(Boolean))
  ).slice(0, 3) as string[]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #3a1a10 0%, #6b2314 55%, #a52d15 100%)',
          fontFamily: 'sans-serif',
          padding: '64px 68px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🪷</span>
          <span style={{ fontSize: 22, color: '#ffc05a', fontWeight: 700, letterSpacing: 1 }}>
            TEMPLE HERITAGE · AI YATRA PLANNER
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              display: 'flex',
              color: 'white',
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 22,
              maxWidth: 1000,
            }}
          >
            {title}
          </span>

          <div style={{ display: 'flex', gap: 22, fontSize: 24, color: '#ffe3c2', marginBottom: stops.length ? 18 : 0 }}>
            {dayCount > 0 && <span style={{ display: 'flex' }}>{dayCount}-day itinerary</span>}
            {from && <span style={{ display: 'flex' }}>From {from}</span>}
            {region && <span style={{ display: 'flex' }}>{region}</span>}
          </div>

          {stops.length > 0 && (
            <span style={{ display: 'flex', color: '#f0ddc8', fontSize: 22 }}>
              {stops.join('  ·  ')}
            </span>
          )}
        </div>
      </div>
    ),
    { ...size }
  )
}
