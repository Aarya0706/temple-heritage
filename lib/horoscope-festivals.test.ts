import { describe, it, expect } from "vitest";
import { getUpcomingFestivalForSign } from "./horoscope-festivals";
import { getZodiacSign } from "./zodiac";

describe("getUpcomingFestivalForSign", () => {
  it("matches Saturn-ruled Capricorn to the next Shiva festival", () => {
    // Jan 20 2026 is after Makar Sankranti (Jan 14, also Shiva-temple-linked)
    // but before Maha Shivaratri (Feb 15) — isolates the Shiva-specific match.
    const sign = getZodiacSign("2000-01-05")!; // Capricorn
    const result = getUpcomingFestivalForSign(sign, new Date(2026, 0, 20));
    expect(result?.festival.slug).toBe("maha-shivaratri");
  });

  it("matches Venus-ruled Taurus to the next Goddess festival", () => {
    const sign = getZodiacSign("2000-05-01")!; // Taurus
    const result = getUpcomingFestivalForSign(sign, new Date(2026, 0, 1));
    expect(result?.festival.slug).toBe("navratri");
  });

  it("only returns a festival tied to a temple matching the sign's deity focus", () => {
    const sign = getZodiacSign("2000-05-01")!; // Taurus -> Venus -> Goddess/Meenakshi
    const result = getUpcomingFestivalForSign(sign, new Date(2026, 0, 1));
    expect(
      result?.festival.relatedTempleSlugs.includes("meenakshi-amman")
    ).toBe(true);
  });

  it("returns null once every matching festival for the year has passed", () => {
    const sign = getZodiacSign("2000-01-05")!; // Capricorn
    const result = getUpcomingFestivalForSign(sign, new Date(2026, 11, 31));
    expect(result).toBeNull();
  });
});
