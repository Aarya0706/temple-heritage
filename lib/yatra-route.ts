import { temples, Temple } from "@/data/temples";

/**
 * Turns a day's `templeSlugs` into the matching Temple records, in the same
 * order, dropping any slug that no longer exists in the data set (e.g. an
 * older saved itinerary referencing a temple that was later renamed/removed).
 */
export function resolveTemples(slugs: string[] | undefined): Temple[] {
  if (!slugs || slugs.length === 0) return [];
  const bySlug = new Map(temples.map((t) => [t.slug, t]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((t): t is Temple => Boolean(t));
}

/**
 * Google Maps multi-stop directions link — no API key required. Opens turn-
 * by-turn directions through every stop in order on maps.google.com / the
 * Google Maps app.
 *
 * `startFrom` is the place the traveller sets off from (their starting city,
 * or the temple they ended the previous day at). Passing it means the link
 * opens with real driving directions into the first temple instead of
 * starting the route at the first temple itself.
 */
export function googleMapsRouteUrl(stops: Temple[], startFrom?: string | null): string {
  const points = [
    ...(startFrom && startFrom.trim() ? [`${startFrom.trim()}, India`] : []),
    ...stops.map((t) => `${t.name}, ${t.city}, ${t.state}, India`),
  ];
  return `https://www.google.com/maps/dir/${points.map(encodeURIComponent).join("/")}`;
}
