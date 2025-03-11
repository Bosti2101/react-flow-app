module.export = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    overrides: [
      {
        files: ['*.yaml', '*.yml'],
        parser: 'yaml-eslint-parser',
      },
    ],
  },
  plugins: ['@typescript-eslint', 'json-format'],
  extends: [
    'standard',
    'plugin:markdown/recommended',
    'plugin:yml/standard',
    'next/core-web-vitals',
    'prettier',
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'no-useless-catch': 'off',
    indent: ['warn', 2],
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: true,
      },
    ],
    'no-unneeded-ternary': 'warn',
  },
}
