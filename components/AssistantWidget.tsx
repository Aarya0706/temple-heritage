"use client";

import { usePathname } from "next/navigation";
import { Maximize2, Minimize2, X } from "lucide-react";
import { useAssistantChat, type Language } from "@/lib/useAssistantChat";
import { AssistantChatBody } from "@/components/AssistantChatBody";
import { useState } from "react";

type WidgetMode = "closed" | "popup" | "fullscreen";

export function AssistantWidget() {
  const pathname = usePathname();
  const [mode, setMode] = useState<WidgetMode>("closed");
  const chat = useAssistantChat();

  // The dedicated /assistant page already gives the full experience —
  // skip the floating launcher there so it isn't pointing at itself.
  if (pathname === "/assistant") return null;

  if (mode === "closed") {
    return (
      <button
        type="button"
        className="floating-chat"
        aria-label="Open Temple AI Assistant"
        onClick={() => setMode("popup")}
      >
        🤖
      </button>
    );
  }

  const isFullscreen = mode === "fullscreen";

  return (
    <div className={isFullscreen ? "assistant-widget-fullscreen" : "assistant-widget-popup"}>
      <div className="assistant-widget-header">
        <span className="assistant-widget-title">✦ TempleGuide AI</span>

        <div className="assistant-widget-header-actions">
          <div
            role="group"
            aria-label="Reply language"
            className="assistant-widget-lang-toggle"
          >
            {(["en", "hi"] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => chat.setLanguage(lang)}
                aria-pressed={chat.language === lang}
                className={chat.language === lang ? "is-active" : ""}
              >
                {lang === "en" ? "EN" : "हि"}
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label={isFullscreen ? "Collapse to popup" : "Expand to fullscreen"}
            title={isFullscreen ? "Collapse to popup" : "Expand to fullscreen"}
            className="assistant-widget-icon-btn"
            onClick={() => setMode(isFullscreen ? "popup" : "fullscreen")}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button
            type="button"
            aria-label="Close assistant"
            title="Close"
            className="assistant-widget-icon-btn"
            onClick={() => setMode("closed")}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="assistant-widget-body">
        <AssistantChatBody {...chat} />
      </div>
    </div>
  );
}
