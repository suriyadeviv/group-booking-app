import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Define the base ESLint configuration
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Add rule to ignore unused arguments that start with an underscore
  {
    files: ["**/*.ts", "**/*.tsx"], // Apply to TypeScript files
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn", 
        { "argsIgnorePattern": "^_" }
      ], // Ignore unused arguments that start with an underscore
    },
  },
  
  // Use the `overrides` property inside flat config (as flat config doesn't support overrides directly)
  {
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/*.test.[jt]s?(x)"], // Target test files
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable `any` for test files
      "@typescript-eslint/no-require-imports": "off", // Disable `require` imports for test files
      "@next/next/no-img-element": "off", // Disable the no-img-element rule for test files
    },
  },
];

export default eslintConfig;
