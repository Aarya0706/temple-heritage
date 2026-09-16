// Geographic route optimization for AI-generated yatra itineraries.
//
// The planner (app/api/planner/route.ts) decides WHICH temples belong in a
// trip — it's good at cultural fit, festival timing and regional grouping,
// but an LLM has no real distance model, so the order it emits is often
// noticeably worse than it needs to be (a stop 300km backwards, then
// forwards again past the same junction).
//
// This module leaves the AI's temple selection completely untouched and only
// re-sequences the visits: nearest-neighbour to build a sensible starting
// tour, then 2-opt to remove the crossings nearest-neighbour always leaves
// behind. The path is OPEN (no return leg to the start) because a pilgrimage
// ends wherever the last temple is — travellers fly home from the nearest
// airport, they don't drive back to where they began.
//
// Everything here is pure and synchronous: no API key, no network call, no
// paid routing service. Distances are great-circle, so they read as "as the
// crow flies" rather than road distance — honest, and enough to rank one
// ordering against another.

import { haversineKm, MAJOR_CITY_COORDS } from "./geo";
import { temples, Temple } from "@/data/temples";

export type LatLng = { lat: number; lng: number };

export type RouteOrigin = LatLng & { name: string };

/** One hop between two consecutive points on the route. */
export type RouteLeg = {
  from: string;
  to: string;
  km: number;
};

export type OptimizedDay = {
  label: string;
  /** The day's stops in optimized visiting order. */
  stops: Temple[];
  /** Where this day's travel begins: the trip origin, or the previous day's last stop. */
  startsFrom: RouteOrigin | null;
  legs: RouteLeg[];
  totalKm: number;
};

export type OptimizedTrip = {
  days: OptimizedDay[];
  origin: RouteOrigin | null;
  /** Distance of the whole trip in the planner's original order. */
  originalKm: number;
  /** Distance of the whole trip after re-sequencing. */
  optimizedKm: number;
  /** originalKm − optimizedKm, never negative. */
  savedKm: number;
  /** True only when the saving is big enough to be worth showing. */
  improved: boolean;
};

/** A saving smaller than this is noise from great-circle rounding, not a real win. */
const MIN_SAVING_KM = 5;

/* ------------------------------------------------------------------ */
/* Distance helpers                                                    */
/* ------------------------------------------------------------------ */

/** Total length of an open path through `points`, in kilometers. */
export function pathLengthKm(points: LatLng[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineKm(points[i - 1], points[i]);
  }
  return total;
}

/**
 * Per-hop breakdown of a day's travel. Includes the leg from `start` into the
 * first temple when a start point is known, so "Bhopal → Ujjain, 180 km"
 * shows up rather than silently disappearing.
 */
export function buildLegs(stops: Temple[], start: RouteOrigin | null): RouteLeg[] {
  const points: { name: string; lat: number; lng: number }[] = [
    ...(start ? [{ name: start.name, lat: start.lat, lng: start.lng }] : []),
    ...stops.map((t) => ({ name: t.name, lat: t.lat, lng: t.lng })),
  ];

  const legs: RouteLeg[] = [];
  for (let i = 1; i < points.length; i++) {
    legs.push({
      from: points[i - 1].name,
      to: points[i].name,
      km: haversineKm(points[i - 1], points[i]),
    });
  }
  return legs;
}

/** Rounds a distance for display: "84 km", "1,240 km". */
export function formatKm(km: number): string {
  return `${Math.round(km).toLocaleString("en-IN")} km`;
}

/* ------------------------------------------------------------------ */
/* Origin resolution                                                   */
/* ------------------------------------------------------------------ */

/**
 * Turns the planner's free-text starting city ("Bhopal", "Bhopal, Madhya
 * Pradesh", "bhopal ") into coordinates, so day one's route starts from the
 * traveller's actual home city instead of jumping straight to a temple.
 *
 * Tries the whole string first, then the part before the first comma, since
 * users and saved plans write the field both ways. Returns null when nothing
 * matches — callers must treat the origin as optional rather than guessing.
 */
export function resolveOrigin(
  from: string | null | undefined,
  templeList: Pick<Temple, "city" | "state" | "lat" | "lng">[] = temples
): RouteOrigin | null {
  if (!from || !from.trim()) return null;

  const candidates = [from, from.split(",")[0]].map((s) => s.trim()).filter(Boolean);

  for (const candidate of candidates) {
    const needle = candidate.toLowerCase();

    const byCity = templeList.find((t) => t.city.toLowerCase() === needle);
    if (byCity) return { name: candidate, lat: byCity.lat, lng: byCity.lng };

    const major = MAJOR_CITY_COORDS[needle];
    if (major) return { name: candidate, lat: major.lat, lng: major.lng };

    const byState = templeList.find((t) => t.state.toLowerCase() === needle);
    if (byState) return { name: candidate, lat: byState.lat, lng: byState.lng };
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* The optimizer                                                       */
/* ------------------------------------------------------------------ */

/** Greedy tour: repeatedly hop to the closest unvisited point. */
function nearestNeighbourOrder(points: LatLng[], startIndex: number): number[] {
  const unvisited = new Set(points.map((_, i) => i));
  unvisited.delete(startIndex);

  const order = [startIndex];
  let current = startIndex;

  while (unvisited.size > 0) {
    let best = -1;
    let bestKm = Infinity;
    // Iterating the index range rather than the Set keeps ties resolving to
    // the earlier index, so the same input always produces the same route.
    for (let i = 0; i < points.length; i++) {
      if (!unvisited.has(i)) continue;
      const km = haversineKm(points[current], points[i]);
      if (km < bestKm) {
        bestKm = km;
        best = i;
      }
    }
    order.push(best);
    unvisited.delete(best);
    current = best;
  }

  return order;
}

/**
 * 2-opt on an open path: repeatedly reverse the segment between two positions
 * whenever doing so shortens the total, which is what untangles the crossings
 * nearest-neighbour leaves behind.
 *
 * `fixedHead` positions at the front of the order are never moved — that's how
 * the trip origin stays the starting point instead of being optimized into the
 * middle of the route.
 */
function twoOpt(order: number[], points: LatLng[], fixedHead: number): number[] {
  const dist = (a: number, b: number) => haversineKm(points[a], points[b]);
  const result = order.slice();
  const n = result.length;

  // Guards against pathological input; real itineraries converge in a handful
  // of sweeps, so this ceiling is never reached in practice.
  const MAX_SWEEPS = 60;
  let sweeps = 0;
  let improved = true;

  while (improved && sweeps < MAX_SWEEPS) {
    improved = false;
    sweeps++;

    for (let i = Math.max(1, fixedHead); i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const before =
          dist(result[i - 1], result[i]) +
          (j + 1 < n ? dist(result[j], result[j + 1]) : 0);
        const after =
          dist(result[i - 1], result[j]) +
          (j + 1 < n ? dist(result[i], result[j + 1]) : 0);

        // Require a real improvement, not a floating-point tie, or the loop
        // can flip the same pair back and forth forever.
        if (after < before - 1e-9) {
          const segment = result.slice(i, j + 1).reverse();
          result.splice(i, segment.length, ...segment);
          improved = true;
        }
      }
    }
  }

  return result;
}

/**
 * Best visiting order for one set of stops.
 *
 * With a known start point the route is anchored there. Without one, every
 * stop is tried as the opening move and the shortest resulting path wins —
 * affordable because an itinerary has tens of stops, not thousands.
 */
export function optimizeStops(stops: Temple[], start: RouteOrigin | null): Temple[] {
  if (stops.length < 3) return stops.slice();

  if (start) {
    const points: LatLng[] = [start, ...stops];
    const order = twoOpt(nearestNeighbourOrder(points, 0), points, 1);
    // Drop the origin (index 0) and shift back into stop indices.
    return order.slice(1).map((i) => stops[i - 1]);
  }

  let bestOrder: number[] | null = null;
  let bestKm = Infinity;

  for (let s = 0; s < stops.length; s++) {
    const order = twoOpt(nearestNeighbourOrder(stops, s), stops, 0);
    const km = pathLengthKm(order.map((i) => stops[i]));
    if (km < bestKm - 1e-9) {
      bestKm = km;
      bestOrder = order;
    }
  }

  return (bestOrder ?? stops.map((_, i) => i)).map((i) => stops[i]);
}

/* ------------------------------------------------------------------ */
/* Whole-trip optimization                                             */
/* ------------------------------------------------------------------ */

export type PlannedDay = {
  label: string;
  stops: Temple[];
};

/**
 * Re-sequences an entire itinerary.
 *
 * The trip is treated as one continuous path from the starting city through
 * every temple the AI picked, then sliced back into days using each day's
 * original stop count — so a "two temples on day two" plan stays a two-temple
 * day two, it just visits a better-chosen pair in a better order. Days the
 * planner left without temples (travel or rest days) keep their place in the
 * sequence.
 *
 * Optimizing across day boundaries rather than within each day is what
 * actually removes backtracking: re-ordering three stops inside one day can't
 * fix a plan that crosses the same state line four times.
 */
export function optimizeTrip(days: PlannedDay[], from: string | null | undefined): OptimizedTrip {
  const origin = resolveOrigin(from);
  const flat = days.flatMap((d) => d.stops);

  const originalKm = pathLengthKm([...(origin ? [origin] : []), ...flat]);
  const sequence = optimizeStops(flat, origin);
  const optimizedKm = pathLengthKm([...(origin ? [origin] : []), ...sequence]);

  // Re-chunk the optimized sequence back into the planner's day shape.
  const optimizedDays: OptimizedDay[] = [];
  let cursor = 0;
  let previousEnd: RouteOrigin | null = origin;

  for (const day of days) {
    const stops = sequence.slice(cursor, cursor + day.stops.length);
    cursor += day.stops.length;

    const startsFrom = previousEnd;
    const legs = buildLegs(stops, startsFrom);

    optimizedDays.push({
      label: day.label,
      stops,
      startsFrom,
      legs,
      totalKm: legs.reduce((sum, leg) => sum + leg.km, 0),
    });

    const last = stops[stops.length - 1];
    if (last) previousEnd = { name: last.name, lat: last.lat, lng: last.lng };
  }

  const savedKm = Math.max(0, originalKm - optimizedKm);

  return {
    days: optimizedDays,
    origin,
    originalKm,
    optimizedKm,
    savedKm,
    improved: savedKm >= MIN_SAVING_KM,
  };
}

/**
 * The planner's original ordering, described with the same shape as an
 * optimized trip, so the UI can toggle between the two without special-casing
 * either side.
 */
export function describePlannedTrip(
  days: PlannedDay[],
  from: string | null | undefined
): OptimizedTrip {
  const origin = resolveOrigin(from);
  const flat = days.flatMap((d) => d.stops);
  const totalKm = pathLengthKm([...(origin ? [origin] : []), ...flat]);

  const described: OptimizedDay[] = [];
  let previousEnd: RouteOrigin | null = origin;

  for (const day of days) {
    const legs = buildLegs(day.stops, previousEnd);
    described.push({
      label: day.label,
      stops: day.stops,
      startsFrom: previousEnd,
      legs,
      totalKm: legs.reduce((sum, leg) => sum + leg.km, 0),
    });
    const last = day.stops[day.stops.length - 1];
    if (last) previousEnd = { name: last.name, lat: last.lat, lng: last.lng };
  }

  return {
    days: described,
    origin,
    originalKm: totalKm,
    optimizedKm: totalKm,
    savedKm: 0,
    improved: false,
  };
}
