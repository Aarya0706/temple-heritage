import { describe, it, expect } from "vitest";
import { rankChunks, type Chunk } from "./tfidf";

const chunks: Chunk[] = [
  { id: "timings", section: "Timings & Best Time to Visit", text: "Darshan timing / visiting hours: 6am to 9pm daily." },
  { id: "history", section: "Overview", text: "Built in the 12th century, this temple has a long history of Chola-era patronage." },
  { id: "access", section: "Getting There", text: "Nearest airport is 40km away, no direct road access in monsoon." },
  { id: "review-1", section: "Visitor Review", text: "A visitor rated it 5/5 and wrote: crowded in the mornings but worth the wait." },
];

describe("rankChunks", () => {
  it("ranks the timings chunk highest for a timings question", () => {
    const ranked = rankChunks(chunks, "what are the visiting hours", 5);
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].chunk.id).toBe("timings");
  });

  it("ranks the access chunk highest for a getting-there question", () => {
    const ranked = rankChunks(chunks, "how do I get to the temple, is there an airport nearby", 5);
    expect(ranked[0].chunk.id).toBe("access");
  });

  it("surfaces the review chunk for a crowd-level question", () => {
    const ranked = rankChunks(chunks, "is it crowded in the morning", 5);
    expect(ranked.some((r) => r.chunk.id === "review-1")).toBe(true);
  });

  it("returns an empty array for an empty corpus", () => {
    expect(rankChunks([], "anything", 5)).toEqual([]);
  });

  it("respects topK", () => {
    const ranked = rankChunks(chunks, "temple visitor history timing access", 2);
    expect(ranked.length).toBeLessThanOrEqual(2);
  });

  it("scores nonsense queries at zero, unlike a relevant query", () => {
    // rankChunks itself doesn't filter zero-score results (that's done by
    // MIN_RELEVANCE in the API route) — it always returns topK entries.
    // What should differ is the *score*, not the result count.
    const relevant = rankChunks(chunks, "visiting hours", 1)[0].score;
    const unrelated = rankChunks(chunks, "xyzabc nonword", 1)[0].score;

    expect(relevant).toBeGreaterThan(0);
    expect(unrelated).toBe(0);
  });
});
