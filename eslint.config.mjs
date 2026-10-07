import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendor + the nested Orazaka engine (separate project, mid-refactor —
    // also excluded from tsconfig). Linting these polluted the gate with
    // thousands of vendored/generated issues and can never be "clean".
    "node_modules/**",
    "products/**",
  ]),
  {
    // no-explicit-any downgraded to a warning: pragmatic in MDX/React glue code
    // where props are structurally dynamic. The storefront code we author is
    // typed. (set-state-in-effect is handled with local disables at the few
    // legitimate client-hydration sites.)
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

// Every user-facing string comes from messages/<locale>.json (lib/i18n.ts): a component never
// chooses its text with `locale === "fr" ? … : …`. Only routing code compares locales.
eslintConfig.push(
  {
    files: ["app/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
    ignores: ["lib/i18n.ts", "lib/seo.ts", "app/[[]locale[]]/layout.tsx", "app/components/I18nProvider.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ConditionalExpression[test.type='BinaryExpression'][test.right.value=/^(fr|en)$/]",
          message: "Put the text in messages/en.json + messages/fr.json and read it from the dictionary (t.…).",
        },
        {
          selector: "ConditionalExpression > Identifier.test[name=/^(isFr|isEn|fr)$/]",
          message: "Put the text in messages/en.json + messages/fr.json and read it from the dictionary (t.…).",
        },
      ],
    },
  },
);

export default eslintConfig;
