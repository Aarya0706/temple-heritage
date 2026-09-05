"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Temple } from "@/data/temples";
import { Festival } from "@/data/festivals";
import { TempleMapFilters } from "./TempleMapFilters";

const AllTemplesMap = dynamic(() => import("./AllTemplesMap"), {
  ssr: false,
  loading: () => <div className="all-temples-map-loading">Loading map…</div>,
});

/**
 * Leaflet touches `window` on import, so the map itself is dynamically
 * imported with ssr:false — mirrors YatraRouteMapLoader's pattern. This
 * wrapper owns the deity/festival filter state and hands the filtered
 * temple list down to the map once it's ready.
 */
export default function AllTemplesMapLoader({
  temples,
  festivals,
}: {
  temples: Temple[];
  festivals: Festival[];
}) {
  const [filtered, setFiltered] = useState<Temple[]>(temples);

  return (
    <div className="all-temples-map-wrapper">
      <TempleMapFilters
        temples={temples}
        festivals={festivals}
        onFilterChange={setFiltered}
      />
      <AllTemplesMap temples={filtered} />
    </div>
  );
}
