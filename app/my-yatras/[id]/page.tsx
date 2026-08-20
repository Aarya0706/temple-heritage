import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import DownloadItineraryButton from '@/components/DownloadItineraryButton'

type ItineraryDay = {
  day: string;
  title: string;
  description: string;
  templeSlugs?: string[];
};

export default async function YatraDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: yatra, error } = await supabase
    .from('yatra_plans')
    .select('id, title, itinerary, created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !yatra) notFound();

  const days: ItineraryDay[] = yatra.itinerary?.days || [];
  const summary: string = yatra.itinerary?.summary || "";
  const from: string = yatra.itinerary?.from || "";
  const region: string = yatra.itinerary?.region || "";

  return (
    <main>
      <section className="page-hero">
        <Link
          href="/my-yatras"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#ffc05a",
            textDecoration: "none",
            fontSize: 14,
            marginBottom: 14
          }}
        >
          <ArrowLeft size={15} /> Back to My Yatras
        </Link>
        <h1>{yatra.title}</h1>
        <p style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar size={15} />
            Saved on {new Date(yatra.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          {from && (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={15} /> From {from}
            </span>
          )}
        </p>
      </section>

      <section className="section section-light">
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {summary && (
            <p style={{ marginBottom: 28, color: "#6b4a3d", fontSize: 16, lineHeight: 1.6 }}>
              {summary}
            </p>
          )}

          {days.length === 0 ? (
            <div style={{
              border: "1px dashed #d9b48f",
              borderRadius: 14,
              padding: "32px 24px",
              textAlign: "center",
              color: "#8c6a54",
              background: "#fff8f0"
            }}>
              <p>This itinerary doesn't have any day-by-day details saved.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {days.map((d, i) => (
                <div
                  key={i}
                  style={{
                    background: "white",
                    border: "1px solid #f0ddc8",
                    borderRadius: 14,
                    padding: "20px 24px",
                    boxShadow: "0 1px 4px rgba(139, 69, 19, 0.08)"
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#3a1a10", marginBottom: 8, fontSize: 16 }}>
                    {d.day} · {d.title}
                  </div>
                  <p style={{ color: "#6b4a3d", lineHeight: 1.6, margin: 0 }}>{d.description}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <DownloadItineraryButton
              title={yatra.title}
              summary={summary}
              from={from}
              region={region}
              createdAt={yatra.created_at}
              days={days}
            />
            <Link href="/planner" className="btn-secondary" style={{ color: "#8c2416", borderColor: "#b95a40" }}>
              Plan another Yatra
            </Link>
            <Link href="/my-yatras" className="btn-secondary" style={{ color: "#8c2416", borderColor: "#b95a40" }}>
              Back to My Yatras
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
