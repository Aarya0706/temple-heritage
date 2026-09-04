// lib/generatePassportPdf.ts
// Client-side only ("use client" in the component that calls this).
// Reuses the same jsPDF instance pattern as your itinerary export — swap in
// your actual logo import path where marked below.

import { jsPDF } from "jspdf";
import type { PassportData } from "@/lib/passport";

const STAMP_COLORS = ["#B4472B", "#C48A2E", "#2E6B4F", "#3A5B8C", "#7A3B69"]; // rotate per stamp for a hand-stamped feel

function drawStamp(
  doc: jsPDF,
  x: number,
  y: number,
  size: number,
  label: string,
  subLabel: string,
  colorHex: string
) {
  const rotation = (Math.random() - 0.5) * 12; // slight random tilt, real-stamp look

  doc.saveGraphicsState();
  // @ts-ignore - jsPDF's rotate signature accepts an angle + optional origin
  doc.setDrawColor(colorHex);
  doc.setLineWidth(1.2);
  doc.setLineDashPattern([1.5, 1.5], 0);

  // circular stamp border (approximated with an octagon-ish circle via 'circle')
  doc.circle(x + size / 2, y + size / 2, size / 2, "S");

  doc.setLineDashPattern([], 0);
  doc.setFontSize(8);
  doc.setTextColor(colorHex);
  doc.setFont("helvetica", "bold");
  doc.text(label, x + size / 2, y + size / 2 - 2, { align: "center", maxWidth: size - 8 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text(subLabel, x + size / 2, y + size / 2 + 6, { align: "center", maxWidth: size - 8 });

  doc.restoreGraphicsState();
}

export function generatePassportPdf(data: PassportData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // --- Cover page ---
  doc.setFillColor("#F4EBD9"); // parchment tone; swap for your brand palette
  doc.rect(0, 0, 210, 297, "F");

  // TODO: replace with your app logo, same as itinerary PDF header
  // doc.addImage(logoBase64, "PNG", 85, 30, 40, 40);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor("#5A3A22");
  doc.text("PILGRIMAGE PASSPORT", 105, 90, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(data.username ?? "Traveler", 105, 105, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor("#8A6A4A");
  doc.text(
    `${data.stamps.length} of ${data.totalTemples} sacred sites visited`,
    105,
    115,
    { align: "center" }
  );

  const issueDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.setFontSize(9);
  doc.text(`Issued ${issueDate}`, 105, 280, { align: "center" });

  // --- Stamp pages ---
  const stampsPerRow = 3;
  const stampSize = 50;
  const marginX = 20;
  const marginY = 30;
  const gapX = 15;
  const gapY = 25;
  const rowsPerPage = 4;
  const perPage = stampsPerRow * rowsPerPage;

  data.stamps.forEach((stamp, i) => {
    const posOnPage = i % perPage;
    if (posOnPage === 0) {
      doc.addPage();
      doc.setFillColor("#FDF8EF");
      doc.rect(0, 0, 210, 297, "F");
      doc.setFontSize(10);
      doc.setTextColor("#8A6A4A");
      doc.text(`Page ${Math.floor(i / perPage) + 2}`, 190, 15, { align: "right" });
    }

    const col = posOnPage % stampsPerRow;
    const row = Math.floor(posOnPage / stampsPerRow);
    const x = marginX + col * (stampSize + gapX);
    const y = marginY + row * (stampSize + gapY);

    const color = STAMP_COLORS[i % STAMP_COLORS.length];
    const visitedDate = new Date(stamp.visitedAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    drawStamp(doc, x, y, stampSize, stamp.templeName, visitedDate, color);

    doc.setFontSize(7);
    doc.setTextColor("#5A3A22");
    doc.text(stamp.state ?? "", x + stampSize / 2, y + stampSize + 6, {
      align: "center",
      maxWidth: stampSize,
    });
  });

  doc.save(`${(data.username ?? "pilgrimage").replace(/\s+/g, "-")}-passport.pdf`);
}
