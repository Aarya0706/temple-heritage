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

export type MostSaved = {
  slug: string;
  name: string;
  count: number;
};

/**
 * The single most-saved temple across every user's saved_temples rows, with
 * its slug resolved to a display name. Ties break on whichever slug sorts
 * first, same as Array.prototype.sort's stable ordering — good enough for a
 * single "most saved" headline stat, unlike topViewedTemples this only
 * needs the winner, not a ranked list.
 */
export function mostSavedTemple(
  rows: { temple_slug: string }[],
  templeNames: Map<string, string>
): MostSaved | null {
  const counts = new Map<string, number>();
  for (const { temple_slug: slug } of rows) {
    if (!templeNames.has(slug)) continue;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  if (counts.size === 0) return null;

  let best: MostSaved | null = null;
  for (const [slug, count] of counts) {
    if (!best || count > best.count) {
      best = { slug, name: templeNames.get(slug)!, count };
    }
  }
  return best;
}

export type MostCompletedRegion = {
  region: Region;
  count: number;
};

/**
 * The region with the most *completed* Yatras (not just saved/planned
 * ones) — pass only itineraries whose plan has a completed_at set. Reuses
 * the same regionsForItinerary resolution as plannerRegionCounts, so a
 * completed plan spanning two regions still credits both.
 */
export function mostCompletedRegion(
  completedItineraries: YatraItinerary[]
): MostCompletedRegion | null {
  const counts = plannerRegionCounts(completedItineraries);
  return counts.length > 0 ? counts[0] : null;
}

/**
 * How many Yatra plans were generated/saved in the last `days` days
 * (default 7, i.e. "this week" on a rolling basis rather than calendar
 * Mon-Sun, so the number is always "since a week ago" instead of
 * resetting to 0 every Monday).
 */
export function yatrasGeneratedInLastDays(createdAtDates: string[], days = 7): number {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return createdAtDates.filter((iso) => new Date(iso).getTime() >= cutoff).length;
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
