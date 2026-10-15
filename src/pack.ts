import type { Random } from "./rng";

// Flourish placement on an occupancy grid (DESIGN.md §5.4). Units are
// modules, and the grid covers the whole post body, 16 columns wide.
//
// Content and placed tiles both occupy their cells plus every cell
// sharing an edge with them, so a tile is never edge to edge with
// content or with another tile. Diagonal neighbors are fine.
//
// Tiles are placed largest first. Every free position for a size is
// tried in a shuffled order, and kept with a chance scaled by the
// density field, so tiles cluster where the density is high.

export type Tile = { x: number; y: number; size: number };
export type Region = { x: number; y: number; w: number; h: number };
export type Grid = { w: number; h: number; cells: Uint8Array };

const SIZES = [4, 2, 1];
// chance to keep a free position at full density, by tile size
const CHANCES: Record<number, number> = {
  4: 0.25,
  2: 0.15,
  1: 0.06,
};

export const createGrid = (w: number, h: number): Grid => ({
  w,
  h,
  cells: new Uint8Array(w * h),
});

const inside = (g: Grid, x: number, y: number) =>
  x >= 0 && y >= 0 && x < g.w && y < g.h;

function mark (g: Grid, x: number, y: number) {
  if (inside(g, x, y)) g.cells[y * g.w + x] = 1;
}

// marks a rectangle and the ring of cells sharing an edge with it
export function occupy (g: Grid, x: number, y: number, w: number, h: number) {
  for (let j = y; j < y + h; j++) {
    mark(g, x - 1, j);
    mark(g, x + w, j);
    for (let i = x; i < x + w; i++) mark(g, i, j);
  }
  for (let i = x; i < x + w; i++) {
    mark(g, i, y - 1);
    mark(g, i, y + h);
  }
}

function fits (g: Grid, x: number, y: number, size: number) {
  for (let j = y; j < y + size; j++) {
    for (let i = x; i < x + size; i++) {
      if (!inside(g, i, j) || g.cells[j * g.w + i]) return false;
    }
  }
  return true;
}

function shuffle<T> (r: Random, list: T[]) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = r.int(i + 1);
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

// places tiles inside a region; tile positions are relative to it
export function place (
  r: Random,
  g: Grid,
  region: Region,
  density: (x: number, y: number) => number,
): Tile[] {
  const out: Tile[] = [];
  for (const size of SIZES) {
    const candidates: [number, number][] = [];
    for (let y = region.y; y + size <= region.y + region.h; y++) {
      for (let x = region.x; x + size <= region.x + region.w; x++) {
        if (fits(g, x, y, size)) candidates.push([x, y]);
      }
    }
    for (const [x, y] of shuffle(r, candidates)) {
      if (!fits(g, x, y, size)) continue;
      if (r.next() >= CHANCES[size] * density(x + size / 2, y + size / 2)) continue;
      occupy(g, x, y, size, size);
      out.push({ x: x - region.x, y: y - region.y, size });
    }
  }
  return out;
}
