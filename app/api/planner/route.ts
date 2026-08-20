import { NextRequest, NextResponse } from "next/server";
import { groq, AI_MODEL, buildTempleContext } from "@/lib/ai";

export const runtime = "nodejs";

type PlannerRequest = {
  from: string;
  days: number;
  region: string;
  interests: string[];
};

type ItineraryDay = {
  day: string;
  title: string;
  description: string;
  templeSlugs: string[];
};

function extractJson(text: string): unknown {
  // Model is instructed to return raw JSON, but strip markdown fences defensively.
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "");
  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not set on the server. Add it to .env.local and restart the dev server." },
      { status: 500 }
    );
  }

  let body: PlannerRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { from, days, region, interests } = body;
  const safeDays = Math.max(1, Math.min(10, Number(days) || 5));

  const system = `You are TempleGuide, an expert Indian pilgrimage (yatra) planner for the Temple Heritage app.
You must ONLY recommend temples that appear in the TEMPLES list below — never invent temples, cities, or facts.
Build a realistic, day-by-day itinerary that respects the traveler's starting city, trip length, preferred region, and interests.
Prefer temples whose region matches the user's preferred region where possible, but you may include a nearby highlight from an adjacent region if it meaningfully improves the trip.

${buildTempleContext()}

Respond with ONLY valid JSON (no markdown fences, no commentary) matching this exact shape:
{
  "days": [
    { "day": "Day 1", "title": "short title", "description": "2-3 sentence plan for the day, mentioning specific temple names", "templeSlugs": ["slug-if-any"] }
  ],
  "summary": "one sentence overview of the trip"
}
Return exactly ${safeDays} day objects.`;

  const userMessage = `Plan a ${safeDays}-day yatra starting from ${from || "an unspecified city"}, preferred region: ${region || "any"}, interests: ${
    interests && interests.length ? interests.join(", ") : "general heritage"
  }.`;

  try {
    const response = await groq.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 1500,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMessage },
      ],
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      return NextResponse.json({ error: "AI did not return a text response." }, { status: 502 });
    }

    let parsed: { days: ItineraryDay[]; summary: string };
    try {
      parsed = extractJson(text) as { days: ItineraryDay[]; summary: string };
    } catch {
      return NextResponse.json({ error: "AI response could not be parsed. Please try again." }, { status: 502 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Planner AI error:", err);
    return NextResponse.json({ error: "AI request failed. Please try again in a moment." }, { status: 502 });
  }
}
