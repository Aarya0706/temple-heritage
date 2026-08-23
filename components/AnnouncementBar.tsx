import Link from "next/link";
import { Sparkles } from "lucide-react";
import { festivals } from "@/data/festivals";
import { getUpcomingFestivals, formatFestivalDate } from "@/lib/festival-countdown";

/**
 * Thin strip above the main nav row, similar to the announcement ticker on
 * temple committee sites (e.g. Mahakaleshwar's "Committee welcomes you...").
 * Surfaces the soonest upcoming festival from the existing festival data
 * set rather than a hardcoded message, so it stays current as
 * data/festivals.ts is updated year to year.
 *
 * Renders nothing if every festival's date2026 has already passed — see
 * lib/festival-countdown.ts's note on why that means "needs a data refresh"
 * rather than a fake computed date, so this bar just quietly disappears
 * instead of showing stale info.
 */
export function AnnouncementBar() {
  const [next] = getUpcomingFestivals(festivals);
  if (!next) return null;

  const { festival, date, daysUntil } = next;
  const whenLabel =
    daysUntil === 0 ? "today" : daysUntil === 1 ? "tomorrow" : `in ${daysUntil} days`;

  return (
    <div className="announcement-bar">
      <Link href={`/festivals/${festival.slug}`} className="announcement-bar-link">
        <Sparkles size={14} />
        <span>
          <strong>{festival.name}</strong> is {whenLabel} — {formatFestivalDate(date)}
        </span>
        <span className="announcement-bar-cta">See festival details →</span>
      </Link>
    </div>
  );
}
