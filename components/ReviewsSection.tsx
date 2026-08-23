import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";
import DeleteReviewButton from "./DeleteReviewButton";
import ReviewPhotoGallery from "./ReviewPhotoGallery";

type ReviewRow = {
  id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  reviewer_name: string;
  created_at: string;
  temple_review_photos: { storage_path: string }[];
};

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

  const [{ data: reviews }, { data: summary }] = await Promise.all([
    supabase
      .from("temple_reviews")
      .select(
        "id, user_id, rating, review_text, reviewer_name, created_at, temple_review_photos(storage_path)"
      )
      .eq("temple_slug", templeSlug)
      .eq("status", "published")
      .order("created_at", { ascending: false }),
    supabase
      .from("temple_rating_summary")
      .select("average_rating, review_count")
      .eq("temple_slug", templeSlug)
      .maybeSingle(),
  ]);

  const rows = (reviews ?? []) as ReviewRow[];
  const ownReview = user ? rows.find((r) => r.user_id === user.id) : undefined;

  const photoUrl = (path: string) =>
    supabase.storage.from("review-photos").getPublicUrl(path).data.publicUrl;

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
          <p style={{ color: "#705d55", marginBottom: 24 }}>
            You've already reviewed {templeName}. You can delete it from the list below and
            post a new one.
          </p>
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

      {rows.length === 0 ? (
        <div className="empty">Be the first to share your experience at {templeName}.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {rows.map((review) => (
            <article
              key={review.id}
              style={{
                border: "1px solid #f0ddc8",
                borderRadius: 14,
                padding: 18,
                background: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 8,
                  gap: 12,
                }}
              >
                <div>
                  <strong style={{ color: "#542019" }}>{review.reviewer_name}</strong>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <StarRating value={review.rating} size={14} />
                    <span style={{ color: "#9b6958", fontSize: 12 }}>
                      {new Date(review.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                {user?.id === review.user_id && <DeleteReviewButton reviewId={review.id} />}
              </div>

              {review.review_text && (
                <p style={{ color: "#705d55", lineHeight: 1.7, margin: "8px 0" }}>
                  {review.review_text}
                </p>
              )}

              <ReviewPhotoGallery
                photoUrls={review.temple_review_photos.map((p) => photoUrl(p.storage_path))}
                reviewerName={review.reviewer_name}
              />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}