import { describe, it, expect } from "vitest";
import { topViewedTemples, plannerRegionCounts, bucketSignupsByDay } from "./admin-stats";

// Real slugs from data/temples.ts, chosen for their known regions:
// meenakshi-amman -> South India, dwarkadhish -> West India,
// kashi-vishwanath -> North India.

describe("topViewedTemples", () => {
  const names = new Map([
    ["meenakshi-amman", "Meenakshi Amman Temple"],
    ["dwarkadhish", "Dwarkadhish Temple"],
    ["kashi-vishwanath", "Kashi Vishwanath Temple"],
  ]);

  it("sorts by view_count descending and resolves names", () => {
    const rows = [
      { temple_slug: "dwarkadhish", view_count: 5 },
      { temple_slug: "meenakshi-amman", view_count: 42 },
      { temple_slug: "kashi-vishwanath", view_count: 17 },
    ];
    expect(topViewedTemples(rows, names)).toEqual([
      { slug: "meenakshi-amman", name: "Meenakshi Amman Temple", views: 42 },
      { slug: "kashi-vishwanath", name: "Kashi Vishwanath Temple", views: 17 },
      { slug: "dwarkadhish", name: "Dwarkadhish Temple", views: 5 },
    ]);
  });

  it("respects the limit", () => {
    const rows = [
      { temple_slug: "dwarkadhish", view_count: 5 },
      { temple_slug: "meenakshi-amman", view_count: 42 },
      { temple_slug: "kashi-vishwanath", view_count: 17 },
    ];
    expect(topViewedTemples(rows, names, 2)).toHaveLength(2);
  });

  it("skips slugs with no matching temple name", () => {
    const rows = [
      { temple_slug: "meenakshi-amman", view_count: 42 },
      { temple_slug: "removed-temple", view_count: 99 },
    ];
    expect(topViewedTemples(rows, names)).toEqual([
      { slug: "meenakshi-amman", name: "Meenakshi Amman Temple", views: 42 },
    ]);
  });

  it("handles an empty view log", () => {
    expect(topViewedTemples([], names)).toEqual([]);
  });
});

describe("plannerRegionCounts", () => {
  it("counts one plan toward every region it touches", () => {
    const itineraries = [
      { days: [{ templeSlugs: ["meenakshi-amman"] }] }, // South
      { days: [{ templeSlugs: ["dwarkadhish", "kashi-vishwanath"] }] }, // West + North
      { days: [{ templeSlugs: ["kashi-vishwanath"] }] }, // North
    ];
    expect(plannerRegionCounts(itineraries)).toEqual([
      { region: "North India", count: 2 },
      { region: "South India", count: 1 },
      { region: "West India", count: 1 },
    ]);
  });

  it("ignores plans with no resolvable region", () => {
    expect(plannerRegionCounts([{}, { days: [] }, undefined, null])).toEqual([]);
  });

  it("handles an empty list", () => {
    expect(plannerRegionCounts([])).toEqual([]);
  });
});

describe("bucketSignupsByDay", () => {
  function daysAgoIso(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  }

  it("returns one entry per day in the window, oldest first", () => {
    const series = bucketSignupsByDay([daysAgoIso(0)], 7);
    expect(series).toHaveLength(7);
    expect(series[6].signups).toBe(1); // today, last entry
  });

  it("counts signups per day and accumulates the running total", () => {
    const series = bucketSignupsByDay([daysAgoIso(2), daysAgoIso(2), daysAgoIso(0)], 7);
    const twoDaysAgo = series[4]; // index 6 - 2
    const today = series[6];
    expect(twoDaysAgo.signups).toBe(2);
    expect(twoDaysAgo.cumulative).toBe(2);
    expect(today.signups).toBe(1);
    expect(today.cumulative).toBe(3);
  });

  it("folds signups from before the window into the starting cumulative total", () => {
    const series = bucketSignupsByDay([daysAgoIso(100), daysAgoIso(0)], 7);
    expect(series[0].cumulative).toBe(1); // the 100-day-old signup, not yet "today"
    expect(series[6].cumulative).toBe(2);
  });

  it("still produces zero-filled days with no signups", () => {
    const series = bucketSignupsByDay([], 5);
    expect(series.every((d) => d.signups === 0 && d.cumulative === 0)).toBe(true);
  });
});
