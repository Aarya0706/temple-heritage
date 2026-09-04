"use client";

import { useState } from "react";
import Image from "next/image";

type HighlightCardProps = {
  highlight: string;
  description: string;
  detail: string;
  image: string;
  number: string;
  templeName: string;
};

export default function HighlightCard({
  highlight,
  description,
  detail,
  image,
  number,
  templeName,
}: HighlightCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article
        className="highlight-card"
        role="button"
        tabIndex={0}
        aria-label={`Learn more about ${highlight}`}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <div className="highlight-image">
          <Image
            src={image}
            alt={`${highlight} at ${templeName}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
          />
          <div className="highlight-number">{number}</div>
        </div>

        <div className="highlight-content">
          <h3>{highlight}</h3>
          <p>{description}</p>
          <button
            type="button"
            className="highlight-link highlight-link-button"
            onClick={(event) => {
              event.stopPropagation();
              setOpen(true);
            }}
          >
            Explore highlight →
          </button>
        </div>
      </article>

      {open && (
        <div
          className="highlight-modal-backdrop"
          onClick={() => setOpen(false)}
        >
          <div
            className="highlight-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="highlight-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ position: "relative", width: "100%", height: 320, borderRadius: "28px 28px 0 0", overflow: "hidden" }}>
              <Image
                src={image}
                alt={`${highlight} at ${templeName}`}
                fill
                sizes="760px"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="highlight-modal-body">
              <div className="eyebrow">✦ {templeName}</div>

              <h3 id="highlight-modal-title">{highlight}</h3>

              <p className="highlight-modal-summary">
                {description}
              </p>

              <div className="highlight-detail-section">
                <h4>More about this highlight</h4>
                <p>{detail}</p>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}