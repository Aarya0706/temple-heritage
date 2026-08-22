// components/DownloadItineraryButton.tsx
"use client";

import { Download } from "lucide-react";
import {
  POPPINS_REGULAR_BASE64,
  POPPINS_BOLD_BASE64,
} from "@/lib/pdf-fonts";
import {
  getLogoDataUrl,
  LOGO_FORMAT,
  LOGO_WIDTH_PX,
  LOGO_HEIGHT_PX,
} from "@/lib/pdf-logo";

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

export default function DownloadItineraryButton({
  title,
  summary,
  from,
  region,
  createdAt,
  days,
}: Props) {
  async function handleDownload() {
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    });

    // ----------------------------------------------------------
    // FONTS
    // ----------------------------------------------------------
    doc.addFileToVFS(
      "Poppins-Regular.ttf",
      POPPINS_REGULAR_BASE64
    );
    doc.addFont(
      "Poppins-Regular.ttf",
      "Poppins",
      "normal"
    );

    doc.addFileToVFS(
      "Poppins-Bold.ttf",
      POPPINS_BOLD_BASE64
    );
    doc.addFont(
      "Poppins-Bold.ttf",
      "Poppins",
      "bold"
    );

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 56;

    // Keep content above the footer on every page.
    const footerHeight = 42;
    const contentBottom = pageHeight - footerHeight - 12;

    const maxWidth = pageWidth - margin * 2;

    let y = 64;

    // ----------------------------------------------------------
    // LOGO
    // ----------------------------------------------------------
    let logoDataUrl = "";

    try {
      logoDataUrl = await getLogoDataUrl();
    } catch {
      // Continue without the logo if it cannot be loaded.
    }

    if (logoDataUrl) {
      const logoHeight = 70;
      const logoWidth =
        (LOGO_WIDTH_PX / LOGO_HEIGHT_PX) * logoHeight;

      doc.addImage(
        logoDataUrl,
        LOGO_FORMAT,
        margin,
        y - 34,
        logoWidth,
        logoHeight
      );

      y += 44;
    }

    // Header divider
    doc.setDrawColor(232, 194, 161);
    doc.setLineWidth(1);

    doc.line(
      margin,
      y,
      pageWidth - margin,
      y
    );

    y += 28;

    // ----------------------------------------------------------
    // TEXT SANITIZING
    // ----------------------------------------------------------
    // The embedded Poppins subset only includes the glyphs this app
    // actually uses. AI-generated text can include characters outside
    // that subset (most commonly an arrow like "→" in day titles,
    // e.g. "Lucknow → Varanasi"), which jsPDF silently drops instead
    // of rendering — so replace known offenders with safe equivalents
    // before anything reaches doc.text(). Characters already confirmed
    // to render fine (·, –, •) are left untouched.
    function sanitizeForPdf(text: string): string {
      return text
        .replace(/[\u2192\u21D2\u27A1]/g, " - ") // →, ⇒, ➡
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/\s+/g, " ")
        .trim();
    }

    // ----------------------------------------------------------
    // WRAPPED TEXT
    // ----------------------------------------------------------
    function writeWrapped(
      text: string,
      lineHeight: number,
      gapAfter: number
    ) {
      const lines: string[] =
        doc.splitTextToSize(sanitizeForPdf(text), maxWidth);

      for (const line of lines) {
        // IMPORTANT:
        // If text reaches the footer area, make a new page.
        if (y > contentBottom) {
          doc.addPage();
          y = 64;
        }

        doc.text(line, margin, y);
        y += lineHeight;
      }

      y += gapAfter;
    }

    // ----------------------------------------------------------
    // TITLE
    // ----------------------------------------------------------
    doc.setFont("Poppins", "bold");
    doc.setFontSize(22);
    doc.setTextColor(53, 17, 14);

    writeWrapped(title, 27, 7);

    // ----------------------------------------------------------
    // META
    // ----------------------------------------------------------
    doc.setFont("Poppins", "normal");
    doc.setFontSize(11);
    doc.setTextColor(165, 116, 79);

    const metaParts = [
      `Saved ${new Date(createdAt).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )}`,
    ];

    if (from) {
      metaParts.push(`From ${from}`);
    }

    if (region) {
      metaParts.push(region);
    }

    writeWrapped(
      metaParts.join("   ·   "),
      15,
      14
    );

    // Divider
    doc.setDrawColor(240, 221, 200);

    doc.line(
      margin,
      y,
      pageWidth - margin,
      y
    );

    y += 24;

    // ----------------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------------
    if (summary) {
      doc.setFont("Poppins", "normal");
      doc.setFontSize(11.5);
      doc.setTextColor(107, 74, 61);

      writeWrapped(summary, 16, 22);
    }

    // ----------------------------------------------------------
    // DAYS
    // ----------------------------------------------------------
    days.forEach((d) => {
      // Leave enough room for the heading itself.
      if (y > contentBottom - 45) {
        doc.addPage();
        y = 64;
      }

      doc.setFont("Poppins", "bold");
      doc.setFontSize(13.5);
      doc.setTextColor(165, 45, 21);

      writeWrapped(
        `${d.day} · ${d.title}`,
        18,
        4
      );

      doc.setFont("Poppins", "normal");
      doc.setFontSize(11);
      doc.setTextColor(74, 54, 42);

      writeWrapped(
        d.description,
        15,
        22
      );
    });

    // ----------------------------------------------------------
    // FOOTER ON EVERY PAGE
    // ----------------------------------------------------------
    const totalPages = doc.getNumberOfPages();

    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);

      // Footer position is calculated from the current page.
      const footerY = pageHeight - 20;

      // Footer divider
      doc.setDrawColor(232, 194, 161);
      doc.setLineWidth(0.7);

      doc.line(
        margin,
        pageHeight - 36,
        pageWidth - margin,
        pageHeight - 36
      );

      // Footer name
      doc.setFont("Poppins", "normal");
      doc.setFontSize(8);
      doc.setTextColor(145, 104, 82);

      doc.text(
        sanitizeForPdf("Temple Heritage • Created by Aarya Shirsath"),
        margin,
        footerY
      );

      // Page number
      doc.text(
        `Page ${page} of ${totalPages}`,
        pageWidth - margin,
        footerY,
        {
          align: "right",
        }
      );
    }

    // ----------------------------------------------------------
    // SAVE
    // ----------------------------------------------------------
    const filename =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + ".pdf";

    doc.save(filename);
  }

  return (
    <button
      onClick={handleDownload}
      className="btn-secondary"
      style={{
        color: "#8c2416",
        borderColor: "#b95a40",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Download size={16} />
      Download as PDF
    </button>
  );
}