module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/ban-ts-comment': 'off'
  }
};
