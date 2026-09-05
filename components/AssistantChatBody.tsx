import { Send, Sparkles, Loader2, Mic, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { SUGGESTIONS, type Message, type Language } from "@/lib/useAssistantChat";

type AssistantChatBodyProps = {
  language: Language;
  messages: Message[];
  loading: boolean;
  input: string;
  setInput: (value: string) => void;
  listening: boolean;
  speechSupported: boolean;
  toggleListening: () => void;
  displayText: (message: Message) => string;
  send: (e: React.FormEvent) => void;
};

export function AssistantChatBody({
  language,
  messages,
  loading,
  input,
  setInput,
  listening,
  speechSupported,
  toggleListening,
  displayText,
  send,
}: AssistantChatBodyProps) {
  return (
    <>
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
          background: "linear-gradient(180deg, #fffaf4 0%, #fff7ef 100%)",
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
              {SUGGESTIONS[language].map((s) => (
                <button
                  key={s.prompt}
                  type="button"
                  onClick={() => setInput(s.prompt)}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "78%",
              padding: "14px 20px",
              borderRadius: "18px",
              lineHeight: 1.6,
              fontSize: "16px",
              background: message.role === "user" ? "#a52d15" : "#ffffff",
              color: message.role === "user" ? "#ffffff" : "#674b41",
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
                  <p style={{ margin: "4px 0 10px", lineHeight: 1.65 }}>
                    {children}
                  </p>
                ),

                strong: ({ children }) => (
                  <strong style={{ color: "#7d2114", fontWeight: 700 }}>
                    {children}
                  </strong>
                ),

                ul: ({ children }) => (
                  <ul style={{ margin: "8px 0 12px", paddingLeft: "22px" }}>
                    {children}
                  </ul>
                ),

                ol: ({ children }) => (
                  <ol style={{ margin: "8px 0 12px", paddingLeft: "22px" }}>
                    {children}
                  </ol>
                ),

                li: ({ children }) => (
                  <li style={{ marginBottom: "7px", lineHeight: 1.55 }}>
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
              {displayText(message)}
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
              border: "1px solid rgba(112, 38, 22, 0.14)",
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
          borderTop: "1px solid rgba(112, 38, 22, 0.12)",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            listening ? "Listening..." : "Ask: best Shiva temples near Mumbai..."
          }
          disabled={loading}
          style={{
            flex: 1,
            minWidth: 0,
            height: "46px",
            padding: "0 20px",
            border: "1px solid rgba(112, 38, 22, 0.16)",
            borderRadius: "999px",
            background: "#fffaf4",
            outline: "none",
            fontSize: "16px",
            color: "#674b41",
          }}
        />

        {speechSupported && (
          <button
            type="button"
            onClick={toggleListening}
            disabled={loading}
            aria-label={listening ? "Stop voice input" : "Ask by voice"}
            aria-pressed={listening}
            title={listening ? "Stop voice input" : "Ask by voice"}
            style={{
              width: "46px",
              height: "46px",
              flex: "0 0 46px",
              border: listening ? "none" : "1px solid rgba(112, 38, 22, 0.16)",
              borderRadius: "50%",
              background: listening ? "#a52d15" : "#fffaf4",
              color: listening ? "#ffffff" : "#a52d15",
              display: "grid",
              placeItems: "center",
              cursor: loading ? "default" : "pointer",
              animation: listening ? "mic-pulse 1.4s ease-in-out infinite" : "none",
            }}
          >
            {listening ? <Square size={16} /> : <Mic size={18} />}
          </button>
        )}

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
            boxShadow: "0 8px 20px rgba(165, 45, 21, 0.22)",
          }}
        >
          <Send size={17} />
        </button>
      </form>
    </>
  );
}
