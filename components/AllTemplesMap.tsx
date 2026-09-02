"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import Link from "next/link";
import { Temple } from "@/data/temples";
import "leaflet/dist/leaflet.css";

function templeIcon(isActive: boolean) {
  return divIcon({
    className: "all-temples-marker",
    html: `<span class="${isActive ? "active" : ""}">🛕</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 28],
  });
}

/** Fits the map to every temple once, on first render. */
function FitToTemples({ temples }: { temples: Temple[] }) {
  const map = useMap();
  useMemo(() => {
    if (temples.length > 0) {
      map.fitBounds(
        temples.map((t) => [t.lat, t.lng] as [number, number]),
        { padding: [28, 28] }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function AllTemplesMap({ temples }: { temples: Temple[] }) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  if (temples.length === 0) return null;

  const center: [number, number] = [22.5, 79.5]; // rough geographic center of India

  return (
    <div className="all-temples-map">
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: 480, width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {temples.map((t) => (
          <Marker
            key={t.slug}
            position={[t.lat, t.lng]}
            icon={templeIcon(hovered === t.slug)}
            eventHandlers={{
              mouseover: () => setHovered(t.slug),
              mouseout: () => setHovered(null),
              click: () => router.push(`/temples/${t.slug}`),
            }}
          >
            <Popup>
              <div style={{ minWidth: 160 }}>
                <strong>{t.name}</strong>
                <p style={{ margin: "4px 0", color: "#705d55", fontSize: 13 }}>
                  {t.city}, {t.state}
                </p>
                <Link
                  href={`/temples/${t.slug}`}
                  style={{ color: "#a52d15", fontWeight: 600, fontSize: 13 }}
                >
                  View temple →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
        <FitToTemples temples={temples} />
      </MapContainer>
    </div>
  );
}
