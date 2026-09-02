"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Heart, Loader2, Moon, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { temples } from "@/data/temples";
import { getZodiacSign, getHoroscopeGuidance } from "@/lib/zodiac";

type Reason =
  | { type: "saved_by_similar_users"; count: number }
  | { type: "matches_horoscope"; sign: string }
  | { type: "matches_interests" }
  | { type: "popular" };

type RecommendationResponse = {
  recommendations: { slug: string; reason: Reason }[];
  hasSavedTemples: boolean;
};

function ReasonBadge({ reason }: { reason: Reason }) {
  if (reason.type === "saved_by_similar_users") {
    return (
      <span className="reason-badge">
        <Heart size={13} /> Saved by {reason.count} visitor{reason.count === 1 ? "" : "s"} with similar taste
      </span>
    );
  }
  if (reason.type === "matches_horoscope") {
    return (
      <span className="reason-badge">
        <Moon size={13} /> Suited to {reason.sign}
      </span>
    );
  }
  if (reason.type === "matches_interests") {
    return (
      <span className="reason-badge">
        <Sparkles size={13} /> Matches your interests
      </span>
    );
  }
  return (
    <span className="reason-badge">
      <TrendingUp size={13} /> Popular with visitors
    </span>
  );
}

export default function HoroscopePage() {
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecommendationResponse | null>(null);

  const sign = useMemo(() => (birthDate ? getZodiacSign(birthDate) : null), [birthDate]);
  const guidance = useMemo(() => (sign ? getHoroscopeGuidance(sign) : null), [sign]);

  useEffect(() => {
    if (!birthDate || !sign) {
      setData(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/recommendations?birthdate=${encodeURIComponent(birthDate)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Couldn't load recommendations.");
        return res.json();
      })
      .then((json: RecommendationResponse) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [birthDate, sign]);

  const results = useMemo(() => {
    if (!data) return [];
    const bySlug = new Map(temples.map((t) => [t.slug, t]));
    return data.recommendations
      .map((r) => ({ temple: bySlug.get(r.slug), reason: r.reason }))
      .filter((r): r is { temple: (typeof temples)[number]; reason: Reason } => !!r.temple);
  }, [data]);

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ Astrology-guided discovery</div>
        <h1>Find Your Temple by Horoscope</h1>
        <p>
          Enter your birth date and we'll point you to temples traditionally associated with
          your sun sign's ruling planet — a fun, well-known thread in Indian temple culture.
        </p>
      </section>

      <section className="section section-light">
        <div className="recommend-grid">
          <div className="panel">
            <h3>When were you born?</h3>
            <p style={{ fontSize: 13, color: "#9b6958", marginTop: 4, marginBottom: 14, lineHeight: 1.5 }}>
              This uses your sun sign (Western zodiac) worked out purely from the date — not a
              full Vedic birth chart, which would need your birth time and place too.
            </p>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid rgba(165,45,21,0.25)",
                fontSize: 15,
              }}
            />

            {sign && guidance && (
              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  borderRadius: 12,
                  background: "rgba(165,45,21,0.06)",
                  border: "1px solid rgba(165,45,21,0.15)",
                }}
              >
                <div style={{ fontSize: 28, lineHeight: 1 }}>{sign.symbol}</div>
                <h4 style={{ marginTop: 8, marginBottom: 2 }}>{sign.name}</h4>
                <p style={{ fontSize: 12, color: "#9b6958", marginBottom: 10 }}>
                  {sign.dateRange} · {sign.element} sign · ruled by {sign.rulingPlanet}
                </p>
                <p style={{ fontSize: 13.5, color: "#7a4a3a", lineHeight: 1.55 }}>{guidance.blurb}</p>
              </div>
            )}

            {birthDate && !sign && (
              <p style={{ marginTop: 16, fontSize: 13, color: "#b3261e" }}>
                Couldn't read that date — try picking it again from the calendar.
              </p>
            )}

            <p style={{ marginTop: 20, fontSize: 13, color: "#9b6958", lineHeight: 1.5 }}>
              Looking for something more specific? Try the{" "}
              <Link href="/recommender" style={{ color: "#a52d15", fontWeight: 600 }}>
                interest-based recommender
              </Link>{" "}
              instead.
            </p>
          </div>

          <div className="panel">
            <h3>{sign ? `Temples suited to ${sign.name}` : "Your recommendations"}</h3>

            {!birthDate && (
              <p style={{ color: "#9b6958", fontSize: 14, padding: "20px 0" }}>
                Add your birth date to see temples matched to your sign.
              </p>
            )}

            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9b6958", padding: "20px 0" }}>
                <Loader2 size={18} className="spin" /> Reading the stars...
              </div>
            )}

            {error && <p style={{ color: "#b3261e" }}>{error}</p>}

            {!loading &&
              !error &&
              results.map(({ temple, reason }) => (
                <Link href={`/temples/${temple.slug}`} className="result-card" key={temple.slug}>
                  <img src={temple.image} alt={temple.name} />
                  <div style={{ flex: 1 }}>
                    <h4>{temple.name}</h4>
                    <p>📍 {temple.city}, {temple.state}</p>
                    <p style={{ marginTop: 6 }}>{temple.shortDescription}</p>
                    <div style={{ marginTop: 8 }}>
                      <ReasonBadge reason={reason} />
                    </div>
                  </div>
                  <ArrowRight size={18} color="#a52d15" />
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
