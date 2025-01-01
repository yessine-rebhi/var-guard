export default {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [require.resolve('./eslint-plugin-varsguard')],
  rules: {
    'varsguard/envVarPolicy': 'error',
  },
};