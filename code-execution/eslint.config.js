import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ['**/*.{ts}'],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      // Allow prefixing unused variables with ''
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^',
          varsIgnorePattern: '^',
          caughtErrorsIgnorePattern: '^',
        },
      ],
      // Enforce type definition to consistently use type (instead of interface which is default).
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },
  eslintConfigPrettier,
)
