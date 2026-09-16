"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Map as MapIcon, Route, Check } from "lucide-react";
import { Temple } from "@/data/temples";
import {
  optimizeTrip,
  describePlannedTrip,
  buildLegs,
  formatKm,
  OptimizedDay,
} from "@/lib/route-optimize";

const YatraRouteMap = dynamic(() => import("./YatraRouteMap"), {
  ssr: false,
  loading: () => <div className="yatra-route-map-loading">Loading route map…</div>,
});

export type YatraRouteDay = {
  label: string;
  stops: Temple[];
};

/**
 * Route map for a Yatra, with geographic optimization.
 *
 * Two orderings of the exact same temples are available: the planner's
 * original sequence (which matches the day-by-day text above it on the page)
 * and the optimized one from lib/route-optimize. The planner's order is shown
 * first so the map never contradicts the itinerary the traveller just read —
 * the optimized route is one click away, and only advertised when re-ordering
 * actually saves a meaningful distance.
 *
 * Leaflet touches `window` on import, so the map itself is dynamically
 * imported with ssr:false; this component owns the tab and toggle state.
 */
export default function YatraRouteMapLoader({
  days,
  from,
}: {
  days: YatraRouteDay[];
  from?: string | null;
}) {
  const withStops = useMemo(() => days.filter((d) => d.stops.length > 0), [days]);

  const planned = useMemo(() => describePlannedTrip(withStops, from), [withStops, from]);
  const optimized = useMemo(() => optimizeTrip(withStops, from), [withStops, from]);

  const [useOptimized, setUseOptimized] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const trip = useOptimized ? optimized : planned;

  // "Whole trip" stitches every day back into one continuous route, which is
  // where the re-ordering is easiest to see. It's only worth offering once
  // there's more than one day to stitch.
  const wholeTrip: OptimizedDay | null = useMemo(() => {
    if (trip.days.length < 2) return null;
    const stops = trip.days.flatMap((d) => d.stops);
    const legs = buildLegs(stops, trip.origin);
    return {
      label: "Whole trip",
      stops,
      startsFrom: trip.origin,
      legs,
      totalKm: legs.reduce((sum, leg) => sum + leg.km, 0),
    };
  }, [trip]);

  if (withStops.length === 0) return null;

  const views: OptimizedDay[] = wholeTrip ? [wholeTrip, ...trip.days] : trip.days;
  const active = views[Math.min(activeIndex, views.length - 1)];

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ display: "flex", alignItems: "center", gap: 8, color: "#3a1a10", marginBottom: 14 }}>
        <MapIcon size={18} /> Route map
      </h3>

      {optimized.improved ? (
        <div className="route-optimizer">
          <Route size={18} className="route-optimizer-icon" />
          <p className="route-optimizer-copy">
            {useOptimized ? (
              <>
                Visiting the same temples in this order saves about{" "}
                <strong>{formatKm(optimized.savedKm)}</strong> — {formatKm(optimized.optimizedKm)}{" "}
                instead of {formatKm(optimized.originalKm)}. The day-by-day notes above follow the
                planner&apos;s original sequence.
              </>
            ) : (
              <>
                This route doubles back on itself. Reordering the same temples cuts about{" "}
                <strong>{formatKm(optimized.savedKm)}</strong> off the journey.
              </>
            )}
          </p>
          <button
            type="button"
            className="btn-secondary route-optimizer-btn"
            onClick={() => setUseOptimized((v) => !v)}
          >
            {useOptimized ? "Show planner's order" : "Optimize the route"}
          </button>
        </div>
      ) : (
        <p className="route-optimizer-clear">
          <Check size={15} /> Checked for detours — these temples are already in an efficient
          visiting order.
        </p>
      )}

      {views.length > 1 && (
        <div className="yatra-route-day-tabs">
          {views.map((d, i) => (
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

      <YatraRouteMap
        stops={active.stops}
        startsFrom={active.startsFrom}
        legs={active.legs}
        totalKm={active.totalKm}
      />
    </div>
  );
}
