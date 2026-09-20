// lib/generatePassportPdf.ts
// Client-side only ("use client" in the component that calls this).
//
// Design goals for this version: the passport should read as one finished
// document, not a mostly-blank cover page followed by a grid of identical
// dashed circles. So: header + stamps share page 1, every stamp is
// color-coded by region (a real visual "different types of stamps" cue
// instead of an arbitrary color rotation), and the grid is sized so a
// fully-stamped passport (every temple in the catalog) still fits on a
// single page -- it only spills onto a second page if the catalog grows
// past what one page can hold.

import { jsPDF } from "jspdf";
import type { PassportData, PassportStamp } from "@/lib/passport";
import type { Region } from "@/lib/yatra-stats";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 15;
const MARGIN_BOTTOM = 15;
const CONTINUATION_TOP = 22; // top margin on page 2+, which has no big header

const INK = "#3A1A10"; // dark brown -- matches the app's passport heading color
const PARCHMENT = "#FDF8EF";
const HEADER_BG = "#5A3A22";
const GOLD = "#D9A441";
const CREAM = "#FDF8EF";

/** One accent color + one-letter seal per region, so stamps read as
 *  distinct "types" at a glance instead of an arbitrary color rotation. */
const REGION_STYLE: Record<Region, { color: string; code: string }> = {
  "North India": { color: "#3A5B8C", code: "N" },
  "South India": { color: "#B4472B", code: "S" },
  "East India": { color: "#2E8C86", code: "E" },
  "West India": { color: "#C48A2E", code: "W" },
  "Central India": { color: "#4C7A3E", code: "C" },
};
const FALLBACK_STYLE = { color: "#7A6A5A", code: "\u2022" };

export function regionStyle(region: string | null): { color: string; code: string } {
  if (region && region in REGION_STYLE) return REGION_STYLE[region as Region];
  return FALLBACK_STYLE;
}

/** Short state code shown on the stamp -- falls back to the first three
 *  letters of the state for anything not in the map, so a temple in a
 *  state we haven't explicitly coded still shows something reasonable. */
const STATE_ABBR: Record<string, string> = {
  "Tamil Nadu": "TN",
  Gujarat: "GJ",
  Odisha: "OD",
  "Uttar Pradesh": "UP",
  Uttarakhand: "UK",
  "Andhra Pradesh": "AP",
  "Madhya Pradesh": "MP",
  Delhi: "DL",
  Maharashtra: "MH",
  Jharkhand: "JH",
};

export function abbreviateState(state: string | null): string {
  if (!state) return "";
  return STATE_ABBR[state] ?? state.slice(0, 3).toUpperCase();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Draws one stamp: an outer dashed ring + inner solid ring in the
 *  region's color, a small circular seal at the top carrying the
 *  region's letter code, and the temple name/date centered inside. A
 *  slight random tilt on the text (not the -- rotationally symmetric --
 *  circles) gives it a hand-stamped feel without hurting legibility. */
function drawStamp(doc: jsPDF, cx: number, cy: number, size: number, stamp: PassportStamp) {
  const r = size / 2;
  const { color, code } = regionStyle(stamp.region);
  const tilt = (Math.random() - 0.5) * 6; // small +/-3deg wobble, text only

  doc.setDrawColor(color);

  doc.setLineWidth(1);
  doc.setLineDashPattern([1.4, 1.2], 0);
  doc.circle(cx, cy, r, "S");

  doc.setLineDashPattern([], 0);
  doc.setLineWidth(0.5);
  doc.circle(cx, cy, r - 2.2, "S");

  // Seal badge overlapping the top of the ring
  const sealR = 3.4;
  doc.setFillColor(color);
  doc.circle(cx, cy - r, sealR, "F");
  doc.setTextColor(CREAM);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text(code, cx, cy - r + 1.6, { align: "center" });

  // Temple name (wraps to at most 2 lines within the ring)
  const nameLines: string[] = doc.splitTextToSize(stamp.templeName, size - 11).slice(0, 2);
  doc.setTextColor(color);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.4);
  const nameStartY = cy - (nameLines.length - 1) * 2.6 - 1.5;
  nameLines.forEach((line: string, i: number) => {
    doc.text(line, cx, nameStartY + i * 3.2, { align: "center", angle: tilt });
  });

  // Date + state, one compact line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.6);
  doc.setTextColor(INK);
  const dateLine = `${formatDate(stamp.visitedAt)}${
    stamp.state ? " \u00b7 " + abbreviateState(stamp.state) : ""
  }`;
  doc.text(dateLine, cx, cy + (nameLines.length - 1) * 1.6 + 5, {
    align: "center",
    angle: tilt,
  });
}

function drawHeader(doc: jsPDF, data: PassportData, pct: number): number {
  const headerH = 46;
  doc.setFillColor(HEADER_BG);
  doc.rect(0, 0, PAGE_W, headerH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(CREAM);
  doc.text("PILGRIMAGE PASSPORT", PAGE_W / 2, 15, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(data.username ?? "Traveler", PAGE_W / 2, 23, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(GOLD);
  doc.text(
    `${data.stamps.length} of ${data.totalTemples} sacred sites visited \u2014 ${pct}%`,
    PAGE_W / 2,
    30,
    { align: "center" }
  );

  // Progress bar
  const barW = 120;
  const barX = (PAGE_W - barW) / 2;
  const barY = 34;
  doc.setFillColor("#7A5A3E");
  doc.roundedRect(barX, barY, barW, 2.4, 1.2, 1.2, "F");
  doc.setFillColor(GOLD);
  doc.roundedRect(barX, barY, Math.max((barW * pct) / 100, 2.4), 2.4, 1.2, 1.2, "F");

  const issueDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.setFontSize(7.5);
  doc.setTextColor(CREAM);
  doc.text(`Issued ${issueDate}`, PAGE_W / 2, 41, { align: "center" });

  return headerH;
}

function fillPageBackground(doc: jsPDF) {
  doc.setFillColor(PARCHMENT);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
}

export function buildPassportPdfDoc(data: PassportData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pct =
    data.totalTemples > 0 ? Math.round((data.stamps.length / data.totalTemples) * 100) : 0;

  fillPageBackground(doc);
  const headerH = drawHeader(doc, data, pct);

  if (data.stamps.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.setTextColor(INK);
    doc.text("No stamps yet \u2014 visit a temple to start your passport.", PAGE_W / 2, 90, {
      align: "center",
    });
    return doc;
  }

  // Grid sized so a fully-stamped passport still fits on one page: 4
  // columns, full-bleed within the margins, tight enough rows that a
  // catalog of ~20 temples needs no second page.
  const cols = 4;
  const stampSize = 34;
  const gapX = (PAGE_W - MARGIN_X * 2 - cols * stampSize) / (cols - 1);
  const gapY = 8;
  const rowH = stampSize + gapY;
  const topOfGridPage1 = headerH + 10;
  const rowsPerPage1 = Math.max(
    1,
    Math.floor((PAGE_H - topOfGridPage1 - MARGIN_BOTTOM) / rowH)
  );
  const perPage1 = cols * rowsPerPage1;
  const rowsPerContinuationPage = Math.max(
    1,
    Math.floor((PAGE_H - CONTINUATION_TOP - MARGIN_BOTTOM) / rowH)
  );
  const perContinuationPage = cols * rowsPerContinuationPage;

  let i = 0;
  let pageNum = 1;
  while (i < data.stamps.length) {
    const isFirstPage = pageNum === 1;
    const capacity = isFirstPage ? perPage1 : perContinuationPage;
    const top = isFirstPage ? topOfGridPage1 : CONTINUATION_TOP;

    if (!isFirstPage) {
      doc.addPage();
      fillPageBackground(doc);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor("#8A6A4A");
      doc.text(`Page ${pageNum}`, PAGE_W - MARGIN_X, 12, { align: "right" });
    }

    for (let posOnPage = 0; posOnPage < capacity && i < data.stamps.length; posOnPage++, i++) {
      const col = posOnPage % cols;
      const row = Math.floor(posOnPage / cols);
      const cx = MARGIN_X + stampSize / 2 + col * (stampSize + gapX);
      const cy = top + stampSize / 2 + row * rowH;
      drawStamp(doc, cx, cy, stampSize, data.stamps[i]);
    }

    pageNum++;
  }

  return doc;
}

export function generatePassportPdf(data: PassportData) {
  const doc = buildPassportPdfDoc(data);
  doc.save(`${(data.username ?? "pilgrimage").replace(/\s+/g, "-")}-passport.pdf`);
}
