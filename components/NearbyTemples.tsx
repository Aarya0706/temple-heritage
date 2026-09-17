import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { temples, Temple } from "@/data/temples";
import { haversineKm } from "@/lib/geo";

/** Rounds a distance for display, matching the "X km" style used elsewhere. */
function formatDistance(km: number): string {
  if (km < 1) return "< 1 km";
  return `${Math.round(km).toLocaleString("en-IN")} km`;
}

/**
 * Straight-line-nearest other temples in the catalogue, used on the temple
 * detail page so a visitor planning one stop can see what else is worth
 * combining with it geographically (distinct from HighlightCard's "what to
 * explore" and the AI recommender's cultural-similarity picks).
 */
function getNearbyTemples(current: Temple, limit: number): { temple: Temple; km: number }[] {
  return temples
    .filter((t) => t.slug !== current.slug)
    .map((t) => ({ temple: t, km: haversineKm(current, t) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

export default function NearbyTemples({
  temple,
  limit = 4,
}: {
  temple: Temple;
  limit?: number;
}) {
  const nearby = getNearbyTemples(temple, limit);
  if (nearby.length === 0) return null;

  return (
    <div className="nearby-temples">
      <h3 className="nearby-temples-heading">
        <MapPin size={16} /> Nearby temples
      </h3>
      <div className="nearby-temples-row">
        {nearby.map(({ temple: t, km }) => (
          <Link key={t.slug} href={`/temples/${t.slug}`} className="nearby-temple-card">
            <div className="nearby-temple-image">
              <Image src={t.image} alt={t.name} fill sizes="180px" style={{ objectFit: "cover" }} />
              <span className="nearby-temple-distance">{formatDistance(km)}</span>
            </div>
            <div className="nearby-temple-body">
              <strong>{t.name}</strong>
              <span>
                {t.city}, {t.state}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
