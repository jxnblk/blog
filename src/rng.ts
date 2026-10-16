// Deterministic randomness: seeded from a string (e.g. post slug),
// with named sub-streams so tuning one system doesn't reshuffle others.

// cyrb53-style string hash -> 32-bit int
export function hash (str: string): number {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  return h1 >>> 0;
}

export function mulberry32 (seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Random = ReturnType<typeof createRandom>;

export function createRandom (seed: string) {
  const next = mulberry32(hash(seed));
  return {
    next,
    int: (n: number) => Math.floor(next() * n),
    pick: <T,>(list: readonly T[]): T => list[Math.floor(next() * list.length)],
    chance: (p: number) => next() < p,
  };
}

// rng(seed)('flourish:0') -> independent stream
export function rng (seed: string) {
  return (stream: string) => createRandom(`${seed}:${stream}`);
}
