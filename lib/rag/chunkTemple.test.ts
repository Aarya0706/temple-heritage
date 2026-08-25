import { describe, it, expect } from "vitest";
import { buildTempleChunks, type ReviewRow } from "./chunkTemple";
import type { Temple } from "@/data/temples";

const baseTemple: Temple = {
  slug: "test-temple",
  name: "Test Temple",
  deity: "Test Deity",
  city: "Test City",
  state: "Test State",
  region: "South India",
  image: "",
  highlightImages: ["", ""],
  highlightDescriptions: ["Short desc A", "Short desc B"],
  highlightDetails: ["Detail A", "Detail B"],
  shortDescription: "Short.",
  description: "A long description of the temple.",
  timing: "6am - 9pm",
  bestTime: "October to March",
  type: "Historic",
  highlights: ["Gopuram", "Hall"],
  lat: 0,
  lng: 0,
};

describe("buildTempleChunks", () => {
  it("always includes an overview and a timings chunk", () => {
    const chunks = buildTempleChunks(baseTemple, []);
    const sections = chunks.map((c) => c.section);
    expect(sections).toContain("Overview");
    expect(sections).toContain("Timings & Best Time to Visit");
  });

  it("includes an access chunk only when accessNotes is set", () => {
    const withoutNotes = buildTempleChunks(baseTemple, []);
    expect(withoutNotes.some((c) => c.section === "Getting There")).toBe(false);

    const withNotes = buildTempleChunks({ ...baseTemple, accessNotes: "No road access." }, []);
    expect(withNotes.some((c) => c.section === "Getting There")).toBe(true);
  });

  it("creates one highlight chunk per highlight with detail text", () => {
    const chunks = buildTempleChunks(baseTemple, []);
    const highlightChunks = chunks.filter((c) => c.section.startsWith("Highlight:"));
    expect(highlightChunks.length).toBe(2);
  });

  it("filters out reviews with empty or missing review_text", () => {
    const reviews: ReviewRow[] = [
      { rating: 5, review_text: "Great place", reviewer_name: "A" },
      { rating: 3, review_text: "", reviewer_name: "B" },
      { rating: 4, review_text: null, reviewer_name: "C" },
    ];
    const chunks = buildTempleChunks(baseTemple, reviews);
    const reviewChunks = chunks.filter((c) => c.section === "Visitor Review");
    expect(reviewChunks.length).toBe(1);
    expect(reviewChunks[0].text).toContain("Great place");
  });

  it("caps review chunks at 25 even with more published reviews", () => {
    const reviews: ReviewRow[] = Array.from({ length: 40 }, (_, i) => ({
      rating: 5,
      review_text: `Review number ${i}`,
      reviewer_name: `User ${i}`,
    }));
    const chunks = buildTempleChunks(baseTemple, reviews);
    const reviewChunks = chunks.filter((c) => c.section === "Visitor Review");
    expect(reviewChunks.length).toBe(25);
  });
});
