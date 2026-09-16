import { festivals } from "@/data/festivals";

// Inverse of Festival.relatedTempleSlugs: which festivals a given temple is
// known for. Built once at module load — festivals.ts is small and static,
// so there's no need to recompute this per render or per filter change.
const FESTIVALS_BY_TEMPLE_SLUG: Record<string, string[]> = {};

for (const festival of festivals) {
  for (const slug of festival.relatedTempleSlugs) {
    (FESTIVALS_BY_TEMPLE_SLUG[slug] ??= []).push(festival.name);
  }
}

/** Festival names a temple is known for celebrating, in festivals.ts order. Empty array if none are tagged. */
export function festivalsForTemple(templeSlug: string): string[] {
  return FESTIVALS_BY_TEMPLE_SLUG[templeSlug] ?? [];
}

/** Every festival name that has at least one related temple, alphabetically — for building a filter's option list. */
export function festivalNamesWithTemples(): string[] {
  return Array.from(new Set(festivals.filter((f) => f.relatedTempleSlugs.length > 0).map((f) => f.name))).sort(
    (a, b) => a.localeCompare(b)
  );
}

/** True if the temple is tagged with the given festival name. */
export function templeCelebratesFestival(templeSlug: string, festivalName: string): boolean {
  return festivalsForTemple(templeSlug).includes(festivalName);
}
