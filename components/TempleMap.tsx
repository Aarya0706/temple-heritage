import { Navigation } from "lucide-react";

// Uses the key-less Google Maps embed (google.com/maps?...&output=embed)
// rather than the official Maps Embed API, since that requires a billed
// API key. This works fine for a "show roughly where this is + let
// people get directions" use case and needs zero setup or cost.
export default function TempleMap({
  name,
  city,
  state,
}: {
  name: string;
  city: string;
  state: string;
}) {
  const query = encodeURIComponent(`${name}, ${city}, ${state}, India`);
  const embedSrc = `https://www.google.com/maps?q=${query}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <div
      style={{
        border: "1px solid #f0ddc8",
        borderRadius: 16,
        overflow: "hidden",
        background: "white",
      }}
    >
      <iframe
        title={`Map showing ${name}`}
        src={embedSrc}
        width="100%"
        height="360"
        style={{ border: 0, display: "block" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          padding: "14px 18px",
        }}
      >
        <span style={{ color: "#705d55", fontSize: 14 }}>
          {city}, {state}
        </span>
        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{
            color: "#8c2416",
            borderColor: "#b95a40",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Navigation size={16} />
          Get Directions
        </a>
      </div>
    </div>
  );
}
