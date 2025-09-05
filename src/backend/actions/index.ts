import { github } from './github'
import { lastfm } from './lastfm'

export async function fetchActions() {
  const actions = await Promise.all([lastfm(), github()])

  return actions.filter(x => x != null).sort((a, b) => b.date.getTime() - a.date.getTime())
}
