import type { Temple } from "@/data/temples";
import { getZodiacSign, getHoroscopeGuidance, type ZodiacSign } from "@/lib/zodiac";

// Real recommender logic — replaces the old version that only ever scored
// against the checkbox preferences. Blends three signals:
//
// 1. Content-based: matches the user's selected interests against the
//    temple's own attributes (deity/type/region) — same idea as before,
//    kept because it's the only signal available for a first-time visitor
//    with no saved temples yet.
// 2. Collaborative (item-item co-occurrence): "people who saved the
//    temples you saved also saved these" — computed from every user's
//    saved_temples rows, not just the current user's. This is the part
//    that makes it a *real* recommender rather than a static rules engine.
// 3. Popularity: rating-weighted, used as a cold-start fallback and a
//    gentle tie-breaker everywhere else.
//
// Each temple's score also carries a `reason` so the UI can show *why*
// it was recommended — useful for the user and a good thing to point to
// in an interview ("here's how I made recommendations explainable").

export type SavedRow = { user_id: string; temple_slug: string };
export type RatingRow = { temple_slug: string; average_rating: number; review_count: number };

export type RecommendationReason =
  | { type: "saved_by_similar_users"; count: number }
  | { type: "matches_horoscope"; sign: string }
  | { type: "matches_interests" }
  | { type: "popular" };

export type ScoredRecommendation = {
  temple: Temple;
  score: number;
  reason: RecommendationReason;
};

const PREFERENCE_WEIGHT = 1;
const COLLABORATIVE_WEIGHT = 2.5; // strongest signal when it's available — real behavior beats stated preference
const POPULARITY_WEIGHT = 0.6;
const HOROSCOPE_WEIGHT = 1.8; // stated on purpose (birth date, not a checkbox) — weighted above plain preference, below real behavior

function horoscopeScore(temple: Temple, sign: ZodiacSign | null): number {
  if (!sign) return 0;
  const guidance = getHoroscopeGuidance(sign);
  let s = 0;
  if (guidance.deityFocus.some((d) => temple.deity.includes(d))) s += 5;
  if (guidance.typeFocus?.some((t) => temple.type === t)) s += 2;
  return s;
}

function preferenceScore(temple: Temple, selected: string[]): number {
  let s = 0;
  if (selected.includes(temple.deity)) s += 5;
  if (selected.includes("Lord Shiva") && temple.deity.includes("Shiva")) s += 4;
  if (selected.includes("Lord Vishnu / Krishna") && (temple.deity.includes("Vishnu") || temple.deity.includes("Krishna"))) s += 4;
  if (selected.includes("Goddess") && temple.deity.includes("Goddess")) s += 4;
  if (selected.includes("Architecture")) s += 2;
  if (selected.includes("History")) s += temple.type.includes("Historic") ? 3 : 1;
  if (selected.includes("Nature") && ["North India", "West India"].includes(temple.region)) s += 2;
  if (selected.includes("Jyotirlinga") && temple.type === "Jyotirlinga") s += 5;
  return s;
}

/**
 * Item-item co-occurrence: for every OTHER user who saved at least one of
 * `seedSlugs`, count what else they saved. A temple saved by many people
 * who also saved your temples is a strong "you'd probably like this too"
 * signal — the standard collaborative-filtering approach for implicit
 * feedback (saves, not explicit ratings) at small scale.
 */
function coOccurrenceCounts(seedSlugs: Set<string>, allSaved: SavedRow[]): Map<string, number> {
  const counts = new Map<string, number>();
  if (seedSlugs.size === 0) return counts;

  const byUser = new Map<string, Set<string>>();
  for (const row of allSaved) {
    if (!byUser.has(row.user_id)) byUser.set(row.user_id, new Set());
    byUser.get(row.user_id)!.add(row.temple_slug);
  }

  for (const savedSet of byUser.values()) {
    // Only users who overlap with the seed set contribute — a user who
    // saved none of the current user's temples tells us nothing.
    const overlaps = [...seedSlugs].some((slug) => savedSet.has(slug));
    if (!overlaps) continue;

    for (const slug of savedSet) {
      if (seedSlugs.has(slug)) continue; // don't recommend what's already saved
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }

  return counts;
}

function popularityScore(rating?: RatingRow): number {
  if (!rating || rating.review_count === 0) return 0;
  // log-dampened review count so one temple with 50 reviews doesn't
  // completely drown out everything else — same reasoning as IMDB-style
  // weighted ratings.
  return rating.average_rating * Math.log(1 + rating.review_count);
}

export function recommendTemples({
  temples,
  selectedPreferences,
  savedSlugs,
  allSaved,
  ratings,
  birthDate,
  limit = 4,
}: {
  temples: Temple[];
  selectedPreferences: string[];
  savedSlugs: string[]; // current user's own saved temples
  allSaved: SavedRow[]; // every user's saved rows, for co-occurrence
  ratings: RatingRow[];
  birthDate?: string | null; // "YYYY-MM-DD", optional — powers the horoscope signal
  limit?: number;
}): ScoredRecommendation[] {
  const savedSet = new Set(savedSlugs);
  const ratingBySlug = new Map(ratings.map((r) => [r.temple_slug, r]));
  const coOccurrence = coOccurrenceCounts(savedSet, allSaved);
  const sign = birthDate ? getZodiacSign(birthDate) : null;

  const maxCoOccurrence = Math.max(1, ...coOccurrence.values());
  const maxPopularity = Math.max(1, ...temples.map((t) => popularityScore(ratingBySlug.get(t.slug))));
  const maxPreference = Math.max(1, ...temples.map((t) => preferenceScore(t, selectedPreferences)));
  const maxHoroscope = Math.max(1, ...temples.map((t) => horoscopeScore(t, sign)));

  const candidates = temples.filter((t) => !savedSet.has(t.slug));

  const scored: ScoredRecommendation[] = candidates.map((temple) => {
    const coCount = coOccurrence.get(temple.slug) ?? 0;
    const collab = coCount / maxCoOccurrence;
    const pref = preferenceScore(temple, selectedPreferences) / maxPreference;
    const pop = popularityScore(ratingBySlug.get(temple.slug)) / maxPopularity;
    const horoscope = horoscopeScore(temple, sign) / maxHoroscope;

    const score =
      collab * COLLABORATIVE_WEIGHT +
      pref * PREFERENCE_WEIGHT +
      pop * POPULARITY_WEIGHT +
      horoscope * HOROSCOPE_WEIGHT;

    // Attribute the recommendation to whichever signal actually drove it,
    // so the UI can say why — collaborative first (it's the strongest and
    // most specific signal when present), then horoscope (deliberate,
    // explicit input), then preference match, then fall back to
    // "popular" as the honest default.
    let reason: RecommendationReason;
    if (coCount > 0) {
      reason = { type: "saved_by_similar_users", count: coCount };
    } else if (sign && horoscopeScore(temple, sign) > 0) {
      reason = { type: "matches_horoscope", sign: sign.name };
    } else if (preferenceScore(temple, selectedPreferences) > 0) {
      reason = { type: "matches_interests" };
    } else {
      reason = { type: "popular" };
    }

    return { temple, score, reason };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
