// Real (road) travel-time estimation for yatra route legs.
//
// lib/route-optimize.ts deliberately stays pure and synchronous — no network
// call, great-circle distance only — because it also runs as the ranking
// function inside the 2-opt optimizer, which needs to evaluate thousands of
// candidate orderings per request. This module is the opposite: one network
// call per already-decided route, to attach a realistic road distance and
// driving time to each leg the traveller will actually see.
//
// Routing service: OSRM's public demo server (router.project-osrm.org). Like
// the OpenStreetMap tiles already used for the map, it's key-free — no
// account, no billing, no env var to configure on Vercel. It is a shared demo
// instance with no uptime guarantee, so every call here is expected to fail
// sometimes; callers must always have the straight-line numbers on hand to
// fall back to.

import { RouteLeg, formatKm } from "./route-optimize";

export type RouteLegPoint = { name: string; lat: number; lng: number };

export type TimedLeg = RouteLeg & {
  /** Estimated driving time for this leg, in minutes. Null when unavailable. */
  durationMin: number | null;
  /** Road distance in km when a route was found; falls back to the great-circle km otherwise. */
  roadKm: number | null;
  source: "road" | "straight-line";
};

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving/";

/** How long to wait for the routing service before giving up and falling back. */
export const ROUTING_TIMEOUT_MS = 6000;

/* ------------------------------------------------------------------ */
/* Pure helpers (no network) — the parts worth unit testing directly.  */
/* ------------------------------------------------------------------ */

/** Builds the OSRM request URL for an ordered list of points. */
export function buildOsrmUrl(points: RouteLegPoint[]): string {
  const coords = points.map((p) => `${p.lng},${p.lat}`).join(";");
  return `${OSRM_BASE}${coords}?overview=false&annotations=false&steps=false`;
}

/**
 * Turns an OSRM /route response into per-leg road distance + duration,
 * matched up against the straight-line legs already computed for the same
 * points. Returns null for anything that doesn't look like a usable result —
 * a non-Ok status, a malformed body, or a leg count that doesn't match
 * `legs` (which would mean the response doesn't correspond to this route) —
 * so the caller can fall back cleanly rather than display mismatched data.
 */
export function parseOsrmResponse(data: unknown, legs: RouteLeg[]): TimedLeg[] | null {
  if (!data || typeof data !== "object") return null;
  const body = data as {
    code?: string;
    routes?: { legs?: { distance?: number; duration?: number }[] }[];
  };

  if (body.code !== "Ok") return null;
  const routeLegs = body.routes?.[0]?.legs;
  if (!routeLegs || routeLegs.length !== legs.length) return null;

  return legs.map((leg, i) => {
    const rl = routeLegs[i];
    const distanceM = rl?.distance;
    const durationS = rl?.duration;
    if (typeof distanceM !== "number" || typeof durationS !== "number") {
      return { ...leg, durationMin: null, roadKm: null, source: "straight-line" };
    }
    return {
      ...leg,
      roadKm: distanceM / 1000,
      durationMin: durationS / 60,
      source: "road",
    };
  });
}

/** "1h 20m" / "45m" — never "0m", so a very short hop still reads as real time. */
export function formatDuration(minutes: number): string {
  const total = Math.max(1, Math.round(minutes));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Falls back to the already-known straight-line legs, unchanged in meaning. */
export function toStraightLineLegs(legs: RouteLeg[]): TimedLeg[] {
  return legs.map((leg) => ({ ...leg, durationMin: null, roadKm: null, source: "straight-line" }));
}

/** Label for one leg: "180 km · ~3h 20m" when road data is available, "180 km" otherwise. */
export function describeLeg(leg: TimedLeg): string {
  const km = formatKm(leg.roadKm ?? leg.km);
  if (leg.source === "road" && leg.durationMin != null) {
    return `${km} · ~${formatDuration(leg.durationMin)}`;
  }
  return km;
}

/* ------------------------------------------------------------------ */
/* Network call                                                        */
/* ------------------------------------------------------------------ */

/**
 * Fetches road distance + driving time for each leg of `points`, in order.
 * Always resolves (never throws) — a timeout, a network error, or a routing
 * service outage all resolve to the straight-line legs instead, since a
 * missing "estimated travel time" is a much smaller problem for a traveller
 * than a broken route page.
 */
export async function fetchTimedLegs(
  points: RouteLegPoint[],
  legs: RouteLeg[],
  fetchImpl: typeof fetch = fetch
): Promise<TimedLeg[]> {
  if (legs.length === 0) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ROUTING_TIMEOUT_MS);

  try {
    const res = await fetchImpl(buildOsrmUrl(points), { signal: controller.signal });
    if (!res.ok) return toStraightLineLegs(legs);
    const data = await res.json();
    const parsed = parseOsrmResponse(data, legs);
    return parsed ?? toStraightLineLegs(legs);
  } catch {
    // Network failure, timeout/abort, or an OSRM instance that's down —
    // all the same outcome from the traveller's point of view.
    return toStraightLineLegs(legs);
  } finally {
    clearTimeout(timeout);
  }
}
