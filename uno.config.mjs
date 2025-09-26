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
  theme: {
    backgroundColor: {
      base: 'var(--bg)',
      overlay: 'var(--bg-overlay)',
      footer: 'var(--bg-footer)',
    },
    colors: {
      accent: 'var(--text-accent)',
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
    },
    fontSize: {
      xl: '24px',
      lg: '20px',
      md: '16px',
    },
  },
})
