/** Deterministic PRNG so the mock catalog is identical on every reload. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export const pick = <T,>(r: () => number, arr: readonly T[]): T => arr[Math.floor(r() * arr.length)]
export const range = (r: () => number, min: number, max: number) => min + r() * (max - min)
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
