import Link from "next/link";
import { Star } from "lucide-react";
import { Temple } from "@/data/temples";

export function TempleCard({
  temple,
  rating,
}: {
  temple: Temple;
  rating?: { average_rating: number; review_count: number };
}) {
  return (
    <article className="temple-card">
      <Link href={`/temples/${temple.slug}`}>
        <div className="temple-image">
          <img src={temple.image} alt={temple.name} />
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