import { NextRequest, NextResponse } from "next/server";
import { groq, AI_MODEL, buildTempleContext } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";
import { temples } from "@/data/temples";

export const runtime = "nodejs";

const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 60_000;

type PlannerRequest = {
  from: string;
  days: number;
  region: string;
  interests: string[];
  travelStyle?: string;
  festival?: string | null;
  festivalDate?: string | null;
  festivalTemples?: string[];
  anchorTempleSlug?: string | null;
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

const KNOWN_TEMPLE_SLUGS = new Set(temples.map((t) => t.slug));

/**
 * Data-integrity checks on top of `isValidItinerary`'s structural check.
 * Catches the two failure modes that used to reach the route layer
 * unnoticed: a slug the model invented (not in the real database) and a
 * slug the model placed on more than one day (which produces a 0 km leg
 * once the route optimizer runs, since the "trip" visits the same place
 * twice). Called only once `isValidItinerary` has already confirmed
 * `data.days[].templeSlugs` exists and is an array.
 */
function findItineraryDataIssues(data: ItineraryResponse): {
  unknownSlugs: string[];
  duplicateSlugs: string[];
} {
  const allSlugs = data.days.flatMap((d) => d.templeSlugs);

  const unknownSlugs = [...new Set(allSlugs.filter((slug) => !KNOWN_TEMPLE_SLUGS.has(slug)))];

  const seen = new Set<string>();
  const duplicateSlugs = new Set<string>();
  for (const slug of allSlugs) {
    if (seen.has(slug)) duplicateSlugs.add(slug);
    seen.add(slug);
  }

  return { unknownSlugs, duplicateSlugs: [...duplicateSlugs] };
}

function hasNoDataIssues(data: ItineraryResponse): boolean {
  const { unknownSlugs, duplicateSlugs } = findItineraryDataIssues(data);
  return unknownSlugs.length === 0 && duplicateSlugs.length === 0;
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

  // Whitelist rather than trust the client string directly — it goes
  // straight into the prompt below.
  const TRAVEL_STYLES = ["Relaxed", "Balanced", "Packed"] as const;
  const travelStyle: (typeof TRAVEL_STYLES)[number] = TRAVEL_STYLES.includes(
    body.travelStyle as (typeof TRAVEL_STYLES)[number]
  )
    ? (body.travelStyle as (typeof TRAVEL_STYLES)[number])
    : "Balanced";

  const TRAVEL_STYLE_GUIDANCE: Record<(typeof TRAVEL_STYLES)[number], string> = {
    Relaxed:
      "Relaxed pace: at most one major temple per day, with generous rest time, and never schedule back-to-back travel days.",
    Balanced:
      "Balanced pace: typically one, occasionally two, temples per day when they are genuinely close together, with reasonable rest built in.",
    Packed:
      "Packed pace: fit two to three temples into a day wherever they are genuinely close together, minimizing idle time while staying realistic about travel time.",
  };

  const festival =
    typeof body.festival === "string" && body.festival.trim()
      ? body.festival.trim()
      : null;

  // Only accept a clean ISO date (YYYY-MM-DD) — reject anything else so a
  // malformed or tampered value can't get echoed into the prompt.
  const festivalDate =
    typeof body.festivalDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.festivalDate.trim())
      ? body.festivalDate.trim()
      : null;

  const festivalDateReadable = festivalDate
    ? new Date(`${festivalDate}T00:00:00Z`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

  // Resolve the festival's linked temple slugs against the real database —
  // never trust client-supplied slugs directly, and drop anything that
  // doesn't exist so the AI is never told to use a fake temple.
  const festivalTemples = Array.isArray(body.festivalTemples)
    ? body.festivalTemples
        .filter((slug): slug is string => typeof slug === "string" && slug.trim().length > 0)
        .map((slug) => temples.find((t) => t.slug === slug.trim()))
        .filter((t): t is (typeof temples)[number] => Boolean(t))
    : [];

  // Resolve a single "anchor" temple against the real database — set when the
  // planner was opened from a temple's own page via "Plan a Visit" /
  // "Build My Itinerary", so the trip should be built around that specific
  // temple rather than only the general region/interests. Never trust the
  // client-supplied slug directly.
  const anchorTemple =
    typeof body.anchorTempleSlug === "string" && body.anchorTempleSlug.trim()
      ? temples.find((t) => t.slug === body.anchorTempleSlug!.trim()) || null
      : null;

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

TRAVEL STYLE:
${travelStyle} — ${TRAVEL_STYLE_GUIDANCE[travelStyle]}
${
  festival
    ? `
FESTIVAL FOCUS:
This trip is built around the festival "${festival}"${festivalDateReadable ? `, which falls on ${festivalDateReadable}` : ""}. ${
        festivalDateReadable
          ? `Structure the itinerary's days so the celebration day genuinely lines up with ${festivalDateReadable} — arrive with enough buffer beforehand, and state the actual date (or "the day of the festival, ${festivalDateReadable}") in the day description for the celebration day, so the trip reads as a real, dated plan rather than a vague "sometime during the festival" itinerary. `
          : ""
      }${
        festivalTemples.length > 0
          ? `The temples in the database specifically known for celebrating "${festival}" are: ${festivalTemples
              .map((t) => `${t.name} (slug: ${t.slug}, ${t.city}, ${t.state})`)
              .join(
                "; "
              )}. Your itinerary MUST feature at least one of these exact temples for the festival-celebration day — but choose WHICHEVER one of them fits best into a single, non-backtracking route through the region, and place the festival day wherever it naturally falls in that route (it does not have to be the last day, and you do not need to return to a temple you already left earlier in the trip just to end there). Do not substitute a different, more famous temple from an unrelated state.`
          : `The database has no temple explicitly tagged for "${festival}" — use your best geographic and cultural judgment to pick temples in the region genuinely associated with this festival.`
      } Center the itinerary's timing and activities around experiencing the festival — arrival before it, the celebration itself as a highlight day, and time to explore the surrounding temples and region. Refer to the festival ONLY by its exact given name, "${festival}" — do not substitute or rename it to a different, even closely related, festival (e.g. do not call it "Durga Puja" if the given name is "Navratri", or vice versa). Mention "${festival}" by that exact name in the day descriptions where relevant.
`
    : ""
}
${
  anchorTemple
    ? `
ANCHOR TEMPLE:
This trip is being planned from the page of a specific temple: ${anchorTemple.name} (slug: ${anchorTemple.slug}, ${anchorTemple.city}, ${anchorTemple.state}). The itinerary MUST feature this exact temple, ideally as one of the earlier highlight days, and the rest of the route should be built sensibly around it — nearby temples and stops that fit a single, non-backtracking route through the region containing it. Do not substitute a different, more famous temple in its place.
`
    : ""
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
21. Plan temple visits in a single geographically efficient direction. Do NOT double back to a city or temple you have already left earlier in the trip, unless it is genuinely unavoidable.
22. For the journey home, depart from the nearest reasonable airport or station to your LAST stop — not necessarily the same city or airport used to arrive in the region.
23. Structure every day's description around a clear morning, afternoon and evening flow (e.g. "Begin the morning at...", "In the afternoon...", "As evening falls...") so the traveler can see roughly when each activity happens — without inventing exact clock times.
24. Respect the requested travel style's pace (see TRAVEL STYLE above) when deciding how many temples to place in a single day.

Examples:
- Write "seven to ten hours", NOT "7-10 hours".
- Write "five to eight hours", NOT "5-8 hours".
- Write "sixteen to eighteen kilometres", NOT "16-18 km".
- Write "approximately one and a half hours", NOT "1.5 hours".

25. Make all travel durations and distances easy to read in normal sentences.
26. Never combine two numbers together without spaces or words between them.
27. Every temple slug must appear AT MOST ONCE across the ENTIRE trip. Never place the same temple on two different days, even as a "return visit" or "on the way back" — once a temple has been visited on one day, do not include its slug again on any later day.

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
    let structurallyValid = isValidItinerary(parsed, safeDays);
    let dataIssues = structurallyValid
      ? findItineraryDataIssues(parsed)
      : { unknownSlugs: [], duplicateSlugs: [] };

    if (!structurallyValid || dataIssues.unknownSlugs.length > 0 || dataIssues.duplicateSlugs.length > 0) {
      console.log(
        "Planner returned incomplete or invalid itinerary. Retrying...",
        structurallyValid ? dataIssues : "structurally invalid"
      );

      const retryPrompt = `
Your previous response was incomplete or invalid.
${
        dataIssues.duplicateSlugs.length > 0
          ? `\nIt repeated the following temple slug(s) on more than one day, which is not allowed — each temple may appear on AT MOST ONE day across the entire trip: ${dataIssues.duplicateSlugs.join(", ")}. Rebuild the route so each of these appears only once.\n`
          : ""
      }${
        dataIssues.unknownSlugs.length > 0
          ? `\nIt used the following temple slug(s) that do NOT exist in the database below — do not invent slugs, use only ones listed: ${dataIssues.unknownSlugs.join(", ")}.\n`
          : ""
      }
Generate the itinerary again from scratch.

You MUST return exactly ${safeDays} complete days.

Starting city: ${from}
Region: ${region}
Interests: ${
        interests.length > 0
          ? interests.join(", ")
          : "Temples and heritage"
      }
Travel style: ${travelStyle} — ${TRAVEL_STYLE_GUIDANCE[travelStyle]}
${
        festival
          ? `Festival focus: Build the itinerary around "${festival}", refer to it ONLY by that exact name.${
              festivalDateReadable ? ` It falls on ${festivalDateReadable} — state that actual date on the celebration day.` : ""
            } ${
              festivalTemples.length > 0
                ? `You MUST feature at least one of these exact temples, known for celebrating it: ${festivalTemples
                    .map((t) => `${t.name} (slug: ${t.slug})`)
                    .join("; ")}. Pick whichever fits best into a non-backtracking route; the festival day doesn't have to be last.`
                : ""
            }\n`
          : ""
      }
${
        anchorTemple
          ? `Anchor temple: This trip MUST feature ${anchorTemple.name} (slug: ${anchorTemple.slug}, ${anchorTemple.city}, ${anchorTemple.state}), ideally as an early highlight day, with the rest of the route built sensibly around it.\n`
          : ""
      }
Use only temples from this database:

${templeContext}

Every day must contain:
- day
- title
- description
- templeSlugs

The days array must contain exactly ${safeDays} objects.

Each temple slug must appear on AT MOST ONE day across the entire trip — never repeat the same temple on two different days.

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
      structurallyValid = isValidItinerary(parsed, safeDays);
      dataIssues = structurallyValid ? findItineraryDataIssues(parsed) : { unknownSlugs: [], duplicateSlugs: [] };
    }

    if (!isValidItinerary(parsed, safeDays) || dataIssues.unknownSlugs.length > 0 || dataIssues.duplicateSlugs.length > 0) {
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