import { NextRequest, NextResponse } from "next/server";
import { groq, AI_MODEL, buildTempleContext } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

// Chat gets a bit more headroom than the planner since a real conversation
// is several back-and-forth turns, not one request.
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000; // 1 minute

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`assistant:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "You're sending messages a little too fast — please wait a moment and try again." },
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

  let body: { messages: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const system = `You are TempleGuide, a warm and knowledgeable AI assistant for the Temple Heritage app, which helps travelers discover Indian temples, festivals, darshan timings, and pilgrimage (yatra) planning.
Only state facts about temples/festivals that appear in the data below — never invent timings, history, or locations. If asked about something not covered, say so honestly and suggest the Yatra Planner or Temple Explorer instead.
Keep replies conversational and concise (2-5 sentences unless the user asks for detail).

${buildTempleContext()}`;

  // Map the app's {role: "ai"|"user"} shape to the API's {role: "assistant"|"user"} shape,
  // and prepend the system prompt as Groq (OpenAI-style) expects it in the messages array.
  const apiMessages = [
    { role: "system" as const, content: system },
    ...messages.map((m) => ({
      role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
      content: m.text,
    })),
  ];

  try {
    const response = await groq.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 500,
      messages: apiMessages,
    });

    const reply = response.choices[0]?.message?.content ?? "I couldn't generate a response — please try again.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Assistant AI error:", err);
    return NextResponse.json({ error: "AI request failed. Please try again in a moment." }, { status: 502 });
  }
}