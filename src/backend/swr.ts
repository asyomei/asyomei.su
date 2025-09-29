import { setTimeout as delay } from 'node:timers/promises'

export type ValidateType = 'keep' | 'update' | 'refresh'

interface Props<T> {
  fetch: () => Promise<T>
  validate: (prev: T | undefined, elapsedMs: number) => ValidateType
}

export const SECOND = 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE

const MAX_ATTEMPTS = 2

export function swr<T>(props: Props<T>) {
  let data: T
  let setAt = 0
  let updating = false

  async function refresh(attempts = 1) {
    if (updating && attempts === 1) {
      for (let i = 0; i < 100; ++i) {
        if (!updating) break
        await delay(100)
      }
      return data
    }
    updating = true

    try {
      data = await props.fetch()
      setAt = Date.now()
    } catch (e) {
      if (attempts >= MAX_ATTEMPTS) throw e
      await delay(100)
      await refresh(attempts + 1)
    } finally {
      if (attempts === 1) updating = false
    }
  }

  return async (): Promise<T> => {
    if (setAt === 0) {
      await refresh()
      return data
    }

    const type = props.validate(data, Date.now() - setAt)
    switch (type) {
      case 'refresh':
        await refresh()
        return data
      case 'update':
        void refresh()
        return data
      case 'keep':
        return data
    }
  }
}

export function ttlValidator(opts: { update: number, refresh: number }) {
  return (_: unknown, elapsedMs: number): ValidateType => {
    if (opts.refresh < elapsedMs) return 'refresh'
    if (opts.update < elapsedMs) return 'update'
    return 'keep'
  }
}
