"use client";

import { FormEvent, useState } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Namaste! 🪷 I'm TempleGuide. Ask me about temples, festivals, darshan, or planning a pilgrimage.",
    },
  ]);

  async function send(e: FormEvent) {
    e.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", text },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: data.reply,
        },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text:
            err instanceof Error
              ? `⚠️ ${err.message}`
              : "⚠️ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="page-hero">
        <div
          className="eyebrow"
          style={{ color: "#ffc05a" }}
        >
          ✦ TempleGuide AI
        </div>

        <h1>Ask the Temple Assistant</h1>

        <p>
          Ask questions in natural language — answers are grounded in
          our real temple and festival data.
        </p>
      </section>

      <section
        className="section section-light"
        style={{
          paddingTop: "25px",
          paddingBottom: "35px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            minHeight: "280px",
            maxHeight: "560px",
            height: "auto",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            background: "#fffaf4",
            border: "1px solid rgba(112, 38, 22, 0.14)",
            borderRadius: "28px",
            overflow: "hidden",
            boxShadow: "0 18px 45px rgba(78, 24, 13, 0.10)",
          }}
        >
          {/* MESSAGES */}
          <div
            style={{
              flex: "1 1 auto",
              minHeight: 0,
              overflowY: "auto",
              padding: "18px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              background:
                "linear-gradient(180deg, #fffaf4 0%, #fff7ef 100%)",
            }}

            
          >
            {messages.length === 1 && !loading && (
              <div className="assistant-suggestions">
                <div className="assistant-suggestions-title">
                  ✦ Explore with TempleGuide
                </div>

                <p className="assistant-suggestions-subtitle">
                  Try one of these questions to get started
                </p>

                <div className="suggestion-grid">
                  <button
                    type="button"
                    onClick={() =>
                      setInput("What are the best Shiva temples near Mumbai?")
                    }
                  >
                    🛕 Best Shiva temples near Mumbai
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setInput("Plan a 2-day pilgrimage to Ujjain")
                    }
                  >
                    🗺️ Plan a 2-day pilgrimage to Ujjain
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setInput("Which Indian temples are famous for their festivals?")
                    }
                  >
                    🎉 Famous temple festivals
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setInput("Tell me about the important Jyotirlinga temples")
                    }
                  >
                    🕉️ Explore Jyotirlingas
                  </button>
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  alignSelf:
                    message.role === "user"
                      ? "flex-end"
                      : "flex-start",
                  maxWidth: "78%",
                  padding: "14px 20px",
                  borderRadius: "18px",
                  lineHeight: 1.6,
                  fontSize: "16px",
                  background:
                    message.role === "user"
                      ? "#a52d15"
                      : "#ffffff",
                  color:
                    message.role === "user"
                      ? "#ffffff"
                      : "#674b41",
                  border:
                    message.role === "user"
                      ? "none"
                      : "1px solid rgba(112, 38, 22, 0.14)",
                  boxShadow:
                    message.role === "user"
                      ? "none"
                      : "0 5px 15px rgba(78, 24, 13, 0.05)",
                }}
              >
                {message.role === "ai" && (
                  <Sparkles
                    size={14}
                    style={{
                      marginRight: 6,
                      verticalAlign: "middle",
                    }}
                  />
                )}

                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p
                        style={{
                          margin: "4px 0 10px",
                          lineHeight: 1.65,
                        }}
                      >
                        {children}
                      </p>
                    ),

                    strong: ({ children }) => (
                      <strong
                        style={{
                          color: "#7d2114",
                          fontWeight: 700,
                        }}
                      >
                        {children}
                      </strong>
                    ),

                    ul: ({ children }) => (
                      <ul
                        style={{
                          margin: "8px 0 12px",
                          paddingLeft: "22px",
                        }}
                      >
                        {children}
                      </ul>
                    ),

                    ol: ({ children }) => (
                      <ol
                        style={{
                          margin: "8px 0 12px",
                          paddingLeft: "22px",
                        }}
                      >
                        {children}
                      </ol>
                    ),

                    li: ({ children }) => (
                      <li
                        style={{
                          marginBottom: "7px",
                          lineHeight: 1.55,
                        }}
                      >
                        {children}
                      </li>
                    ),

                    h3: ({ children }) => (
                      <h3
                        style={{
                          margin: "12px 0 8px",
                          color: "#6f1a10",
                          fontFamily: '"Playfair Display", serif',
                          fontSize: "21px",
                        }}
                      >
                        {children}
                      </h3>
                    ),

                    h4: ({ children }) => (
                      <h4
                        style={{
                          margin: "10px 0 6px",
                          color: "#7d2114",
                          fontSize: "17px",
                        }}
                      >
                        {children}
                      </h4>
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            ))}

            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  maxWidth: "78%",
                  padding: "14px 20px",
                  borderRadius: "18px",
                  background: "#ffffff",
                  color: "#674b41",
                  border:
                    "1px solid rgba(112, 38, 22, 0.14)",
                }}
              >
                <Loader2
                  size={14}
                  className="spin"
                  style={{
                    marginRight: 6,
                    verticalAlign: "middle",
                  }}
                />
                Thinking...
              </div>
            )}
          </div>

          {/* INPUT */}
          <form
            onSubmit={send}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 18px",
              background: "#fffdf9",
              borderTop:
                "1px solid rgba(112, 38, 22, 0.12)",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask: best Shiva temples near Mumbai..."
              disabled={loading}
              style={{
                flex: 1,
                minWidth: 0,
                height: "46px",
                padding: "0 20px",
                border:
                  "1px solid rgba(112, 38, 22, 0.16)",
                borderRadius: "999px",
                background: "#fffaf4",
                outline: "none",
                fontSize: "16px",
                color: "#674b41",
              }}
            />

            <button
              type="submit"
              aria-label="Send"
              disabled={loading}
              style={{
                width: "52px",
                height: "52px",
                flex: "0 0 52px",
                border: "none",
                borderRadius: "50%",
                background: "#a52d15",
                color: "#ffffff",
                display: "grid",
                placeItems: "center",
                boxShadow:
                  "0 8px 20px rgba(165, 45, 21, 0.22)",
              }}
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}