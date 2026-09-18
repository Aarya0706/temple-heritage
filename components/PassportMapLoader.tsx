"use client";

import dynamic from "next/dynamic";
import type { Temple } from "@/data/temples";

// Leaflet touches `window` on import, so it's dynamically imported with
// ssr:false — same pattern as AllTemplesMapLoader and YatraRouteMapLoader.
const AllTemplesMap = dynamic(() => import("./AllTemplesMap"), {
  ssr: false,
  loading: () => <div className="all-temples-map-loading">Loading map…</div>,
});

export default function PassportMapLoader({ temples }: { temples: Temple[] }) {
  return <AllTemplesMap temples={temples} />;
}
