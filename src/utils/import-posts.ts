import z from 'zod/v4'

const PostSchema = z.object({
  title: z.string(),
  description: z.string(),
  created: z.coerce.date(),
  default: z.any(),
})

export function importPosts() {
  return Object.entries(import.meta.glob('../blog/*/*.astro', { eager: true }))
    .map(([path, data]) => {
      const post = PostSchema.parse(data)
      path = path.replace('../blog/', '').replace('.astro', '')
      const [lang, id] = path.split('/')
      return { ...post, id, lang: lang as 'ru' | 'en' }
    })
    .sort((a, b) => b.created.getTime() - a.created.getTime())
}

export function groupPostsByLang(posts: ReturnType<typeof importPosts>) {
  const ruPosts = posts.filter(x => x.lang === 'ru')
  const enPosts = posts.filter(x => x.lang === 'en')

  return ruPosts.map((ruPost, i) => {
    const enPost = enPosts[i]
    return { ru: ruPost, en: enPost }
  })
}
