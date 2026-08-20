"use client";

import Link from "next/link";
import { Clock3, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { regions, temples } from "@/data/temples";

export function DarshanExplorer() {
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
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 30 }}>
          {filtered.map((temple) => (
            <Link
              href={`/temples/${temple.slug}`}
              key={temple.slug}
              style={{ display: "block", color: "inherit", textDecoration: "none" }}
            >
              <article
                className="service-card"
                style={{
                  background: "#fff",
                  color: "#4d1710",
                  borderColor: "rgba(150,50,20,.14)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "22px 26px"
                }}
              >
                <div>
                  <div className="eyebrow">{temple.deity}</div>
                  <h3 style={{ margin: "4px 0" }}>{temple.name}</h3>
                  <p style={{ margin: 0, opacity: 0.8 }}>
                    <MapPin size={15} style={{ verticalAlign: "middle" }} /> {temple.city}, {temple.state}
                  </p>
                </div>
                <div style={{ textAlign: "right", minWidth: 220 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", color: "#a42b14", fontWeight: 600 }}>
                    <Clock3 size={16} /> Darshan timings
                  </div>
                  <p style={{ margin: "4px 0 0" }}>{temple.timing}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty">No temples found. Try another search.</div>
      )}
    </>
  );
}
