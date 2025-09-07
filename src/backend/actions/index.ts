import type { Action } from './types'
import { framagit } from './framagit'
import { github } from './github'
import { lastfm } from './lastfm'
import { shikimori } from './shikimori'

const byDate = <T extends { date: Date }>(a: T, b: T) => b.date.getTime() - a.date.getTime()

export async function fetchActions() {
  const all = await Promise.all([lastfm(), github(), shikimori(), framagit()])
  let actions = all.filter(x => x != null)
  actions.sort(byDate)

  actions = takeNewest(actions, ['github', 'framagit'])

  return actions
}

function takeNewest(actions: Action[], from: string[]): Action[] {
  const newest = actions.find(x => from.includes(x.service.name))
  return actions.filter(x => x === newest || !from.includes(x.service.name))
}
