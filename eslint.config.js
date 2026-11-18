import js from '@eslint/js';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import astro from 'eslint-plugin-astro';
import { flatConfigs as importX } from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['node_modules/', 'dist/', '.output/', '.astro/']),

  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser, ...globals.node },
      sourceType: 'module',
    },
  },

  js.configs.recommended,
  tseslint.configs.recommended,
  importX.recommended,
  importX.typescript,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs.flat.recommended,
  astro.configs.recommended,

  {
    plugins: {
      perfectionist,
      'sort-destructure-keys': sortDestructureKeys,
    },

    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'perfectionist/sort-interfaces': ['error', { order: 'asc' }],
      'perfectionist/sort-object-types': ['error', { order: 'asc' }],
      'perfectionist/sort-objects': ['warn', { order: 'asc' }],
      'react/jsx-sort-props': [
        'warn',
        { callbacksLast: true, multiline: 'last' },
      ],
      'sort-destructure-keys/sort-destructure-keys': 'warn',
    },

    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver()],
      // Explicit version: eslint-plugin-react's 'detect' calls context.getFilename(),
      // which ESLint 10 removed
      react: { version: '19.3' },
    },
  },

  {
    files: ['eslint.config.js'],
    rules: {
      'import-x/no-named-as-default-member': 'off',
    },
  },

  {
    files: ['**/*.astro'],
    rules: {
      'react/jsx-key': 'off',
      'react/no-unknown-property': 'off',
    },
  },

  prettierRecommended,

  {
    files: ['**/*.astro/*.js', '**/*.astro/*.ts'],
    rules: {
      'prettier/prettier': 'off',
    },
  },
);
