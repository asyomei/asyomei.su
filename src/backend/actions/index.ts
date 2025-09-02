import { lastfm } from './lastfm'

export async function fetchActions() {
  const actions = await Promise.all([lastfm()])

  return actions.filter(x => x != null).sort((b, a) => b.date.getTime() - a.date.getTime())
}
