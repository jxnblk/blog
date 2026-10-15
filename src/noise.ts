import type { Random } from "./rng";

// Seeded 2D Perlin noise. Returns roughly -1 to 1, and 0 at every
// integer lattice point, so sample it scaled down (e.g. x / 6)

const GRADIENTS = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function perlin (r: Random) {
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = p.length - 1; i > 0; i--) {
    const j = r.int(i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = [...p, ...p];
  const dot = (h: number, x: number, y: number) => {
    const [gx, gy] = GRADIENTS[h & 7];
    return gx * x + gy * y;
  };

  return (x: number, y: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const a = perm[X] + Y;
    const b = perm[X + 1] + Y;
    return lerp(
      lerp(dot(perm[a], x, y), dot(perm[b], x - 1, y), u),
      lerp(dot(perm[a + 1], x, y - 1), dot(perm[b + 1], x - 1, y - 1), u),
      v,
    );
  };
}

export const smoothstep = (lo: number, hi: number, n: number) => {
  const t = Math.min(1, Math.max(0, (n - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
};
