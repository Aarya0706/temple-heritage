import { describe, it, expect } from "vitest";
import { getZodiacSign, getHoroscopeGuidance } from "./zodiac";

describe("getZodiacSign", () => {
  it("returns the correct sign for a date in the middle of a range", () => {
    expect(getZodiacSign("1999-08-15")?.name).toBe("Leo");
    expect(getZodiacSign("2000-02-29")?.name).toBe("Pisces");
  });

  it("handles Capricorn's wrap across the new year", () => {
    expect(getZodiacSign("2000-01-01")?.name).toBe("Capricorn");
    expect(getZodiacSign("2000-12-25")?.name).toBe("Capricorn");
  });

  it("resolves boundary dates to the correct side", () => {
    expect(getZodiacSign("2000-01-19")?.name).toBe("Capricorn");
    expect(getZodiacSign("2000-01-20")?.name).toBe("Aquarius");
    expect(getZodiacSign("2000-07-22")?.name).toBe("Cancer");
    expect(getZodiacSign("2000-07-23")?.name).toBe("Leo");
  });

  it("returns null for malformed input", () => {
    expect(getZodiacSign("")).toBeNull();
    expect(getZodiacSign("not-a-date")).toBeNull();
    expect(getZodiacSign("2000-13-40")).toBeNull();
  });

  it("covers all 12 signs across a full year", () => {
    const names = new Set<string>();
    for (let month = 1; month <= 12; month++) {
      const day = 10;
      const date = `2001-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const sign = getZodiacSign(date);
      expect(sign).not.toBeNull();
      if (sign) names.add(sign.name);
    }
    expect(names.size).toBe(12);
  });
});

describe("getHoroscopeGuidance", () => {
  it("maps every sign's ruling planet to a non-empty deity focus", () => {
    for (let month = 1; month <= 12; month++) {
      const sign = getZodiacSign(`2001-${String(month).padStart(2, "0")}-10`);
      expect(sign).not.toBeNull();
      if (!sign) continue;
      const guidance = getHoroscopeGuidance(sign);
      expect(guidance.deityFocus.length).toBeGreaterThan(0);
      expect(guidance.blurb.length).toBeGreaterThan(0);
    }
  });
});
