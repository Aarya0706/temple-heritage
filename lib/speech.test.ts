import { describe, it, expect } from "vitest";
import { speechRecognitionLang } from "./speech";

describe("speechRecognitionLang", () => {
  it("maps 'hi' to Hindi (India) locale", () => {
    expect(speechRecognitionLang("hi")).toBe("hi-IN");
  });

  it("maps 'en' to English (India) locale", () => {
    expect(speechRecognitionLang("en")).toBe("en-IN");
  });
});
