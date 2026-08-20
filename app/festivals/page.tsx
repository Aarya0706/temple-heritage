import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { festivals } from "@/data/festivals";
import { slugify } from "@/lib/slug";

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

      <section className="section section-light">
        <div className="festival-grid">
          {festivals.map((festival) => (
            <article className="festival-card" key={festival.name}>
              <div className="festival-image">
                <img
                  src={festival.imageUrl}
                  alt={festival.name}
                />

                <span className="festival-month">
                  {festival.month}
                </span>
              </div>

              <div className="festival-content">
                <h2>{festival.name}</h2>

                <div className="festival-location">
                  <MapPin size={16} />
                  <span>{festival.place}</span>
                </div>

                <p>{festival.note}</p>

                <Link
                  href={`/festivals/${slugify(festival.name)}`}
                  className="festival-link"
                >
                  Explore Festival
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
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