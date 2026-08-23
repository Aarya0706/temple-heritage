"use client";

import { useState } from "react";
import { Loader2, BadgeCheck, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import StarRating from "./StarRating";
import DeleteReviewButton from "./DeleteReviewButton";
import ReviewPhotoGallery from "./ReviewPhotoGallery";

export const PAGE_SIZE = 10;

export type ReviewRow = {
  id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  reviewer_name: string;
  created_at: string;
  temple_review_photos: { storage_path: string }[];
};

type SortOption = "newest" | "highest" | "lowest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];

export default function ReviewList({
  templeSlug,
  templeName,
  initialReviews,
  totalCount,
  currentUserId,
  verifiedUserIds = [],
}: {
  templeSlug: string;
  templeName: string;
  initialReviews: ReviewRow[];
  totalCount: number;
  currentUserId?: string;
  verifiedUserIds?: string[];
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [total, setTotal] = useState(totalCount);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [photosOnly, setPhotosOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Whether the temple has any published reviews at all, independent of the
  // current filter — decides whether the sort/filter toolbar shows up.
  // Fixed at mount time so the toolbar doesn't disappear if a filter drops
  // the visible count to zero.
  const [hasAnyReviews] = useState(totalCount > 0);

  const hasMore = reviews.length < total;
  const verifiedSet = new Set(verifiedUserIds);

  const photoUrl = (path: string) =>
    createClient().storage.from("review-photos").getPublicUrl(path).data.publicUrl;

  const fetchPage = async (offset: number, sort: SortOption, filterPhotos: boolean) => {
    const supabase = createClient();
    // temple_review_photos!inner forces an inner join, so with the photos
    // filter on, only reviews that actually have at least one photo row
    // come back (and count() reflects that too).
    const columns = filterPhotos
      ? "id, user_id, rating, review_text, reviewer_name, created_at, temple_review_photos!inner(storage_path)"
      : "id, user_id, rating, review_text, reviewer_name, created_at, temple_review_photos(storage_path)";

    let query = supabase
      .from("temple_reviews")
      .select(columns, { count: "exact" })
      .eq("temple_slug", templeSlug)
      .eq("status", "published");

    query =
      sort === "highest"
        ? query.order("rating", { ascending: false }).order("created_at", { ascending: false })
        : sort === "lowest"
          ? query.order("rating", { ascending: true }).order("created_at", { ascending: false })
          : query.order("created_at", { ascending: false });

    const { data, count, error: fetchError } = await query.range(offset, offset + PAGE_SIZE - 1);
    return { data: (data ?? []) as unknown as ReviewRow[], count: count ?? 0, error: fetchError };
  };

  const applyFilters = async (nextSort: SortOption, nextPhotosOnly: boolean) => {
    setSortBy(nextSort);
    setPhotosOnly(nextPhotosOnly);
    setLoading(true);
    setError(null);
    try {
      const { data, count, error: fetchError } = await fetchPage(0, nextSort, nextPhotosOnly);
      if (fetchError) throw new Error(fetchError.message);
      setReviews(data);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await fetchPage(reviews.length, sortBy, photosOnly);
      if (fetchError) throw new Error(fetchError.message);
      setReviews((prev) => [...prev, ...data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load more reviews.");
    } finally {
      setLoading(false);
    }
  };

  const toolbar = hasAnyReviews && (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
        marginBottom: 18,
      }}
    >
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#705d55" }}>
        Sort by
        <select
          value={sortBy}
          disabled={loading}
          onChange={(e) => applyFilters(e.target.value as SortOption, photosOnly)}
          style={{
            border: "1px solid #f0ddc8",
            borderRadius: 8,
            padding: "6px 10px",
            font: "inherit",
            fontSize: 13,
            color: "#542019",
            background: "white",
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() => applyFilters(sortBy, !photosOnly)}
        disabled={loading}
        aria-pressed={photosOnly}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          border: "1px solid",
          borderColor: photosOnly ? "#a52d15" : "#f0ddc8",
          background: photosOnly ? "#fdece6" : "white",
          color: photosOnly ? "#a52d15" : "#705d55",
          fontSize: 13,
          fontWeight: 600,
          padding: "6px 12px",
          borderRadius: 999,
          cursor: loading ? "default" : "pointer",
        }}
      >
        <ImageIcon size={13} /> With photos only
      </button>
    </div>
  );

  if (reviews.length === 0) {
    return (
      <div>
        {toolbar}
        <div className="empty">
          {photosOnly
            ? "No reviews with photos yet — try clearing the filter."
            : `Be the first to share your experience at ${templeName}.`}
        </div>
      </div>
    );
  }

  return (
    <div>
      {toolbar}

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {reviews.map((review) => (
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
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <strong style={{ color: "#542019" }}>{review.reviewer_name}</strong>
                  {verifiedSet.has(review.user_id) && (
                    <span
                      title="This visitor has saved this temple to My Yatras"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#2f6b3a",
                        background: "#eaf4ea",
                        borderRadius: 999,
                        padding: "2px 8px",
                      }}
                    >
                      <BadgeCheck size={12} /> Verified visitor
                    </span>
                  )}
                </div>
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
              {currentUserId === review.user_id && <DeleteReviewButton reviewId={review.id} />}
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

        {error && <p style={{ color: "#a52d15", fontSize: 14, margin: 0 }}>{error}</p>}

        {hasMore && (
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            style={{
              alignSelf: "center",
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid #f0ddc8",
              background: "white",
              color: "#a52d15",
              fontWeight: 600,
              fontSize: 14,
              padding: "10px 22px",
              borderRadius: 999,
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Loading..." : `Load more (${total - reviews.length} more)`}
          </button>
        )}
      </div>
    </div>
  );
}
