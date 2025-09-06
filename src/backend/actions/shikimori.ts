import type { Action } from './types'
import z from 'zod/v4'
import { url } from '~/urls'
import { HOUR, swr, ttlValidator } from '../swr'
import { wafu } from '../utils/wafu'

const USER_ID = 1461317
const API_URL = `https://shikimori.one/api/users/${USER_ID}/history?limit=10`

const ResponseSchema = z.object({
  created_at: z.coerce.date(),
  description: z.string(),
  target: z.object({
    name: z.string(),
    url: z.string(),
  }),
})
  .array()

export const shikimori = swr({
  validate: ttlValidator({
    update: 3 * HOUR,
    revalidate: 8 * HOUR,
  }),
  async fetch(): Promise<Action | null> {
    const res = await wafu(API_URL)
    const arr = ResponseSchema.parse(await res.json())

    for (const data of arr) {
      const extra = parseDescription(data.description)
      if (!extra) continue

      return {
        extra,
        service: {
          name: 'shikimori',
          url: url.my.shikimori,
        },
        content: {
          text: data.target.name,
          url: `https://shikimori.one${data.target.url}`,
        },
        date: data.created_at,
      }
    }

    return null
  },
})

function parseDescription(description: string): string | undefined {
  const general = {
    'Запланировано': 'added',
    'Добавлено в список': 'added',
    'Удалено из списка': 'removed',
    'Пересматриваю': 'rewatched',
    'Смотрю': 'watched',
    'Брошено': 'dropped',
    'Читаю': 'read',
    'Отложено': 'delayed',
  }[description]
  if (general) return general

  if (/^Просмотрен.+эпизод/.test(description)) return 'watch'
  if (description.startsWith('Просмотрено') || description.startsWith('Прочитано')) {
    return 'completed'
  }
}
