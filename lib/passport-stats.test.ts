import { describe, it, expect } from "vitest";
import { computePassportStats, computeNextMilestone } from "./passport-stats";
import type { PassportStamp } from "./passport";

// Real slugs/regions from data/temples.ts: meenakshi-amman -> Tamil Nadu /
// South India, dwarkadhish -> Gujarat / West India, kashi-vishwanath ->
// Uttar Pradesh / North India.
function stamp(overrides: Partial<PassportStamp>): PassportStamp {
  return {
    templeSlug: "meenakshi-amman",
    templeName: "Meenakshi Amman Temple",
    city: "Madurai",
    state: "Tamil Nadu",
    region: "South India",
    imageUrl: null,
    visitedAt: new Date().toISOString(),
    method: "manual",
    ...overrides,
  };
}

describe("computeNextMilestone", () => {
  it("returns the first milestone when no stamps yet", () => {
    expect(computeNextMilestone(0)).toEqual({ label: "First Stamp", remaining: 1, target: 1 });
  });

  it("returns remaining count to the next unreached milestone", () => {
    expect(computeNextMilestone(3)).toEqual({
      label: "Wandering Pilgrim",
      remaining: 2,
      target: 5,
    });
  });

  it("returns null once every defined milestone is passed", () => {
    expect(computeNextMilestone(41)).toBeNull();
  });
});

describe("computePassportStats", () => {
  it("returns no states/regions for an empty passport", () => {
    const stats = computePassportStats([], 50);
    expect(stats.statesExplored).toEqual([]);
    expect(stats.unlockedRegions).toEqual([]);
    expect(stats.allTemplesVisited).toBe(false);
  });

  it("deduplicates states and unlocks only regions actually visited", () => {
    const stamps = [
      stamp({ templeSlug: "meenakshi-amman", state: "Tamil Nadu", region: "South India" }),
      stamp({ templeSlug: "kashi-vishwanath", state: "Uttar Pradesh", region: "North India" }),
      stamp({
        templeSlug: "kashi-vishwanath-again",
        state: "Uttar Pradesh",
        region: "North India",
      }),
    ];
    const stats = computePassportStats(stamps, 50);
    expect(stats.statesExplored.sort()).toEqual(["Tamil Nadu", "Uttar Pradesh"]);
    expect(stats.unlockedRegions.sort()).toEqual(["North India", "South India"].sort());
  });

  it("flags allTemplesVisited once stamp count reaches the total", () => {
    const stamps = [stamp({}), stamp({ templeSlug: "dwarkadhish" })];
    expect(computePassportStats(stamps, 2).allTemplesVisited).toBe(true);
    expect(computePassportStats(stamps, 3).allTemplesVisited).toBe(false);
  });
});
