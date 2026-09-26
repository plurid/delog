import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default ts.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/distribution/**',
      '.pnpm-store/**',
      '**/source/**',
      '**/configurations/**',
      'packages/**/scripts/**',
      'fixtures/**/scripts/**',
      '**/target/**',
      'playwright-report/**',
      'test-results/**',
      '**/binder/**',
      '**/env/**',
      '**/.venv/**',
      '**/coverage/**',
      '**/data/**',
      'packages/delog-client/delog-cli/tests/**',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  prettier,
);
