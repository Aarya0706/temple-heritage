import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const VALID_STATUSES = ["published", "flagged", "hidden"] as const;
type ReviewStatus = (typeof VALID_STATUSES)[number];

// Defense in depth: RLS already blocks non-admins at the database
// layer (see supabase/migrations/0003_admin.sql), but checking here
// too lets us return a clean 403 instead of a raw Postgres RLS error.
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, status: 401, error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) return { ok: false as const, status: 403, error: "Admin access required" };

  return { ok: true as const, supabase };
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id, status } = await request.json();
  if (!id || !status) {
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  }
  if (!VALID_STATUSES.includes(status as ReviewStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from("temple_reviews")
    .update({ status })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // temple_review_photos rows cascade automatically; the underlying
  // storage objects aren't cleaned up here, same tradeoff as the
  // user-facing delete flow in app/api/reviews/route.ts.
  const { error } = await auth.supabase.from("temple_reviews").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
