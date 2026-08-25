import type { Temple } from "@/data/temples";

// Client-side fuzzy/weighted search over the temple catalog.
//
// Why not Postgres full-text search / pg_trgm: the temple catalog lives in
// data/temples.ts as static app data, not a Supabase table — there's
// nothing in the DB to run pg_trgm against without first migrating the
// whole catalog into Postgres, which is a much bigger (and unnecessary)
// change for ~20 temples. This gets the same practical result — typo
// tolerance + relevance ranking instead of a plain substring filter —
// entirely client-side, with no new infra.

// Field weights: a match on the temple's own name should outrank a match
// buried in its long-form description.
const FIELD_WEIGHTS: Array<{ field: (t: Temple) => string[]; weight: number }> = [
  { field: (t) => [t.name], weight: 5 },
  { field: (t) => [t.deity], weight: 3 },
  { field: (t) => [t.city], weight: 3 },
  { field: (t) => [t.state], weight: 2 },
  { field: (t) => [t.type], weight: 2 },
  { field: (t) => t.highlights, weight: 2 },
  { field: (t) => [t.region], weight: 1 },
  { field: (t) => [t.shortDescription], weight: 1 },
];

// Below this, a fuzzy match is considered noise (e.g. "a" matching "at"
// with distance 1 on a 2-letter word) rather than a real typo.
const FUZZY_SIMILARITY_THRESHOLD = 0.6;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/[^a-z0-9]/g, ""))
    .filter((t) => t.length > 0);
}

/** Classic Levenshtein edit distance — small, dependency-free, exact for short strings. */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prevRow = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const currRow = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        prevRow[j] + 1, // deletion
        currRow[j - 1] + 1, // insertion
        prevRow[j - 1] + cost // substitution
      );
    }
    prevRow = currRow;
  }

  return prevRow[b.length];
}

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

/**
 * Best match score for a single query token against a single word from a
 * temple field. Exact/substring matches score highest and always win over
 * a fuzzy (typo-tolerant) match on the same word.
 */
function tokenWordScore(token: string, word: string): number {
  if (word === token) return 1;

  // Substring credit only kicks in once the shorter side is at least 3
  // characters — otherwise a throwaway 1-2 letter word (e.g. "a" from "A
  // test temple.") trivially appears inside almost any longer query token
  // and produces false-positive matches.
  const shorterLen = Math.min(word.length, token.length);
  if (shorterLen >= 3 && (word.includes(token) || token.includes(word))) return 0.9;

  const sim = similarity(token, word);
  return sim >= FUZZY_SIMILARITY_THRESHOLD ? sim * 0.75 : 0;
}

export type ScoredTemple = { temple: Temple; score: number };

/**
 * Scores one temple against a (possibly multi-word) query. Each query token
 * is matched against every word in every weighted field; the token's best
 * match anywhere contributes its similarity * that field's weight. A
 * multi-token query ("mahakal ujjain") rewards temples that match more of
 * the tokens, without requiring every token to match.
 */
export function scoreTemple(query: string, temple: Temple): number {
  const tokens = tokenize(query);
  if (tokens.length === 0) return 0;

  let total = 0;

  for (const token of tokens) {
    let bestForToken = 0;

    for (const { field, weight } of FIELD_WEIGHTS) {
      for (const rawValue of field(temple)) {
        for (const word of tokenize(rawValue)) {
          const score = tokenWordScore(token, word) * weight;
          if (score > bestForToken) bestForToken = score;
        }
      }
    }

    total += bestForToken;
  }

  return total;
}

/** Ranks temples by relevance to `query`, highest first. Empty query returns the input order unscored. */
export function searchTemples(query: string, temples: Temple[]): ScoredTemple[] {
  const q = query.trim();
  if (!q) return temples.map((temple) => ({ temple, score: 0 }));

  return temples
    .map((temple) => ({ temple, score: scoreTemple(q, temple) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
