"use client";

import { useState } from "react";

const FLAG_KEY = "th_show_welcome_modal";

export function WelcomeLoginModal() {
  const [open, setOpen] = useState(() => {
    // Runs once during initial render — safe place to read/clear the flag
    // without triggering the react-hooks/set-state-in-effect lint rule.
    try {
      if (typeof window !== "undefined" && sessionStorage.getItem(FLAG_KEY) === "1") {
        sessionStorage.removeItem(FLAG_KEY);
        return true;
      }
    } catch {
      // sessionStorage unavailable (e.g. private mode edge cases) — just skip the popup
    }
    return false;
  });

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
            zIndex: 1,
          }}
        >
          ×
        </button>
        <img
          src="/images/welcome-om.png"
          alt="Om Namah Shivay — welcome"
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}
