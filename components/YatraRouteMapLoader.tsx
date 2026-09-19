"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { TimedLeg, toStraightLineLegs } from "@/lib/route-time";

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

  const views: OptimizedDay[] = wholeTrip ? [wholeTrip, ...trip.days] : trip.days;
  const active: OptimizedDay | undefined = views[Math.min(activeIndex, views.length - 1)];

  const activePointsKey = useMemo(
    () =>
      !active
        ? ""
        : [
            active.startsFrom ? `${active.startsFrom.lat},${active.startsFrom.lng}` : "",
            ...active.stops.map((t) => `${t.lat},${t.lng}`),
          ].join("|"),
    [active]
  );

  // Road distance + driving time for the currently-active view, keyed to the
  // route it was fetched for. Tagging the result with the key it belongs to
  // (rather than resetting state imperatively when the view changes) means a
  // response that arrives for a tab the traveller has since switched away
  // from is simply ignored below, instead of racing a reset.
  const [resolved, setResolved] = useState<{ key: string; legs: TimedLeg[] } | null>(null);
  const [loadingTravelTime, setLoadingTravelTime] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    if (!active || active.legs.length === 0) return;

    const points = [
      ...(active.startsFrom
        ? [{ name: active.startsFrom.name, lat: active.startsFrom.lat, lng: active.startsFrom.lng }]
        : []),
      ...active.stops.map((t) => ({ name: t.name, lat: t.lat, lng: t.lng })),
    ];
    const key = activePointsKey;
    const legCount = active.legs.length;

    const thisRequest = ++requestId.current;
    // This effect exists specifically to kick off the routing-service fetch
    // when the active route changes, so flagging "in flight" as soon as that
    // starts is the effect's actual job, not a synchronization side-effect
    // the linter's cascading-render warning is meant to catch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingTravelTime(true);

    fetch("/api/route-time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { legs?: TimedLeg[] } | null) => {
        if (thisRequest !== requestId.current) return; // a newer request has since started
        if (data?.legs && data.legs.length === legCount) {
          setResolved({ key, legs: data.legs });
        }
      })
      .catch(() => {
        // Straight-line legs (derived below) already cover this case.
      })
      .finally(() => {
        if (thisRequest === requestId.current) setLoadingTravelTime(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePointsKey]);

  if (!active) return null;

  const timedLegs: TimedLeg[] =
    resolved && resolved.key === activePointsKey ? resolved.legs : toStraightLineLegs(active.legs);
  const hasRoadTimes = timedLegs.some((leg) => leg.source === "road");
  const totalDurationMin = hasRoadTimes
    ? timedLegs.reduce((sum, leg) => sum + (leg.durationMin ?? 0), 0)
    : null;

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
        legs={timedLegs}
        totalKm={active.totalKm}
        totalDurationMin={totalDurationMin}
        loadingTravelTime={loadingTravelTime}
      />
    </div>
  );
}
