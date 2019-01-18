module.exports = {
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    // '@vue/prettier',
    'eslint:recommended'
  ],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        semi: false,
        singleQuote: true,
        trailingComma: 'es5'
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
