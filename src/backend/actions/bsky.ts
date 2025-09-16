import type { Action } from './types'
import z from 'zod/v4'
import { url } from '~/urls'
import { HOUR, swr, ttlValidator } from '../swr'
import { wafu } from '../utils/wafu'

const API_URL = 'https://api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed'

const ResponseSchema = z.object({
  feed: z.object({
    post: z.object({
      uri: z.string(),
      record: z.object({
        text: z.string(),
        createdAt: z.coerce.date(),
      }),
    }),
    reply: z.unknown().optional(),
  }).array(),
})

export const bsky = swr({
  validate: ttlValidator({
    revalidate: 8 * HOUR,
    update: 3 * HOUR,
  }),
  async fetch(): Promise<Action | null> {
    const res = await wafu(API_URL, {
      query: { actor: 'did:web:asyomei.su', limit: '20' },
    })
    const data = ResponseSchema.parse(await res.json())

    const post = data.feed.find(x => !x.reply)?.post
    if (!post) return null

    const m = post.uri.match(/at:\/\/did:web:asyomei.su\/app\.bsky\.feed\.post\/([a-zA-Z0-9]+)/)
    if (!m) return null
    const postId = m[1]

    return {
      service: {
        name: 'bsky',
        url: url.my.bsky,
      },
      content: {
        text: post.record.text.split('\n', 1)[0] || '<no text>',
        url: `${url.my.bsky}/post/${postId}`,
      },
      date: post.record.createdAt,
    }
  },
})
