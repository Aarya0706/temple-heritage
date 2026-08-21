import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Sparkles,
  MapPin,
} from "lucide-react";
import { temples } from "@/data/temples";
import SaveTempleButton from "@/components/SaveTempleButton";
import HighlightCard from "@/components/HighlightCard";

export function generateStaticParams() {
  return temples.map((temple) => ({
    slug: temple.slug,
  }));
}

export default async function TempleDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const temple = temples.find((item) => item.slug === slug);

  if (!temple) {
    notFound();
  }

  return (
    <main>
      <section className="detail-hero">
        <div className="detail-layout">
          <div className="detail-image">
            <img src={temple.image} alt={temple.name} />
          </div>

          <div className="detail-copy">
            <span className="tag">{temple.deity}</span>

            <h1>{temple.name}</h1>

            <div className="location">
              <MapPin size={17} style={{ verticalAlign: "middle" }} />
              {temple.city}, {temple.state}
            </div>

            <p>{temple.description}</p>

            <div className="info-grid">
              <div className="info-box">
                <span>Temple type</span>
                <strong>{temple.type}</strong>
              </div>

              <div className="info-box">
                <span>Darshan</span>
                <strong>{temple.timing}</strong>
              </div>

              <div className="info-box">
                <span>Best time</span>
                <strong>{temple.bestTime}</strong>
              </div>
            </div>

            <div className="hero-actions">
              <Link
                href="/planner"
                className="btn-primary"
                style={{ background: "#a52d15", color: "white" }}
              >
                <Sparkles size={17} />
                Plan a Visit
              </Link>

              <Link
                href="/temples"
                className="btn-secondary"
                style={{ color: "#8c2416", borderColor: "#b95a40" }}
              >
                <ArrowLeft size={17} />
                All Temples
              </Link>

              <SaveTempleButton templeSlug={temple.slug} />
            </div>
          </div>
        </div>
      </section>

      <section className="detail-section">
        <div className="eyebrow">✦ Highlights</div>
        <h2>What to explore</h2>

        <div className="highlight-grid">
          {temple.highlights.map((highlight, index) => (
            <HighlightCard
              key={highlight}
              highlight={highlight}
              description={
                temple.highlightDescriptions?.[index] ??
                `A memorable part of the ${temple.name} pilgrimage experience.`
              }
              detail={
                temple.highlightDetails?.[index] ??
                temple.highlightDescriptions?.[index] ??
                `Learn more about ${highlight} as part of the ${temple.name} visit.`
              }
              image={temple.highlightImages?.[index] || temple.image}
              number={String(index + 1).padStart(2, "0")}
              templeName={temple.name}
            />
          ))}
        </div>
      </section>

      <section className="section section-dark">
        <div className="section-heading">
          <div className="eyebrow">✦ Plan around the visit</div>
          <h2>Make the journey meaningful</h2>

          <p>
            Use the AI planner to combine this temple with nearby destinations
            and build a day-by-day itinerary.
          </p>

          <div className="underline" />

          <Link
            href="/planner"
            className="btn-primary"
            style={{ marginTop: 25 }}
          >
            Build My Itinerary <CalendarDays size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}