import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { temples } from "@/data/temples";
import StarRating from "@/components/StarRating";
import AdminReviewActions from "@/components/AdminReviewActions";

type ReviewRow = {
  id: string;
  temple_slug: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  reviewer_name: string;
  created_at: string;
  status: "published" | "flagged" | "hidden";
  temple_review_photos: { storage_path: string }[];
};

const STATUS_STYLE: Record<ReviewRow["status"], { bg: string; color: string }> = {
  published: { bg: "#eaf4ea", color: "#2f6b3a" },
  flagged: { bg: "#fdf0dc", color: "#a5661a" },
  hidden: { bg: "#f2e6e6", color: "#8c2416" },
};

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  // 404 rather than a "not authorized" message — doesn't advertise
  // that an admin panel exists to users who aren't cleared to see it.
  // The real access control is the RLS policies in
  // supabase/migrations/0003_admin.sql; this is a courtesy redirect.
  if (!profile?.is_admin) notFound();

  let query = supabase
    .from("temple_reviews")
    .select(
      "id, temple_slug, user_id, rating, review_text, reviewer_name, created_at, status, temple_review_photos(storage_path)"
    )
    .order("created_at", { ascending: false });

  if (statusFilter === "flagged" || statusFilter === "hidden" || statusFilter === "published") {
    query = query.eq("status", statusFilter);
  }

  const { data: reviews, error } = await query;
  const rows = (reviews ?? []) as ReviewRow[];

  const templeName = (slug: string) => temples.find((t) => t.slug === slug)?.name || slug;

  const photoUrl = (path: string) =>
    supabase.storage.from("review-photos").getPublicUrl(path).data.publicUrl;

  const tabs: { key: string; label: string }[] = [
    { key: "all", label: "All" },
    { key: "published", label: "Published" },
    { key: "flagged", label: "Flagged" },
    { key: "hidden", label: "Hidden" },
  ];
  const activeTab = statusFilter ?? "all";

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ Admin</div>
        <h1>Review Moderation</h1>
        <p>Publish, flag, hide, or remove visitor reviews across every temple.</p>
      </section>

      <section className="section section-light">
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            {tabs.map((tab) => (
              <a
                key={tab.key}
                href={tab.key === "all" ? "/admin" : `/admin?status=${tab.key}`}
                className={`filter-btn ${activeTab === tab.key ? "active" : ""}`}
              >
                {tab.label}
              </a>
            ))}
          </div>

          {error && (
            <div style={{ color: "#a52d15", marginBottom: 20 }}>
              Couldn&apos;t load reviews: {error.message}
            </div>
          )}

          {rows.length === 0 ? (
            <div className="empty">No reviews in this view.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                      gap: 12,
                      marginBottom: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <strong style={{ color: "#542019" }}>{templeName(review.temple_slug)}</strong>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            padding: "3px 8px",
                            borderRadius: 999,
                            background: STATUS_STYLE[review.status].bg,
                            color: STATUS_STYLE[review.status].color,
                          }}
                        >
                          {review.status}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                        <StarRating value={review.rating} size={14} />
                        <span style={{ color: "#9b6958", fontSize: 12 }}>
                          {review.reviewer_name} ·{" "}
                          {new Date(review.created_at).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <AdminReviewActions reviewId={review.id} status={review.status} />
                  </div>

                  {review.review_text && (
                    <p style={{ color: "#705d55", lineHeight: 1.7, margin: "8px 0" }}>
                      {review.review_text}
                    </p>
                  )}

                  {review.temple_review_photos.length > 0 && (
                    <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                      {review.temple_review_photos.map((photo) => (
                        <img
                          key={photo.storage_path}
                          src={photoUrl(photo.storage_path)}
                          alt={`Photo from ${review.reviewer_name}'s review`}
                          style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8 }}
                        />
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
