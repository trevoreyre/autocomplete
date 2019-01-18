module.exports = {
    extends: [
      'plugin:vue/recommended',
      'plugin:prettier/recommended'
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
      parser: "babel-eslint"
    }
  }
