import { regionsForItinerary, type YatraItinerary, type Region } from "./yatra-stats";

export type TempleViewRow = {
  temple_slug: string;
  view_count: number;
};

export type TopTemple = {
  slug: string;
  name: string;
  views: number;
};

/**
 * Top N temples by raw view count, with slugs resolved to display names.
 * Rows with a slug not present in `templeNames` are skipped rather than
 * shown as "undefined" -- can happen if a temple was removed from
 * data/temples.ts after it had already collected views.
 */
export function topViewedTemples(
  rows: TempleViewRow[],
  templeNames: Map<string, string>,
  limit = 8
): TopTemple[] {
  return rows
    .filter((r) => templeNames.has(r.temple_slug))
    .slice()
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, limit)
    .map((r) => ({
      slug: r.temple_slug,
      name: templeNames.get(r.temple_slug)!,
      views: r.view_count,
    }));
}

export type RegionCount = {
  region: Region;
  count: number;
};

/**
 * How many saved Yatra plans touch each region, resolved the same way the
 * "My Yatras" region badges are (via each plan's real templeSlugs, not the
 * freeform displayRegion label -- see regionsForItinerary). A single plan
 * that spans two regions counts once toward each, so totals across regions
 * can exceed the plan count.
 */
export function plannerRegionCounts(itineraries: YatraItinerary[]): RegionCount[] {
  const counts = new Map<Region, number>();
  for (const itinerary of itineraries) {
    for (const region of regionsForItinerary(itinerary)) {
      counts.set(region, (counts.get(region) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count);
}

export type SignupDay = {
  date: string; // YYYY-MM-DD
  signups: number;
  cumulative: number;
};

/**
 * Daily + cumulative signup counts for the last `days` calendar days
 * (default 30), local-date bucketed. Days with zero signups still appear
 * in the output so the chart has an unbroken x-axis instead of gaps.
 */
export function bucketSignupsByDay(createdAtDates: string[], days = 30): SignupDay[] {
  const dayKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const today = new Date();
  const windowStart = new Date(today);
  windowStart.setDate(windowStart.getDate() - (days - 1));
  const windowStartKey = dayKey(windowStart);

  const counts = new Map<string, number>();
  let cumulativeBeforeWindow = 0;
  for (const iso of createdAtDates) {
    const key = dayKey(new Date(iso));
    if (key < windowStartKey) {
      // Signups before the visible window still count toward the running
      // total, so the first bar/point isn't misleadingly reset to zero.
      cumulativeBeforeWindow += 1;
    } else {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  const series: SignupDay[] = [];
  let cumulative = cumulativeBeforeWindow;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    const signups = counts.get(key) ?? 0;
    cumulative += signups;
    series.push({ date: key, signups, cumulative });
  }

  return series;
}
