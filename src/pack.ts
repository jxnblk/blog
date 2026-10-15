import type { Random } from "./rng";

// Packs flourish tiles into a free grid region (DESIGN.md §5.4).
// The region is cut into the largest square cells that fit (4, 2, or 1
// modules). Each cell is left empty, filled with one flourish, or split
// into four quadrants that choose again. Most cells stay empty, so the
// prose keeps its negative space. Units are modules.

export type Tile = { x: number; y: number; size: number };

// chance to fill or split a cell, by cell size
const CHANCES: Record<number, { fill: number; split: number }> = {
  4: { fill: 0.25, split: 0.25 },
  2: { fill: 0.3, split: 0.15 },
  1: { fill: 0.25, split: 0 },
};

const pow2floor = (n: number) => 2 ** Math.floor(Math.log2(n));

function cell (r: Random, x: number, y: number, size: number, density: number, out: Tile[]) {
  const { fill, split } = CHANCES[size];
  const n = r.next();
  if (n < fill * density) {
    out.push({ x, y, size });
  } else if (n < (fill + split) * density) {
    const half = size / 2;
    cell(r, x, y, half, density, out);
    cell(r, x + half, y, half, density, out);
    cell(r, x, y + half, half, density, out);
    cell(r, x + half, y + half, half, density, out);
  }
}

// density scales the fill and split chances: 1 is the default restraint
export function pack (r: Random, w: number, h: number, density = 1, x = 0, y = 0): Tile[] {
  const out: Tile[] = [];
  if (w < 1 || h < 1) return out;
  const size = Math.min(4, pow2floor(Math.min(w, h)));
  const cols = Math.floor(w / size);
  const rows = Math.floor(h / size);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      cell(r, x + i * size, y + j * size, size, density, out);
    }
  }
  // leftover strips on the right and bottom take smaller cells
  out.push(...pack(r, w - cols * size, h, density, x + cols * size, y));
  out.push(...pack(r, cols * size, h - rows * size, density, x, y + rows * size));
  return out;
}
