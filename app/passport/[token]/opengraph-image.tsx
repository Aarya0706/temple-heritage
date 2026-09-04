// app/passport/[token]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getPassportByShareToken } from "@/lib/passport";

export const runtime = "edge";
export const alt = "Pilgrimage Passport";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: { token: string } }) {
  const passport = await getPassportByShareToken(params.token);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4EBD9",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 56, color: "#5A3A22", fontWeight: 700, marginBottom: 16 }}>
          Pilgrimage Passport
        </div>
        <div style={{ fontSize: 32, color: "#8A6A4A", marginBottom: 8 }}>
          {passport?.username ?? "A pilgrim"}
        </div>
        <div style={{ fontSize: 28, color: "#B4472B" }}>
          {passport?.stamps.length ?? 0} of {passport?.totalTemples ?? 0} sacred sites visited
        </div>
      </div>
    ),
    { ...size }
  );
}
