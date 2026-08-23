import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Powers the star rating shown on Browse Temples cards. Public data,
// no auth required — the temple_rating_summary view already only
// includes published reviews.
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("temple_rating_summary")
    .select("temple_slug, average_rating, review_count");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ratings: data });
}