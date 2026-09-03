import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { festivals } from "@/data/festivals";
import { slugify } from "@/lib/slug";
import FestivalCountdown from "@/components/FestivalCountdown";

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
              <Link href="/festivals" className="btn-secondary" style={{ color: "#8c2416", borderColor: "#b95a40" }}><ArrowLeft size={17} /> All Festivals</Link>
            </div>
          </div>
        </div>
      </section>

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