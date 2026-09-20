import { describe, it, expect } from "vitest";
import { regionColor, abbreviateState, currentMilestoneLabel } from "./generatePassportPdf";

describe("regionColor", () => {
  it("gives each of the five regions a distinct color", () => {
    const regions = ["North India", "South India", "East India", "West India", "Central India"] as const;
    const colors = new Set(regions.map((r) => regionColor(r)));
    expect(colors.size).toBe(5);
  });

  it("falls back to a neutral color for an unrecognized or null region", () => {
    expect(regionColor(null)).toBe("#7A6A5A");
    expect(regionColor("Atlantis")).toBe("#7A6A5A");
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

describe("currentMilestoneLabel", () => {
  it("returns null for zero stamps", () => {
    expect(currentMilestoneLabel(0)).toBeNull();
  });

  it("returns the first milestone once the first stamp is earned", () => {
    expect(currentMilestoneLabel(1)).toBe("First Stamp");
    expect(currentMilestoneLabel(4)).toBe("First Stamp");
  });

  it("returns the highest milestone reached, not just the nearest one", () => {
    expect(currentMilestoneLabel(5)).toBe("Wandering Pilgrim");
    expect(currentMilestoneLabel(9)).toBe("Wandering Pilgrim");
    expect(currentMilestoneLabel(20)).toBe("Yatra Sadhak");
    expect(currentMilestoneLabel(100)).toBe("Heritage Keeper");
  });
});
