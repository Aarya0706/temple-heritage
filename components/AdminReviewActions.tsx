"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Flag, Loader2, Trash2 } from "lucide-react";

type Status = "published" | "flagged" | "hidden";

const ACTION_STYLE = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  border: "1px solid #f0ddc8",
  background: "white",
  color: "#705d55",
  fontSize: 12,
  fontWeight: 600,
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer",
} as const;

export default function AdminReviewActions({
  reviewId,
  status,
}: {
  reviewId: string;
  status: Status;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const setStatus = async (next: Status) => {
    setLoading(next);
    const res = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reviewId, status: next }),
    });
    setLoading(null);
    if (res.ok) router.refresh();
  };

  const handleDelete = async () => {
    if (!window.confirm("Permanently delete this review? This can't be undone.")) return;
    setLoading("delete");
    const res = await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reviewId }),
    });
    setLoading(null);
    if (res.ok) router.refresh();
  };

  const spinner = <Loader2 size={12} className="animate-spin" />;

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {status !== "published" && (
        <button style={ACTION_STYLE} disabled={!!loading} onClick={() => setStatus("published")}>
          {loading === "published" ? spinner : <Eye size={12} />} Publish
        </button>
      )}
      {status !== "flagged" && (
        <button style={ACTION_STYLE} disabled={!!loading} onClick={() => setStatus("flagged")}>
          {loading === "flagged" ? spinner : <Flag size={12} />} Flag
        </button>
      )}
      {status !== "hidden" && (
        <button style={ACTION_STYLE} disabled={!!loading} onClick={() => setStatus("hidden")}>
          {loading === "hidden" ? spinner : <EyeOff size={12} />} Hide
        </button>
      )}
      <button
        style={{ ...ACTION_STYLE, color: "#a52d15", borderColor: "#e8bcae" }}
        disabled={!!loading}
        onClick={handleDelete}
      >
        {loading === "delete" ? spinner : <Trash2 size={12} />} Delete
      </button>
    </div>
  );
}
