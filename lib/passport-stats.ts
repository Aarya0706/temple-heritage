import { temples } from "@/data/temples";
import type { PassportStamp } from "@/lib/passport";
import { REGIONS, type Region } from "@/lib/yatra-stats";

/** Every distinct state a temple can be in, sourced from the static data file. */
const ALL_STATES = Array.from(new Set(temples.map((t) => t.state))).sort();

export type Milestone = {
  count: number;
  label: string;
};

// Ordered ascending — computeNextMilestone walks this to find the first one
// the pilgrim hasn't reached yet.
export const PASSPORT_MILESTONES: Milestone[] = [
  { count: 1, label: "First Stamp" },
  { count: 5, label: "Wandering Pilgrim" },
  { count: 10, label: "Devoted Traveler" },
  { count: 20, label: "Yatra Sadhak" },
  { count: 40, label: "Heritage Keeper" },
];

export type NextMilestone = {
  label: string;
  remaining: number;
  target: number;
};

/**
 * The next milestone badge the pilgrim hasn't reached yet, and how many
 * more stamps stand between them and it. Returns null once every defined
 * milestone has been passed (computePassportStats then falls back to the
 * "all temples visited" case for the UI).
 */
export function computeNextMilestone(stampCount: number): NextMilestone | null {
  const next = PASSPORT_MILESTONES.find((m) => m.count > stampCount);
  if (!next) return null;
  return { label: next.label, remaining: next.count - stampCount, target: next.count };
}

export type PassportStats = {
  statesExplored: string[];
  totalStates: number;
  unlockedRegions: Region[];
  nextMilestone: NextMilestone | null;
  allTemplesVisited: boolean;
};

/**
 * Rolls up the stats shown at the top of a Pilgrimage Passport: distinct
 * states touched, region badges unlocked, and progress toward the next
 * milestone. Pure function of the stamps already on the passport — no
 * Supabase access here, so it works for both the owner's view and a
 * shared read-only passport.
 */
export function computePassportStats(
  stamps: PassportStamp[],
  totalTemples: number
): PassportStats {
  const statesExplored = Array.from(
    new Set(stamps.map((s) => s.state).filter((s): s is string => !!s))
  ).sort();

  const unlockedRegions = REGIONS.filter((region) =>
    stamps.some((s) => s.region === region)
  );

  return {
    statesExplored,
    totalStates: ALL_STATES.length,
    unlockedRegions,
    nextMilestone: computeNextMilestone(stamps.length),
    allTemplesVisited: totalTemples > 0 && stamps.length >= totalTemples,
  };
}
