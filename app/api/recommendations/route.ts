import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { temples } from "@/data/temples";
import { recommendTemples } from "@/lib/recommend";

export const runtime = "nodejs";

// GET /api/recommendations?preferences=Architecture,History&birthdate=1999-08-15
//
// Auth-optional. Logged-out visitors still get preference + popularity
// based recommendations; logged-in visitors with saved temples also get
// the collaborative "saved by similar users" signal. `birthdate`
// ("YYYY-MM-DD") is optional too — when present it's converted to a Sun
// sign and adds the "matches_horoscope" signal. Never persisted; it's
// used for this one request and discarded.
//
// IMPORTANT — depends on a migration: the collaborative signal needs to
// read every user's saved_temples rows (not just the current user's), so
// it relies on the "saved_temples_select_public" RLS policy added in
// supabase/migrations/0002_saved_temples.sql. If that migration hasn't
// been applied yet, the all-rows query below will come back empty under
// the old owner-only policy — recommendTemples() degrades gracefully to
// preference + popularity only in that case, it just won't have the
// collaborative signal until the migration is applied.
export async function GET(req: NextRequest) {
  const preferencesParam = req.nextUrl.searchParams.get("preferences") ?? "";
  const selectedPreferences = preferencesParam
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const birthDate = req.nextUrl.searchParams.get("birthdate");

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: ownSaved }, { data: allSaved }, { data: ratings }] = await Promise.all([
    user
      ? supabase.from("saved_temples").select("temple_slug").eq("user_id", user.id)
      : Promise.resolve({ data: [] as { temple_slug: string }[] }),
    supabase.from("saved_temples").select("user_id, temple_slug"),
    supabase.from("temple_rating_summary").select("temple_slug, average_rating, review_count"),
  ]);

  const recommendations = recommendTemples({
    temples,
    selectedPreferences,
    savedSlugs: (ownSaved ?? []).map((r) => r.temple_slug),
    allSaved: allSaved ?? [],
    ratings: ratings ?? [],
    birthDate,
    limit: 4,
  });

  return NextResponse.json({
    recommendations: recommendations.map((r) => ({
      slug: r.temple.slug,
      reason: r.reason,
    })),
    // Lets the client tell "no personalization available yet" apart from
    // "you have no saves" without a second round trip.
    hasSavedTemples: (ownSaved ?? []).length > 0,
  });
}
