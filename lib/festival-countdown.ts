import { Festival } from "@/data/festivals";

export type FestivalCountdownInfo = {
  festival: Festival;
  /** Verified upcoming date as a Date object (midnight local time). */
  date: Date;
  /** Whole days from now until `date`. Negative if the date has already passed this year. */
  daysUntil: number;
  hasPassed: boolean;
};

/**
 * Turns a festival's verified `date2026` into countdown info relative to `now`.
 * `date2026` is the last Panchang-verified occurrence — once it passes, the
 * next real date depends on next year's lunar calendar, which this data set
 * doesn't carry yet. Callers should treat `hasPassed: true` as "needs a data
 * refresh for next year" rather than compute a fake countdown.
 */
export function getFestivalCountdown(
  festival: Festival,
  now: Date = new Date()
): FestivalCountdownInfo {
  const date = new Date(`${festival.date2026}T00:00:00`);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntil = Math.round((date.getTime() - startOfToday.getTime()) / msPerDay);

  return {
    festival,
    date,
    daysUntil,
    hasPassed: daysUntil < 0,
  };
}

/**
 * Festivals with a verified date still ahead of `now`, soonest first.
 * Festivals whose date2026 has already passed are left out — their real
 * next-occurrence date isn't known until the data set is refreshed.
 */
export function getUpcomingFestivals(
  festivals: Festival[],
  now: Date = new Date()
): FestivalCountdownInfo[] {
  return festivals
    .map((festival) => getFestivalCountdown(festival, now))
    .filter((info) => !info.hasPassed)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function formatFestivalDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
