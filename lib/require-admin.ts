import { createClient } from "@/lib/supabase/server";

/**
 * Auth + authorization guard for admin-only API routes.
 *
 * Mirrors the check already used in app/admin/page.tsx (auth.getUser() ->
 * profiles.is_admin), so the page and the API routes it calls agree on
 * who counts as an admin. Returns the already-authenticated Supabase
 * client so callers don't have to create a second one.
 */

type RequireAdminResult =
  | { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; userId: string }
  | { ok: false; status: 401 | 403; error: string };

export async function requireAdmin(): Promise<RequireAdminResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401, error: "Not authenticated" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return { ok: false, status: 403, error: "Not authorized" };
  }

  return { ok: true, supabase, userId: user.id };
}