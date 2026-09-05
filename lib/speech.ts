// Maps the assistant's reply-language toggle to a BCP-47 locale for the
// Web Speech API's SpeechRecognition.lang. Kept separate from
// lib/ai.ts's AssistantLanguage so this stays a plain client-safe module
// with no server-only imports (groq-sdk, env reads) pulled into the
// browser bundle.
export type SpeechLanguage = "en" | "hi";

export function speechRecognitionLang(language: SpeechLanguage): string {
  return language === "hi" ? "hi-IN" : "en-IN";
}
