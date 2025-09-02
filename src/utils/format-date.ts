export function relativeDate(date: Date) {
  const elapsedMs = Date.now() - date.getTime()

  const seconds = elapsedMs / 1000 | 0
  if (seconds < 60) return 'now'

  const minutes = seconds / 60 | 0
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`

  const hours = minutes / 60 | 0
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`

  const days = hours / 24 | 0
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`

  const weeks = days / 7 | 0
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`

  return formatDate(date)
}

export function formatDate(date: Date) {
  const pad = (x: number) => x.toString().padStart(2, '0')

  const day = date.getUTCDate()
  const mon = date.getUTCMonth() + 1
  const year = date.getUTCFullYear()
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()

  return `${year}-${pad(mon)}-${pad(day)} ${pad(hours)}:${pad(minutes)} utc`
}
