// lib/generatePassportPdf.ts
// Client-side only ("use client" in the component that calls this).
//
// Design goals for this version: the passport should read as one finished
// document, not a mostly-blank cover page followed by a grid of identical
// dashed circles. So: header + stamps share page 1, every stamp is
// color-coded by region (a real visual "different types of stamps" cue
// instead of an arbitrary color rotation) with a legend explaining the
// colors, and the grid is sized so a fully-stamped passport (every temple
// in the catalog) still fits on a single page -- it only spills onto a
// second page if the catalog grows past what one page can hold.
//
// Dashed rings are hand-drawn as short line segments rather than using
// jsPDF's circle() + setLineDashPattern: jsPDF approximates a circle with
// four Bezier arcs, and the dash pattern restarts at each arc's seam,
// which makes dashes bunch up unevenly around the ring. Drawing our own
// evenly-spaced segments avoids that.

import { jsPDF } from "jspdf";
import type { PassportData, PassportStamp } from "@/lib/passport";
import type { Region } from "@/lib/yatra-stats";
import { PASSPORT_MILESTONES } from "@/lib/passport-stats";

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

/** One accent color per region, so stamps read as distinct "types" at a
 *  glance instead of an arbitrary color rotation. Order here is also the
 *  order the legend row is drawn in. */
const REGION_COLORS: [Region, string][] = [
  ["North India", "#3A5B8C"],
  ["South India", "#B4472B"],
  ["East India", "#2E8C86"],
  ["West India", "#C48A2E"],
  ["Central India", "#4C7A3E"],
];
const REGION_COLOR_MAP: Record<Region, string> = Object.fromEntries(REGION_COLORS) as Record<
  Region,
  string
>;
const FALLBACK_COLOR = "#7A6A5A";

export function regionColor(region: string | null): string {
  if (region && region in REGION_COLOR_MAP) return REGION_COLOR_MAP[region as Region];
  return FALLBACK_COLOR;
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

/** The highest milestone reached at this stamp count, or null if the
 *  passport has no stamps yet (PASSPORT_MILESTONES' lowest threshold is
 *  1, so any passport with at least one stamp has a current milestone). */
export function currentMilestoneLabel(stampCount: number): string | null {
  let label: string | null = null;
  for (const m of PASSPORT_MILESTONES) {
    if (m.count <= stampCount) label = m.label;
  }
  return label;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Hand-drawn dashed ring: evenly spaced short arcs rather than jsPDF's
 *  native circle+dash-pattern combination (see file header comment). */
function drawDashedCircle(
  doc: jsPDF,
  cx: number,
  cy: number,
  r: number,
  dashDeg: number,
  gapDeg: number
) {
  const stepDeg = dashDeg + gapDeg;
  const steps = Math.max(1, Math.round(360 / stepDeg));
  const actualStep = 360 / steps;
  const actualDash = (dashDeg / stepDeg) * actualStep;

  for (let i = 0; i < steps; i++) {
    const startAngle = (i * actualStep * Math.PI) / 180;
    const endAngle = ((i * actualStep + actualDash) * Math.PI) / 180;
    doc.line(
      cx + r * Math.cos(startAngle),
      cy + r * Math.sin(startAngle),
      cx + r * Math.cos(endAngle),
      cy + r * Math.sin(endAngle)
    );
  }
}

/** Draws one stamp: an outer hand-dashed ring + inner solid ring in the
 *  region's color, and the temple name/date centered inside. A slight
 *  random tilt on the text (not the -- rotationally symmetric -- circles)
 *  gives it a hand-stamped feel without hurting legibility. */
function drawStamp(doc: jsPDF, cx: number, cy: number, size: number, stamp: PassportStamp) {
  const r = size / 2;
  const color = regionColor(stamp.region);
  const tilt = (Math.random() - 0.5) * 6; // small +/-3deg wobble, text only

  doc.setDrawColor(color);
  doc.setLineWidth(0.9);
  drawDashedCircle(doc, cx, cy, r, 9, 7);

  doc.setLineWidth(0.5);
  doc.circle(cx, cy, r - 2.4, "S");

  // Temple name (wraps to at most 2 lines within the ring)
  doc.setTextColor(color);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.6);
  const nameLines: string[] = doc.splitTextToSize(stamp.templeName, size - 11).slice(0, 2);
  const nameStartY = cy - (nameLines.length - 1) * 2.6 - 2;
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

/** A single-line color key ("● North India  ● South India  ...") so the
 *  region colors on the stamps mean something at a glance instead of
 *  needing per-stamp labels. Returns the y position just below the row. */
function drawRegionLegend(doc: jsPDF, y: number): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);

  const dotR = 1.3;
  const gapAfterDot = 2.2;
  const gapBetweenEntries = 7;

  const widths = REGION_COLORS.map(([name]) => doc.getTextWidth(name));
  const entryWidths = widths.map((w) => dotR * 2 + gapAfterDot + w);
  const totalWidth =
    entryWidths.reduce((a, b) => a + b, 0) + gapBetweenEntries * (REGION_COLORS.length - 1);

  let x = (PAGE_W - totalWidth) / 2;
  REGION_COLORS.forEach(([name, color], i) => {
    doc.setFillColor(color);
    doc.circle(x + dotR, y - 1, dotR, "F");
    doc.setTextColor(INK);
    doc.text(name, x + dotR * 2 + gapAfterDot, y, { align: "left" });
    x += entryWidths[i] + gapBetweenEntries;
  });

  return y;
}

function drawHeader(doc: jsPDF, data: PassportData, pct: number): number {
  const headerH = 48;
  doc.setFillColor(HEADER_BG);
  doc.rect(0, 0, PAGE_W, headerH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(CREAM);
  doc.text("PILGRIMAGE PASSPORT", PAGE_W / 2, 14, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text(data.username ?? "Traveler", PAGE_W / 2, 21, { align: "center" });

  doc.setFontSize(8.5);
  doc.setTextColor(GOLD);
  doc.text(
    `${data.stamps.length} of ${data.totalTemples} sacred sites visited \u2014 ${pct}%`,
    PAGE_W / 2,
    27,
    { align: "center" }
  );

  // Progress bar
  const barW = 110;
  const barX = (PAGE_W - barW) / 2;
  const barY = 30.5;
  doc.setFillColor("#7A5A3E");
  doc.roundedRect(barX, barY, barW, 2.2, 1.1, 1.1, "F");
  doc.setFillColor(GOLD);
  doc.roundedRect(barX, barY, Math.max((barW * pct) / 100, 2.2), 2.2, 1.1, 1.1, "F");

  const milestone = currentMilestoneLabel(data.stamps.length);
  if (milestone) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(CREAM);
    doc.text(`Milestone: ${milestone}`, PAGE_W / 2, 37.5, { align: "center" });
  }

  const issueDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor("#D8C4AE");
  doc.text(`Issued ${issueDate}`, PAGE_W / 2, 43.5, { align: "center" });

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

  const legendY = headerH + 7;
  drawRegionLegend(doc, legendY);

  // Grid sized so a fully-stamped passport still fits on one page: 4
  // columns, full-bleed within the margins, tight enough rows that a
  // catalog of ~20 temples needs no second page.
  const cols = 4;
  const stampSize = 33;
  const gapX = (PAGE_W - MARGIN_X * 2 - cols * stampSize) / (cols - 1);
  const gapY = 7;
  const rowH = stampSize + gapY;
  const topOfGridPage1 = legendY + 8;
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
