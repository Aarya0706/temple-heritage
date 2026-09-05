import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import NextFestivalBanner from "@/components/NextFestivalBanner";
import { FestivalExplorer } from "@/components/FestivalExplorer";

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
        <FestivalExplorer />
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
