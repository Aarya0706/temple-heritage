"use client";

import { Download } from "lucide-react";
import { POPPINS_REGULAR_BASE64, POPPINS_BOLD_BASE64 } from "@/lib/pdf-fonts";
import { LOGO_BASE64, LOGO_FORMAT, LOGO_WIDTH_PX, LOGO_HEIGHT_PX } from "@/lib/pdf-logo";

type ItineraryDay = {
  day: string;
  title: string;
  description: string;
};

type Props = {
  title: string;
  summary: string;
  from: string;
  region: string;
  createdAt: string;
  days: ItineraryDay[];
};

export default function DownloadItineraryButton({ title, summary, from, region, createdAt, days }: Props) {
  async function handleDownload() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    // Embed Poppins into the PDF's virtual filesystem so text renders with
    // real glyphs instead of jsPDF's built-in "helvetica", which different
    // PDF viewers substitute inconsistently (the source of the odd
    // spacing/weight seen before).
    doc.addFileToVFS("Poppins-Regular.ttf", POPPINS_REGULAR_BASE64);
    doc.addFont("Poppins-Regular.ttf", "Poppins", "normal");
    doc.addFileToVFS("Poppins-Bold.ttf", POPPINS_BOLD_BASE64);
    doc.addFont("Poppins-Bold.ttf", "Poppins", "bold");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 56;
    const maxWidth = pageWidth - margin * 2;
    let y = 64;

    // Logo header (skipped gracefully if lib/pdf-logo.ts hasn't been filled in yet)
    if (LOGO_BASE64) {
      const logoHeight = 32;
      const logoWidth = (LOGO_WIDTH_PX / LOGO_HEIGHT_PX) * logoHeight;
      doc.addImage(LOGO_BASE64, LOGO_FORMAT, margin, y - 24, logoWidth, logoHeight);
      y += logoHeight + 12;
    }

    // Renders text wrapped to maxWidth, one line at a time (avoids jsPDF's
    // array-text rendering, which can introduce odd letter-spacing/overflow).
    // Returns the new y position after the block.
    function writeWrapped(text: string, lineHeight: number, gapAfter: number) {
      const lines: string[] = doc.splitTextToSize(text, maxWidth);
      for (const line of lines) {
        if (y > pageHeight - 64) {
          doc.addPage();
          y = 64;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      }
      y += gapAfter;
    }

    // Title
    doc.setFont("Poppins", "bold");
    doc.setFontSize(20);
    doc.setTextColor(58, 26, 16);
    writeWrapped(title, 24, 6);

    // Meta line
    doc.setFont("Poppins", "normal");
    doc.setFontSize(11);
    doc.setTextColor(165, 116, 79);
    const metaParts = [
      `Saved ${new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
    ];
    if (from) metaParts.push(`From ${from}`);
    if (region) metaParts.push(region);
    writeWrapped(metaParts.join("   \u00B7   "), 15, 14);

    // Divider
    doc.setDrawColor(240, 221, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 24;

    // Summary
    if (summary) {
      doc.setFont("Poppins", "normal");
      doc.setFontSize(11.5);
      doc.setTextColor(107, 74, 61);
      writeWrapped(summary, 16, 22);
    }

    // Days
    days.forEach((d) => {
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 64;
      }
      doc.setFont("Poppins", "bold");
      doc.setFontSize(13.5);
      doc.setTextColor(165, 45, 21);
      writeWrapped(`${d.day} \u00B7 ${d.title}`, 18, 4);

      doc.setFont("Poppins", "normal");
      doc.setFontSize(11);
      doc.setTextColor(74, 54, 42);
      writeWrapped(d.description, 15, 22);
    });

    const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + ".pdf";
    doc.save(filename);
  }

  return (
    <button
      onClick={handleDownload}
      className="btn-secondary"
      style={{ color: "#8c2416", borderColor: "#b95a40", display: "inline-flex", alignItems: "center", gap: 6 }}
    >
      <Download size={16} /> Download as PDF
    </button>
  );
}
