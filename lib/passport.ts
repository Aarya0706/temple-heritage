// lib/passport.ts
import { createClient } from "@/lib/supabase/server";
import { temples } from "@/data/temples";

export type PassportStamp = {
  templeSlug: string;
  templeName: string;
  city: string | null;
  state: string | null;
  imageUrl: string | null;
  visitedAt: string;
  method: "manual" | "review" | "qr" | "geo" | "itinerary";
};

export type PassportData = {
  userId: string;
  username: string | null; // sourced from profiles.full_name
  shareToken: string;
  stamps: PassportStamp[];
  totalTemples: number;
};

/** Look up display details for a temple by slug from the static data file
 *  (not Supabase) — check_ins/passport_share_view only ever store the slug. */
export function templeBySlug(slug: string) {
  return temples.find((t) => t.slug === slug) ?? null;
}

function buildStamp(row: {
  temple_slug: string;
  visited_at: string;
  check_in_method: PassportStamp["method"];
}): PassportStamp {
  const t = templeBySlug(row.temple_slug);
  return {
    templeSlug: row.temple_slug,
    templeName: t?.name ?? "Unknown Temple",
    city: t?.city ?? null,
    state: t?.state ?? null,
    imageUrl: t?.image ?? null,
    visitedAt: row.visited_at,
    method: row.check_in_method,
  };
}

/** Fetch the logged-in user's own passport (used on /profile/passport). */
export async function getOwnPassport(): Promise<PassportData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return getPassportByUserId(user.id);
}

async function getPassportByUserId(userId: string): Promise<PassportData | null> {
  const supabase = await createClient();

  // maybeSingle (not single): a missing row should come back as null data,
  // not an error we then have to distinguish from "not logged in."
  let [{ data: profile }, { data: checkIns }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, passport_share_token")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("check_ins")
      .select("temple_slug, visited_at, check_in_method")
      .eq("user_id", userId)
      .order("visited_at", { ascending: true }),
  ]);

  // A signed-in user can end up with no profiles row (the signup insert can
  // silently fail under RLS before email confirmation establishes a
  // session -- see the 20260904_auto_create_profile.sql migration). That's
  // a missing-data problem, not a "not logged in" one, so don't bounce them
  // to /login for it -- create the row on the fly instead.
  if (!profile) {
    const { data: created } = await supabase
      .from("profiles")
      .insert({ id: userId })
      .select("id, full_name, passport_share_token")
      .single();
    profile = created;
  }

  if (!profile) return null;

  const stamps: PassportStamp[] = (checkIns ?? []).map(buildStamp);

  return {
    userId: profile.id,
    username: profile.full_name,
    shareToken: profile.passport_share_token,
    stamps,
    // total comes from the static data array now, not a Supabase count query
    totalTemples: temples.length,
  };
}

/** Fetch a passport by its public share token (used on /passport/[token], anon-readable). */
export async function getPassportByShareToken(token: string): Promise<PassportData | null> {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("passport_share_view")
    .select("*")
    .eq("passport_share_token", token);

  if (!rows || rows.length === 0) return null;

  const first = rows[0];
  const stamps: PassportStamp[] = rows.map((row: any) =>
    buildStamp({
      temple_slug: row.temple_slug,
      visited_at: row.visited_at,
      check_in_method: row.check_in_method,
    })
  );

  return {
    userId: first.user_id,
    username: first.username,
    shareToken: token,
    stamps,
    totalTemples: temples.length,
  };
}

/** Manual "Mark as visited" check-in, called from a client component via a server action or route handler. */
export async function markTempleVisited(templeSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Validate the slug against the static data file before writing — avoids
  // silently creating a stamp for a slug that doesn't correspond to a real temple.
  if (!templeBySlug(templeSlug)) {
    throw new Error(`Unknown temple slug: ${templeSlug}`);
  }

  const { error } = await supabase
    .from("check_ins")
    .upsert(
      { user_id: user.id, temple_slug: templeSlug, check_in_method: "manual" },
      { onConflict: "user_id,temple_slug", ignoreDuplicates: true }
    );

  if (error) throw error;
}
