"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
};

export default function TempleAskWidget({
  templeSlug,
  templeName,
}: {
  templeSlug: string;
  templeName: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function askQuestion(question: string) {
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/temples/${templeSlug}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer, sources: data.sources ?? [] },
      ]);
    } catch {
      setError("Couldn't reach the assistant. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;
    askQuestion(q);
  }

  const suggestions = [
    "What are the visiting hours?",
    "What's the best time of year to visit?",
    "What do visitors say about this place?",
  ];

  return (
    <section className="detail-section" id="ask-ai">
      <div className="eyebrow">✦ Ask About This Temple</div>
      <h2>
        <Sparkles size={20} style={{ verticalAlign: "middle", marginRight: 8 }} />
        Ask the {templeName} guide
      </h2>
      <p style={{ color: "#705d55", marginBottom: 20 }}>
        Answers are grounded in {templeName}&apos;s curated details and visitor reviews —
        not a general model guess.
      </p>

      <div
        style={{
          border: "1px solid #e8d9cd",
          borderRadius: 14,
          background: "#fffaf6",
          overflow: "hidden",
        }}
      >
        {messages.length > 0 && (
          <div
            ref={scrollRef}
            style={{
              maxHeight: 360,
              overflowY: "auto",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                }}
              >
                <div
                  style={{
                    background: m.role === "user" ? "#a52d15" : "#f3e6db",
                    color: m.role === "user" ? "#fff" : "#3a2a22",
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontSize: 14.5,
                    lineHeight: 1.5,
                  }}
                >
                  {m.text}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div
                    style={{
                      marginTop: 6,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {m.sources.map((s, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: 11.5,
                          color: "#9b6958",
                          background: "#fbeee5",
                          border: "1px solid #eeded2",
                          borderRadius: 999,
                          padding: "2px 9px",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", color: "#9b6958", fontSize: 14 }}>
                Thinking…
              </div>
            )}
          </div>
        )}

        {messages.length === 0 && (
          <div style={{ padding: "18px 20px 4px", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => askQuestion(s)}
                style={{
                  fontSize: 13,
                  color: "#8c2416",
                  background: "#fbeee5",
                  border: "1px solid #eeded2",
                  borderRadius: 999,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: 8,
            padding: 14,
            borderTop: messages.length > 0 ? "1px solid #eeded2" : "none",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${templeName}...`}
            maxLength={400}
            style={{
              flex: 1,
              border: "1px solid #e8d9cd",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 14.5,
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary"
            style={{
              background: "#a52d15",
              color: "white",
              opacity: loading || !input.trim() ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Send size={15} />
            Ask
          </button>
        </form>

        {error && (
          <p style={{ color: "#a5661a", fontSize: 13.5, padding: "0 14px 14px" }}>{error}</p>
        )}
      </div>
    </section>
  );
}
