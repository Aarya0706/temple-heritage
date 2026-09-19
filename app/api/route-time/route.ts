// app/api/route-time/route.ts
//
// Enriches an already-decided route (a set of ordered stops, from the
// planner's sequence or the optimizer's re-ordering) with real road distance
// and estimated driving time per leg. Runs server-side so the routing call
// isn't subject to a browser's CORS rules and so the timeout/fallback logic
// lives in one place rather than duplicated on every client.
import { NextRequest, NextResponse } from "next/server";
import { buildLegs } from "@/lib/route-optimize";
import { fetchTimedLegs, RouteLegPoint, toStraightLineLegs } from "@/lib/route-time";

export async function POST(req: NextRequest) {
  try {
    const { points } = (await req.json()) as { points?: RouteLegPoint[] };

    if (!Array.isArray(points) || points.length < 2) {
      return NextResponse.json({ legs: [] });
    }
    if (points.length > 50) {
      // Nothing in this app produces a route this long; treat it as a bad
      // request rather than sending an oversized query to a shared demo server.
      return NextResponse.json({ error: "Too many points" }, { status: 400 });
    }

    const [origin, ...stops] = points;
    const straightLineLegs = buildLegs(stops, { ...origin });

    const legs = await fetchTimedLegs(points, straightLineLegs);
    return NextResponse.json({ legs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to estimate travel time" }, { status: 500 });
  }
}
