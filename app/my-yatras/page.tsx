import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { temples } from '@/data/temples'
import Link from 'next/link'
import { MapPin, Calendar, Compass, ChevronRight } from 'lucide-react'
import UnsaveTempleButton from '@/components/UnsaveTempleButton'
import DeleteYatraButton from '@/components/DeleteYatraButton'
import MarkYatraCompleteButton from '@/components/MarkYatraCompleteButton'
import YatraStatsBlock from '@/components/YatraStatsBlock'
import { computeYatraStats } from '@/lib/yatra-stats'

export default async function MyYatrasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: savedRows } = await supabase
    .from('saved_temples')
    .select('temple_slug')
    .eq('user_id', user.id)

  const { data: yatraRows } = await supabase
    .from('yatra_plans')
    .select('id, title, itinerary, created_at, completed_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const savedTemples = (savedRows || [])
    .map(r => temples.find(t => t.slug === r.temple_slug))
    .filter(Boolean)

  const stats = computeYatraStats(
    (yatraRows || []).map(y => ({ id: y.id, itinerary: y.itinerary, completed_at: y.completed_at }))
  )

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ Your journey</div>
        <h1>My Yatras</h1>
        <p>Your saved temples and planned pilgrimages, all in one place.</p>
      </section>

      <section className="section section-light">
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          <YatraStatsBlock stats={stats} />

          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={22} color="#a52d15" /> Saved Temples
            </h2>

            {savedTemples.length === 0 ? (
              <div style={{
                border: "1px dashed #d9b48f",
                borderRadius: 14,
                padding: "32px 24px",
                textAlign: "center",
                color: "#8c6a54",
                background: "#fff8f0"
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🛕</div>
                <p style={{ marginBottom: 12 }}>No temples saved yet.</p>
                <Link href="/temples" className="btn-secondary" style={{ color: "#8c2416", borderColor: "#b95a40" }}>
                  Browse Temples
                </Link>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 18
              }}>
                {savedTemples.map((t: any) => (
                  <Link
                    key={t.slug}
                    href={`/temples/${t.slug}`}
                    style={{
                      position: "relative",
                      display: "block",
                      borderRadius: 14,
                      overflow: "hidden",
                      background: "white",
                      border: "1px solid #f0ddc8",
                      textDecoration: "none",
                      transition: "box-shadow 0.2s, transform 0.2s",
                      boxShadow: "0 1px 4px rgba(139, 69, 19, 0.08)"
                    }}
                  >
                    <UnsaveTempleButton templeSlug={t.slug} />
                    <div style={{ height: 130, overflow: "hidden" }}>
                      <img
                        src={t.image}
                        alt={t.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 700, color: "#3a1a10", marginBottom: 4 }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: "#a5744f", display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={13} /> {t.city}, {t.state}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 style={{ fontSize: 24, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <Compass size={22} color="#a52d15" /> Saved Itineraries
            </h2>

            {(!yatraRows || yatraRows.length === 0) ? (
              <div style={{
                border: "1px dashed #d9b48f",
                borderRadius: 14,
                padding: "32px 24px",
                textAlign: "center",
                color: "#8c6a54",
                background: "#fff8f0"
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🪷</div>
                <p style={{ marginBottom: 12 }}>No saved itineraries yet.</p>
                <Link href="/planner" className="btn-secondary" style={{ color: "#8c2416", borderColor: "#b95a40" }}>
                  Plan a Yatra
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {yatraRows.map((y: any) => {
                  const dayCount = y.itinerary?.days?.length || 0;
                  return (
                    <Link
                      key={y.id}
                      href={`/my-yatras/${y.id}`}
                      style={{
                        background: "white",
                        border: "1px solid #f0ddc8",
                        borderRadius: 14,
                        padding: "18px 22px",
                        boxShadow: "0 1px 4px rgba(139, 69, 19, 0.08)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 12,
                        textDecoration: "none",
                        transition: "box-shadow 0.2s, transform 0.15s"
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: "#3a1a10", marginBottom: 6, fontSize: 16 }}>
                          {y.title}
                        </div>
                        <div style={{ fontSize: 13, color: "#a5744f", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Calendar size={13} />
                            {new Date(y.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          {dayCount > 0 && <span>{dayCount} day{dayCount > 1 ? "s" : ""}</span>}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#a52d15",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          flexWrap: "wrap"
                        }}
                      >
                        <MarkYatraCompleteButton
                          yatraId={y.id}
                          initialCompleted={!!y.completed_at}
                          onEvent
                        />
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          View itinerary <ChevronRight size={16} />
                        </span>
                        <DeleteYatraButton yatraId={y.id} title={y.title} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  )
}
