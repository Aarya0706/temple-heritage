import Link from "next/link";
import Image from "next/image";
import type { Temple } from "@/data/temples";

// Small row of temple thumbnails shown under a day's description — the
// "visual" part of "visual generated itinerary with day-by-day stops":
// a reader can see and click through to each stop instead of just reading
// a slug-free description. Pure presentation, no client state, so it works
// the same in the planner's client component and the server-rendered
// my-yatras / public-yatra pages.
export function DayStopThumbs({ stops }: { stops: Temple[] }) {
  if (stops.length === 0) return null;

  return (
    <div className="day-stops">
      {stops.map((temple) => (
        <Link key={temple.slug} href={`/temples/${temple.slug}`} className="day-stop">
          <span className="day-stop-image">
            <Image src={temple.image} alt={temple.name} fill sizes="34px" style={{ objectFit: "cover" }} />
          </span>
          {temple.name}
        </Link>
      ))}
    </div>
  );
}
