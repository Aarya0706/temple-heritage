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

export default function DiscoverPage() {
  const [selected, setSelected] = useState<string[]>(["Architecture"]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecommendationResponse | null>(null);

  // Fetches on mount and whenever preferences change — this is a feed,
  // not a form, so there's no separate "go" button gating the results.
  useEffect(() => {
    let cancelled = false;

    const params = selected.length ? `?preferences=${encodeURIComponent(selected.join(","))}` : "";

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
  }

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ For you</div>
        <h1>Discover</h1>
        <p>
          Picks based on what visitors with similar taste saved, your stated interests, and
          what&apos;s popular right now.
        </p>
      </section>

      <section className="section section-light">
        {/* Compact filter bar instead of a side panel — this is meant to
            read as a feed you scroll, with filters as a lightweight
            refinement rather than a form you fill in before seeing anything. */}
        <div className="panel" style={{ marginBottom: 24 }}>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              background: "none",
              border: 0,
              cursor: "pointer",
              padding: 0,
            }}
            aria-expanded={filtersOpen}
          >
            <h3 style={{ margin: 0 }}>Tune your picks</h3>
            <span style={{ fontSize: 13, color: "#a52d15", fontWeight: 600 }}>
              {filtersOpen ? "Hide" : selected.length ? `${selected.length} selected` : "Show filters"}
            </span>
          </button>

          {filtersOpen && (
            <>
              <div className="preference-list" style={{ marginTop: 16 }}>
                {options.map((item) => (
                  <label className="pref" key={item}>
                    <input type="checkbox" checked={selected.includes(item)} onChange={() => toggle(item)} />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              <p style={{ marginTop: 16, fontSize: 13, color: "#9b6958", lineHeight: 1.5 }}>
                <Moon size={13} style={{ verticalAlign: "-2px" }} /> Want a pick based on your birth
                date instead?{" "}
                <Link href="/horoscope" style={{ color: "#a52d15", fontWeight: 600 }}>
                  Try the horoscope finder
                </Link>
                .
              </p>
            </>
          )}

          {data && !data.hasSavedTemples && (
            <p style={{ marginTop: 16, fontSize: 13, color: "#9b6958", lineHeight: 1.5 }}>
              <Star size={13} style={{ verticalAlign: "-2px" }} /> Save a few temples on their pages
              and come back — recommendations get sharper once we know what you actually like, not
              just what you clicked.
            </p>
          )}
        </div>

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9b6958", padding: "20px 0" }}>
            <Loader2 size={18} className="spin" /> Finding temples for you...
          </div>
        )}

        {error && <p style={{ color: "#b3261e" }}>{error}</p>}

        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {results.map(({ temple, reason }) => (
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
        )}
      </section>
    </main>
  );
}
