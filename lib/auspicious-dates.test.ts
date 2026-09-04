import { describe, it, expect } from "vitest";
import {
  getAuspiciousWeekday,
  getNextWeekdayDates,
  getUpcomingFestivalsForTemple,
} from "./auspicious-dates";
import { temples } from "@/data/temples";

describe("getAuspiciousWeekday", () => {
  it("matches a Shiva temple to Monday", () => {
    const kashiVishwanath = temples.find((t) => t.slug === "kashi-vishwanath")!;
    expect(getAuspiciousWeekday(kashiVishwanath)?.weekdayName).toBe("Monday");
  });

  it("returns null for a deity with no mapped weekday", () => {
    const guidance = getAuspiciousWeekday({
      ...temples[0],
      deity: "Unmapped Deity",
    });
    expect(guidance).toBeNull();
  });
});

describe("getNextWeekdayDates", () => {
  it("returns dates that all fall on the requested weekday", () => {
    const from = new Date(2026, 0, 1); // Thursday, Jan 1 2026
    const dates = getNextWeekdayDates(1, 4, from); // Monday
    expect(dates).toHaveLength(4);
    dates.forEach((d) => expect(d.getDay()).toBe(1));
  });

  it("includes today when today already matches", () => {
    const from = new Date(2026, 0, 5); // Monday, Jan 5 2026
    const [first] = getNextWeekdayDates(1, 1, from);
    expect(first.getDate()).toBe(5);
  });

  it("returns dates in strictly increasing order, 7 days apart", () => {
    const dates = getNextWeekdayDates(3, 5, new Date(2026, 2, 10));
    for (let i = 1; i < dates.length; i++) {
      const diffDays = (dates[i].getTime() - dates[i - 1].getTime()) / 86400000;
      expect(diffDays).toBe(7);
    }
  });
});

describe("getUpcomingFestivalsForTemple", () => {
  it("only returns festivals whose relatedTempleSlugs includes the temple", () => {
    const results = getUpcomingFestivalsForTemple(
      "kashi-vishwanath",
      new Date(2026, 0, 1)
    );
    results.forEach(({ festival }) =>
      expect(festival.relatedTempleSlugs).toContain("kashi-vishwanath")
    );
  });

  it("returns an empty array for a temple with no related festivals", () => {
    const results = getUpcomingFestivalsForTemple(
      "not-a-real-temple-slug",
      new Date(2026, 0, 1)
    );
    expect(results).toEqual([]);
  });
});
