// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/*.js"],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "indent": ["error", 4],
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
    },
  },
  {
    files: ["test/**/*.test.ts", "test/**/*.spec.ts"],
    plugins: {},
    rules: {
      "@typescript-eslint/unbound-method": "off",
    },
  },
);
