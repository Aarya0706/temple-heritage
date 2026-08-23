"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ReviewPhotoGallery({
  photoUrls,
  reviewerName,
}: {
  photoUrls: string[];
  reviewerName: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % photoUrls.length));
      if (e.key === "ArrowLeft")
        setOpenIndex((i) => (i === null ? i : (i - 1 + photoUrls.length) % photoUrls.length));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex, photoUrls.length]);

  if (photoUrls.length === 0) return null;

  return (
    <>
      <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
        {photoUrls.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`Enlarge photo ${i + 1} from ${reviewerName}'s visit`}
            style={{
              width: 96,
              height: 96,
              padding: 0,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            <img
              src={url}
              alt={`Photo from ${reviewerName}'s visit`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="review-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo from ${reviewerName}'s visit`}
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            className="review-lightbox-close"
            aria-label="Close"
            onClick={() => setOpenIndex(null)}
          >
            <X size={22} />
          </button>

          {photoUrls.length > 1 && (
            <button
              type="button"
              className="review-lightbox-nav review-lightbox-prev"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? i : (i - 1 + photoUrls.length) % photoUrls.length));
              }}
            >
              <ChevronLeft size={26} />
            </button>
          )}

          <img
            src={photoUrls[openIndex]}
            alt={`Photo from ${reviewerName}'s visit`}
            className="review-lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />

          {photoUrls.length > 1 && (
            <button
              type="button"
              className="review-lightbox-nav review-lightbox-next"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? i : (i + 1) % photoUrls.length));
              }}
            >
              <ChevronRight size={26} />
            </button>
          )}

          {photoUrls.length > 1 && (
            <span className="review-lightbox-count">
              {openIndex + 1} / {photoUrls.length}
            </span>
          )}
        </div>
      )}
    </>
  );
}