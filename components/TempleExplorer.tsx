 "use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TempleCard } from "./TempleCard";
import { regions, temples } from "@/data/temples";

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
    const q = query.toLowerCase().trim();
    return temples.filter((t) => {
      const matchesRegion = region === "All" || t.region === region;
      const matchesQuery =
        !q ||
        [t.name, t.deity, t.city, t.state, t.region].some((value) =>
          value.toLowerCase().includes(q)
        );
      return matchesRegion && matchesQuery;
    });
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