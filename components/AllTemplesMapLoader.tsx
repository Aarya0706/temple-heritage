"use client";

import dynamic from "next/dynamic";
import { Temple } from "@/data/temples";

const AllTemplesMap = dynamic(() => import("./AllTemplesMap"), {
  ssr: false,
  loading: () => <div className="all-temples-map-loading">Loading map…</div>,
});

/**
 * Leaflet touches `window` on import, so the map itself is dynamically
 * imported with ssr:false — mirrors YatraRouteMapLoader's pattern. This
 * wrapper just hands the full temple list down once the map is ready.
 */
export default function AllTemplesMapLoader({ temples }: { temples: Temple[] }) {
  return <AllTemplesMap temples={temples} />;
}
