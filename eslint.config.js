import js from "@eslint/js";
import globals from "globals";

const vitestGlobals = {
  describe: "readonly",
  it: "readonly",
  expect: "readonly",
  vi: "readonly",
  beforeEach: "readonly",
  afterEach: "readonly",
};

export default [
  {
    ignores: ["app.js", "docs", "dist", "node_modules", "coverage", "playwright-report", "test-results"],
  },
  {
    files: ["**/*.js"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        ...vitestGlobals,
      },
    },
  },
];
