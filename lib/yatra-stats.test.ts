import { describe, it, expect } from "vitest";
import { regionsForItinerary, computeStreak, computeYatraStats } from "./yatra-stats";

// Real slugs from data/temples.ts, chosen for their known regions:
// meenakshi-amman -> South India, dwarkadhish -> West India,
// kashi-vishwanath -> North India.

describe("regionsForItinerary", () => {
  it("resolves every region touched across all days", () => {
    const itinerary = {
      days: [
        { templeSlugs: ["meenakshi-amman"] },
        { templeSlugs: ["dwarkadhish", "kashi-vishwanath"] },
      ],
    };
    expect(regionsForItinerary(itinerary).sort()).toEqual(
      ["North India", "South India", "West India"].sort()
    );
  });

  it("ignores unknown slugs and returns no duplicates", () => {
    const itinerary = {
      days: [
        { templeSlugs: ["meenakshi-amman", "not-a-real-slug"] },
        { templeSlugs: ["meenakshi-amman"] },
      ],
    };
    expect(regionsForItinerary(itinerary)).toEqual(["South India"]);
  });

  it("handles missing/empty itinerary data without crashing", () => {
    expect(regionsForItinerary(undefined)).toEqual([]);
    expect(regionsForItinerary({})).toEqual([]);
    expect(regionsForItinerary({ days: [] })).toEqual([]);
  });
});

describe("computeStreak", () => {
  function daysAgo(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  }

  it("is 0 with no completed dates", () => {
    expect(computeStreak([])).toBe(0);
  });

  it("counts today alone as a streak of 1", () => {
    expect(computeStreak([daysAgo(0)])).toBe(1);
  });

  it("counts consecutive days ending today", () => {
    expect(computeStreak([daysAgo(0), daysAgo(1), daysAgo(2)])).toBe(3);
  });

  it("still counts as live if the most recent completion was yesterday", () => {
    expect(computeStreak([daysAgo(1), daysAgo(2)])).toBe(2);
  });

  it("breaks the streak once a full day is missed", () => {
    // Nothing today or yesterday — 3 days ago doesn't extend a live streak.
    expect(computeStreak([daysAgo(3), daysAgo(4)])).toBe(0);
  });

  it("collapses multiple completions on the same day into one", () => {
    expect(computeStreak([daysAgo(0), daysAgo(0)])).toBe(1);
  });
});

describe("computeYatraStats", () => {
  it("only counts rows with completed_at set", () => {
    const stats = computeYatraStats([
      { id: "1", itinerary: { days: [{ templeSlugs: ["meenakshi-amman"] }] }, completed_at: new Date().toISOString() },
      { id: "2", itinerary: { days: [{ templeSlugs: ["dwarkadhish"] }] }, completed_at: null },
    ]);
    expect(stats.completedCount).toBe(1);
    expect(stats.unlockedRegions).toEqual(["South India"]);
  });

  it("unlocks a badge from any completed plan touching that region, in REGIONS order", () => {
    const now = new Date().toISOString();
    const stats = computeYatraStats([
      { id: "1", itinerary: { days: [{ templeSlugs: ["dwarkadhish"] }] }, completed_at: now },
      { id: "2", itinerary: { days: [{ templeSlugs: ["kashi-vishwanath"] }] }, completed_at: now },
    ]);
    expect(stats.unlockedRegions).toEqual(["North India", "West India"]);
  });
});
