 "use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TempleCard } from "./TempleCard";
import { regions, temples } from "@/data/temples";
import { searchTemples } from "@/lib/temple-search";

type RatingMap = Record<string, { average_rating: number; review_count: number }>;

export function TempleExplorer() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [ratings, setRatings] = useState<RatingMap>({});

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
  }, []);

  const filtered = useMemo(() => {
    const regionMatched = region === "All" ? temples : temples.filter((t) => t.region === region);

    // searchTemples does typo-tolerant, weighted-relevance ranking (name >
    // deity/city > region/description) instead of a plain substring check —
    // see lib/temple-search.ts for why this is client-side rather than a
    // Postgres full-text search.
    return searchTemples(query, regionMatched).map((r) => r.temple);
  }, [query, region]);

  return (
    <>
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search temple, city, deity or state..."
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

      {filtered.length ? (
        <div className="temple-grid">
          {filtered.map((temple) => (
            <TempleCard key={temple.slug} temple={temple} rating={ratings[temple.slug]} />
          ))}
        </div>
      ) : (
        <div className="empty">No temples found. Try another search.</div>
      )}
    </>
  );
}