import Link from "next/link";
import { Temple } from "@/data/temples";

export function TempleCard({ temple }: { temple: Temple }) {
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
          <span className="text-link">Explore →</span>
        </div>
      </Link>
    </article>
  );
}
