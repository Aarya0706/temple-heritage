import { NextRequest, NextResponse } from "next/server";
import { festivals } from "@/data/festivals";
import { slugify } from "@/lib/slug";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const month = searchParams.get("month");

  if (slug) {
    const festival = festivals.find((f) => slugify(f.name) === slug || f.slug === slug);
    if (!festival) {
      return NextResponse.json({ error: "Festival not found" }, { status: 404 });
    }
    return NextResponse.json({ festival });
  }

  if (month) {
    const filtered = festivals.filter(
      (f) => f.month.toLowerCase() === month.toLowerCase()
    );
    return NextResponse.json({ festivals: filtered });
  }

  return NextResponse.json({ festivals });
}