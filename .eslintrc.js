module.exports = {
  extends: ['standard', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'script',
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  env: {
    es6: true,
  },
  rules: {
    'prettier/prettier': ['error'],
    'no-async-promise-executor': 'off',
    'no-misleading-character-class': 'off',
    'no-useless-catch': 'off',
    eqeqeq: 'warn',
    'no-throw-literal': 'off',
    'no-unused-vars': 'error',
    semi: ['error', 'always'],
    'prefer-promise-reject-errors': 'off',
    'handle-callback-err': 'warn',
  },
};
