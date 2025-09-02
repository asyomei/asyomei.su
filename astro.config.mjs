import node from '@astrojs/node'
import { defineConfig, passthroughImageService } from 'astro/config'

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  site: 'https://asyomei.org',
  vite: {
    define: {
      'import.meta.env.BUILD_DATE': JSON.stringify(getBuildDate()),
    },
  },
  image: {
    service: passthroughImageService(),
  },
  build: {
    inlineStylesheets: 'never',
  },
  devToolbar: { enabled: false },
})

function getBuildDate() {
  const date = new Date().toISOString()
  return date.slice(0, date.indexOf('T'))
}
