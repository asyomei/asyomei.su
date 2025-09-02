interface Options extends RequestInit {
  query?: Record<string, string>
}

export async function wafu(url: string, opts?: Options) {
  const { query, ...init } = opts ?? {}

  const headers = new Headers(init?.headers)
  if (!headers.has('User-Agent')) {
    headers.set('User-Agent', 'asyomei.su/1.0')
  }

  if (query) {
    const search = new URLSearchParams(query)
    url = `${url}?${search}`
  }

  return await fetch(url, {
    ...init,
    headers,
  })
}
