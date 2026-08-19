 "use client";

import { FormEvent, useState } from "react";
import { Send, Sparkles } from "lucide-react";

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Namaste! 🪷 I’m TempleGuide. Ask me about temples, festivals, darshan, or planning a pilgrimage." }
  ]);

  function send(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "ai", text: `For “${text}”, I’d suggest starting with our temple directory and Yatra Planner. The next version can connect this chat to a real AI model and live temple database.` }
    ]);
    setInput("");
  }

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ TempleGuide AI</div>
        <h1>Ask the Temple Assistant</h1>
        <p>Ask questions in natural language. The interface is ready for a real LLM integration.</p>
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
          </div>
          <form className="chat-input" onSubmit={send}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask: best Shiva temples near Mumbai..." />
            <button className="explore-btn" type="submit" aria-label="Send"><Send size={17} /></button>
          </form>
        </div>
      </section>
    </main>
  );
}
