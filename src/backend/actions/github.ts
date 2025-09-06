import type { Action } from './types'
import z from 'zod/v4'
import { url } from '~/urls'
import { HOUR, swr, ttlValidator } from '../swr'
import { wafu } from '../utils/wafu'

const API_URL = 'https://api.github.com/users/asyomei/events/public?per_page=1'

const ResponseSchema = z.object({
  id: z.string(),
  type: z.string(),
  payload: z.any(),
  repo: z.object({
    name: z.string(),
    url: z.url(),
  }),
  created_at: z.coerce.date(),
})
  .array()
  .transform(x => x[0])

export const github = swr({
  validate: ttlValidator({
    update: 1 * HOUR,
    revalidate: 6 * HOUR,
  }),
  async fetch(): Promise<Action | null> {
    const res = await wafu(API_URL, {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })

    const data = ResponseSchema.parse(await res.json())
    const extra = getExtra(data.type, data.payload)

    if (!extra) return null
    return {
      extra,
      service: {
        name: 'github',
        url: url.my.github,
      },
      content: {
        text: data.repo.name,
        url: `https://github.com/${data.repo.name}`,
      },
      date: data.created_at,
    }
  },
})

function getExtra(type: string, payload: any): string | undefined {
  type = type.slice(0, -5) // -Event

  const fn = {
    Create: () => `${payload.ref_type} created`,
    Delete: () => `${payload.ref_type} deleted`,
    Fork: () => 'forked',
    Gollum: () => 'wiki updated',
    IssueComment: () => `issue comment ${payload.action}`,
    Issues: () => `issue ${payload.action}`,
    Public: () => 'made public',
    PullRequest: () => `pr ${payload.action}`,
    Push: () => payload.commits.at(-1).message,
    Release: () => `release ${payload.action}`,
    Watch: () => 'starred',
  }[type]

  return fn?.()
}
