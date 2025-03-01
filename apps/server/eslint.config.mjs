import { config } from "@repo/eslint-config/base";
/** @type {import("eslint").Linter.Config} */
const eslintConfig = [
  ...config,
  { ignores: ["vitest.config.ts", "dist/**/*", "src/__generated__/**/*"] },
];

export default eslintConfig;
