import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/ratelimit";

// The unique(temple_slug, user_id) constraint already stops one user from
// reviewing the same temple twice, but nothing stops a script from posting
// a new review every few seconds across many different temples. Cap it at
// a generous "real pilgrim" rate rather than a bot rate.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const rate = checkRateLimit(`review:${user.id}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "You've posted several reviews recently — please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((rate.resetAt - Date.now()) / 1000).toString(),
          "X-RateLimit-Limit": rate.limit.toString(),
          "X-RateLimit-Remaining": rate.remaining.toString(),
        },
      }
    );
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
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Same storage cleanup as the user-facing delete flow in
  // app/api/reviews/route.ts — grab paths before the cascade removes
  // the temple_review_photos rows.
  const { data: photos } = await auth.supabase
    .from("temple_review_photos")
    .select("storage_path")
    .eq("review_id", id);

  const { error, count } = await auth.supabase
    .from("temple_reviews")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (count && count > 0 && photos && photos.length > 0) {
    const { error: storageError } = await auth.supabase.storage
      .from("review-photos")
      .remove(photos.map((p) => p.storage_path));

    if (storageError) {
      return NextResponse.json({ success: true, storageWarning: storageError.message });
    }
  }

  return NextResponse.json({ success: true });
}