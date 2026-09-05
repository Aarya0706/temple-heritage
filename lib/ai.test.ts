import { describe, it, expect } from "vitest";
import { normalizeAssistantLanguage } from "./ai";

describe("normalizeAssistantLanguage", () => {
  it("passes through 'hi'", () => {
    expect(normalizeAssistantLanguage("hi")).toBe("hi");
  });

  it("passes through 'en'", () => {
    expect(normalizeAssistantLanguage("en")).toBe("en");
  });

  it("falls back to 'en' for anything else", () => {
    expect(normalizeAssistantLanguage("fr")).toBe("en");
    expect(normalizeAssistantLanguage(undefined)).toBe("en");
    expect(normalizeAssistantLanguage(null)).toBe("en");
    expect(normalizeAssistantLanguage(42)).toBe("en");
    expect(normalizeAssistantLanguage("")).toBe("en");
  });
});
