"use client";

import { FormEvent, useState } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";

type Message = { role: "user" | "ai"; text: string };

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Namaste! 🪷 I'm TempleGuide. Ask me about temples, festivals, darshan, or planning a pilgrimage." },
  ]);

  async function send(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setMessages((m) => [...m, { role: "ai", text: data.reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "ai", text: err instanceof Error ? `⚠️ ${err.message}` : "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ TempleGuide AI</div>
        <h1>Ask the Temple Assistant</h1>
        <p>Ask questions in natural language — answers are grounded in our real temple and festival data.</p>
      </section>

      <section className="section section-light">
        <div className="chat-box">
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role === "user" ? "user" : "ai"}`}>
                {message.role === "ai" && <Sparkles size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />}
                {message.text}
              </div>
            ))}
            {loading && (
              <div className="message ai">
                <Loader2 size={14} className="spin" style={{ marginRight: 6, verticalAlign: "middle" }} />
                Thinking...
              </div>
            )}
          </div>
          <form className="chat-input" onSubmit={send}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask: best Shiva temples near Mumbai..."
              disabled={loading}
            />
            <button className="explore-btn" type="submit" aria-label="Send" disabled={loading}>
              <Send size={17} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
