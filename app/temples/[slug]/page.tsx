import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Sparkles,
  MapPin,
  Star,
} from "lucide-react";
import { temples } from "@/data/temples";
import SaveTempleButton from "@/components/SaveTempleButton";
import HighlightCard from "@/components/HighlightCard";
import ReviewsSection from "@/components/ReviewsSection";
import TempleMap from "@/components/TempleMap";
import { createClient } from "@/lib/supabase/server";
import TempleAskWidget from "@/components/TempleAskWidget";

export function generateStaticParams() {
  return temples.map((temple) => ({
    slug: temple.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const temple = temples.find((item) => item.slug === slug);
  if (!temple) return { title: "Temple not found" };

  const description = temple.shortDescription || temple.description;

  return {
    title: temple.name,
    description,
    openGraph: {
      title: temple.name,
      description,
      siteName: "Temple Heritage",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: temple.name,
      description,
    },
  };
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

  // Small hero badge only — ReviewsSection independently fetches the same
  // summary (and the full review list) further down the page.
  const supabase = await createClient();
  const { data: ratingSummary } = await supabase
    .from("temple_rating_summary")
    .select("average_rating, review_count")
    .eq("temple_slug", temple.slug)
    .maybeSingle();

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

            <div
              className="location"
              style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 14 }}
            >
              <span>
                <MapPin size={17} style={{ verticalAlign: "middle" }} />{" "}
                {temple.city}, {temple.state}
              </span>

              <a
                href="#location"
                style={{
                  color: "#9b6958",
                  fontWeight: 600,
                  textDecoration: "none",
                  borderBottom: "1px dashed #c9a58f",
                }}
              >
                View on map
              </a>

              <a
                href="#reviews"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  color: "#9b6958",
                  fontWeight: 600,
                  textDecoration: "none",
                  borderBottom: "1px dashed #c9a58f",
                }}
              >
                {ratingSummary && ratingSummary.review_count > 0 ? (
                  <>
                    <Star size={14} fill="#f28a18" color="#f28a18" strokeWidth={1.5} />
                    {ratingSummary.average_rating} · {ratingSummary.review_count}{" "}
                    {ratingSummary.review_count === 1 ? "review" : "reviews"}
                  </>
                ) : (
                  "No reviews yet — be the first"
                )}
              </a>
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

      <section className="detail-section" id="location">
        <div className="eyebrow">✦ Getting There</div>
        <h2>Location</h2>
        <TempleMap name={temple.name} city={temple.city} state={temple.state} />
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

      <TempleAskWidget templeSlug={temple.slug} templeName={temple.name} />
      <ReviewsSection templeSlug={temple.slug} templeName={temple.name} />
    </main>
  );
}