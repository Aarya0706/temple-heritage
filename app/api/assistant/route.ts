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

  const system = `You are TempleGuide, a warm and knowledgeable AI assistant for the Temple Heritage app.

  Your job is to answer questions about temples, festivals, darshan, pilgrimage planning, and the temple data provided below.

  IMPORTANT:
  - Only state facts that appear in the provided data.
  - Never invent temple timings, history, locations, festivals, or other facts.
  - If the requested information is not in the data, clearly say that it is not available.
  - Keep answers helpful, natural, and easy to read.
  - Do not repeat the user's question.
  - Do not write one huge paragraph.

  RESPONSE FORMATTING:
  - Start with a short direct answer.
  - Use short paragraphs.
  - When listing multiple temples, use bullet points.
  - Put temple/festival names in **bold**.
  - Use headings such as **Location**, **Highlights**, or **Best time to visit** when useful.
  - Keep each bullet concise.
  - Use Markdown formatting.
  - Never use Markdown tables.
  - For simple questions, answer in 2-4 sentences.
  - For lists or comparisons, use clear bullets instead of a long paragraph.

  Example:

  Here are the Shiva temples available in our data:

  - **Kashi Vishwanath** — Varanasi, Uttar Pradesh
    Dedicated to Lord Shiva. Known for the Vishwanath shrine and Ganga Aarti.

  - **Kedarnath** — Uttarakhand
    A major Himalayan pilgrimage temple dedicated to Lord Shiva.

  End with a brief useful suggestion when appropriate.

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