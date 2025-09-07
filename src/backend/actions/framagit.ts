import type { Action } from './types'
import z from 'zod/v4'
import { url } from '~/urls'
import { HOUR, swr, ttlValidator } from '../swr'
import { wafu } from '../utils/wafu'

const USER_ID = 156563
const EVENT_API_URL = `https://framagit.org/api/v4/users/${USER_ID}/events?per_page=1`
const PROJECT_API_URL = 'https://framagit.org/api/v4/projects/{id}'

const EventSchema = z.object({
  project_id: z.number(),
  action_name: z.string(),
  created_at: z.coerce.date(),
  push_data: z.object({
    commit_title: z.string(),
  }).optional(),
})
  .array()
  .transform(x => x[0])

const ProjectSchema = z.object({
  path_with_namespace: z.string(),
  web_url: z.url(),
})

export const framagit = swr({
  validate: ttlValidator({
    update: 1 * HOUR,
    revalidate: 6 * HOUR,
  }),
  async fetch(): Promise<Action | null> {
    const res = await wafu(EVENT_API_URL)
    const event = EventSchema.parse(await res.json())

    const projectApiUrl = PROJECT_API_URL.replace('{id}', event.project_id.toString())
    const res2 = await wafu(projectApiUrl)
    const project = ProjectSchema.parse(await res2.json())

    const extra = event.push_data?.commit_title ?? event.action_name
    return {
      extra,
      service: {
        name: 'framagit',
        url: url.my.framagit,
      },
      content: {
        text: project.path_with_namespace,
        url: project.web_url,
      },
      date: event.created_at,
    }
  },
})
