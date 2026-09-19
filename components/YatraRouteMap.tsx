"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import { ExternalLink } from "lucide-react";
import { Temple } from "@/data/temples";
import { googleMapsRouteUrl } from "@/lib/yatra-route";
import { formatKm, RouteLeg, RouteOrigin } from "@/lib/route-optimize";
import "leaflet/dist/leaflet.css";

function numberedIcon(index: number) {
  return divIcon({
    className: "yatra-route-marker",
    html: `<span>${index + 1}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

/** The city (or previous day's temple) the traveller sets off from. */
const originIcon = divIcon({
  className: "yatra-route-marker yatra-route-marker-origin",
  html: `<span></span>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

/** Pans/zooms the map to fit every point once, after the map instance exists. */
function FitToPoints({ points }: { points: [number, number][] }) {
  const map = useMap();
  // fitBounds/setView are side effects on the Leaflet map instance, not a
  // computed value, so this belongs in useEffect. We derive a stable string
  // key from the points first so the effect's dependency array only contains
  // simple expressions (map, pointsKey) rather than an inline .map().join().
  const pointsKey = useMemo(() => points.map((p) => p.join()).join("|"), [points]);

  useEffect(() => {
    if (points.length === 1) {
      map.setView(points[0], 7);
    } else if (points.length > 1) {
      map.fitBounds(points, { padding: [40, 40] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointsKey, map]);
  return null;
}

export type YatraRouteMapProps = {
  stops: Temple[];
  /** Where this leg of the journey begins — null when the city couldn't be placed on the map. */
  startsFrom: RouteOrigin | null;
  legs: RouteLeg[];
  totalKm: number;
};

export default function YatraRouteMap({ stops, startsFrom, legs, totalKm }: YatraRouteMapProps) {
  if (stops.length === 0) return null;

  const stopPoints = stops.map((t) => [t.lat, t.lng] as [number, number]);
  const allPoints: [number, number][] = startsFrom
    ? [[startsFrom.lat, startsFrom.lng], ...stopPoints]
    : stopPoints;

  // The approach leg is drawn separately and more faintly than the temple-to-
  // temple legs: it's the drive into the region, not part of the pilgrimage.
  const approach: [number, number][] | null =
    startsFrom && stopPoints.length > 0 ? [[startsFrom.lat, startsFrom.lng], stopPoints[0]] : null;

  // One leg per drawn segment, so a distance label can sit on each line.
  const stopLegs = startsFrom ? legs.slice(1) : legs;
  const approachLeg = startsFrom ? legs[0] : null;

  return (
    <div className="yatra-route-map">
      <MapContainer
        center={allPoints[0]}
        zoom={6}
        style={{ height: 340, width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {approach && (
          <Polyline positions={approach} pathOptions={{ color: "#c9a227", weight: 2, dashArray: "3 7" }}>
            {approachLeg && (
              <Tooltip permanent direction="center" className="yatra-route-leg-label">
                {formatKm(approachLeg.km)}
              </Tooltip>
            )}
          </Polyline>
        )}

        {stopPoints.slice(1).map((point, i) => (
          <Polyline
            key={stops[i + 1].slug}
            positions={[stopPoints[i], point]}
            pathOptions={{ color: "#c94a13", weight: 3 }}
          >
            {stopLegs[i] && (
              <Tooltip permanent direction="center" className="yatra-route-leg-label">
                {formatKm(stopLegs[i].km)}
              </Tooltip>
            )}
          </Polyline>
        ))}

        {startsFrom && (
          <Marker position={[startsFrom.lat, startsFrom.lng]} icon={originIcon}>
            <Tooltip direction="top">Start: {startsFrom.name}</Tooltip>
          </Marker>
        )}

        {stops.map((t, i) => (
          <Marker key={t.slug} position={[t.lat, t.lng]} icon={numberedIcon(i)}>
            <Tooltip direction="top">{t.name}</Tooltip>
          </Marker>
        ))}

        <FitToPoints points={allPoints} />
      </MapContainer>

      <div className="yatra-route-footer">
        <div className="yatra-route-stops">
          {startsFrom && <span className="yatra-route-origin-chip">{startsFrom.name}</span>}
          {stops.map((t, i) => {
            const leg = legs[startsFrom ? i : i - 1];
            return (
              <span key={t.slug} className="yatra-route-stop">
                {leg && <span className="yatra-route-leg-km">{formatKm(leg.km)} →</span>}
                <span className="yatra-route-stop-num">{i + 1}</span> {t.name}
              </span>
            );
          })}
        </div>

        <div className="yatra-route-actions">
          <span className="yatra-route-total">
            <span className="yatra-route-total-figure">{formatKm(totalKm)} straight-line distance</span>
            <span className="yatra-route-total-note">Road distance may be longer.</span>
          </span>
          <a
            href={googleMapsRouteUrl(stops, startsFrom?.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ color: "#8c2416", borderColor: "#b95a40", display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
          >
            Open route in Google Maps <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}
