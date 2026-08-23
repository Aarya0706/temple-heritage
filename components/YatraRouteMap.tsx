"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import { ExternalLink } from "lucide-react";
import { Temple } from "@/data/temples";
import { googleMapsRouteUrl } from "@/lib/yatra-route";
import "leaflet/dist/leaflet.css";

function numberedIcon(index: number) {
  return divIcon({
    className: "yatra-route-marker",
    html: `<span>${index + 1}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

/** Pans/zooms the map to fit every stop once, after the map instance exists. */
function FitToStops({ stops }: { stops: Temple[] }) {
  const map = useMap();
  useMemo(() => {
    if (stops.length === 1) {
      map.setView([stops[0].lat, stops[0].lng], 7);
    } else if (stops.length > 1) {
      map.fitBounds(
        stops.map((t) => [t.lat, t.lng] as [number, number]),
        { padding: [36, 36] }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops.map((t) => t.slug).join(","), map]);
  return null;
}

export default function YatraRouteMap({ stops }: { stops: Temple[] }) {
  if (stops.length === 0) return null;

  const center: [number, number] = [stops[0].lat, stops[0].lng];
  const path = stops.map((t) => [t.lat, t.lng] as [number, number]);

  return (
    <div className="yatra-route-map">
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: 340, width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {stops.length > 1 && (
          <Polyline positions={path} pathOptions={{ color: "#c94a13", weight: 3, dashArray: "6 8" }} />
        )}
        {stops.map((t, i) => (
          <Marker key={t.slug} position={[t.lat, t.lng]} icon={numberedIcon(i)} />
        ))}
        <FitToStops stops={stops} />
      </MapContainer>

      <div className="yatra-route-footer">
        <div className="yatra-route-stops">
          {stops.map((t, i) => (
            <span key={t.slug} className="yatra-route-stop">
              <span className="yatra-route-stop-num">{i + 1}</span> {t.name}
            </span>
          ))}
        </div>
        <a
          href={googleMapsRouteUrl(stops)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ color: "#8c2416", borderColor: "#b95a40", display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
        >
          Open route in Google Maps <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );
}
