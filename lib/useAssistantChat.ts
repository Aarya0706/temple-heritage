import { FormEvent, useEffect, useRef, useState } from "react";
import { speechRecognitionLang } from "@/lib/speech";

// The Web Speech API's SpeechRecognition is a long-standing browser
// feature (Chrome/Edge/Safari via the webkit-prefixed constructor) but
// still isn't part of TypeScript's DOM lib, so the shapes below are
// declared locally rather than pulled from an @types package.
interface SpeechRecognitionAlternative {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternative;
  isFinal: boolean;
}
interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}
interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
}

export type Message = {
  role: "user" | "ai";
  text: string;
};

export type Language = "en" | "hi";

// Sentinel so the greeting bubble re-renders in the newly selected
// language even after the toggle is flipped, without needing to reset
// or rewrite the rest of the conversation history.
export const GREETING_SENTINEL = "__greeting__";

export const GREETING: Record<Language, string> = {
  en: "Namaste! 🪷 I'm TempleGuide. Ask me about temples, festivals, darshan, or planning a pilgrimage.",
  hi: "नमस्ते! 🪷 मैं TempleGuide हूँ। मुझसे मंदिरों, त्योहारों, दर्शन या तीर्थयात्रा की योजना के बारे में पूछें।",
};

export const SUGGESTIONS: Record<
  Language,
  { emoji: string; label: string; prompt: string }[]
> = {
  en: [
    {
      emoji: "🛕",
      label: "Best Shiva temples near Mumbai",
      prompt: "What are the best Shiva temples near Mumbai?",
    },
    {
      emoji: "🗺️",
      label: "Plan a 2-day pilgrimage to Ujjain",
      prompt: "Plan a 2-day pilgrimage to Ujjain",
    },
    {
      emoji: "🎉",
      label: "Famous temple festivals",
      prompt: "Which Indian temples are famous for their festivals?",
    },
    {
      emoji: "🕉️",
      label: "Explore Jyotirlingas",
      prompt: "Tell me about the important Jyotirlinga temples",
    },
  ],
  hi: [
    {
      emoji: "🛕",
      label: "मुंबई के पास सर्वश्रेष्ठ शिव मंदिर",
      prompt: "मुंबई के पास सबसे अच्छे शिव मंदिर कौन से हैं?",
    },
    {
      emoji: "🗺️",
      label: "उज्जैन की 2-दिवसीय तीर्थयात्रा",
      prompt: "उज्जैन के लिए 2 दिन की तीर्थयात्रा की योजना बनाएं",
    },
    {
      emoji: "🎉",
      label: "प्रसिद्ध मंदिर त्योहार",
      prompt: "कौन से भारतीय मंदिर अपने त्योहारों के लिए प्रसिद्ध हैं?",
    },
    {
      emoji: "🕉️",
      label: "ज्योतिर्लिंग के बारे में जानें",
      prompt: "महत्वपूर्ण ज्योतिर्लिंग मंदिरों के बारे में बताएं",
    },
  ],
};

export function useAssistantChat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    setSpeechSupported(!!getSpeechRecognitionCtor());
    // Stop any in-flight recognition if the component unmounts mid-listen.
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function toggleListening() {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = speechRecognitionLang(language);
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: GREETING_SENTINEL,
    },
  ]);

  function displayText(message: Message): string {
    return message.text === GREETING_SENTINEL
      ? GREETING[language]
      : message.text;
  }

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
          messages: nextMessages.map((m) => ({
            role: m.role,
            text: displayText(m),
          })),
          language,
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

  return {
    input,
    setInput,
    loading,
    language,
    setLanguage,
    listening,
    speechSupported,
    toggleListening,
    messages,
    displayText,
    send,
  };
}
