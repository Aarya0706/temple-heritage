import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";
import DeleteReviewButton from "./DeleteReviewButton";
import ReviewList, { PAGE_SIZE, type ReviewRow } from "./ReviewList";

export default async function ReviewsSection({
  templeSlug,
  templeName,
}: {
  templeSlug: string;
  templeName: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // First page only — pagination beyond this is handled client-side by
  // ReviewList so a temple with hundreds of reviews doesn't load them all
  // on every page view.
  const [{ data: reviews, count }, { data: summary }, { data: savers }, { data: ownReview }] =
    await Promise.all([
      supabase
        .from("temple_reviews")
        .select(
          "id, user_id, rating, review_text, reviewer_name, created_at, temple_review_photos(storage_path)",
          { count: "exact" }
        )
        .eq("temple_slug", templeSlug)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .range(0, PAGE_SIZE - 1),
      supabase
        .from("temple_rating_summary")
        .select("average_rating, review_count")
        .eq("temple_slug", templeSlug)
        .maybeSingle(),
      // Users who've saved this temple to My Yatras — used to show a
      // "Verified visitor" badge on their reviews. Not fetched paginated:
      // this is bounded by how many people saved the temple, not by review
      // count, so the full set covers reviews loaded later via "Load more" too.
      supabase.from("saved_temples").select("user_id").eq("temple_slug", templeSlug),
      // The current user's own review, regardless of status. Fetched
      // separately from the public list above (which only shows
      // status='published') so a flagged/hidden review still surfaces the
      // "already reviewed" gating and the moderation notice below — without
      // this, a hidden review would vanish from `rows`, the author would see
      // the write-review form again, and a repost attempt would just 409.
      user
        ? supabase
            .from("temple_reviews")
            .select("id, status")
            .eq("temple_slug", templeSlug)
            .eq("user_id", user.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  const rows = (reviews ?? []) as ReviewRow[];
  const verifiedUserIds = (savers ?? []).map((s) => s.user_id);

  return (
    <section className="detail-section" id="reviews">
      <div className="eyebrow">✦ Visitor Reviews</div>
      <h2>Reviews & Photos</h2>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "10px 0 28px" }}>
        {summary && summary.review_count > 0 ? (
          <>
            <StarRating value={summary.average_rating} />
            <span style={{ color: "#705d55", fontSize: 15 }}>
              {summary.average_rating} · {summary.review_count}{" "}
              {summary.review_count === 1 ? "review" : "reviews"}
            </span>
          </>
        ) : (
          <span style={{ color: "#705d55", fontSize: 15 }}>No reviews yet</span>
        )}
      </div>

      {user ? (
        ownReview ? (
          <div style={{ marginBottom: 24 }}>
            <p style={{ color: "#705d55", margin: 0 }}>
              You&apos;ve already reviewed {templeName}.{" "}
              {ownReview.status === "published"
                ? "You can delete it from the list below and post a new one."
                : "You can delete it and post a new one."}
            </p>
            {ownReview.status !== "published" && (
              <>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#a5661a",
                    background: "#fdf0dc",
                    border: "1px solid #f3ddb0",
                    borderRadius: 10,
                    padding: "10px 14px",
                    marginTop: 10,
                    fontSize: 14,
                  }}
                >
                  {ownReview.status === "hidden"
                    ? "Your review has been hidden by a moderator and isn't visible to other visitors."
                    : "Your review has been flagged for moderator review and isn't visible to other visitors yet."}
                </p>
                <div style={{ marginTop: 8 }}>
                  <DeleteReviewButton reviewId={ownReview.id} />
                </div>
              </>
            )}
          </div>
        ) : (
          <ReviewForm templeSlug={templeSlug} />
        )
      ) : (
        <p style={{ color: "#705d55", marginBottom: 24 }}>
          <Link href={`/login?redirect=/temples/${templeSlug}%23reviews`} style={{ color: "#a52d15" }}>
            Log in
          </Link>{" "}
          to write a review.
        </p>
      )}

      <ReviewList
        templeSlug={templeSlug}
        templeName={templeName}
        initialReviews={rows}
        totalCount={count ?? rows.length}
        currentUserId={user?.id}
        verifiedUserIds={verifiedUserIds}
      />
    </section>
  );
}
