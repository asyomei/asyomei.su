import type { Action } from './types'
import { framagit } from './framagit'
import { lastfm } from './lastfm'
import { shikimori } from './shikimori'

const byDate = <T extends { date: Date }>(a: T, b: T) => b.date.getTime() - a.date.getTime()

export async function fetchActions() {
  const all = await Promise.all([lastfm(), shikimori(), framagit()])
  const actions: Action[] = all.filter(x => x != null)
  actions.sort(byDate)

  return actions
}
