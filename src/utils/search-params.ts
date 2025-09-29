export function addSearchParams(url: string, params: Record<string, string>) {
  const search = new URLSearchParams(params)
  return `${url}?${search}`
}
