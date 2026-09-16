import { describe, it, expect } from "vitest";
import { festivalsForTemple, festivalNamesWithTemples, templeCelebratesFestival } from "./temple-festivals";
import { festivals } from "@/data/festivals";

describe("festivalsForTemple", () => {
  it("returns the festivals a real tagged temple celebrates", () => {
    const names = festivalsForTemple("kashi-vishwanath");
    expect(names.length).toBeGreaterThan(0);
    expect(names).toContain("Makar Sankranti");
  });

  it("returns an empty array for a temple with no festival tags", () => {
    expect(festivalsForTemple("not-a-real-temple-slug")).toEqual([]);
  });
});

describe("festivalNamesWithTemples", () => {
  it("only includes festivals that have at least one related temple", () => {
    const names = festivalNamesWithTemples();
    for (const name of names) {
      const festival = festivals.find((f) => f.name === name);
      expect(festival?.relatedTempleSlugs.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicates and is alphabetically sorted", () => {
    const names = festivalNamesWithTemples();
    expect(new Set(names).size).toBe(names.length);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});

describe("templeCelebratesFestival", () => {
  it("matches a real tagged pair", () => {
    const festival = festivals.find((f) => f.relatedTempleSlugs.length > 0)!;
    const slug = festival.relatedTempleSlugs[0];
    expect(templeCelebratesFestival(slug, festival.name)).toBe(true);
  });

  it("is false for an untagged pair", () => {
    expect(templeCelebratesFestival("kashi-vishwanath", "Not A Real Festival")).toBe(false);
  });
});
