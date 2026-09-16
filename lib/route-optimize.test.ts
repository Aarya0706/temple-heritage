import { describe, it, expect } from "vitest";
import {
  pathLengthKm,
  buildLegs,
  formatKm,
  resolveOrigin,
  optimizeStops,
  optimizeTrip,
  describePlannedTrip,
} from "./route-optimize";
import type { Temple } from "@/data/temples";

function makeTemple(overrides: Partial<Temple>): Temple {
  return {
    slug: "test",
    name: "Test Temple",
    deity: "Test Deity",
    city: "Test City",
    state: "Test State",
    region: "North India",
    image: "",
    highlightImages: [],
    highlightDescriptions: [],
    highlightDetails: [],
    shortDescription: "A test temple.",
    description: "A longer description.",
    timing: "6am - 9pm",
    bestTime: "Winter",
    type: "Historic",
    highlights: [],
    lat: 0,
    lng: 0,
    ...overrides,
  };
}

// Four temples on a rough north-south line, deliberately handed to the
// optimizer in a zig-zagging order.
const north = makeTemple({ slug: "north", name: "North", lat: 28, lng: 77 });
const upper = makeTemple({ slug: "upper", name: "Upper", lat: 24, lng: 77 });
const lower = makeTemple({ slug: "lower", name: "Lower", lat: 20, lng: 77 });
const south = makeTemple({ slug: "south", name: "South", lat: 16, lng: 77 });

const slugsOf = (stops: Temple[]) => stops.map((t) => t.slug);

describe("pathLengthKm", () => {
  it("is zero for an empty or single-point path", () => {
    expect(pathLengthKm([])).toBe(0);
    expect(pathLengthKm([{ lat: 20, lng: 77 }])).toBe(0);
  });

  it("sums consecutive legs", () => {
    const detour = { lat: 24, lng: 82 };
    const direct = pathLengthKm([north, lower]);
    // Routing via a point off the straight line has to cost more.
    expect(pathLengthKm([north, detour, lower])).toBeGreaterThan(direct);
  });

  it("does not add a return leg back to the start", () => {
    const there = pathLengthKm([north, lower]);
    const thereAndBack = pathLengthKm([north, lower, north]);
    expect(thereAndBack).toBeCloseTo(there * 2, 6);
  });
});

describe("buildLegs", () => {
  it("includes the leg from the starting city into the first temple", () => {
    const legs = buildLegs([upper, lower], { name: "Bhopal", lat: 23.2599, lng: 77.4126 });
    expect(legs).toHaveLength(2);
    expect(legs[0].from).toBe("Bhopal");
    expect(legs[0].to).toBe("Upper");
  });

  it("omits the origin leg when no start point is known", () => {
    const legs = buildLegs([upper, lower], null);
    expect(legs).toHaveLength(1);
    expect(legs[0].from).toBe("Upper");
  });
});

describe("formatKm", () => {
  it("rounds to whole kilometres", () => {
    expect(formatKm(83.6)).toBe("84 km");
    expect(formatKm(0.2)).toBe("0 km");
  });
});

describe("resolveOrigin", () => {
  const list = [{ city: "Madurai", state: "Tamil Nadu", lat: 9.9195, lng: 78.1191 }];

  it("matches a temple city regardless of case and padding", () => {
    expect(resolveOrigin("  madurai ", list)).toMatchObject({ name: "madurai", lat: 9.9195 });
  });

  it("falls back to the major-city table for cities with no temple entry", () => {
    expect(resolveOrigin("Bhopal", list)).toMatchObject({ lat: 23.2599, lng: 77.4126 });
  });

  it("strips a trailing state so 'Bhopal, Madhya Pradesh' still resolves", () => {
    expect(resolveOrigin("Bhopal, Madhya Pradesh", list)).not.toBeNull();
  });

  it("returns null for blank or unknown places", () => {
    expect(resolveOrigin("", list)).toBeNull();
    expect(resolveOrigin(null, list)).toBeNull();
    expect(resolveOrigin("Atlantis", list)).toBeNull();
  });
});

describe("optimizeStops", () => {
  it("leaves one- and two-stop days untouched", () => {
    expect(slugsOf(optimizeStops([lower], null))).toEqual(["lower"]);
    expect(slugsOf(optimizeStops([lower, north], null))).toEqual(["lower", "north"]);
  });

  it("untangles a zig-zag into a straight run", () => {
    const zigzag = [north, lower, upper, south];
    const result = slugsOf(optimizeStops(zigzag, null));
    expect(result).toHaveLength(4);
    // Either direction along the line is optimal for an unanchored path.
    expect(["north,upper,lower,south", "south,lower,upper,north"]).toContain(result.join(","));
  });

  it("starts from the given origin rather than reordering it away", () => {
    const fromDelhi = { name: "Delhi", lat: 28.6139, lng: 77.209 };
    const result = slugsOf(optimizeStops([south, upper, lower, north], fromDelhi));
    expect(result).toEqual(["north", "upper", "lower", "south"]);
  });

  it("never drops or duplicates a stop", () => {
    const result = optimizeStops([south, north, upper, lower], null);
    expect(new Set(slugsOf(result))).toEqual(new Set(["south", "north", "upper", "lower"]));
  });

  it("is deterministic across runs", () => {
    const input = [south, north, upper, lower];
    expect(slugsOf(optimizeStops(input, null))).toEqual(slugsOf(optimizeStops(input, null)));
  });
});

describe("optimizeTrip", () => {
  const plannedDays = [
    { label: "Day 1", stops: [south] },
    { label: "Day 2", stops: [north, lower] },
    { label: "Day 3", stops: [upper] },
  ];

  it("keeps each day's stop count so the itinerary text still matches", () => {
    const trip = optimizeTrip(plannedDays, "Delhi");
    expect(trip.days.map((d) => d.stops.length)).toEqual([1, 2, 1]);
    expect(trip.days.map((d) => d.label)).toEqual(["Day 1", "Day 2", "Day 3"]);
  });

  it("shortens a backtracking plan and reports the saving", () => {
    const trip = optimizeTrip(plannedDays, "Delhi");
    expect(trip.optimizedKm).toBeLessThan(trip.originalKm);
    expect(trip.savedKm).toBeGreaterThan(0);
    expect(trip.improved).toBe(true);
  });

  it("reports no improvement when the planner's order was already best", () => {
    const alreadyGood = [
      { label: "Day 1", stops: [north] },
      { label: "Day 2", stops: [upper] },
      { label: "Day 3", stops: [lower, south] },
    ];
    const trip = optimizeTrip(alreadyGood, "Delhi");
    expect(trip.savedKm).toBeLessThan(5);
    expect(trip.improved).toBe(false);
  });

  it("chains each day's start to the previous day's last stop", () => {
    const trip = optimizeTrip(plannedDays, "Delhi");
    expect(trip.days[0].startsFrom?.name).toBe("Delhi");
    const day1End = trip.days[0].stops.at(-1)!.name;
    expect(trip.days[1].startsFrom?.name).toBe(day1End);
  });

  it("handles a rest day with no temples without losing the chain", () => {
    const withRestDay = [
      { label: "Day 1", stops: [north, upper] },
      { label: "Day 2", stops: [] },
      { label: "Day 3", stops: [lower] },
    ];
    const trip = optimizeTrip(withRestDay, "Delhi");
    expect(trip.days[1].stops).toEqual([]);
    expect(trip.days[1].totalKm).toBe(0);
    expect(trip.days[2].startsFrom?.name).toBe(trip.days[0].stops.at(-1)!.name);
  });

  it("still works when the starting city cannot be resolved", () => {
    const trip = optimizeTrip(plannedDays, "Somewhere Unknown");
    expect(trip.origin).toBeNull();
    expect(trip.days[0].startsFrom).toBeNull();
    expect(trip.days.flatMap((d) => d.stops)).toHaveLength(4);
  });
});

describe("describePlannedTrip", () => {
  it("preserves the planner's order untouched", () => {
    const days = [
      { label: "Day 1", stops: [south] },
      { label: "Day 2", stops: [north, lower] },
    ];
    const trip = describePlannedTrip(days, "Delhi");
    expect(slugsOf(trip.days[0].stops)).toEqual(["south"]);
    expect(slugsOf(trip.days[1].stops)).toEqual(["north", "lower"]);
    expect(trip.savedKm).toBe(0);
    expect(trip.improved).toBe(false);
  });

  it("measures the same distance the optimizer starts from", () => {
    const days = [{ label: "Day 1", stops: [south, north, upper] }];
    expect(describePlannedTrip(days, "Delhi").optimizedKm).toBeCloseTo(
      optimizeTrip(days, "Delhi").originalKm,
      6
    );
  });
});
