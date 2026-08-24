import { NextRequest, NextResponse } from "next/server";
import { groq, AI_MODEL } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";
import { createClient } from "@/lib/supabase/server";
import { temples } from "@/data/temples";
import { buildTempleChunks } from "@/lib/rag/chunkTemple";
import { rankChunks } from "@/lib/rag/tfidf";

export const runtime = "nodejs";

const RATE_LIMIT = 12;
const RATE_WINDOW_MS = 60_000;
const TOP_K = 5;

// Below this cosine similarity, treat retrieval as "nothing relevant found"
// and skip the LLM call entirely rather than let it improvise an answer
// with weak context.
const MIN_RELEVANCE = 0.05;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const ip = getClientIp(req);

  const rate = checkRateLimit(`temple-ask:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "You're asking a little too quickly. Please wait a moment and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000)).toString(),
        },
      }
    );
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is missing. Add it to your .env.local file and restart the server." },
      { status: 500 }
    );
  }

  const temple = temples.find((t) => t.slug === slug);
  if (!temple) {
    return NextResponse.json({ error: "Unknown temple." }, { status: 404 });
  }

  let body: { question?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return NextResponse.json({ error: "Please ask a question." }, { status: 400 });
  }
  if (question.length > 400) {
    return NextResponse.json({ error: "Please keep questions under 400 characters." }, { status: 400 });
  }

  try {
    // Pull this temple's published reviews for the retrieval corpus. Same
    // table ReviewsSection already reads from — no scraping, no separate
    // ingestion job needed.
    const supabase = await createClient();
    const { data: reviews } = await supabase
      .from("temple_reviews")
      .select("rating, review_text, reviewer_name")
      .eq("temple_slug", slug)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(30);

    const chunks = buildTempleChunks(temple, reviews ?? []);
    const ranked = rankChunks(chunks, question, TOP_K);
    const relevant = ranked.filter((r) => r.score >= MIN_RELEVANCE);

    if (relevant.length === 0) {
      return NextResponse.json({
        answer: `I don't have information about that for ${temple.name} yet. Try asking about its history, timings, highlights, how to get there, or what visitors have said.`,
        sources: [],
      });
    }

    const context = relevant
      .map((r) => `[${r.chunk.section}] ${r.chunk.text}`)
      .join("\n\n");

    const completion = await groq.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content:
            `You are a knowledgeable, friendly guide for ${temple.name}. ` +
            `Answer the visitor's question using ONLY the CONTEXT provided below. ` +
            `If the context doesn't contain the answer, say plainly that you don't have that information — ` +
            `never invent timings, history, rituals, or logistics. ` +
            `If you draw on a visitor review, make clear it's a visitor's personal experience, not an official fact. ` +
            `Keep the answer conversational and under 4 sentences.`,
        },
        {
          role: "user",
          content: `CONTEXT:\n${context}\n\nQUESTION: ${question}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 400,
    });

    const answer =
      completion.choices?.[0]?.message?.content?.trim() ||
      "I couldn't generate an answer just now — please try again.";

    return NextResponse.json({
      answer,
      sources: relevant.map((r) => r.chunk.section),
    });
  } catch (err: unknown) {
    console.error("Temple Ask AI error:", err);

    const status =
      typeof err === "object" && err !== null && "status" in err
        ? Number((err as { status?: number }).status)
        : 500;

    if (status === 429) {
      return NextResponse.json(
        { error: "The AI service is temporarily busy. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    if (status === 401 || status === 403) {
      return NextResponse.json(
        { error: "Your Groq API key is invalid or does not have permission to use this model." },
        { status }
      );
    }

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? String((err as { message?: unknown })?.message ?? "AI request failed.")
            : "AI request failed. Please try again in a moment.",
      },
      { status: 502 }
    );
  }
}
