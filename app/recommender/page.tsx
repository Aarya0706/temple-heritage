 "use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles, Loader2, Heart, Star, TrendingUp, Moon } from "lucide-react";
import { temples } from "@/data/temples";
import Link from "next/link";

const options = ["Lord Shiva", "Lord Vishnu / Krishna", "Goddess", "Architecture", "History", "Nature", "Jyotirlinga"];

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

export default function RecommenderPage() {
  const [selected, setSelected] = useState<string[]>(["Architecture"]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecommendationResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    const params = selected.length ? `?preferences=${encodeURIComponent(selected.join(","))}` : "";

    // Reset loading/error state as part of the fetch's first tick rather than
    // synchronously in the effect body, so we don't trigger an extra render
    // pass before the request has even started.
    Promise.resolve()
      .then(() => {
        if (cancelled) return Promise.reject(new Error("cancelled"));
        setLoading(true);
        setError(null);
        return fetch(`/api/recommendations${params}`);
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
  }, [selected]);

  const results = useMemo(() => {
    if (!data) return [];
    const bySlug = new Map(temples.map((t) => [t.slug, t]));
    return data.recommendations
      .map((r) => ({ temple: bySlug.get(r.slug), reason: r.reason }))
      .filter((r): r is { temple: (typeof temples)[number]; reason: Reason } => !!r.temple);
  }, [data]);

  function toggle(item: string) {
    setSelected((current) => (current.includes(item) ? current.filter((x) => x !== item) : [...current, item]));
    setDone(true);
  }

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ Smart discovery</div>
        <h1>Find Your Temple</h1>
        <p>
          Personalized picks based on what visitors with similar taste saved, your stated
          interests, and what&apos;s popular right now.
        </p>
      </section>

      <section className="section section-light">
        <div className="recommend-grid">
          <div className="panel">
            <h3>What are you looking for?</h3>
            <div className="preference-list">
              {options.map((item) => (
                <label className="pref" key={item}>
                  <input type="checkbox" checked={selected.includes(item)} onChange={() => toggle(item)} />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(165,45,21,0.15)" }}>
              <p style={{ fontSize: 13, color: "#9b6958", lineHeight: 1.5 }}>
                <Moon size={13} style={{ verticalAlign: "-2px" }} /> Want a pick based on your
                birth date instead?{" "}
                <Link href="/horoscope" style={{ color: "#a52d15", fontWeight: 600 }}>
                  Try the horoscope finder
                </Link>
                .
              </p>
            </div>

            <button
              className="btn-primary"
              style={{ background: "#a52d15", color: "white", border: 0, width: "100%", marginTop: 20 }}
              onClick={() => setDone(true)}
            >
              <Sparkles size={17} /> Recommend Temples
            </button>

            {data && !data.hasSavedTemples && (
              <p style={{ marginTop: 16, fontSize: 13, color: "#9b6958", lineHeight: 1.5 }}>
                <Star size={13} style={{ verticalAlign: "-2px" }} /> Save a few temples on their pages
                and come back — recommendations get sharper once we know what you actually like,
                not just what you clicked.
              </p>
            )}
          </div>

          <div className="panel">
            <h3>{done ? "Your recommendations" : "Recommendations preview"}</h3>

            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9b6958", padding: "20px 0" }}>
                <Loader2 size={18} className="spin" /> Finding temples for you...
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
