import { Flame, MapPinned, Lock } from 'lucide-react'
import { REGIONS, type YatraStats } from '@/lib/yatra-stats'

const REGION_ICON: Record<string, string> = {
  'North India': '🏔️',
  'South India': '🛕',
  'East India': '🌊',
  'West India': '🏜️',
  'Central India': '🌳',
}

export default function YatraStatsBlock({ stats }: { stats: YatraStats }) {
  const { completedCount, streak, unlockedRegions } = stats
  const unlockedSet = new Set(unlockedRegions)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        background: 'linear-gradient(135deg, #fff8f0, #fff2e0)',
        border: '1px solid #f0ddc8',
        borderRadius: 16,
        padding: '22px 24px',
        marginBottom: 40,
      }}
    >
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#a52d15', lineHeight: 1 }}>
            {completedCount}
          </div>
          <div style={{ fontSize: 13, color: '#8c6a54', marginTop: 4 }}>
            Yatra{completedCount === 1 ? '' : 's'} completed
          </div>
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 28,
              fontWeight: 800,
              color: streak > 0 ? '#e2711d' : '#c9a98a',
              lineHeight: 1,
            }}
          >
            <Flame size={24} fill={streak > 0 ? '#e2711d' : 'none'} />
            {streak}
          </div>
          <div style={{ fontSize: 13, color: '#8c6a54', marginTop: 4 }}>
            day streak
          </div>
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#3a1a10',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <MapPinned size={15} color="#a52d15" /> Regions visited
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {REGIONS.map((region) => {
            const unlocked = unlockedSet.has(region)
            return (
              <div
                key={region}
                title={unlocked ? `${region} — unlocked` : `${region} — complete a Yatra here to unlock`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: unlocked ? '1px solid #e2b04a' : '1px solid #e3d5c3',
                  background: unlocked ? '#fff2d0' : '#f5efe6',
                  color: unlocked ? '#8c5a10' : '#b3a190',
                  fontSize: 13,
                  fontWeight: 600,
                  opacity: unlocked ? 1 : 0.65,
                }}
              >
                <span style={{ fontSize: 15 }}>{REGION_ICON[region] || '🗺️'}</span>
                {region}
                {!unlocked && <Lock size={12} />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
