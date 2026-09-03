import Link from "next/link";
import type { Metadata } from "next";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import { festivals } from "@/data/festivals";
import { slugify } from "@/lib/slug";
import { getFestivalCountdown } from "@/lib/festival-countdown";
import NextFestivalBanner from "@/components/NextFestivalBanner";

export const metadata: Metadata = {
  title: "Festival Explorer",
  description:
    "Discover India's major festivals, their cultural significance, celebration places and ideal pilgrimage seasons.",
  openGraph: {
    title: "Festival Explorer",
    description:
      "Discover India's major festivals, their cultural significance, celebration places and ideal pilgrimage seasons.",
    siteName: "Temple Heritage",
    type: "website",
  },
};

export default function FestivalsPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow">✦ Celebrate India&apos;s traditions</div>

        <h1>Festival Explorer</h1>

        <p>
          Discover India&apos;s major festivals, their cultural significance,
          celebration places and ideal pilgrimage seasons.
        </p>
      </section>

      <section className="section section-dark">
        <NextFestivalBanner />
      </section>

      <section className="section section-light">
        <div className="festival-grid">
          {festivals.map((festival) => {
            const countdown = getFestivalCountdown(festival);

            return (
              <Link
                key={festival.name}
                href={`/festivals/${slugify(festival.name)}`}
                className="festival-card-link"
              >
                <article className="festival-card">
                  <div className="festival-image">
                    <img src={festival.imageUrl} alt={festival.name} />

                    <span className="festival-month">
                      {festival.month}
                    </span>

                    {!countdown.hasPassed && (
                      <span className="festival-days-badge">
                        {countdown.daysUntil === 0
                          ? "Today"
                          : `In ${countdown.daysUntil} day${countdown.daysUntil === 1 ? "" : "s"}`}
                      </span>
                    )}
                  </div>

                  <div className="festival-content">
                    <div className="festival-main-info">
                      <div className="eyebrow">Festival</div>

                      <h3>{festival.name}</h3>

                      <p className="festival-location">
                        <MapPin size={15} />
                        <span>{festival.place}</span>
                      </p>
                    </div>

                    <div className="festival-duration">
                      <div className="festival-duration-title">
                        <CalendarDays size={16} />
                        <span>Celebration duration</span>
                      </div>

                      <p>{festival.duration}</p>

                      <span className="festival-view">
                        Explore Festival →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section section-dark">
        <div className="section-heading">
          <div className="eyebrow">✦ Plan your pilgrimage</div>

          <h2>Travel around the festivals that matter to you</h2>

          <p>
            Use the AI Yatra Planner to build a personalized pilgrimage
            itinerary around festivals and temple visits.
          </p>

          <Link
            href="/planner"
            className="btn-primary"
            style={{ marginTop: 25 }}
          >
            Plan My Yatra <Sparkles size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}