"use client";

import { Star } from "lucide-react";

/**
 * Two modes in one component:
 * - display: `value` is a rating (can be fractional, e.g. 4.6), read-only.
 * - input: `value` is the current selection, `onChange` makes it interactive.
 */
export default function StarRating({
  value,
  onChange,
  size = 18,
}: {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
}) {
  const interactive = !!onChange;

  return (
    <div
      style={{ display: "inline-flex", gap: 2 }}
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? "Rating" : `Rated ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: interactive ? "pointer" : "default",
              lineHeight: 0,
            }}
          >
            <Star
              size={size}
              fill={filled ? "#f28a18" : "none"}
              color={filled ? "#f28a18" : "#c9a58f"}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}