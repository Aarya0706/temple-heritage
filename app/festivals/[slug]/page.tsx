import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { festivals } from "@/data/festivals";
import { temples } from "@/data/temples";
import { slugify } from "@/lib/slug";
import FestivalCountdown from "@/components/FestivalCountdown";
import AddToCalendarButton from "@/components/AddToCalendarButton";

export function generateStaticParams() {
  return festivals.map((festival) => ({ slug: slugify(festival.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const festival = festivals.find((item) => slugify(item.name) === slug);
  if (!festival) return { title: "Festival not found" };

  const description = festival.note || festival.description;

  return {
    title: festival.name,
    description,
    openGraph: {
      title: festival.name,
      description,
      siteName: "Temple Heritage",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: festival.name,
      description,
    },
  };
}

export default async function FestivalDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const festival = festivals.find((item) => slugify(item.name) === slug);
  if (!festival) notFound();

  const relatedTemples = festival.relatedTempleSlugs
    .map((templeSlug) => temples.find((temple) => temple.slug === templeSlug))
    .filter((temple): temple is (typeof temples)[number] => Boolean(temple));

  return (
    <main>
      <section className="detail-hero">
        <div className="detail-layout">
          <div className="detail-image">
            <img src={festival.imageUrl} alt={festival.name} />
          </div>
          <div className="detail-copy">
            <span className="tag">{festival.month}</span>
            <h1>{festival.name}</h1>
            <div className="location"><MapPin size={17} style={{ verticalAlign: "middle" }} /> {festival.place}</div>
            <p>{festival.note}</p>
            <FestivalCountdown festivalName={festival.name} date2026={festival.date2026} />
            <div className="hero-actions">
              <Link href="/planner" className="btn-primary" style={{ background: "#a52d15", color: "white" }}><Sparkles size={17} /> Plan a Visit</Link>
              <AddToCalendarButton festival={festival} slug={slug} />
              <Link href="/festivals" className="btn-secondary" style={{ color: "#8c2416", borderColor: "#b95a40" }}><ArrowLeft size={17} /> All Festivals</Link>
            </div>
          </div>
        </div>
      </section>

      {relatedTemples.length > 0 && (
        <section className="section section-light">
          <div className="section-heading">
            <div className="eyebrow">✦ Where it&apos;s celebrated</div>
            <h2>Celebrated at these temples</h2>
          </div>

          <div className="festival-temples-grid">
            {relatedTemples.map((temple) => (
              <Link
                key={temple.slug}
                href={`/temples/${temple.slug}`}
                className="festival-temple-card"
              >
                <div className="festival-temple-image">
                  <img src={temple.image} alt={temple.name} />
                </div>
                <div className="festival-temple-info">
                  <h4>{temple.name}</h4>
                  <p>
                    <MapPin size={14} style={{ verticalAlign: "middle" }} />{" "}
                    {temple.city}, {temple.state}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="section section-dark">
        <div className="section-heading">
          <div className="eyebrow">✦ Plan around the festival</div>
          <h2>Time your yatra around {festival.name}</h2>
          <p>Use the AI planner to build a day-by-day itinerary that lines up with {festival.name} in {festival.place}.</p>
          <div className="underline" />
          <Link href="/planner" className="btn-primary" style={{ marginTop: 25 }}>Build My Itinerary <CalendarDays size={17} /></Link>
        </div>
      </section>
    </main>
  );
}