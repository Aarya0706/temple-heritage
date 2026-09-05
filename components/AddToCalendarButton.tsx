"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarPlus, ChevronDown } from "lucide-react";
import type { Festival } from "@/data/festivals";
import { buildFestivalIcs, buildGoogleCalendarUrl } from "@/lib/ics";

/**
 * "Add to Calendar" with two destinations, since a plain .ics download
 * lands in whatever the OS has registered as the default handler — Outlook
 * on a lot of Windows setups — even for people who actually live in Google
 * Calendar. Google Calendar gets a direct link (no file, no handler
 * involved); Apple/Outlook users still get the .ics download.
 */
export default function AddToCalendarButton({ festival, slug }: { festival: Festival; slug: string }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function openGoogleCalendar() {
    const siteUrl = window.location.origin;
    const googleUrl = buildGoogleCalendarUrl(festival, siteUrl, slug);
    window.open(googleUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  function downloadIcs() {
    const siteUrl = window.location.origin;
    const ics = buildFestivalIcs(festival, siteUrl, slug);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `${slug}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="btn-secondary"
        style={{ color: "#8c2416", borderColor: "#b95a40", display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        <CalendarPlus size={17} /> Add to Calendar <ChevronDown size={15} style={{ opacity: 0.7 }} />
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            minWidth: 220,
            background: "white",
            border: "1px solid rgba(165,45,21,0.18)",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            overflow: "hidden",
            zIndex: 20,
          }}
        >
          <button type="button" role="menuitem" onClick={openGoogleCalendar} className="calendar-menu-item">
            Google Calendar
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={downloadIcs}
            className="calendar-menu-item"
            style={{ borderTop: "1px solid rgba(165,45,21,0.1)" }}
          >
            Apple / Outlook (.ics)
          </button>
        </div>
      )}
    </div>
  );
}
