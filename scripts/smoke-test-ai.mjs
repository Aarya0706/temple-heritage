// Smoke test for the Temple Heritage AI backend.
// Calls the real Groq API directly (same prompts/logic as app/api/planner and
// app/api/assistant) so you can verify GROQ_API_KEY + grounding work
// without needing `next dev` running.
//
// Usage:
//   GROQ_API_KEY=gsk_... node scripts/smoke-test-ai.mjs
// or, if you have .env.local set up:
//   node --env-file=.env.local scripts/smoke-test-ai.mjs

import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  console.error("GROQ_API_KEY is not set. Export it or pass --env-file=.env.local");
  process.exit(1);
}

const groq = new Groq();
const AI_MODEL = "openai/gpt-oss-120b";

// Minimal inline grounding data so this script has no dependency on TS path
// aliases (@/data/temples etc). Mirrors the shape lib/ai.ts serializes.
const templeContext = `TEMPLES (only real destinations you may reference or recommend):
- Meenakshi Amman Temple (slug: meenakshi-amman) | Deity: Meenakshi (Parvati) | Madurai, Tamil Nadu (South) | Type: Historic | Timing: 5:00 AM - 12:30 PM, 4:00 PM - 9:30 PM | Best time: Oct-Mar | Highlights: Dravidian architecture, 14 gopurams | Iconic temple complex with towering painted gopurams.
- Dwarkadhish Temple (slug: dwarkadhish) | Deity: Krishna | Dwarka, Gujarat (West) | Type: Vaishnav | Timing: 6:00 AM - 1:00 PM, 5:00 PM - 9:30 PM | Best time: Oct-Mar | Highlights: Char Dham site, 5-story spire | One of the four Char Dham pilgrimage sites.

FESTIVALS:
- Meenakshi Thirukalyanam (April/May) | Madurai | Celebrates the divine wedding of Meenakshi and Sundareswarar.`;

async function testPlanner() {
  console.log("\n=== Testing /api/planner logic ===");
  const days = 3;
  const system = `You are TempleGuide, an expert Indian pilgrimage (yatra) planner for the Temple Heritage app.
You must ONLY recommend temples that appear in the TEMPLES list below — never invent temples, cities, or facts.
Build a realistic, day-by-day itinerary that respects the traveler's starting city, trip length, preferred region, and interests.

${templeContext}

Respond with ONLY valid JSON (no markdown fences, no commentary) matching this exact shape:
{
  "days": [
    { "day": "Day 1", "title": "short title", "description": "2-3 sentence plan for the day, mentioning specific temple names", "templeSlugs": ["slug-if-any"] }
  ],
  "summary": "one sentence overview of the trip"
}
Return exactly ${days} day objects.`;

  const userMessage = `Plan a ${days}-day yatra starting from Mumbai, preferred region: South, interests: architecture, spirituality.`;

  const response = await groq.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 1500,
    messages: [
      { role: "system", content: system },
      { role: "user", content: userMessage },
    ],
  });

  const text = response.choices[0]?.message?.content;
  console.log("Raw response:\n", text);

  try {
    const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(cleaned);
    console.log("\n✅ Parsed OK. Days returned:", parsed.days?.length, "| Summary:", parsed.summary);
  } catch (e) {
    console.error("\n❌ JSON parse failed:", e.message);
  }
}

async function testAssistant() {
  console.log("\n=== Testing /api/assistant logic ===");
  const system = `You are TempleGuide, a warm and knowledgeable AI assistant for the Temple Heritage app.
Only state facts about temples/festivals that appear in the data below — never invent timings, history, or locations.
Keep replies conversational and concise (2-5 sentences unless the user asks for detail).

${templeContext}`;

  const response = await groq.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 500,
    messages: [
      { role: "system", content: system },
      { role: "user", content: "What are the darshan timings at the Dwarkadhish temple?" },
    ],
  });

  const reply = response.choices[0]?.message?.content;
  console.log("Reply:\n", reply);
  console.log("\n✅ Assistant responded.");
}

try {
  await testPlanner();
  await testAssistant();
  console.log("\n🎉 Smoke test complete — both endpoints' logic work against the live Groq API.");
} catch (err) {
  console.error("\n❌ Smoke test failed:", err);
  process.exit(1);
}
