import type { APIRoute } from 'astro'
import rss from '@astrojs/rss'
import { groupPostsByLang, importPosts } from '~/utils/import-posts'

export const GET: APIRoute = (ctx) => {
  const lang = ctx.params.lang as 'ru' | 'en'
  const posts = importPosts().filter(x => x.lang === lang)
  return rss({
    title: {
      ru: 'чудесный блог asyomei',
      en: 'wonderful asyomei\'s blog',
    }[lang],
    description: {
      ru: 'этот блог ведётся... наверное',
      en: 'this blog is active... probably',
    }[lang],
    site: ctx.site!,
    customData: `<language>${{ ru: 'ru-ru', en: 'en-us' }[lang]}</language>`,
    items: posts.map(post => ({
      title: post.title,
      description: post.description,
      link: `/blog/${lang}/${post.id}`,
      pubDate: post.created,
    })),
  })
}

export function getStaticPaths() {
  return [
    { params: { lang: 'ru' } },
    { params: { lang: 'en' } },
  ]
}
