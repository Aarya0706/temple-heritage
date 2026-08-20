import { NextRequest, NextResponse } from "next/server";
import { groq, AI_MODEL, buildTempleContext } from "@/lib/ai";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

export async function POST(req: NextRequest) {
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
