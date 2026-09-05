import { Festival } from "@/data/festivals";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// YYYYMMDD for an all-day DATE value, from an ISO date string (YYYY-MM-DD).
function toIcsDate(iso: string): string {
  return iso.replaceAll("-", "");
}

// `days` after `iso`, in the same YYYYMMDD shape. DTEND on an all-day VEVENT
// is exclusive, so even a single-day festival needs a DTEND of the following
// day for calendar apps to render it as spanning the correct day(s).
function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
}

// Festival `duration` strings are free text for humans ("10 days", "1 night",
// "2 days (week-long in Braj region)"), not machine-readable spans. Pull the
// leading number off the front for the event length and fall back to a
// single day when nothing parses.
function parseDurationDays(duration: string): number {
  const match = duration.match(/^(\d+)/);
  const days = match ? parseInt(match[1], 10) : 1;
  return Number.isFinite(days) && days > 0 ? days : 1;
}

// Escaping required by RFC 5545 §3.3.11 for TEXT property values.
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

// Lines over 75 octets should be folded per RFC 5545 §3.1: split with a
// CRLF followed by a single leading space on the continuation line.
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let rest = line;
  while (rest.length > 75) {
    chunks.push(rest.slice(0, 75));
    rest = " " + rest.slice(75);
  }
  chunks.push(rest);
  return chunks.join("\r\n");
}

function stamp(now: Date): string {
  return (
    `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T` +
    `${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`
  );
}

/**
 * Builds a downloadable .ics (RFC 5545) calendar file for a single festival,
 * as an all-day event spanning its verified `date2026` occurrence.
 *
 * Like the countdown widget, this is only accurate for the current cycle —
 * `date2026` is the last Panchang-verified date, so the file needs a data
 * refresh once the festival has passed and next year's date is confirmed.
 */
export function buildFestivalIcs(festival: Festival, siteUrl: string, slug: string): string {
  const start = toIcsDate(festival.date2026);
  const spanDays = parseDurationDays(festival.duration);
  const end = addDays(festival.date2026, spanDays);
  const url = `${siteUrl.replace(/\/$/, "")}/festivals/${slug}`;

  const description = [
    festival.note,
    `Celebrated: ${festival.place} · ${festival.duration}.`,
    `Details: ${url}`,
  ].join(" ");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Temple Heritage//Festival Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${slug}-${festival.date2026}@temple-heritage`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escapeText(festival.name)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(festival.place)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(foldLine).join("\r\n") + "\r\n";
}
