import { describe, it, expect } from "vitest";
import { searchTemples, scoreTemple } from "./temple-search";
import type { Temple } from "@/data/temples";

function makeTemple(overrides: Partial<Temple>): Temple {
  return {
    slug: "test",
    name: "Test Temple",
    deity: "Test Deity",
    city: "Test City",
    state: "Test State",
    region: "South India",
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

const meenakshi = makeTemple({ slug: "meenakshi-amman", name: "Meenakshi Amman Temple", deity: "Goddess Meenakshi", city: "Madurai", state: "Tamil Nadu" });
const kashi = makeTemple({ slug: "kashi-vishwanath", name: "Kashi Vishwanath Temple", deity: "Lord Shiva", city: "Varanasi", state: "Uttar Pradesh" });
const somnath = makeTemple({ slug: "somnath", name: "Somnath Temple", deity: "Lord Shiva", city: "Somnath", state: "Gujarat" });

const catalog = [meenakshi, kashi, somnath];

describe("scoreTemple", () => {
  it("scores an exact name match highest among candidates", () => {
    const scores = catalog.map((t) => scoreTemple("meenakshi", t));
    const max = Math.max(...scores);
    expect(scores[0]).toBe(max);
    expect(scores[0]).toBeGreaterThan(0);
  });

  it("tolerates a one-character typo in the temple name", () => {
    const score = scoreTemple("meenaskhi", meenakshi); // transposed 's'/'k'
    expect(score).toBeGreaterThan(0);
  });

  it("tolerates a missing letter", () => {
    const score = scoreTemple("kashi vishwanth", kashi); // missing 'a' in vishwanath
    expect(score).toBeGreaterThan(0);
  });

  it("does not match on unrelated queries", () => {
    expect(scoreTemple("xyzabc123", meenakshi)).toBe(0);
  });

  it("weights a city match over a coincidental short substring", () => {
    // "madurai" should score meenakshi (city match) higher than a temple
    // with no relation to it at all.
    const relevant = scoreTemple("madurai", meenakshi);
    const irrelevant = scoreTemple("madurai", somnath);
    expect(relevant).toBeGreaterThan(irrelevant);
  });

  it("rewards matching more tokens in a multi-word query", () => {
    const bothMatch = scoreTemple("shiva varanasi", kashi);
    const oneMatches = scoreTemple("shiva varanasi", somnath); // matches "shiva" only
    expect(bothMatch).toBeGreaterThan(oneMatches);
  });
});

describe("searchTemples", () => {
  it("returns all temples unscored for an empty query", () => {
    const results = searchTemples("", catalog);
    expect(results.length).toBe(catalog.length);
    expect(results.every((r) => r.score === 0)).toBe(true);
  });

  it("excludes temples with zero relevance", () => {
    const results = searchTemples("meenakshi", catalog);
    expect(results.some((r) => r.temple.slug === "somnath")).toBe(false);
  });

  it("sorts results by descending score", () => {
    const results = searchTemples("shiva", catalog);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("finds a temple by a typo'd city name", () => {
    const results = searchTemples("varansi", catalog); // missing 'i'
    expect(results[0]?.temple.slug).toBe("kashi-vishwanath");
  });
});
