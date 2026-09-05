"use client";

import { useAssistantChat, type Language } from "@/lib/useAssistantChat";
import { AssistantChatBody } from "@/components/AssistantChatBody";

export default function AssistantPage() {
  const chat = useAssistantChat();

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>
          ✦ TempleGuide AI
        </div>

        <h1>Ask the Temple Assistant</h1>

        <p>
          Ask questions in natural language — answers are grounded in our
          real temple and festival data.
        </p>

        <div
          role="group"
          aria-label="Reply language"
          style={{
            display: "inline-flex",
            marginTop: 16,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 999,
            padding: 4,
            gap: 4,
          }}
        >
          {(["en", "hi"] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => chat.setLanguage(lang)}
              aria-pressed={chat.language === lang}
              style={{
                border: "none",
                cursor: "pointer",
                padding: "6px 16px",
                borderRadius: 999,
                fontSize: 13.5,
                fontWeight: 600,
                background: chat.language === lang ? "#ffc05a" : "transparent",
                color: chat.language === lang ? "#5a2a10" : "#fff",
                transition: "background 0.15s ease",
              }}
            >
              {lang === "en" ? "English" : "हिंदी"}
            </button>
          ))}
        </div>
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
          <AssistantChatBody {...chat} />
        </div>
      </section>
    </main>
  );
}
