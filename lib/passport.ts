// lib/passport.ts
// Adjust the import path to match wherever your Supabase server client lives
// (you referenced a server-component pattern for the navbar username, so reuse that client here)
import { createClient } from "@/lib/supabase/server";

export type PassportStamp = {
  templeId: string;
  templeName: string;
  city: string | null;
  state: string | null;
  imageUrl: string | null;
  visitedAt: string;
  method: "manual" | "review" | "qr" | "geo";
};

export type PassportData = {
  userId: string;
  username: string | null;
  avatarUrl: string | null;
  shareToken: string;
  stamps: PassportStamp[];
  totalTemples: number;
};

/** Fetch the logged-in user's own passport (used on /profile/passport). */
export async function getOwnPassport(): Promise<PassportData | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return getPassportByUserId(user.id);
}

async function getPassportByUserId(userId: string): Promise<PassportData | null> {
  const supabase = createClient();

  const [{ data: profile }, { data: checkIns }, { count: totalTemples }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, avatar_url, passport_share_token")
      .eq("id", userId)
      .single(),
    supabase
      .from("check_ins")
      .select("temple_id, visited_at, check_in_method, temples(name, city, state, image_url)")
      .eq("user_id", userId)
      .order("visited_at", { ascending: true }),
    supabase.from("temples").select("id", { count: "exact", head: true }),
  ]);

  if (!profile) return null;

  const stamps: PassportStamp[] = (checkIns ?? []).map((row: any) => ({
    templeId: row.temple_id,
    templeName: row.temples?.name ?? "Unknown Temple",
    city: row.temples?.city ?? null,
    state: row.temples?.state ?? null,
    imageUrl: row.temples?.image_url ?? null,
    visitedAt: row.visited_at,
    method: row.check_in_method,
  }));

  return {
    userId: profile.id,
    username: profile.username,
    avatarUrl: profile.avatar_url,
    shareToken: profile.passport_share_token,
    stamps,
    totalTemples: totalTemples ?? 0,
  };
}

/** Fetch a passport by its public share token (used on /passport/[token], anon-readable). */
export async function getPassportByShareToken(token: string): Promise<PassportData | null> {
  const supabase = createClient();

  const { data: rows } = await supabase
    .from("passport_share_view")
    .select("*")
    .eq("passport_share_token", token);

  if (!rows || rows.length === 0) return null;

  const { count: totalTemples } = await supabase
    .from("temples")
    .select("id", { count: "exact", head: true });

  const first = rows[0];
  const stamps: PassportStamp[] = rows.map((row: any) => ({
    templeId: row.temple_id,
    templeName: row.temple_name,
    city: row.city,
    state: row.state,
    imageUrl: row.image_url,
    visitedAt: row.visited_at,
    method: "review", // share view doesn't expose method; fine for display purposes
  }));

  return {
    userId: first.user_id,
    username: first.username,
    avatarUrl: first.avatar_url,
    shareToken: token,
    stamps,
    totalTemples: totalTemples ?? 0,
  };
}

/** Manual "Mark as visited" check-in, called from a client component via a server action or route handler. */
export async function markTempleVisited(templeId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("check_ins")
    .upsert(
      { user_id: user.id, temple_id: templeId, check_in_method: "manual" },
      { onConflict: "user_id,temple_id", ignoreDuplicates: true }
    );

  if (error) throw error;
}
