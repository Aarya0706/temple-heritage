"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PassportData, PassportStamp } from "@/lib/passport";
import { generatePassportPdf } from "@/lib/generatePassportPdf";

const METHOD_LABEL: Record<PassportStamp["method"], string> = {
  manual: "Marked visited",
  review: "Via review",
  qr: "QR check-in",
  geo: "Geo-tagged",
  itinerary: "Yatra completed",
};

export default function PassportView({
  passport,
  isOwner,
}: {
  passport: PassportData;
  isOwner: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const pct = passport.totalTemples
    ? Math.round((passport.stamps.length / passport.totalTemples) * 100)
    : 0;

  // Prefer the deployed site's public URL (same env var used for OG image
  // tags -- see lib/site-url.ts) over window.location.origin, so the share
  // link is always the real public domain even when copied from localhost
  // during local dev.
  const siteOrigin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const shareUrl = siteOrigin ? `${siteOrigin}/passport/${passport.shareToken}` : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Most recently visited first — the passport reads like a travel log, not
  // an arbitrary list.
  const stamps = [...passport.stamps].sort(
    (a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
  );

  return (
    <div className="passport-page">
      <header className="passport-header">
        <div>
          <h1 className="passport-title">
            {isOwner ? "Your Pilgrimage Passport" : `${passport.username ?? "Pilgrim"}'s Passport`}
          </h1>
          <p className="passport-subtitle">
            {passport.stamps.length} of {passport.totalTemples} sacred sites visited
          </p>
        </div>
        {isOwner && (
          <div className="passport-actions">
            <button
              onClick={() => generatePassportPdf(passport)}
              className="passport-btn passport-btn-solid"
            >
              Download PDF
            </button>
            <button onClick={handleCopy} className="passport-btn passport-btn-outline">
              {copied ? "Copied!" : "Copy share link"}
            </button>
          </div>
        )}
      </header>

      <div className="passport-progress-wrap">
        <div className="passport-progress-row">
          <span className="passport-progress-count">
            {passport.stamps.length} / {passport.totalTemples} stamps
          </span>
          <span className="passport-progress-pct">{pct}%</span>
        </div>
        <div className="passport-progress-track">
          <div className="passport-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {stamps.length === 0 ? (
        <div className="passport-empty">
          <span className="passport-empty-icon">🛕</span>
          <p className="passport-empty-text">
            {isOwner
              ? "No stamps yet. Leave a review or mark a temple as visited from its page to earn your first stamp."
              : "This pilgrim hasn't collected any stamps yet."}
          </p>
          {isOwner && (
            <Link href="/temples" className="passport-btn passport-btn-solid">
              Browse temples
            </Link>
          )}
        </div>
      ) : (
        <div className="passport-grid">
          {stamps.map((stamp) => (
            <Link
              key={stamp.templeSlug}
              href={`/temples/${stamp.templeSlug}`}
              className="passport-stamp"
            >
              <div className="passport-stamp-image-wrap">
                {stamp.imageUrl ? (
                  <Image
                    src={stamp.imageUrl}
                    alt={stamp.templeName}
                    fill
                    sizes="(max-width: 520px) 50vw, 220px"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="passport-stamp-image-fallback">🛕</div>
                )}
                <div className="passport-stamp-seal">🕉️</div>
              </div>
              <div className="passport-stamp-body">
                <span className="passport-stamp-name">{stamp.templeName}</span>
                {(stamp.city || stamp.state) && (
                  <span className="passport-stamp-place">
                    {[stamp.city, stamp.state].filter(Boolean).join(", ")}
                  </span>
                )}
                <div className="passport-stamp-meta">
                  <span className="passport-stamp-date">
                    {new Date(stamp.visitedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="passport-stamp-method">{METHOD_LABEL[stamp.method]}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
