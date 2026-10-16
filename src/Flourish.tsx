import { createRandom, type Random } from "./rng";

// Binary space partitioning toward one corner: each level splits the
// region in half, alternating direction, fills one half with a solid
// color, and recurses into the half nearest the chosen corner, so detail
// gathers in that corner. The outer shape is square; inner regions may be 2:1.
// Units are modules: a size-4 flourish has a 0 0 4 4 viewBox.

const MIN = 0.25; // smallest side, in modules

// two levels per doubling of the side: 1 → 4, 2 → 6, 4 → 8, 8 → 10
function maxDepth (size: number) {
  return 2 * Math.log2(size) + 4;
}

// Color: each flourish takes a base HSL color, mostly foliage greens,
// sometimes a floral hue. Each division shifts slightly from its parent.
export type HSL = [number, number, number];
type Range = [number, number];
export type Family = "foliage" | "poppy" | "marigold" | "peony" | "violet";

export const FOLIAGE_CHANCE = 0.8;
export const FOLIAGE: { hue: Range; sat: Range; light: Range } =
  { hue: [85, 160], sat: [25, 50], light: [22, 50] };
// order matters: the seeded pick indexes into this list
export const FLORAL_HUES: { family: Family; hue: Range }[] = [
  { family: "poppy", hue: [0, 12] },
  { family: "marigold", hue: [36, 46] },
  { family: "peony", hue: [325, 345] },
  { family: "violet", hue: [265, 280] },
];
export const FLORAL = { sat: [60, 80] as Range, light: [50, 64] as Range };

// max shift per division
const SHIFT: HSL = [10, 8, 10];
const MIN_LIGHT_SHIFT = 4; // keeps neighboring pieces distinguishable

function range (r: Random, [min, max]: Range) {
  return min + r.next() * (max - min);
}

function baseColor (r: Random): { family: Family; hsl: HSL } {
  if (r.chance(FOLIAGE_CHANCE)) {
    return { family: "foliage", hsl: [range(r, FOLIAGE.hue), range(r, FOLIAGE.sat), range(r, FOLIAGE.light)] };
  }
  const { family, hue } = r.pick(FLORAL_HUES);
  return { family, hsl: [range(r, hue), range(r, FLORAL.sat), range(r, FLORAL.light)] };
}

// overrides the base color after it's drawn, so the seed's draws (and
// the tile's shape) stay the same. Used by the dev palette app
export type BaseOverride = (family: Family, hsl: HSL) => HSL;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const signed = (r: Random) => r.next() * 2 - 1;

function shift (r: Random, [h, s, l]: HSL): HSL {
  // lightness always moves at least a little, in a random direction
  const dl = Math.sign(signed(r)) * range(r, [MIN_LIGHT_SHIFT, SHIFT[2]]);
  let nl = l + dl;
  if (nl < 12 || nl > 80) nl = l - dl;
  return [
    (h + signed(r) * SHIFT[0] + 360) % 360,
    clamp(s + signed(r) * SHIFT[1], 10, 90),
    clamp(nl, 12, 80),
  ];
}

const css = ([h, s, l]: HSL) => `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;

type Leaf = {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  hsl: HSL;
};

// chance to keep splitting, falling off relative to the max depth
function splitChance (depth: number, max: number) {
  if (depth === 0) return 1;
  return 0.9 - 0.6 * (depth / max);
}

type Corner = { right: boolean; bottom: boolean };

function subdivide (
  r: Random,
  x: number, y: number, w: number, h: number,
  vertical: boolean, // split line direction: vertical = left/right halves
  corner: Corner,
  depth: number,
  max: number,
  color: HSL,
  out: Leaf[],
) {
  const side = vertical ? w / 2 : h / 2;
  if (depth >= max || side < MIN || !r.chance(splitChance(depth, max))) {
    out.push({ x, y, w, h, fill: css(color), hsl: color });
    return;
  }
  if (vertical) {
    const hw = w / 2;
    const next = shift(r, color);
    const [fx, nx] = corner.right ? [x, x + hw] : [x + hw, x];
    out.push({ x: fx, y, w: hw, h, fill: css(color), hsl: color });
    subdivide(r, nx, y, hw, h, false, corner, depth + 1, max, next, out);
  } else {
    const hh = h / 2;
    const next = shift(r, color);
    const [fy, ny] = corner.bottom ? [y, y + hh] : [y + hh, y];
    out.push({ x, y: fy, w, h: hh, fill: css(color), hsl: color });
    subdivide(r, x, ny, w, hh, true, corner, depth + 1, max, next, out);
  }
}

export function layout (seed: string, size: number, override?: BaseOverride) {
  const r = createRandom(seed);
  const leaves: Leaf[] = [];
  const corner = { right: r.chance(0.5), bottom: r.chance(0.5) };
  const vertical = r.chance(0.5);
  const base = baseColor(r);
  const color = override ? override(base.family, base.hsl) : base.hsl;
  subdivide(r, 0, 0, size, size, vertical, corner, 0, maxDepth(size), color, leaves);
  return { family: base.family, leaves };
}

export default function Flourish ({
  seed,
  size = 4,
  className,
}: {
  seed: string;
  size?: number; // modules
  className?: string;
}) {
  const { leaves } = layout(seed, size);
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      shapeRendering="crispEdges"
    >
      {leaves.map((leaf, i) => (
        <rect
          key={i}
          x={leaf.x}
          y={leaf.y}
          width={leaf.w}
          height={leaf.h}
          style={{ fill: leaf.fill }}
          // base color for the client's wind animation
          data-hsl={leaf.hsl.map(n => n.toFixed(1)).join(" ")}
        />
      ))}
    </svg>
  );
}

// rehype-react maps <flourish-tile> from rehypeSections here, where
// hast properties arrive as strings
export function FlourishTile ({ seed, size }: { seed: string; size: string | number }) {
  return <Flourish seed={seed} size={Number(size)} />;
}
