 "use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { TempleCard } from "./TempleCard";
import { regions, temples } from "@/data/temples";

export function TempleExplorer() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");

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
          {filtered.map((temple) => <TempleCard key={temple.slug} temple={temple} />)}
        </div>
      ) : (
        <div className="empty">No temples found. Try another search.</div>
      )}
    </>
  );
}
