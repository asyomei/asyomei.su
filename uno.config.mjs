import { defineConfig, presetWind3, transformerCompileClass, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    transformerCompileClass(),
  ],
  rules: [
    ['border-d', { border: 'var(--border)' }],
    [/^border-([xytrbl])-d$/, ([, pos]) => {
      const val = 'var(--border)'
      /** @type {Record<string, string>} */
      const css = {}
      if (pos === 'x' || pos === 'r') css['border-right'] = val
      if (pos === 'x' || pos === 'l') css['border-left'] = val
      if (pos === 'y' || pos === 't') css['border-top'] = val
      if (pos === 'y' || pos === 'b') css['border-bottom'] = val
      return css
    }],
  ],
  theme: {
    backgroundColor: {
      base: 'var(--bg-base)',
    },
    colors: {
      accent: 'var(--text-accent)',
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
    },
    fontSize: {
      md: '14px',
      sm: '12px',
      xs: '10px',
    },
  },
})
