import { Shirt, Globe, MapPinned } from "lucide-react";
import type { Temple } from "@/data/temples";

type VisitorInfoSectionProps = {
  temple: Temple;
};

export default function VisitorInfoSection({ temple }: VisitorInfoSectionProps) {
  const { visitorInfo } = temple;

  if (!visitorInfo) return null;

  return (
    <section className="detail-section" id="visitor-info">
      <div className="eyebrow">✦ Before You Go</div>
      <h2>Visitor Info</h2>

      <div className="visitor-info-grid">
        <div className="visitor-info-card">
          <div className="visitor-info-card-head">
            <Shirt size={18} />
            <h3>Dress Code</h3>
          </div>
          <p>{visitorInfo.dressCode}</p>
        </div>

        {visitorInfo.officialWebsite && (
          <div className="visitor-info-card">
            <div className="visitor-info-card-head">
              <Globe size={18} />
              <h3>Official Website</h3>
            </div>
            <a
              href={visitorInfo.officialWebsite}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="visitor-info-link"
            >
              {visitorInfo.officialWebsite.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          </div>
        )}

        <div className="visitor-info-card visitor-info-card-wide">
          <div className="visitor-info-card-head">
            <MapPinned size={18} />
            <h3>Worth Combining Nearby</h3>
          </div>
          <ul className="visitor-info-places">
            {visitorInfo.nearbyPlaces.map((place) => (
              <li key={place.name}>
                <strong>{place.name}</strong>
                <span>{place.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
