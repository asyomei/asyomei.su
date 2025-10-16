import { z } from 'astro/zod'
import { env } from '~/env'
import { addSearchParams } from '~/utils/search-params'
import { USER_AGENT } from '../consts'
import { MINUTE, swr, ttlValidator } from '../swr'

export type LastfmTrack = z.infer<typeof LastfmTrack>

const LastfmTrack = z.object({
  'artist': z.object({ '#text': z.string() }),
  'name': z.string(),
  'url': z.string().url(),
  'image': z.object({
    'size': z.string(),
    '#text': z.string().url(),
  }).array(),
  '@attr': z.object({
    nowplaying: z.literal('true'),
  }).optional(),
})
  .transform(x => ({
    artist: x.artist['#text'],
    title: x.name,
    url: x.url,
    cover: x.image[2]['#text'],
    nowplaying: x['@attr']?.nowplaying === 'true',
  }))

const ResponseSchema = z.object({
  recenttracks: z.object({
    track: z.array(LastfmTrack).nonempty(),
  }),
})
  .transform(x => x.recenttracks.track[0])

export const fetchLastfm = swr({
  validate: ttlValidator({
    refresh: 3 * MINUTE,
    update: 1 * MINUTE,
  }),
  async fetch() {
    if (!env.LASTFM_TOKEN) return

    const url = addSearchParams('https://ws.audioscrobbler.com/2.0/', {
      method: 'user.getrecenttracks',
      user: 'asyomei',
      api_key: env.LASTFM_TOKEN,
      format: 'json',
      limit: '1',
    })
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    })
    const data = ResponseSchema.parse(await res.json())

    return data
  },
})
