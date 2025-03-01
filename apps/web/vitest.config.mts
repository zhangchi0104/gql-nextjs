import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    watch: false,
    // temporary fix for next-auth
    // source: https://github.com/nextauthjs/next-auth/discussions/9385#discussioncomment-11064988
    server: {
      deps: { inline: ["next"] },
    },
  },
});
