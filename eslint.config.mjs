// @ts-check

import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
      'no-unused-vars': 'warn', // JS unused vars as warning
      '@typescript-eslint/no-unused-vars': 'warn', // TS unused vars as warning
    },
  },
  globalIgnores([".angular/*"])
);