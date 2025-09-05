import type { Action } from './types'
import z from 'zod/v4'
import { url } from '~/urls'
import { env } from '../env'
import { HOUR, MINUTE, swr, ttlValidator } from '../swr'
import { wafu } from '../utils/wafu'

const API_URL = 'https://ws.audioscrobbler.com/2.0/'
const USER = 'asyomei'

const ResponseSchema = z.object({
  recenttracks: z.object({
    track: z.object({
      'artist': z.object({ '#text': z.string() }),
      'name': z.string(),
      'url': z.url(),
      'date': z.object({ uts: z.coerce.number() }).optional(),
      '@attr': z.object({
        nowplaying: z.literal('true').optional(),
      }).optional(),
    }).array(),
  }),
})
  .transform(x => x.recenttracks.track[0])
  .transform(x => ({
    artist: x.artist['#text'],
    title: x.name,
    url: x.url,
    date: x.date?.uts ? new Date(x.date.uts * 1000) : new Date(),
    playing: x['@attr']?.nowplaying === 'true',
  }))

export const lastfm = swr({
  validate: ttlValidator({
    update: 5 * MINUTE,
    revalidate: 1 * HOUR,
  }),
  async fetch(): Promise<Action | null> {
    if (!env.LASTFM_TOKEN) return null

    const res = await wafu(API_URL, {
      query: {
        method: 'user.getrecenttracks',
        user: USER,
        api_key: env.LASTFM_TOKEN,
        format: 'json',
        limit: '1',
      },
    })

    const data = ResponseSchema.parse(await res.json())
    return {
      service: {
        name: 'lastfm',
        url: url.my.lastfm,
      },
      content: {
        text: `${formatTitle(data.title)} - ${formatArtist(data.artist)}`,
        url: data.url,
      },
      date: data.date,
    }
  },
})

function formatTitle(title: string): string {
  return title
    .replace(/\(feat\W.+?\)/i, '')
    .replace(/\(.*(?:version|remastered|bonus|recorded).*?\)/i, '')
    .replace(/\(instrumental\)/i, '[inst]')
    .replace(/feat\. [^(]+/i, '')
    .replace(/ {2,}/, ' ')
    .trimEnd()
}

const artists = ['Invent, Animate']
function formatArtist(artist: string): string {
  const single = artists.find(x => artist.startsWith(x))
  if (single) return single

  return artist.replace(/^(.+?)[,;&].+/, '$1').trimEnd()
}
