import antfu from '@antfu/eslint-config'

export default antfu({
  astro: true,
  unocss: true,
  typescript: true,
  lessOpinionated: true,
  rules: {
    'node/prefer-global/process': 'off',
    'style/brace-style': ['warn', '1tbs'],
    'unused-imports/no-unused-imports': 'off',
    'unused-imports/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'curly': 'off',
  },
})
