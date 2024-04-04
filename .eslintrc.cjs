module.exports = {
  env: {
    node: true,
  },
  extends: [
    'plugin:storybook/recommended',
    'plugin:vue/vue3-recommended',
    '@vue/prettier',
    'eslint:recommended',
  ],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['Autocomplete'],
      },
    ],
    'no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
      },
    ],
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
}
