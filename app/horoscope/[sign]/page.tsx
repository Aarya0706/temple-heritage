import { notFound } from "next/navigation";
import Link from "next/link";
import { temples } from "@/data/temples";
import { getZodiacSignByName, getHoroscopeGuidance } from "@/lib/zodiac";

export async function generateMetadata({ params }: { params: Promise<{ sign: string }> }) {
  const { sign: signParam } = await params;
  const sign = getZodiacSignByName(signParam);
  if (!sign) return {};
  return {
    title: `${sign.name} Temple Match — Temple Heritage`,
    description: `Temples traditionally suited to ${sign.name}, ruled by ${sign.rulingPlanet}.`,
  };
}

export default async function HoroscopeSignPage({ params }: { params: Promise<{ sign: string }> }) {
  const { sign: signParam } = await params;
  const sign = getZodiacSignByName(signParam);
  if (!sign) notFound();

  const guidance = getHoroscopeGuidance(sign);
  const matches = temples
    .filter((t) => guidance.deityFocus.some((d) => t.deity.includes(d)))
    .slice(0, 4);

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ Astrology-guided discovery</div>
        <h1>{sign.symbol} {sign.name}&apos;s Temple Match</h1>
        <p>{guidance.blurb}</p>
      </section>

      <section className="section section-light">
        <div className="recommend-grid">
          {matches.map((temple) => (
            <Link href={`/temples/${temple.slug}`} className="result-card" key={temple.slug}>
              <img src={temple.image} alt={temple.name} />
              <div style={{ flex: 1 }}>
                <h4>{temple.name}</h4>
                <p>📍 {temple.city}, {temple.state}</p>
              </div>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: 24, fontSize: 13, color: "#9b6958" }}>
          Find your own match on the{" "}
          <Link href="/horoscope" style={{ color: "#a52d15", fontWeight: 600 }}>horoscope page</Link>.
        </p>
      </section>
    </main>
  );
}
