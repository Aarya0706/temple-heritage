import { ImageResponse } from "next/og";
import { temples } from "@/data/temples";
import { getZodiacSignByName, getHoroscopeGuidance } from "@/lib/zodiac";

export const alt = "Temple Horoscope Match";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ sign: string }> }) {
  const { sign: signParam } = await params;
  const sign = getZodiacSignByName(signParam);
  const guidance = sign ? getHoroscopeGuidance(sign) : null;
  const topMatch = guidance
    ? temples.find((t) => guidance.deityFocus.some((d) => t.deity.includes(d)))
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #3a1a10 0%, #6b2314 55%, #a52d15 100%)",
          fontFamily: "sans-serif",
          padding: "64px 68px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>🪷</span>
          <span style={{ fontSize: 22, color: "#ffc05a", fontWeight: 700, letterSpacing: 1 }}>
            TEMPLE HERITAGE · HOROSCOPE MATCH
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 110, marginBottom: 8 }}>{sign?.symbol ?? "✦"}</span>
          <span style={{ display: "flex", color: "white", fontSize: 58, fontWeight: 800, marginBottom: 18 }}>
            {sign?.name ?? "Your Sign"}&apos;s Temple Match
          </span>
          <div style={{ display: "flex", gap: 22, fontSize: 24, color: "#ffe3c2", marginBottom: topMatch ? 18 : 0 }}>
            {sign && <span style={{ display: "flex" }}>{sign.element} sign</span>}
            {sign && <span style={{ display: "flex" }}>Ruled by {sign.rulingPlanet}</span>}
          </div>
          {topMatch && (
            <span style={{ display: "flex", color: "#f0ddc8", fontSize: 22 }}>Best match: {topMatch.name}</span>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
