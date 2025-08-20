// eslint.config.js
import vue from "eslint-plugin-vue";
import ts from "@typescript-eslint/eslint-plugin";
import { defineConfig } from "eslint/config";
import globals from "globals";
import vueParser from "vue-eslint-parser";

export default defineConfig([
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: "@typescript-eslint/parser", // для <script lang="ts">
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { vue, ts },
    rules: {},
  },
  {
    files: ["**/*.vue"],
    plugins: { vue },
    rules: {},
  },
]);

