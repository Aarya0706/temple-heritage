import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id, temple_slug, rating, review_text, photo_paths } =
    await request.json();

  if (!id || !temple_slug || !rating) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }
  if (review_text && review_text.length > 1000) {
    return NextResponse.json({ error: "Review is too long" }, { status: 400 });
  }

  // Same display-name fallback the navbar uses: full_name, else email prefix.
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const reviewerName =
    profile?.full_name || user.email?.split("@")[0] || "Anonymous pilgrim";

  const { error: reviewError } = await supabase.from("temple_reviews").insert({
    id,
    temple_slug,
    user_id: user.id,
    rating,
    review_text: review_text || null,
    reviewer_name: reviewerName,
  });

  if (reviewError) {
    // Most common case: the unique(temple_slug, user_id) constraint —
    // the user already reviewed this temple.
    const status = reviewError.code === "23505" ? 409 : 500;
    return NextResponse.json({ error: reviewError.message }, { status });
  }

  if (Array.isArray(photo_paths) && photo_paths.length > 0) {
    const rows = photo_paths
      .slice(0, 3) // hard cap, in case the client check is bypassed
      .map((storage_path: string) => ({ review_id: id, storage_path }));

    const { error: photoError } = await supabase
      .from("temple_review_photos")
      .insert(rows);

    // The review itself already succeeded — don't fail the whole request
    // over photo rows, just surface the issue.
    if (photoError) {
      return NextResponse.json(
        { success: true, id, photoWarning: photoError.message },
        { status: 201 }
      );
    }
  }

  return NextResponse.json({ success: true, id }, { status: 201 });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // temple_review_photos rows are removed automatically via ON DELETE CASCADE.
  // The underlying storage objects are not cleaned up here — acceptable for
  // v1, worth a cleanup job later if orphaned files become a real cost.
  const { error } = await supabase
    .from("temple_reviews")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}