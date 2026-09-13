// Straight-line distance helper + a small lookup of major Indian city
// coordinates, used to make "near <city>" search queries actually
// geographic instead of a coincidental text match.

/** Great-circle distance between two lat/lng points, in kilometers. */
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Coordinates for major Indian cities that people are likely to search
// "near <city>" for, even when that city itself has no temple entry in
// data/temples.ts (e.g. Bhopal). Temple cities already carry their own
// coordinates in data/temples.ts and don't need to be duplicated here —
// resolveCityToCoords() checks both.
export const MAJOR_CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  bhopal: { lat: 23.2599, lng: 77.4126 },
  delhi: { lat: 28.6139, lng: 77.209 },
  "new delhi": { lat: 28.6139, lng: 77.209 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  pune: { lat: 18.5204, lng: 73.8567 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  surat: { lat: 21.1702, lng: 72.8311 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
  kanpur: { lat: 26.4499, lng: 80.3319 },
  nagpur: { lat: 21.1458, lng: 79.0882 },
  indore: { lat: 22.7196, lng: 75.8577 },
  patna: { lat: 25.5941, lng: 85.1376 },
  bhubaneswar: { lat: 20.2961, lng: 85.8245 },
  raipur: { lat: 21.2514, lng: 81.6296 },
  ranchi: { lat: 23.3441, lng: 85.3096 },
  guwahati: { lat: 26.1445, lng: 91.7362 },
  chandigarh: { lat: 30.7333, lng: 76.7794 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  nashik: { lat: 19.9975, lng: 73.7898 },
};

/**
 * Resolves a free-text place name typed after "near" to coordinates, by
 * checking (in order): a temple's own city name, a temple's own state name,
 * then the major-city table above. Returns null if nothing matches closely
 * enough to be useful — callers should fall back to plain text search.
 */
export function resolvePlaceToCoords(
  place: string,
  temples: { city: string; state: string; lat: number; lng: number }[]
): { lat: number; lng: number } | null {
  const needle = place.trim().toLowerCase();
  if (!needle) return null;

  const byCity = temples.find((t) => t.city.toLowerCase() === needle);
  if (byCity) return { lat: byCity.lat, lng: byCity.lng };

  const byState = temples.find((t) => t.state.toLowerCase() === needle);
  if (byState) return { lat: byState.lat, lng: byState.lng };

  if (MAJOR_CITY_COORDS[needle]) return MAJOR_CITY_COORDS[needle];

  return null;
}
