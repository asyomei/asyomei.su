import node from '@astrojs/node'
import { defineConfig, passthroughImageService } from 'astro/config'

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  site: 'https://asyomei.org',
  image: {
    service: passthroughImageService(),
  },
  build: {
    inlineStylesheets: 'never',
  },
  devToolbar: { enabled: false },
})
