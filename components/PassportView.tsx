"use client";

import { useState } from "react";
import type { PassportData } from "@/lib/passport";
import { generatePassportPdf } from "@/lib/generatePassportPdf";

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

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/passport/${passport.shareToken}`
      : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {isOwner ? "Your Pilgrimage Passport" : `${passport.username ?? "Pilgrim"}'s Passport`}
          </h1>
          <p className="text-sm text-muted-foreground">
            {passport.stamps.length} of {passport.totalTemples} sacred sites visited ({pct}%)
          </p>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => generatePassportPdf(passport)}
              className="px-4 py-2 rounded-md bg-amber-700 text-white text-sm font-medium hover:bg-amber-800"
            >
              Download PDF
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-md border border-amber-700 text-amber-700 text-sm font-medium hover:bg-amber-50"
            >
              {copied ? "Copied!" : "Copy share link"}
            </button>
          </div>
        )}
      </header>

      <div className="w-full h-2 bg-amber-100 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-amber-700 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {passport.stamps.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {isOwner
            ? "No stamps yet — visit a temple and leave a review, or mark it visited, to earn your first stamp."
            : "This pilgrim hasn't collected any stamps yet."}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {passport.stamps.map((stamp) => (
            <div
              key={stamp.templeId}
              className="flex flex-col items-center border-2 border-dashed border-amber-300 rounded-full aspect-square p-4 text-center"
            >
              <span className="text-xs font-semibold text-amber-900">{stamp.templeName}</span>
              <span className="text-[10px] text-amber-600 mt-1">
                {new Date(stamp.visitedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
