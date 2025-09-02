import antfu from '@antfu/eslint-config'

export default antfu({
  astro: true,
  typescript: true,
  lessOpinionated: true,
  rules: {
    'unused-imports/no-unused-imports': 'off',
    'unused-imports/no-unused-vars': 'off',
  },
})
