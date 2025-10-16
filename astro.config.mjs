import node from '@astrojs/node'
import { defineConfig, passthroughImageService } from 'astro/config'
import UnoCSS from 'unocss/astro'

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  site: 'https://asyomei.su',
  vite: {
    ssr: import.meta.env.PROD ? { noExternal: true } : undefined,
  },
  image: {
    service: passthroughImageService(),
  },
  build: {
    inlineStylesheets: 'never',
  },
  devToolbar: { enabled: false },
  integrations: [UnoCSS()],
})
