import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next"],
  },
  resolve: {
    // Mirrors the "@/*" -> "./*" path alias in tsconfig.json so tests can
    // import with the same "@/lib/..." paths the app code uses.
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});