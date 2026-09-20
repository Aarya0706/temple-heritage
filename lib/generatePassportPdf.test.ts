import { describe, it, expect } from "vitest";
import { regionStyle, abbreviateState } from "./generatePassportPdf";

describe("regionStyle", () => {
  it("gives each of the five regions a distinct color and letter code", () => {
    const regions = ["North India", "South India", "East India", "West India", "Central India"] as const;
    const styles = regions.map((r) => regionStyle(r));
    const colors = new Set(styles.map((s) => s.color));
    const codes = new Set(styles.map((s) => s.code));
    expect(colors.size).toBe(5);
    expect(codes.size).toBe(5);
  });

  it("falls back to a neutral style for an unrecognized or null region", () => {
    expect(regionStyle(null)).toEqual({ color: "#7A6A5A", code: "\u2022" });
    expect(regionStyle("Atlantis")).toEqual({ color: "#7A6A5A", code: "\u2022" });
  });
});

describe("abbreviateState", () => {
  it("uses the known short code for a mapped state", () => {
    expect(abbreviateState("Tamil Nadu")).toBe("TN");
    expect(abbreviateState("Uttarakhand")).toBe("UK");
  });

  it("falls back to the first three letters, uppercased, for an unmapped state", () => {
    expect(abbreviateState("Rajasthan")).toBe("RAJ");
  });

  it("returns an empty string for null", () => {
    expect(abbreviateState(null)).toBe("");
  });
});
