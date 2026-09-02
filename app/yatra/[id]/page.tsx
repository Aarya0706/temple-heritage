import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Calendar, MapPin, Sparkles, Globe } from 'lucide-react'
import YatraRouteMapLoader, { YatraRouteDay } from '@/components/YatraRouteMapLoader'
import { resolveTemples } from '@/lib/yatra-route'

type ItineraryDay = {
  day: string;
  title: string;
  description: string;
  templeSlugs?: string[];
};

async function getPublicYatra(id: string) {
  const supabase = await createClient();
  // No user_id filter here on purpose — this route is unauthenticated.
  // The "yatra_plans_select_public" RLS policy (is_public = true) is what
  // actually scopes this: a private plan's id simply won't return a row.
  const { data: yatra } = await supabase
    .from('yatra_plans')
    .select('id, title, itinerary, created_at, is_public')
    .eq('id', id)
    .eq('is_public', true)
    .maybeSingle();
  return yatra;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const yatra = await getPublicYatra(id);
  if (!yatra) return { title: 'Yatra not found | Temple Heritage' };

  const dayCount = yatra.itinerary?.days?.length || 0;
  const summary: string = yatra.itinerary?.summary || `A ${dayCount}-day pilgrimage itinerary planned on Temple Heritage.`;

  return {
    title: `${yatra.title} | Temple Heritage`,
    description: summary,
    openGraph: {
      title: yatra.title,
      description: summary,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: yatra.title,
      description: summary,
    },
  };
}

export default async function PublicYatraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const yatra = await getPublicYatra(id);
  if (!yatra) notFound();

  const days: ItineraryDay[] = yatra.itinerary?.days || [];
  const summary: string = yatra.itinerary?.summary || "";
  const from: string = yatra.itinerary?.from || "";
  const region: string = yatra.itinerary?.displayRegion || yatra.itinerary?.region || "";

  const routeDays: YatraRouteDay[] = days.map((d) => ({
    label: d.day,
    stops: resolveTemples(d.templeSlugs),
  }));

  return (
    <main>
      <section className="page-hero">
        <div
          className="eyebrow"
          style={{ color: "#ffc05a", display: "flex", alignItems: "center", gap: 6 }}
        >
          <Globe size={13} /> Shared Yatra
        </div>
        <h1>{yatra.title}</h1>
        <p style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar size={15} />
            Planned {new Date(yatra.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          {from && (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={15} /> From {from}
            </span>
          )}
          {region && <span>{region}</span>}
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
              <p>This itinerary doesn&apos;t have any day-by-day details saved.</p>
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

          <YatraRouteMapLoader days={routeDays} />

          <div style={{
            marginTop: 32,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #f0ddc8",
            paddingTop: 24
          }}>
            <p style={{ color: "#8c6a54", fontSize: 14, margin: 0 }}>
              Made with Temple Heritage&apos;s AI Yatra Planner.
            </p>
            <Link href="/planner" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} /> Plan Your Own Yatra
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
