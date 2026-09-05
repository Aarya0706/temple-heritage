"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarHeart, Heart, Loader2, Moon, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { temples } from "@/data/temples";
import { getZodiacSign, getHoroscopeGuidance } from "@/lib/zodiac";
import { getUpcomingFestivalForSign } from "@/lib/horoscope-festivals";
import { formatFestivalDate } from "@/lib/festival-countdown";
import { slugify } from "@/lib/slug";

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

// Returning visitors shouldn't have to retype their birth date every time.
// Scoped to this page only — not shared with any other stored preference.
const BIRTH_DATE_STORAGE_KEY = "temple-heritage:horoscope-birthdate";

export default function HoroscopePage() {
  // Start empty on both server and the client's first render pass — same
  // hydration-mismatch reasoning as FestivalCountdown's `mounted` flag.
  // Reading localStorage during the initial render would make the very
  // first client render disagree with the server-rendered markup, so the
  // stored value is applied a beat later, in an effect after mount.
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecommendationResponse | null>(null);
  // Gates the write-back effect below until the initial read has actually
  // finished. Without this, the write effect fires on mount too (with
  // birthDate still ""), deleting whatever was stored a beat before the
  // deferred read gets to it — a silent race that made the read always see
  // an empty value.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Defer the state update out of the effect body itself, same as the
    // fetch effect below and FestivalCountdown's mount effect — a
    // synchronous setState call directly in an effect trips
    // react-hooks/set-state-in-effect.
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const stored = window.localStorage.getItem(BIRTH_DATE_STORAGE_KEY);
        if (stored) setBirthDate(stored);
      } catch {
        // Storage can be unavailable (private browsing, disabled cookies) —
        // fail quietly and just leave the field blank.
      } finally {
        if (!cancelled) setHydrated(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (birthDate) {
        window.localStorage.setItem(BIRTH_DATE_STORAGE_KEY, birthDate);
      } else {
        window.localStorage.removeItem(BIRTH_DATE_STORAGE_KEY);
      }
    } catch {
      // Same as above — not being able to persist shouldn't break the page.
    }
  }, [birthDate, hydrated]);

  const sign = useMemo(() => (birthDate ? getZodiacSign(birthDate) : null), [birthDate]);
  const guidance = useMemo(() => (sign ? getHoroscopeGuidance(sign) : null), [sign]);
  const linkedFestival = useMemo(() => (sign ? getUpcomingFestivalForSign(sign) : null), [sign]);

  useEffect(() => {
    if (!birthDate || !sign) {
      Promise.resolve().then(() => setData(null));
      return;
    }

    let cancelled = false;

    Promise.resolve()
      .then(() => {
        if (cancelled) return Promise.reject(new Error("cancelled"));
        setLoading(true);
        setError(null);
        return fetch(`/api/recommendations?birthdate=${encodeURIComponent(birthDate)}`);
      })
      .then((res) => {
        if (!res.ok) throw new Error("Couldn't load recommendations.");
        return res.json();
      })
      .then((json: RecommendationResponse) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled && err?.message !== "cancelled") {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
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
          Enter your birth date and we&apos;ll point you to temples traditionally associated with
          your sun sign&apos;s ruling planet — a fun, well-known thread in Indian temple culture.
        </p>
      </section>

      <section className="section section-light">
        <div className="recommend-grid">
          <div className="panel">
            <h3 style={{ fontSize: 21, marginBottom: 10 }}>When were you born?</h3>
            <p style={{ fontSize: 13, color: "#9b6958", marginTop: 0, marginBottom: 16, lineHeight: 1.5 }}>
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

            <p style={{ fontSize: 11, color: "#9b6958", marginTop: 4 }}>
              Tip: use the calendar icon rather than typing, to avoid date-format mix-ups.
            </p>

            {birthDate && (
              <button
                type="button"
                onClick={() => setBirthDate("")}
                style={{
                  marginTop: 8,
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: 12,
                  color: "#9b6958",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Not your date? Clear it
              </button>
            )}

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

                {linkedFestival && (
                  <Link
                    href={`/festivals/${slugify(linkedFestival.festival.name)}`}
                    style={{
                      marginTop: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 10,
                      background: "rgba(165,45,21,0.09)",
                      border: "1px solid rgba(165,45,21,0.18)",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <CalendarHeart size={18} color="#a52d15" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#7a4a3a", lineHeight: 1.4 }}>
                      <strong style={{ color: "#a52d15" }}>{linkedFestival.festival.name}</strong> on{" "}
                      {formatFestivalDate(linkedFestival.date)} is tied to your sign&apos;s deity —
                      worth timing a visit around.
                    </span>
                  </Link>
                )}

                <Link
                  href={`/horoscope/${slugify(sign.name)}`}
                  style={{
                    marginTop: 12,
                    display: "inline-block",
                    fontSize: 13,
                    color: "#a52d15",
                    fontWeight: 600,
                  }}
                >
                  Get a shareable link for {sign.name} →
                </Link>
              </div>
            )}

            {birthDate && !sign && (
              <p style={{ marginTop: 16, fontSize: 13, color: "#b3261e" }}>
                Couldn&apos;t read that date — try picking it again from the calendar.
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
            <h3 style={{ fontSize: 21, marginBottom: 10 }}>
              {sign ? `Temples suited to ${sign.name}` : "Your recommendations"}
            </h3>

            {!birthDate && (
              <p style={{ color: "#9b6958", fontSize: 14, padding: "8px 0" }}>
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

            <div style={{ marginTop: 24, textAlign: "center" }}>
              <img
                src="/images/zodiac-wheel.png"
                alt="Zodiac wheel"
                style={{
                  display: "inline-block",
                  width: "min(320px, 100%)",
                  height: "auto",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  borderRadius: "50%",
                  boxShadow: "0 0 20px rgba(165,45,21,0.2)",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
