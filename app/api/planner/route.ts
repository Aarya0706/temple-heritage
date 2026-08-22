import { NextRequest, NextResponse } from "next/server";
import { groq, AI_MODEL, buildTempleContext } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";
import { temples } from "@/data/temples";

export const runtime = "nodejs";

// AI calls are the most expensive thing this app does — keep this tight.
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 60_000; // 1 minute

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

// ----------------------------------------------------------------------
// FEASIBILITY VALIDATION
// ----------------------------------------------------------------------
// The system prompt below asks the model to follow travel-feasibility rules,
// but prose "hard constraints" are a request, not a guarantee — the model
// (openai/gpt-oss-120b) has been observed producing itineraries that violate
// them on the Kedarnath/Badrinath circuit specifically (e.g. combining the
// Gaurikund drive and the Kedarnath trek into one day, or having Badrinath
// on the second-to-last day with no transfer day before the flight home).
// This checks the model's *actual output* structurally against the same
// facts recorded in each temple's `accessNotes`, rather than trusting it
// self-enforced the rules. See data/temples.ts for the source numbers.
const slugToState = new Map(temples.map((t) => [t.slug, t.state]));
const slugToCity = new Map(temples.map((t) => [t.slug, t.city]));

function validateFeasibility(days: ItineraryDay[], fromCity?: string): string[] {
  const violations: string[] = [];
  const kedarnathIdx = days.findIndex((d) => d.templeSlugs?.includes("kedarnath"));
  const badrinathIdx = days.findIndex((d) => d.templeSlugs?.includes("badrinath"));

  // Continuity check: a day's description should never claim the traveler is
  // departing FROM the trip's origin city when the previous day already had
  // them somewhere else. Observed failure: a Varanasi day followed by a
  // "Travel from Delhi to Dehradun..." day, silently skipping the return
  // leg to Delhi — an invisible, unaccounted-for flight the traveler would
  // actually have to book and take.
  if (fromCity) {
    for (let i = 1; i < days.length; i++) {
      const prevSlugs = days[i - 1].templeSlugs || [];
      const prevCity = prevSlugs.map((s) => slugToCity.get(s)).find(Boolean);
      if (!prevCity || prevCity.toLowerCase() === fromCity.toLowerCase()) continue;
      const text = `${days[i].title} ${days[i].description}`;
      if (new RegExp(`from\\s+${fromCity}\\b`, "i").test(text)) {
        violations.push(
          `Day ${i + 1} describes travel starting "from ${fromCity}", but the previous day's itinerary already placed the traveler in ${prevCity}, not ${fromCity}. This is a continuity error - either add the missing return-to-${fromCity} leg explicitly, or rewrite this day to depart from ${prevCity}, the traveler's actual location.`
        );
      }
    }
  }

  // Kedarnath's approach (drive to Gaurikund + trek) must not be crammed
  // onto the same day as departing from a temple outside Uttarakhand.
  if (kedarnathIdx > 0) {
    const prevSlugs = days[kedarnathIdx - 1].templeSlugs || [];
    const prevLeavesFromOutside = prevSlugs.some((s) => slugToState.get(s) && slugToState.get(s) !== "Uttarakhand");
    if (prevLeavesFromOutside) {
      violations.push(
        "The day before Kedarnath still visits a temple outside Uttarakhand. The ~210 km / 7-10 hour drive to Gaurikund plus the 16-18 km / 5-8 hour trek cannot happen on the same day as departing from elsewhere — arrive in Uttarakhand (e.g. Rishikesh) the day before, then give the Gaurikund drive + trek its own dedicated day."
      );
    }

    // A transit day with no temple slug can hide the same problem: it may
    // still be combining a flight INTO Uttarakhand with the 7-10 hour drive
    // to Gaurikund, on the same day, starting from a city that itself needs
    // more than a short direct hop to reach Dehradun/Rishikesh (anything
    // other than Delhi-NCR, which is the one short/direct/well-connected
    // exception this app treats as safe to combine with the Gaurikund drive).
    if (!prevSlugs.length) {
      let lookback = kedarnathIdx - 1;
      while (lookback > 0 && !(days[lookback].templeSlugs || []).length) lookback--;
      const gapDays = kedarnathIdx - lookback;
      const originSlugs = days[lookback].templeSlugs || [];
      const originState = originSlugs.map((s) => slugToState.get(s)).find(Boolean);
      const originCity = originSlugs.map((s) => slugToCity.get(s)).find(Boolean);
      if (originState && originState !== "Uttarakhand" && originCity && originCity.toLowerCase() !== "delhi" && gapDays === 1) {
        violations.push(
          `Kedarnath is reached only one transit day after leaving ${originCity} (${originState}), which has no short direct connection to Dehradun/Rishikesh/Haridwar the way Delhi does. That single day cannot combine the flight into Uttarakhand with the ~210 km / 7-10 hour drive to Gaurikund — split it into a dedicated arrival day plus a separate Gaurikund-drive day before the trek, or route the flight through Delhi and say so explicitly.`
        );
      }
    }
  }

  // Kedarnath and Badrinath are not adjacent — descending and transferring
  // between them takes most of a day on its own via Rudraprayag/Chamoli.
  if (kedarnathIdx !== -1 && badrinathIdx !== -1) {
    const gap = Math.abs(badrinathIdx - kedarnathIdx);
    if (gap < 3) {
      violations.push(
        `Kedarnath and Badrinath are only ${gap} day(s) apart. Descending from Kedarnath (5-8 hours) and then driving to Badrinath/Joshimath (7-10 hours via Rudraprayag and Chamoli) cannot be compressed into that gap — leave at least 2 full days between the Kedarnath day and the Badrinath day.`
      );
    }
  }

  // Varanasi has no direct flight to Indore (Ujjain's nearest airport) —
  // the model has been observed writing "fly from Varanasi to Indore" as a
  // quick same-day hop and then scheduling a relaxed evening on arrival,
  // when the real connection requires a layover (Delhi/Mumbai/Bengaluru/
  // Hyderabad) and takes 6-10 hours door-to-door. See kashi-vishwanath's
  // and mahakaleshwar's accessNotes in data/temples.ts for the source facts.
  const varanasiIdx = days.findIndex((d) => d.templeSlugs?.includes("kashi-vishwanath"));
  const ujjainIdx = days.findIndex((d) => d.templeSlugs?.includes("mahakaleshwar"));
  if (varanasiIdx !== -1 && ujjainIdx !== -1 && Math.abs(ujjainIdx - varanasiIdx) === 1) {
    const travelDay = days[Math.max(varanasiIdx, ujjainIdx)];
    const text = `${travelDay.title} ${travelDay.description}`.toLowerCase();
    const impliesQuickHop =
      (text.includes("fly") || text.includes("flight")) &&
      (text.includes("relax") || text.includes("settle in") || text.includes("evening") || text.includes("same day"));
    if (impliesQuickHop) {
      violations.push(
        "The Varanasi-to-Ujjain travel day describes a quick direct flight to Indore followed by a relaxed evening, but there is NO direct Varanasi-Indore flight - it requires a connecting flight (via Delhi, Mumbai, Bengaluru or Hyderabad) and takes 6-10 hours door-to-door including the layover. Rewrite this day to reflect a full connecting-flight travel day, not a short hop with time left over for sightseeing or a relaxed evening on arrival."
      );
    }
  }

  // Badrinath has no airport or railway station — leaving it requires a
  // full transfer day back to Rishikesh/Haridwar/Dehradun before any
  // flight or train, so it can't be within 1 day of the itinerary's end.
  if (badrinathIdx !== -1) {
    const daysRemainingAfter = days.length - 1 - badrinathIdx;
    if (daysRemainingAfter < 2) {
      violations.push(
        "Badrinath has no airport or railway station — the nearest (Dehradun, or Rishikesh/Haridwar) is ~300 km / 8-10 hours away by mountain road. The itinerary needs at least 2 days after the Badrinath day: one to transfer back down, and a separate one to actually fly or take the train out."
      );
    }
  }

  return violations;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`planner:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "You're planning yatras a little too fast — please wait a moment and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((rate.resetAt - Date.now()) / 1000).toString(),
          "X-RateLimit-Limit": rate.limit.toString(),
          "X-RateLimit-Remaining": rate.remaining.toString(),
        },
      }
    );
  }

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

TRAVEL FEASIBILITY RULES (violating these produces an itinerary nobody can actually follow — treat them as hard constraints, not suggestions):
- Kedarnath and Badrinath are remote high-Himalayan shrines in Uttarakhand. Reaching either from Rishikesh/Dehradun is itself a full day of mountain driving, and Kedarnath additionally requires a ~16-18 km trek (6-8 hours each way) from Gaurikund. NEVER schedule travel into Kedarnath or Badrinath on the same day as departing from a city outside Uttarakhand/Delhi-NCR — give each its own dedicated day, and give the Kedarnath trek its own day separate from any other travel. See each temple's ACCESS NOTES above for exact numbers.
- Kedarnath and Badrinath are in the same state but are NOT adjacent to each other — moving between them still takes most of a day via Rudraprayag, and needs at least 2 full days of gap in the itinerary. Do not treat "visit Kedarnath in the morning, Badrinath in the afternoon" as feasible.
- Badrinath has no airport or railway station. Leaving Badrinath by flight or train requires its own dedicated transfer day back to Rishikesh/Haridwar/Dehradun first — never schedule Badrinath within the last 2 days of the itinerary.
- Treat any two temples in DIFFERENT states as requiring a dedicated travel day (flight or long train/road journey) UNLESS both states are immediate neighbors on a well-connected route (e.g. Delhi <-> Uttar Pradesh, Gujarat <-> Maharashtra). Never sequence three or more different states across three or fewer consecutive days.
- Do NOT assume a direct/non-stop flight exists between two Indian cities just because both have airports — many tier-2 pilgrimage-adjacent cities (e.g. Varanasi and Indore) have NO direct route and require a connecting flight via a metro hub (Delhi, Mumbai, Bengaluru, Hyderabad), which takes 6-10 hours door-to-door including the layover. When a temple's ACCESS NOTES explicitly call out a missing direct route, treat that leg as a full connecting-flight travel day with no time left for sightseeing or a "relaxed evening" on arrival — never describe it as a quick same-day hop.
- NARRATIVE CONTINUITY: track where the traveler actually is at the end of each day and always describe the next travel day as departing FROM that real location — never from the trip's original starting city out of habit once the itinerary has moved on. If the traveler is in Varanasi at the end of a day, the next travel day must say "from Varanasi," not silently revert to "from Delhi." If reaching Kedarnath/Badrinath from a city that isn't Delhi-NCR, that city's flight into Dehradun/Rishikesh/Haridwar is almost never a short direct hop — budget the connecting flight AND the ~210 km/7-10 hour Gaurikund drive as two separate dedicated days, not one.
- For trips of ${safeDays <= 4 ? "4 days or fewer, stay within a single state or a pair of well-connected neighboring states" : safeDays <= 7 ? "5-7 days, span at most 2-3 states that are realistically connected by direct flights or a shared travel corridor" : "8-10 days, you may span multiple regions, but still budget a full travel day for each major state change and never combine a remote Himalayan shrine with a same-day city change"}.
- If the preferred region and starting city cannot realistically support ${safeDays} days of temple visits without impossible travel, it is better to include a couple of well-connected temples from an adjacent region than to force in a geographically distant one — never sacrifice feasibility for coverage. If Kedarnath and/or Badrinath genuinely cannot both fit given the day count, it is better to drop one of them than to compress the travel.

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

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: system },
    { role: "user", content: userMessage },
  ];

  // Up to one initial attempt plus one corrective retry. Retrying with the
  // specific violations fed back in fixes real logistics mistakes far more
  // reliably than the up-front prompt alone did in testing.
  const MAX_ATTEMPTS = 2;

  try {
    let parsed: { days: ItineraryDay[]; summary: string } | null = null;
    let violations: string[] = [];

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const response = await groq.chat.completions.create({
        model: AI_MODEL,
        // Higher than before: the added travel-feasibility rules make the
        // system prompt heavier, and openai/gpt-oss-120b spends tokens on
        // internal reasoning before writing the actual JSON — too low a
        // cap here means reasoning alone can exhaust the budget and leave
        // no room for the response itself (seen as an empty completion).
        max_tokens: 4096,
        messages,
      });

      const choice = response.choices[0];
      const text = choice?.message?.content;
      if (!text) {
        const reason = choice?.finish_reason;
        const hint =
          reason === "length"
            ? " The model ran out of tokens before writing a response — try a shorter trip or fewer interests."
            : "";
        return NextResponse.json(
          { error: `AI did not return a text response.${hint}` },
          { status: 502 }
        );
      }

      try {
        parsed = extractJson(text) as { days: ItineraryDay[]; summary: string };
      } catch {
        return NextResponse.json({ error: "AI response could not be parsed. Please try again." }, { status: 502 });
      }

      violations = validateFeasibility(parsed.days || [], from);
      if (violations.length === 0) {
        return NextResponse.json(parsed);
      }

      if (attempt < MAX_ATTEMPTS) {
        // Feed the exact violations back and ask for a corrected version,
        // rather than silently serving an itinerary nobody can follow.
        messages.push({ role: "assistant", content: text });
        messages.push({
          role: "user",
          content: `That itinerary is not feasible:\n${violations.map((v) => `- ${v}`).join("\n")}\nFix these specific problems and return the full corrected JSON in the same shape.`,
        });
      }
    }

    // Both attempts still violate the hard constraints — better to say so
    // than to hand the user a plan with an impossible day in it.
    return NextResponse.json(
      {
        error:
          "The AI couldn't produce a feasible itinerary for this request — it kept combining travel legs that can't actually fit in one day (" +
          violations.join(" ") +
          "). Try reducing the day count's scope, e.g. dropping Kedarnath or Badrinath, or adding a couple more days.",
      },
      { status: 422 }
    );
  } catch (err) {
    console.error("Planner AI error:", err);
    return NextResponse.json({ error: "AI request failed. Please try again in a moment." }, { status: 502 });
  }
}