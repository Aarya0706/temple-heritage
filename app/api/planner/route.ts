import { NextRequest, NextResponse } from "next/server";
import { groq, AI_MODEL, buildTempleContext } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 60_000;

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

type ItineraryResponse = {
  days: ItineraryDay[];
  summary: string;
};

function extractJson(text: string): ItineraryResponse | null {
  try {
    let cleaned = text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      return null;
    }

    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    return JSON.parse(cleaned) as ItineraryResponse;
  } catch {
    return null;
  }
}

function isValidItinerary(
  data: ItineraryResponse | null,
  totalDays: number
): data is ItineraryResponse {
  if (!data || !Array.isArray(data.days)) {
    return false;
  }

  if (data.days.length !== totalDays) {
    return false;
  }

  return data.days.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof item.title === "string" &&
      item.title.trim().length > 0 &&
      typeof item.description === "string" &&
      item.description.trim().length > 0 &&
      Array.isArray(item.templeSlugs)
  );
}

function normalizeItinerary(
  data: ItineraryResponse,
  totalDays: number,
  from: string
): ItineraryResponse {
  return {
    days: data.days.slice(0, totalDays).map((item, index) => ({
      day: `Day ${index + 1}`,
      title: item.title.trim(),
      description: item.description.trim(),
      templeSlugs: item.templeSlugs.filter(
        (slug): slug is string =>
          typeof slug === "string" && slug.trim().length > 0
      ),
    })),
    summary:
      typeof data.summary === "string" && data.summary.trim()
        ? data.summary.trim()
        : `A personalized ${totalDays}-day spiritual journey starting from ${from}.`,
  };
}

async function generateItinerary(
  prompt: string
): Promise<ItineraryResponse | null> {
  const response = await groq.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "Return only valid JSON. Do not use markdown, code fences, explanations, comments, or extra text.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 3000,
    response_format: {
      type: "json_object",
    },
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content || !content.trim()) {
    return null;
  }

  return extractJson(content);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const rate = checkRateLimit(
    `planner:${ip}`,
    RATE_LIMIT,
    RATE_WINDOW_MS
  );

  if (!rate.allowed) {
    return NextResponse.json(
      {
        error:
          "You're planning yatras a little too quickly. Please wait a moment and try again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.max(
            1,
            Math.ceil((rate.resetAt - Date.now()) / 1000)
          ).toString(),
        },
      }
    );
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      {
        error:
          "GROQ_API_KEY is missing. Add it to your .env.local file and restart the server.",
      },
      { status: 500 }
    );
  }

  let body: PlannerRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const from =
    typeof body.from === "string" && body.from.trim()
      ? body.from.trim()
      : "Delhi";

  const region =
    typeof body.region === "string" && body.region.trim()
      ? body.region.trim()
      : "Any region";

  const interests = Array.isArray(body.interests)
    ? body.interests.filter(
        (interest): interest is string =>
          typeof interest === "string" &&
          interest.trim().length > 0
      )
    : [];

  const safeDays = Math.max(
    1,
    Math.min(10, Number(body.days) || 5)
  );

  try {
    const templeContext = buildTempleContext().slice(0, 9000);

    const prompt = `
You are an expert Indian pilgrimage and temple travel planner.

Create a COMPLETE and geographically realistic ${safeDays}-day spiritual itinerary.

STARTING CITY:
${from}

PREFERRED REGION:
${region}

INTERESTS:
${
  interests.length > 0
    ? interests.join(", ")
    : "Temples and heritage"
}

AVAILABLE TEMPLE DATABASE:

${templeContext}

CRITICAL RULES:

1. You MUST return EXACTLY ${safeDays} complete days.
2. Do not stop early.
3. Do not leave any day generic or empty.
4. Every single day must have a unique and meaningful title.
5. Every single day must have a detailed realistic description.
6. Use ONLY temple slugs that exist in the provided database.
7. Do NOT invent temples or temple slugs.
8. Keep the route geographically sensible.
9. Do not jump across India unnecessarily.
10. Account for realistic travel time between destinations.
11. If a destination requires a full travel day, describe it realistically.
12. Prefer temples in the selected region.
13. templeSlugs must ALWAYS be an array.
14. Do not repeat the same generic description.
15. Return JSON only.
16. No markdown.
17. No code fences.
18. No text before or after the JSON.
19. When mentioning travel time, distance, trek length, or any number range, NEVER use hyphens between numbers.
20. Write ranges using words instead.

Examples:
- Write "seven to ten hours", NOT "7-10 hours".
- Write "five to eight hours", NOT "5-8 hours".
- Write "sixteen to eighteen kilometres", NOT "16-18 km".
- Write "approximately one and a half hours", NOT "1.5 hours".

21. Make all travel durations and distances easy to read in normal sentences.
22. Never combine two numbers together without spaces or words between them.

Return exactly this structure:

{
  "days": [
    {
      "day": "Day 1",
      "title": "Meaningful title",
      "description": "Travel from one destination to another in approximately seven to ten hours, then rest and prepare for the next day's pilgrimage.",
      "templeSlugs": ["valid-temple-slug"]
    }
  ],
  "summary": "A short summary of the complete journey."
}

IMPORTANT:

Before returning your answer, count the days.

The "days" array MUST contain exactly ${safeDays} objects.

Do not return fewer than ${safeDays} days.
Do not return more than ${safeDays} days.
`;

    let parsed = await generateItinerary(prompt);

    if (!isValidItinerary(parsed, safeDays)) {
      console.log(
        "Planner returned incomplete itinerary. Retrying..."
      );

      const retryPrompt = `
Your previous response was incomplete or invalid.

Generate the itinerary again from scratch.

You MUST return exactly ${safeDays} complete days.

Starting city: ${from}
Region: ${region}
Interests: ${
        interests.length > 0
          ? interests.join(", ")
          : "Temples and heritage"
      }

Use only temples from this database:

${templeContext}

Every day must contain:
- day
- title
- description
- templeSlugs

The days array must contain exactly ${safeDays} objects.

Return only valid JSON:

{
  "days": [
    {
      "day": "Day 1",
      "title": "Meaningful title",
      "description": "Detailed realistic itinerary for the day.",
      "templeSlugs": []
    }
  ],
  "summary": "Journey summary."
}
`;

      parsed = await generateItinerary(retryPrompt);
    }

    if (!isValidItinerary(parsed, safeDays)) {
      return NextResponse.json(
        {
          error:
            "The AI could not generate a complete itinerary. Please try again.",
        },
        { status: 502 }
      );
    }

    const result = normalizeItinerary(
      parsed,
      safeDays,
      from
    );

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Planner AI error:", err);

    const status =
      typeof err === "object" &&
      err !== null &&
      "status" in err
        ? Number((err as { status?: number }).status)
        : 500;

    const message =
      typeof err === "object" &&
      err !== null &&
      "message" in err
        ? String((err as { message?: unknown }).message)
        : "AI request failed.";

    if (status === 429) {
      return NextResponse.json(
        {
          error:
            "The AI service is temporarily busy. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    if (status === 401 || status === 403) {
      return NextResponse.json(
        {
          error:
            "Your Groq API key is invalid or does not have permission to use this model.",
        },
        { status }
      );
    }

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? message
            : "AI request failed. Please try again in a moment.",
      },
      { status: 502 }
    );
  }
}