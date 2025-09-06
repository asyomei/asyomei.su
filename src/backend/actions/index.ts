import { github } from './github'
import { lastfm } from './lastfm'
import { shikimori } from './shikimori'

export async function fetchActions() {
  const actions = await Promise.all([lastfm(), github(), shikimori()])

  return actions.filter(x => x != null).sort((a, b) => b.date.getTime() - a.date.getTime())
}
