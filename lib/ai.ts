import Groq from "groq-sdk";
import { temples } from "@/data/temples";
import { festivals } from "@/data/festivals";

// Single shared client. Reads GROQ_API_KEY from the environment automatically.
// A placeholder fallback prevents the SDK from throwing at module-load time
// (e.g. during `next build`, or on Vercel before env vars are configured) —
// routes check for the real key before ever calling the client.
export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "placeholder-build-key" });

// Free-tier friendly, strong general-purpose model. Swap for another Groq
// model (e.g. "openai/gpt-oss-120b") if you want to compare quality/speed.
export const AI_MODEL = "openai/gpt-oss-120b";

// Supported reply languages for the Temple Assistant chat. Kept as a
// narrow union (not a generic string) so an invalid value from the client
// falls back to English instead of silently confusing the model.
export type AssistantLanguage = "en" | "hi";

export function normalizeAssistantLanguage(value: unknown): AssistantLanguage {
  return value === "hi" ? "hi" : "en";
}

// A compact, token-cheap serialization of the site's structured data.
// This is what "grounds" the AI in real temples/festivals instead of letting it hallucinate.
export function buildTempleContext() {
  const templeLines = temples
    .map(
      (t) =>
        `- ${t.name} (slug: ${t.slug}) | Deity: ${t.deity} | ${t.city}, ${t.state} (${t.region}) | Type: ${t.type} | Timing: ${t.timing} | Best time: ${t.bestTime} | Highlights: ${t.highlights.join(", ")} | ${t.shortDescription}` +
        (t.accessNotes ? `\n  ACCESS NOTES (hard logistics facts - respect these exactly): ${t.accessNotes}` : "")
    )
    .join("\n");

  const festivalLines = festivals
    .map((f) => `- ${f.name} (${f.month}) | ${f.place} | ${f.note}`)
    .join("\n");

  return `TEMPLES (only real destinations you may reference or recommend):\n${templeLines}\n\nFESTIVALS:\n${festivalLines}`;
}
