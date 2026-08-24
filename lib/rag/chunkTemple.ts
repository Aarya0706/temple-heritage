import type { Temple } from "@/data/temples";
import type { Chunk } from "./tfidf";

export type ReviewRow = {
  rating: number;
  review_text: string | null;
  reviewer_name: string | null;
};

// Cap on how many reviews enter the corpus. Reviews are passed in already
// sorted newest-first (see the route), so this keeps the corpus focused on
// recent visitor experience rather than growing unbounded on popular temples.
const MAX_REVIEW_CHUNKS = 25;

/**
 * Splits one temple's structured data + its published reviews into
 * section-tagged chunks for retrieval. Chunking by field (not one big blob)
 * is what makes TF-IDF retrieval precise — a question about timings should
 * score highest against the timings chunk, not get diluted by unrelated
 * history text in the same document.
 */
export function buildTempleChunks(temple: Temple, reviews: ReviewRow[]): Chunk[] {
  const chunks: Chunk[] = [];

  chunks.push({
    id: `${temple.slug}-overview`,
    section: "Overview",
    text: `${temple.name} in ${temple.city}, ${temple.state} (${temple.region}) is dedicated to ${temple.deity}. ${temple.description}`,
  });

  chunks.push({
    id: `${temple.slug}-visit-info`,
    section: "Timings & Best Time to Visit",
    text: `${temple.name} darshan timing: ${temple.timing}. Best time to visit: ${temple.bestTime}. Temple type: ${temple.type}.`,
  });

  if (temple.accessNotes) {
    chunks.push({
      id: `${temple.slug}-access`,
      section: "Getting There",
      text: `${temple.name} access notes: ${temple.accessNotes}`,
    });
  }

  temple.highlights.forEach((highlight, i) => {
    const detail = temple.highlightDetails?.[i] ?? temple.highlightDescriptions?.[i];
    if (detail) {
      chunks.push({
        id: `${temple.slug}-highlight-${i}`,
        section: `Highlight: ${highlight}`,
        text: detail,
      });
    }
  });

  reviews
    .filter((r) => r.review_text && r.review_text.trim().length > 0)
    .slice(0, MAX_REVIEW_CHUNKS)
    .forEach((r, i) => {
      chunks.push({
        id: `${temple.slug}-review-${i}`,
        section: "Visitor Review",
        text: `A visitor rated ${temple.name} ${r.rating}/5 and wrote: ${r.review_text}`,
      });
    });

  return chunks;
}
