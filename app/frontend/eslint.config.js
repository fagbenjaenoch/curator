import js from "@eslint/js";
import { globalIgnores } from "eslint/config";
import pluginImport from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    plugins: {
      import: pluginImport,
    },
    // settings: {
    //   "import/resolver": {
    //     node: {
    //       extensions: [".js", ".jsx", ".ts", ".tsx"]
    //     },
    //     alias: {
    //       map: [["@", "./src"]],
    //       extensions: [".js", ".jsx", ".ts", ".tsx"]
    //     }
    //   }
    // },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      // "no-restricted-imports": [
      //   "error",
      //   {
      //     patterns: [
      //       {
      //         group: [ "./", "../*", ".*"],
      //         message: "Use @/ for absolute imports instead of relative paths.",
      //       },
      //     ],
      //   },
      // ],
    },
  },
]);
