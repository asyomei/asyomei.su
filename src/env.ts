if (import.meta.env.DEV) {
  // eslint-disable-next-line antfu/no-top-level-await
  await import('dotenv/config')
}

export const env = process.env as {
  LASTFM_TOKEN?: string
}
