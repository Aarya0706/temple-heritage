import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { festivals } from "@/data/festivals";
import { getUpcomingFestivals } from "@/lib/festival-countdown";
import { slugify } from "@/lib/slug";
import FestivalCountdown from "./FestivalCountdown";

export default function NextFestivalBanner() {
  const [next] = getUpcomingFestivals(festivals);
  if (!next) return null;

  const { festival } = next;

  return (
    <div className="next-festival-banner">
      <img src={festival.imageUrl} alt="" className="next-festival-banner-bg" />
      <div className="next-festival-banner-content">
        <div className="eyebrow" style={{ color: "#ffd9a8" }}>✦ Coming up next</div>
        <h2>{festival.name}</h2>
        <p className="next-festival-banner-place">
          <MapPin size={15} /> {festival.place}
        </p>
        <FestivalCountdown festivalName={festival.name} date2026={festival.date2026} />
        <Link href={`/festivals/${slugify(festival.name)}`} className="btn-primary" style={{ marginTop: 20 }}>
          Explore {festival.name} <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
