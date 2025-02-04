module.exports = [
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['*.ts', '*.tsx'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      // TypeScript 전용 규칙을 여기에 추가
    },
  },
];
