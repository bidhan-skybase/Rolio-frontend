// .eslintrc.js or eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Required for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Enable compatibility with classic ESLint extends
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend Next.js recommended configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Ignore build folders and environment files
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],

    // General rules - you can customize as needed
    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "warn", // warn instead of error
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // React
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",

      // Next.js
      "@next/next/no-img-element": "warn",

      // General JS
      "no-console": "warn",
      "no-unused-vars": [
        "warn",
        { vars: "all", args: "after-used", ignoreRestSiblings: true },
      ],
    },

    overrides: [
      {
        files: ["*.ts", "*.tsx"],
        rules: {
          "no-undef": "off", // TypeScript already checks types
        },
      },
    ],
  },
];

export default eslintConfig;
