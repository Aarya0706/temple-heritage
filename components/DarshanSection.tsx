// components/DarshanSection.tsx
// The temple detail page's "Darshan" tab: general timings plus the
// specific darshan/aarti types and practical notes for temples where
// that's been documented (temple.darshan). Mirrors the visitor-info-card
// visual language already used on this page.
import { Clock, CalendarDays, Info } from "lucide-react";
import type { Temple } from "@/data/temples";

type DarshanSectionProps = {
  temple: Temple;
};

export default function DarshanSection({ temple }: DarshanSectionProps) {
  const { darshan } = temple;

  return (
    <section className="detail-section">
      <div className="eyebrow">✦ Darshan</div>
      <h2>Planning your darshan</h2>

      <div className="visitor-info-grid">
        <div className="visitor-info-card">
          <div className="visitor-info-card-head">
            <span className="visitor-info-card-icon">
              <Clock size={17} />
            </span>
            <h3>Darshan Hours</h3>
          </div>
          <p>{temple.timing}</p>
        </div>

        <div className="visitor-info-card">
          <div className="visitor-info-card-head">
            <span className="visitor-info-card-icon">
              <CalendarDays size={17} />
            </span>
            <h3>Best Time to Visit</h3>
          </div>
          <p>{temple.bestTime}</p>
        </div>

        {darshan && (
          <div className="visitor-info-card visitor-info-card-wide">
            <div className="visitor-info-card-head">
              <span className="visitor-info-card-icon">
                <Info size={17} />
              </span>
              <h3>Darshan &amp; Rituals</h3>
            </div>
            <div className="darshan-types">
              {darshan.types.map((type) => (
                <span key={type} className="darshan-type-pill">
                  {type}
                </span>
              ))}
            </div>
            <p style={{ marginTop: 14 }}>{darshan.notes}</p>
          </div>
        )}
      </div>
    </section>
  );
}
