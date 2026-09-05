"use client";

import { useMemo, useState } from "react";
import { Temple } from "@/data/temples";
import { Festival } from "@/data/festivals";

type Props = {
  temples: Temple[];
  festivals: Festival[];
  onFilterChange: (filtered: Temple[]) => void;
};

/**
 * Owns deity/festival filter state for the all-temples map. Festivals
 * don't carry a deity field of their own — filtering by festival narrows
 * to that festival's `relatedTempleSlugs` from data/festivals.ts.
 */
export function TempleMapFilters({ temples, festivals, onFilterChange }: Props) {
  const deities = useMemo(
    () => Array.from(new Set(temples.map((t) => t.deity))).sort(),
    [temples]
  );

  const [selectedDeity, setSelectedDeity] = useState("all");
  const [selectedFestival, setSelectedFestival] = useState("all");

  function applyFilters(deity: string, festivalSlug: string) {
    let filtered = temples;

    if (deity !== "all") {
      filtered = filtered.filter((t) => t.deity === deity);
    }

    if (festivalSlug !== "all") {
      const festival = festivals.find((f) => f.slug === festivalSlug);
      const relatedSlugs = new Set(festival?.relatedTempleSlugs ?? []);
      filtered = filtered.filter((t) => relatedSlugs.has(t.slug));
    }

    onFilterChange(filtered);
  }

  function clearFilters() {
    setSelectedDeity("all");
    setSelectedFestival("all");
    onFilterChange(temples);
  }

  const hasActiveFilters = selectedDeity !== "all" || selectedFestival !== "all";

  return (
    <div className="temple-map-filters">
      <div className="temple-map-filter-group">
        <label htmlFor="map-deity-filter">Deity</label>
        <select
          id="map-deity-filter"
          value={selectedDeity}
          onChange={(e) => {
            setSelectedDeity(e.target.value);
            applyFilters(e.target.value, selectedFestival);
          }}
        >
          <option value="all">All deities</option>
          {deities.map((deity) => (
            <option key={deity} value={deity}>
              {deity}
            </option>
          ))}
        </select>
      </div>

      <div className="temple-map-filter-group">
        <label htmlFor="map-festival-filter">Festival</label>
        <select
          id="map-festival-filter"
          value={selectedFestival}
          onChange={(e) => {
            setSelectedFestival(e.target.value);
            applyFilters(selectedDeity, e.target.value);
          }}
        >
          <option value="all">All festivals</option>
          {festivals.map((festival) => (
            <option key={festival.slug} value={festival.slug}>
              {festival.name}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          className="temple-map-filter-clear"
          onClick={clearFilters}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
