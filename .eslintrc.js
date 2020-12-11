module.exports = {
  extends: 'erb',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'prettier/prettier': 0,
    // take advantage of hoisting
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    // using typescript anyway
    'react/prop-types': 'off',
    // makes render prop pattern painful
    'react/display-name': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./configs/webpack.config.eslint.js'),
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
