"use client";

import { CalendarPlus } from "lucide-react";
import type { Festival } from "@/data/festivals";
import { buildFestivalIcs } from "@/lib/ics";

/**
 * Generates a one-event .ics file for this festival entirely client-side
 * (Blob + object URL) and triggers a download — no server round trip or new
 * dependency, since an .ics file is just a text template.
 */
export default function AddToCalendarButton({ festival, slug }: { festival: Festival; slug: string }) {
  function handleClick() {
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
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="btn-secondary"
      style={{ color: "#8c2416", borderColor: "#b95a40" }}
    >
      <CalendarPlus size={17} /> Add to Calendar
    </button>
  );
}
