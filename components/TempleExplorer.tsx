"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TempleCard } from "./TempleCard";
import { regions, temples } from "@/data/temples";
import { searchTemples } from "@/lib/temple-search";

type RatingMap = Record<string, { average_rating: number; review_count: number }>;

const ALL = "All";

// Facet option lists are derived from the catalog instead of hardcoded, so
// adding a temple with a new state/deity/type automatically shows up as a
// filter option without a second place to remember to update.
function uniqueSorted(values: string[]): string[] {
  return [ALL, ...Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))];
}

export function TempleExplorer() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState(ALL);
  const [state, setState] = useState(ALL);
  const [city, setCity] = useState(ALL);
  const [deity, setDeity] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [ratings, setRatings] = useState<RatingMap>({});
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [loggedIn, setLoggedIn] = useState(true);

  const states = useMemo(() => uniqueSorted(temples.map((t) => t.state)), []);
  const cities = useMemo(() => uniqueSorted(temples.map((t) => t.city)), []);
  const deities = useMemo(() => uniqueSorted(temples.map((t) => t.deity)), []);
  const types = useMemo(() => uniqueSorted(temples.map((t) => t.type)), []);

  useEffect(() => {
    fetch("/api/temple-ratings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.ratings) return;
        const map: RatingMap = {};
        for (const r of data.ratings) {
          map[r.temple_slug] = { average_rating: r.average_rating, review_count: r.review_count };
        }
        setRatings(map);
      })
      .catch(() => {
        // Ratings are a nice-to-have on this grid — fail silently and
        // just show cards without them rather than blocking the page.
      });

    // One saved-temples fetch for the whole grid rather than one per card —
    // with 20+ cards, a per-card fetch (the original SaveTempleButton
    // pattern) means 20+ parallel requests on every page load.
    fetch("/api/saved-temples")
      .then((res) => {
        if (res.status === 401) {
          setLoggedIn(false);
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((data) => {
        if (data?.saved) setSavedSlugs(data.saved);
      })
      .catch(() => {
        // Save state is also a nice-to-have — the grid still works without it.
      });
  }, []);

  const toggleSave = async (slug: string) => {
    if (!loggedIn) {
      window.location.href = "/login";
      return;
    }
    const isSaved = savedSlugs.includes(slug);
    // Optimistic update: flip the heart immediately, revert if the request fails.
    setSavedSlugs((prev) => (isSaved ? prev.filter((s) => s !== slug) : [...prev, slug]));
    try {
      const res = await fetch("/api/saved-temples", {
        method: isSaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temple_slug: slug }),
      });
      if (!res.ok) throw new Error("save failed");
    } catch {
      setSavedSlugs((prev) => (isSaved ? [...prev, slug] : prev.filter((s) => s !== slug)));
    }
  };

  const activeFacetCount = [region, state, city, deity, type].filter((f) => f !== ALL).length;

  const filtered = useMemo(() => {
    const facetMatched = temples.filter(
      (t) =>
        (region === ALL || t.region === region) &&
        (state === ALL || t.state === state) &&
        (city === ALL || t.city === city) &&
        (deity === ALL || t.deity === deity) &&
        (type === ALL || t.type === type)
    );

    // searchTemples does typo-tolerant, weighted-relevance ranking (name >
    // deity/city > region/description) instead of a plain substring check —
    // see lib/temple-search.ts for why this is client-side rather than a
    // Postgres full-text search. It also already picks up multi-word
    // queries like "Shiva temples near Bhopal" by scoring each token
    // against every field, so a temple matching "Shiva" (deity) and
    // "Bhopal" (city/region) ranks above one matching only one term.
    return searchTemples(query, facetMatched).map((r) => r.temple);
  }, [query, region, state, city, deity, type]);

  const clearFacets = () => {
    setRegion(ALL);
    setState(ALL);
    setCity(ALL);
    setDeity(ALL);
    setType(ALL);
  };

  return (
    <>
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “Shiva temples near Bhopal”..."
          />
        </div>
        <div className="filters">
          {regions.map((item) => (
            <button
              key={item}
              className={`filter-btn ${region === item ? "active" : ""}`}
              onClick={() => setRegion(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="facet-row">
        <select className="facet-select" value={state} onChange={(e) => setState(e.target.value)} aria-label="Filter by state">
          {states.map((s) => (
            <option key={s} value={s}>{s === ALL ? "All states" : s}</option>
          ))}
        </select>
        <select className="facet-select" value={city} onChange={(e) => setCity(e.target.value)} aria-label="Filter by city">
          {cities.map((c) => (
            <option key={c} value={c}>{c === ALL ? "All cities" : c}</option>
          ))}
        </select>
        <select className="facet-select" value={deity} onChange={(e) => setDeity(e.target.value)} aria-label="Filter by deity">
          {deities.map((d) => (
            <option key={d} value={d}>{d === ALL ? "All deities" : d}</option>
          ))}
        </select>
        <select className="facet-select" value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by temple type">
          {types.map((t) => (
            <option key={t} value={t}>{t === ALL ? "All temple types" : t}</option>
          ))}
        </select>
        {activeFacetCount > 0 && (
          <button type="button" className="facet-clear" onClick={clearFacets}>
            Clear filters ({activeFacetCount})
          </button>
        )}
      </div>

      <p className="result-count">
        {filtered.length} temple{filtered.length === 1 ? "" : "s"} found
      </p>

      {filtered.length ? (
        <div className="temple-grid">
          {filtered.map((temple) => (
            <TempleCard
              key={temple.slug}
              temple={temple}
              rating={ratings[temple.slug]}
              saved={savedSlugs.includes(temple.slug)}
              onToggleSave={toggleSave}
            />
          ))}
        </div>
      ) : (
        <div className="empty">No temples found. Try another search or clear a filter.</div>
      )}
    </>
  );
}
