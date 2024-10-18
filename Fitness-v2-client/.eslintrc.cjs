/** @type {import("eslint").Linter.Config} */
const path = require("path");
const config = {
  root: true,
  env: { browser: true, es2020: true },

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: path.resolve(__dirname, "tsconfig.app.json"), // Ensure it points to your tsconfig file
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    // "plugin:vitest/recommended",
  ],
  ignorePatterns: [
    "dist",
    ".eslintrc.cjs",
    "prettier.config.js",
    "vite.config.ts",
    "vitest.config.ts",
    "tailwind.config.js",
  ],
  plugins: ["react-refresh", "@typescript-eslint", "vitest"],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
  },
  // Add the overrides section
  overrides: [
    {
      // Apply these settings to all test files
      files: [
        "**/*.test.{ts,tsx}",
        "**/__tests__/**/*.{ts,tsx}",
        "**/test/**/*.{ts,tsx}",
      ],
      env: {
        node: true,
      },
      globals: {
        it: "readonly",
        describe: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "no-empty": "off",
        "@typescript-eslint/no-empty-function": "off",

        // Adjust other rules as needed
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/dot-notation": "off",
        "@typescript-eslint/consistent-type-imports": "off",
      },
    },
    {
      files: ["api/**/*.ts"],
      env: {
        node: true,
      },
      parserOptions: {
        project: path.resolve(__dirname, "tsconfig.api.json"),
      },
      rules: {},
    },
  ],
};

module.exports = config;
