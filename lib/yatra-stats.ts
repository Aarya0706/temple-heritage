import { temples } from "@/data/temples";

// The fixed set of regions a Yatra can touch, in display order. Sourced
// from the distinct values of Temple.region in data/temples.ts — if a new
// region is ever added to the temple data, add it here too.
export const REGIONS = [
  "North India",
  "South India",
  "East India",
  "West India",
  "Central India",
] as const;

export type Region = (typeof REGIONS)[number];

type ItineraryDay = {
  templeSlugs?: string[];
};

type YatraItinerary = {
  days?: ItineraryDay[];
} | null | undefined;

export type YatraPlanRow = {
  id: string;
  itinerary: YatraItinerary;
  completed_at: string | null;
};

const slugToRegion = new Map(temples.map((t) => [t.slug, t.region]));

/**
 * Every region actually touched by a plan's itinerary, resolved from its
 * saved templeSlugs (not the freeform displayRegion string, which can be a
 * joined label like "North India & Central India" and isn't safe to parse
 * back apart). A plan can credit more than one region.
 */
export function regionsForItinerary(itinerary: YatraItinerary): Region[] {
  const found = new Set<Region>();
  for (const day of itinerary?.days || []) {
    for (const slug of day.templeSlugs || []) {
      const region = slugToRegion.get(slug);
      if (region && (REGIONS as readonly string[]).includes(region)) {
        found.add(region as Region);
      }
    }
  }
  return Array.from(found);
}

/**
 * Current streak = consecutive calendar days, ending today or yesterday,
 * that have at least one completed Yatra. Dates are compared as local
 * calendar days (not full timestamps), so completing two Yatras on the
 * same day counts once, and "yesterday" still counts as live (the streak
 * isn't considered broken until a full day has passed with nothing
 * completed).
 */
export function computeStreak(completedAtDates: string[]): number {
  const dayKeys = new Set(
    completedAtDates.map((iso) => {
      const d = new Date(iso);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  if (dayKeys.size === 0) return 0;

  const keyFor = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  const cursor = new Date();
  if (!dayKeys.has(keyFor(cursor))) {
    // Nothing completed today — the streak can still be "live" if
    // yesterday has an entry, it just hasn't been extended today yet.
    cursor.setDate(cursor.getDate() - 1);
    if (!dayKeys.has(keyFor(cursor))) return 0;
  }

  let streak = 0;
  while (dayKeys.has(keyFor(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export type YatraStats = {
  completedCount: number;
  streak: number;
  unlockedRegions: Region[];
};

/**
 * Rolls up the stats block shown on My Yatras: how many Yatras are
 * completed, the current streak, and which region badges are unlocked
 * (earned once the user has ≥1 completed Yatra touching that region).
 */
export function computeYatraStats(rows: YatraPlanRow[]): YatraStats {
  const completed = rows.filter((r) => !!r.completed_at);

  const unlockedRegions = new Set<Region>();
  for (const row of completed) {
    for (const region of regionsForItinerary(row.itinerary)) {
      unlockedRegions.add(region);
    }
  }

  return {
    completedCount: completed.length,
    streak: computeStreak(completed.map((r) => r.completed_at as string)),
    unlockedRegions: REGIONS.filter((r) => unlockedRegions.has(r)),
  };
}
