"use client";

import Link from "next/link";
import { Clock3, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { regions, temples } from "@/data/temples";
import { searchTemples } from "@/lib/temple-search";

export function DarshanExplorer() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");

  const filtered = useMemo(() => {
    const regionMatched = region === "All" ? temples : temples.filter((t) => t.region === region);
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
              type="button"
              className={`filter-btn ${
                region === item ? "active" : ""
              }`}
              onClick={() => setRegion(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="darshan-results">
          {filtered.map((temple) => (
            <Link
              key={temple.slug}
              href={`/temples/${temple.slug}`}
              className="darshan-card-link"
            >
              <article className="darshan-card">
                <div className="darshan-card-image">
                  <img
                    src={temple.image}
                    alt={temple.name}
                  />

                  <span className="darshan-region">
                    {temple.region}
                  </span>
                </div>

                <div className="darshan-card-content">
                  <div className="darshan-main-info">
                    <div className="eyebrow">
                      {temple.deity}
                    </div>

                    <h3>{temple.name}</h3>

                    <p className="darshan-location">
                      <MapPin size={15} />
                      <span>
                        {temple.city}, {temple.state}
                      </span>
                    </p>
                  </div>

                  <div className="darshan-timing">
                    <div className="darshan-timing-title">
                      <Clock3 size={16} />
                      <span>Darshan timings</span>
                    </div>

                    <p>{temple.timing}</p>

                    <span className="darshan-view">
                      View Temple →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty">
          No temples found. Try another search.
        </div>
      )}
    </>
  );
}