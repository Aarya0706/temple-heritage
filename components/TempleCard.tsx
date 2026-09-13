import Link from "next/link";
import Image from "next/image";
import { Star, Heart } from "lucide-react";
import { Temple } from "@/data/temples";

export function TempleCard({
  temple,
  rating,
  saved,
  onToggleSave,
}: {
  temple: Temple;
  rating?: { average_rating: number; review_count: number };
  // Both optional: pages that render TempleCard without wiring up saved-state
  // (e.g. a future admin preview) still get a working card, just without
  // the save button's toggled state.
  saved?: boolean;
  onToggleSave?: (slug: string) => void;
}) {
  return (
    <article className="temple-card">
      <Link href={`/temples/${temple.slug}`}>
        <div className="temple-image">
          <Image src={temple.image} alt={temple.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
          {onToggleSave && (
            <button
              type="button"
              className={`temple-save-btn ${saved ? "saved" : ""}`}
              aria-label={saved ? "Remove from saved temples" : "Save temple"}
              aria-pressed={saved}
              onClick={(e) => {
                // The card's image sits inside the detail-page Link, so a
                // plain click here would also navigate — stop it before it
                // bubbles up, this button only toggles the save state.
                e.preventDefault();
                e.stopPropagation();
                onToggleSave(temple.slug);
              }}
            >
              <Heart size={17} fill={saved ? "#e14a12" : "none"} strokeWidth={2} />
            </button>
          )}
          <span className="tag">{temple.deity}</span>
          <div className="temple-overlay">
            <h3>{temple.name}</h3>
            <p>📍 {temple.city}, {temple.state}</p>
          </div>
        </div>
        <div className="temple-body">
          <p>{temple.shortDescription}</p>
          {rating && rating.review_count > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                margin: "8px 0",
                color: "#9b6958",
                fontSize: 13,
              }}
            >
              <Star size={14} fill="#f28a18" color="#f28a18" strokeWidth={1.5} />
              <span>
                {rating.average_rating} · {rating.review_count}{" "}
                {rating.review_count === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
          <span className="text-link">Explore →</span>
        </div>
      </Link>
    </article>
  );
}
