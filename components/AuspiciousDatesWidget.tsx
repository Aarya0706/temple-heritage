import { CalendarHeart, Sparkles } from "lucide-react";
import Link from "next/link";
import { Temple } from "@/data/temples";
import {
  getAuspiciousWeekday,
  getNextWeekdayDates,
  formatShortDate,
  getUpcomingFestivalsForTemple,
} from "@/lib/auspicious-dates";
import { formatFestivalDate } from "@/lib/festival-countdown";

/**
 * Surfaces two honest, traditional signals for "when to go":
 * 1. The weekday folk-tradition associates with this temple's deity
 *    (e.g. Monday for Shiva), with the next few upcoming dates.
 * 2. Any festivals in the data set that are specifically tied to this
 *    temple, with their verified next-occurrence date.
 *
 * Neither is a computed Panchang/tithi — both are clearly labelled as
 * tradition-based, same honesty bar as the horoscope feature.
 */
export default function AuspiciousDatesWidget({ temple }: { temple: Temple }) {
  const weekdayGuidance = getAuspiciousWeekday(temple);
  const upcomingFestivals = getUpcomingFestivalsForTemple(temple.slug);

  if (!weekdayGuidance && upcomingFestivals.length === 0) return null;

  return (
    <section className="detail-section" aria-labelledby="auspicious-dates-heading">
      <div className="eyebrow">✦ When to Go</div>
      <h2 id="auspicious-dates-heading">Auspicious times to visit</h2>

      <div className="auspicious-grid">
        {weekdayGuidance && (
          <div className="info-box auspicious-card">
            <span>
              <Sparkles size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />
              Weekly tradition
            </span>
            <p className="auspicious-blurb">{weekdayGuidance.blurb}</p>
            <div className="auspicious-dates-row">
              {getNextWeekdayDates(weekdayGuidance.weekday, 3).map((date) => (
                <span className="auspicious-date-chip" key={date.toISOString()}>
                  {formatShortDate(date)}
                </span>
              ))}
            </div>
          </div>
        )}

        {upcomingFestivals.length > 0 && (
          <div className="info-box auspicious-card">
            <span>
              <CalendarHeart size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />
              Festivals at this temple
            </span>
            <ul className="auspicious-festival-list">
              {upcomingFestivals.slice(0, 3).map(({ festival, date }) => (
                <li key={festival.slug}>
                  <Link href={`/festivals/${festival.slug}`}>{festival.name}</Link>
                  <span className="auspicious-festival-date">{formatFestivalDate(date)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="auspicious-disclaimer">
        Based on widely-followed weekday and festival traditions, not a computed
        Panchang — always confirm timings with the temple directly, especially
        around major festivals.
      </p>
    </section>
  );
}
