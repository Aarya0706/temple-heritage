"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Map as MapIcon } from "lucide-react";
import { Temple } from "@/data/temples";

const YatraRouteMap = dynamic(() => import("./YatraRouteMap"), {
  ssr: false,
  loading: () => <div className="yatra-route-map-loading">Loading route map…</div>,
});

export type YatraRouteDay = {
  label: string;
  stops: Temple[];
};

/**
 * Day-tabbed route map for a saved Yatra. Leaflet touches `window` on
 * import, so the map itself is dynamically imported with ssr:false — this
 * component just owns the tab state and hands the active day's stops down.
 */
export default function YatraRouteMapLoader({ days }: { days: YatraRouteDay[] }) {
  const daysWithStops = days.filter((d) => d.stops.length > 0);
  const [activeIndex, setActiveIndex] = useState(0);

  if (daysWithStops.length === 0) return null;

  const active = daysWithStops[Math.min(activeIndex, daysWithStops.length - 1)];

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ display: "flex", alignItems: "center", gap: 8, color: "#3a1a10", marginBottom: 14 }}>
        <MapIcon size={18} /> Route Map
      </h3>

      {daysWithStops.length > 1 && (
        <div className="yatra-route-day-tabs">
          {daysWithStops.map((d, i) => (
            <button
              key={d.label + i}
              type="button"
              className={`filter-btn ${i === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(i)}
            >
              {d.label}
            </button>
          ))}
        </div>
      )}

      <YatraRouteMap stops={active.stops} />
    </div>
  );
}
