"use client";

import { useState, useEffect } from "react";
import { PartyPopper } from "lucide-react";
import { festivals } from "@/data/festivals";
import { getUpcomingFestivals, formatFestivalDate } from "@/lib/festival-countdown";

const FLAG_KEY = "th_show_welcome_modal";

export function WelcomeLoginModal() {
  // Always false on both the server render and the client's first
  // (hydration) render, so the two match. The sessionStorage check is
  // deferred to a mount-only effect, which only ever runs in the browser
  // -- this is the sanctioned use case for an effect that sets state
  // (a one-time "sync with a browser-only API on mount" read), not the
  // synchronization-loop pattern react-hooks/set-state-in-effect warns
  // about, so it's fine to keep even with that rule enabled.
  const [open, setOpen] = useState(false);
  const [ongoingFestival, setOngoingFestival] = useState<{ name: string; endDate: Date } | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(FLAG_KEY) === "1") {
        sessionStorage.removeItem(FLAG_KEY);
        // One-time sync with a browser-only API (sessionStorage) on mount,
        // not the synchronization-loop pattern this rule warns about.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpen(true);

        // Whatever festival is currently mid-celebration (if any) gets a
        // greeting added to the same popup. This reuses the same
        // duration-aware "ongoing" check the festival pages use, so a
        // multi-day festival (e.g. an 11-day Ganesh Chaturthi) keeps
        // greeting users for its whole run, not just its first day, and a
        // festival that hasn't started yet or has fully finished is left
        // out rather than guessed at.
        const [next] = getUpcomingFestivals(festivals);
        if (next?.isOngoing) {
          setOngoingFestival({ name: next.festival.name, endDate: next.endDate });
        }
      }
    } catch {
      // sessionStorage unavailable (e.g. private mode edge cases) — just skip the popup
    }
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
      onClick={() => setOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(20,10,5,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: 340,
          width: "100%",
          maxHeight: "88vh",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.35)",
            color: "white",
            fontSize: 18,
            lineHeight: 1,
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          ×
        </button>
        <div style={{ maxHeight: "88vh", overflowY: "auto" }}>
          <img
            src="/images/welcome-om.png"
            alt="Om Namah Shivay — welcome"
            style={{ display: "block", width: "100%", maxHeight: "60vh", objectFit: "cover" }}
          />
          {ongoingFestival && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#fff5e9",
                padding: "14px 18px",
                fontSize: 14,
                color: "#5a3226",
                textAlign: "left",
              }}
            >
              <PartyPopper size={18} style={{ color: "#a52d15", flexShrink: 0 }} />
              <span>
                Happy <strong>{ongoingFestival.name}</strong>! Celebrations continue through{" "}
                {formatFestivalDate(ongoingFestival.endDate)}.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
