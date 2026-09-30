export type Rotation = { version: number; order: number[]; cursor: number }
export const ROTATION_VERSION = 1
export const ROTATION_KEY = 'miso-guide-templates-v1'

export function makeRotation(count: number, previous?: number): Rotation {
  const order = Array.from({ length: count }, (_, i) => i)
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  if (count > 1 && order[0] === previous) [order[0], order[1]] = [order[1], order[0]]
  return { version: ROTATION_VERSION, order, cursor: 0 }
}

export function restoreRotation(raw: string | null, count: number): Rotation {
  try {
    const saved = JSON.parse(raw || 'null') as Rotation | null
    if (saved?.version === ROTATION_VERSION && Array.isArray(saved.order) && saved.order.length === count &&
      new Set(saved.order).size === count && saved.order.every(i => Number.isInteger(i) && i >= 0 && i < count) &&
      Number.isInteger(saved.cursor) && saved.cursor >= 0 && saved.cursor < count) return saved
  } catch { /* A missing or stale browser value starts a new cycle. */ }
  return makeRotation(count)
}

export function nextRotation(current: Rotation): Rotation {
  return current.cursor + 1 < current.order.length
    ? { ...current, cursor: current.cursor + 1 }
    : makeRotation(current.order.length, current.order[current.cursor])
}
