import { Temple } from "@/data/temples";
import { Festival, festivals } from "@/data/festivals";
import { getUpcomingFestivals, FestivalCountdownInfo } from "@/lib/festival-countdown";

// Traditional weekday -> deity associations used across Indian temple
// practice (vaar puja) for pointing devotees toward the most favoured day
// to visit a particular deity's shrine. Like zodiac.ts, this is a
// well-known folk-tradition heuristic, not a computed Panchang/tithi —
// the blurbs are written to be honest about that.
export type WeekdayGuidance = {
  weekday: number; // 0 = Sunday ... 6 = Saturday, matches Date#getDay()
  weekdayName: string;
  deityFocus: string[]; // matched against Temple.deity substrings
  blurb: string;
};

const WEEKDAY_GUIDANCE: WeekdayGuidance[] = [
  {
    weekday: 0,
    weekdayName: "Sunday",
    deityFocus: ["Surya"],
    blurb: "Sunday is traditionally Surya's day — considered an especially favourable day to visit Sun temples.",
  },
  {
    weekday: 1,
    weekdayName: "Monday",
    deityFocus: ["Shiva"],
    blurb: "Monday (Somvar) is Shiva's traditional day of worship across most Hindu communities.",
  },
  {
    weekday: 2,
    weekdayName: "Tuesday",
    deityFocus: ["Goddess", "Meenakshi"],
    blurb: "Tuesday is traditionally set aside for Devi worship in many regional calendars.",
  },
  {
    weekday: 3,
    weekdayName: "Wednesday",
    deityFocus: ["Krishna", "Vishnu", "Venkateswara", "Jagannath"],
    blurb: "Wednesday (Budhvar) is traditionally linked with Vishnu in his gentler, wisdom-giving forms.",
  },
  {
    weekday: 4,
    weekdayName: "Thursday",
    deityFocus: ["Vishnu", "Venkateswara", "Jagannath"],
    blurb: "Thursday (Guruvar) is widely observed as Vishnu's day, tied to Brihaspati/Jupiter.",
  },
  {
    weekday: 5,
    weekdayName: "Friday",
    deityFocus: ["Goddess", "Meenakshi"],
    blurb: "Friday is traditionally the Goddess's day (Shukra/Venus) in most regional temple calendars.",
  },
  {
    weekday: 6,
    weekdayName: "Saturday",
    deityFocus: ["Shiva"],
    blurb: "Saturday (Shanivar) is associated with Shani, and Shiva temples see especially devoted footfall.",
  },
];

/**
 * Finds the weekday tradition (if any) that matches this temple's deity.
 * Returns null for deities with no widely-recognised weekday association
 * in the data set — an honest gap rather than a guessed one.
 */
export function getAuspiciousWeekday(temple: Temple): WeekdayGuidance | null {
  return (
    WEEKDAY_GUIDANCE.find((g) =>
      g.deityFocus.some((focus) => temple.deity.includes(focus))
    ) ?? null
  );
}

/**
 * Next `count` calendar dates (today included) that fall on the given
 * weekday, starting from `from`.
 */
export function getNextWeekdayDates(
  weekday: number,
  count: number = 3,
  from: Date = new Date()
): Date[] {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const dates: Date[] = [];
  const cursor = new Date(start);
  // Advance to the first matching weekday (0-6 days forward).
  cursor.setDate(cursor.getDate() + ((weekday - cursor.getDay() + 7) % 7));

  while (dates.length < count) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 7);
  }
  return dates;
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * Upcoming festivals (from the verified date2026 data set) that this
 * specific temple is tied to via `relatedTempleSlugs`.
 */
export function getUpcomingFestivalsForTemple(
  templeSlug: string,
  now: Date = new Date()
): FestivalCountdownInfo[] {
  const related: Festival[] = festivals.filter((f) =>
    f.relatedTempleSlugs.includes(templeSlug)
  );
  return getUpcomingFestivals(related, now);
}
