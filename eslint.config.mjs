import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/ban-ts-comment": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/refs": "off",
    "react-hooks/set-state-in-effect": "off",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-unreachable": "error",
    "no-redeclare": "error",
    "prefer-const": "warn",
    "no-console": "warn",
    "no-debugger": "error",
  },
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
}];

export default eslintConfig;
