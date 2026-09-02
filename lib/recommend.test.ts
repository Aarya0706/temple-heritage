import { describe, it, expect } from "vitest";
import { recommendTemples } from "./recommend";
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

const a = makeTemple({ slug: "a", name: "Temple A", deity: "Lord Shiva", type: "Jyotirlinga" });
const b = makeTemple({ slug: "b", name: "Temple B", deity: "Goddess", type: "Historic" });
const c = makeTemple({ slug: "c", name: "Temple C", deity: "Lord Vishnu", type: "Historic" });
const d = makeTemple({ slug: "d", name: "Temple D", deity: "Lord Shiva", type: "Historic" });

const catalog = [a, b, c, d];

describe("recommendTemples", () => {
  it("never recommends a temple the user already saved", () => {
    const results = recommendTemples({
      temples: catalog,
      selectedPreferences: [],
      savedSlugs: ["a"],
      allSaved: [],
      ratings: [],
    });
    expect(results.some((r) => r.temple.slug === "a")).toBe(false);
  });

  it("surfaces a co-saved temple via collaborative filtering", () => {
    // Two other users both saved "a" and "c" together — c should be
    // recommended to someone who has only saved "a".
    const allSaved = [
      { user_id: "u1", temple_slug: "a" },
      { user_id: "u1", temple_slug: "c" },
      { user_id: "u2", temple_slug: "a" },
      { user_id: "u2", temple_slug: "c" },
    ];
    const results = recommendTemples({
      temples: catalog,
      selectedPreferences: [],
      savedSlugs: ["a"],
      allSaved,
      ratings: [],
    });
    expect(results[0].temple.slug).toBe("c");
    expect(results[0].reason.type).toBe("saved_by_similar_users");
  });

  it("only counts users who overlap with the seed set", () => {
    // u3 saved "b" and "d" but never anything the current user saved —
    // shouldn't contribute to co-occurrence at all.
    const allSaved = [
      { user_id: "u3", temple_slug: "b" },
      { user_id: "u3", temple_slug: "d" },
    ];
    const results = recommendTemples({
      temples: catalog,
      selectedPreferences: [],
      savedSlugs: ["a"],
      allSaved,
      ratings: [],
    });
    // No co-occurrence signal at all — falls back to preference/popularity,
    // neither of which favors b or d specifically here.
    expect(results.every((r) => r.reason.type !== "saved_by_similar_users")).toBe(true);
  });

  it("falls back to matches_interests when there's no collaborative signal", () => {
    const results = recommendTemples({
      temples: catalog,
      selectedPreferences: ["Jyotirlinga"],
      savedSlugs: [],
      allSaved: [],
      ratings: [],
    });
    expect(results[0].temple.slug).toBe("a"); // only Jyotirlinga in the catalog
    expect(results[0].reason.type).toBe("matches_interests");
  });

  it("falls back to popularity when there's no preference or collaborative signal", () => {
    const ratings = [
      { temple_slug: "b", average_rating: 4.8, review_count: 20 },
      { temple_slug: "d", average_rating: 3.0, review_count: 2 },
    ];
    const results = recommendTemples({
      temples: catalog,
      selectedPreferences: [],
      savedSlugs: [],
      allSaved: [],
      ratings,
    });
    expect(results[0].temple.slug).toBe("b");
    expect(results[0].reason.type).toBe("popular");
  });

  it("surfaces matches_horoscope when a birth date is given and no collaborative signal exists", () => {
    // 1999-08-15 -> Leo -> Sun -> Surya. None of the test temples' deities
    // include "Surya", so use the Shiva-ruled case (Cancer/Moon, Mars, or
    // Saturn) which the catalog does have via temple "a" and "d".
    const results = recommendTemples({
      temples: catalog,
      selectedPreferences: [],
      savedSlugs: [],
      allSaved: [],
      ratings: [],
      birthDate: "2000-07-10", // Cancer -> Moon -> Shiva
    });
    expect(results[0].reason.type).toBe("matches_horoscope");
    expect(results[0].temple.deity).toContain("Shiva");
  });

  it("ignores an unparseable birth date rather than throwing", () => {
    const results = recommendTemples({
      temples: catalog,
      selectedPreferences: [],
      savedSlugs: [],
      allSaved: [],
      ratings: [],
      birthDate: "not-a-date",
    });
    expect(results.every((r) => r.reason.type !== "matches_horoscope")).toBe(true);
  });

  it("respects the limit", () => {
    const results = recommendTemples({
      temples: catalog,
      selectedPreferences: [],
      savedSlugs: [],
      allSaved: [],
      ratings: [],
      limit: 2,
    });
    expect(results.length).toBe(2);
  });

  it("handles a cold-start user (no saves, no preferences, no ratings) without crashing", () => {
    const results = recommendTemples({
      temples: catalog,
      selectedPreferences: [],
      savedSlugs: [],
      allSaved: [],
      ratings: [],
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => Number.isFinite(r.score))).toBe(true);
  });
});
