import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

const emptyModule = fileURLToPath(new URL("./vitest/empty-module.ts", import.meta.url));

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      // Server Actions transitively import these markers; stub them under jsdom.
      "server-only": emptyModule,
      "client-only": emptyModule,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      exclude: [
        "node_modules",
        ".next",
        "tests/e2e",
        "**/*.d.ts",
        "src/app/layout.tsx",
        "src/app/page.tsx",
        "vitest.setup.ts",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
      },
    },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
