import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const VALID_STATUSES = ["published", "flagged", "hidden"];

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      ),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return {
      error: NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      ),
    };
  }

  return { supabase };
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();

  if ("error" in auth) {
    return auth.error;
  }

  const { id, status } = await request.json();

  if (!id || !status) {
    return NextResponse.json(
      { error: "Missing id or status" },
      { status: 400 }
    );
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  const { error } = await auth.supabase
    .from("temple_reviews")
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();

  if ("error" in auth) {
    return auth.error;
  }

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "Missing id" },
      { status: 400 }
    );
  }

  const { data: photos } = await auth.supabase
    .from("temple_review_photos")
    .select("storage_path")
    .eq("review_id", id);

  const { error } = await auth.supabase
    .from("temple_reviews")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (photos && photos.length > 0) {
    await auth.supabase.storage
      .from("review-photos")
      .remove(photos.map((p) => p.storage_path));
  }

  return NextResponse.json({ success: true });
}