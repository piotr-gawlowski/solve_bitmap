module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  'overrides': [
    {
      'files': [
        '**/*.spec.js',
        '**/*.spec.jsx'
      ],
      'env': {
        'jest': true
      }
    }
  ]
};