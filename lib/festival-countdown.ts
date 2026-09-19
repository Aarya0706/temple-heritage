import { Festival } from "@/data/festivals";
import { parseDurationDays } from "./ics";

export type FestivalCountdownInfo = {
  festival: Festival;
  /** Verified upcoming date as a Date object (midnight local time). */
  date: Date;
  /** The festival's last day this year (start + duration - 1), midnight local time. */
  endDate: Date;
  /** Whole days from now until `date` (the start). Negative once the festival has started. */
  daysUntil: number;
  /** True from the start day through the end day of the festival's own duration. */
  isOngoing: boolean;
  /** True only once today is past the LAST day of the festival's duration, not just its start. */
  hasPassed: boolean;
};

/**
 * Turns a festival's verified `date2026` + `duration` into countdown info
 * relative to `now`. A multi-day festival (e.g. a 10-day Ganesh Chaturthi)
 * is "ongoing", not "passed", for every day of its run — `hasPassed` only
 * flips once today is past the festival's last day, not merely its start
 * day. `date2026` is the last Panchang-verified occurrence — once the whole
 * run passes, the next real date depends on next year's lunar calendar,
 * which this data set doesn't carry yet. Callers should treat
 * `hasPassed: true` as "needs a data refresh for next year" rather than
 * compute a fake countdown.
 */
export function getFestivalCountdown(
  festival: Festival,
  now: Date = new Date()
): FestivalCountdownInfo {
  const date = new Date(`${festival.date2026}T00:00:00`);
  const spanDays = parseDurationDays(festival.duration);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + spanDays - 1);

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntil = Math.round((date.getTime() - startOfToday.getTime()) / msPerDay);
  const daysUntilEnd = Math.round((endDate.getTime() - startOfToday.getTime()) / msPerDay);

  const isOngoing = daysUntil <= 0 && daysUntilEnd >= 0;
  const hasPassed = daysUntilEnd < 0;

  return {
    festival,
    date,
    endDate,
    daysUntil,
    isOngoing,
    hasPassed,
  };
}

/**
 * Festivals that are either still ahead or currently ongoing, soonest-start
 * first. Festivals whose full run (through `endDate`) has already finished
 * are left out — their real next-occurrence date isn't known until the data
 * set is refreshed.
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
