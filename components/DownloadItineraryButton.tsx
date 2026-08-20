"use client";

import { Download } from "lucide-react";
import {
  POPPINS_REGULAR_BASE64,
  POPPINS_BOLD_BASE64,
} from "@/lib/pdf-fonts";
import {
  LOGO_BASE64,
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

    // Fonts
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
    const maxWidth = pageWidth - margin * 2;

    let y = 64;

    // --------------------------------------------------
    // TEMPLE HERITAGE LOGO HEADER
    // --------------------------------------------------

    if (LOGO_BASE64) {
      const logoHeight = 90;
      const logoWidth =
        (LOGO_WIDTH_PX / LOGO_HEIGHT_PX) *
        logoHeight;

      doc.addImage(
        LOGO_BASE64,
        LOGO_FORMAT,
        margin,
        y - 42,
        logoWidth,
        logoHeight
      );

      y += 42;
    }

    // Clean divider
    doc.setDrawColor(232, 194, 161);
    doc.setLineWidth(1);

    doc.line(
      margin,
      y,
      pageWidth - margin,
      y
    );

    y += 30;

    // --------------------------------------------------
    // WRAPPED TEXT HELPER
    // --------------------------------------------------

    function writeWrapped(
      text: string,
      lineHeight: number,
      gapAfter: number
    ) {
      const lines: string[] =
        doc.splitTextToSize(text, maxWidth);

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

    // --------------------------------------------------
    // TITLE
    // --------------------------------------------------

    doc.setFont("Poppins", "bold");
    doc.setFontSize(22);
    doc.setTextColor(53, 17, 14);

    writeWrapped(title, 27, 7);

    // --------------------------------------------------
    // META
    // --------------------------------------------------

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

    // --------------------------------------------------
    // SUMMARY
    // --------------------------------------------------

    if (summary) {
      doc.setFont("Poppins", "normal");
      doc.setFontSize(11.5);
      doc.setTextColor(107, 74, 61);

      writeWrapped(summary, 16, 22);
    }

    // --------------------------------------------------
    // DAY-BY-DAY ITINERARY
    // --------------------------------------------------

    days.forEach((d) => {
      if (y > pageHeight - 100) {
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

    // --------------------------------------------------
    // SAVE PDF
    // --------------------------------------------------

    const filename =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      ".pdf";

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