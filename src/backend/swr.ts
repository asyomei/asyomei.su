type ValidateType = 'keep' | 'update' | 'revalidate'

interface Options<T> {
  fetch: (prev?: T) => T | Promise<T>
  validate: (prev: T, elapsedMs: number) => ValidateType
}

export const SECOND = 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE

export function swr<T>(opts: Options<T>): () => Promise<T> {
  const { fetch, validate } = opts

  let value: T
  let setAt = 0
  let updating = false

  async function revalidate() {
    if (updating) return
    updating = true

    try {
      value = await fetch(value)
      setAt = Date.now()
    } finally {
      updating = false
    }
  }

  return async () => {
    if (updating) return value

    if (setAt === 0) {
      await revalidate()
      return value
    }

    const type = validate(value, Date.now() - setAt)
    switch (type) {
      case 'keep':
        return value
      case 'update':
        void revalidate()
        return value
      case 'revalidate':
        await revalidate()
        return value
    }
  }
}

export function ttlValidator(opts: { update: number, revalidate: number }) {
  return (_: unknown, elapsedMs: number): ValidateType => {
    if (elapsedMs >= opts.revalidate) return 'revalidate'
    if (elapsedMs >= opts.update) return 'update'
    return 'keep'
  }
}
