/** Content splitting and layout (docs/design.md, Layout)
 * Groups the top-level hast nodes into blocks, flat, so every block is
 * a direct item of the post body's grid. Spacer elements separate
 * the blocks:
 *
 *   <div class="block block-heading">…</div>
 *   <div class="spacer"></div>
 *   <div class="block block-prose">…</div>
 *   <div class="spacer spacer-section"></div>
 *   <div class="block block-heading">…</div>
 *
 * Sections start at h2 and hr. The hr itself is dropped and the spacer
 * before its section becomes a band of flourishes.
 *
 * Placement is a greedy row-by-row pass. Every item takes one row of
 * the grid (rows grow to fit), and each section moves its prose to a
 * column chosen by rng('layout'). Block heights are measured in
 * modules from the font metrics (see measure.ts), and each block's
 * min-height holds its row to that many modules, so every row ends on
 * a module line. The content is marked on an occupancy grid for the
 * whole body. Runs of rows that share the same free columns get a
 * margin item, and tiles are placed in margins and bands against that
 * grid (see pack.ts), so they never sit edge to edge with content or
 * each other. The 64px and 80px modules give blocks different
 * heights, so margins and 16-column bands are placed once for each.
 *
 * Columns are authored against 16 columns: below that, CSS stacks the
 * blocks full width and hides the margins. Instead, some section
 * spacers grow into bands of tiles, packed separately for 8 and 4
 * columns, and CSS shows the set that matches the grid. A last band
 * after the content always holds a few tiles.
 */
import type { Root, RootContent, Element, ElementContent } from "hast";
import { rng, type Random } from "./rng";
import { createGrid, occupy, place, type Tile } from "./pack";
import { perlin, smoothstep } from "./noise";
import { measureBlock, measureQuote, isAttribution, modules } from "./measure";

export type BlockType =
  | "heading"
  | "prose"
  | "image"
  | "code"
  | "table"
  | "blockquote"
  // a blockquote moved into the negative space (see pullQuote)
  | "pullquote";

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
const MEDIA = new Set(["img", "figure", "iframe", "video"]);

const COLUMNS = 16;
// prose column starts; the prose column is 8 wide
const OFFSETS = [1, 5, 9];
const PROSE = 8;
const WIDE = 12;
// images are one or two columns wider than the prose
const IMAGE_EXTRA = [1, 2];
// pull quote widths at 16 columns, in modules
const QUOTE_WIDTHS = [4, 5, 6, 7, 8];
// section break bands: tile rows, plus an empty row above and below
const BAND = 2;
// density field: noise is sampled at modules × NOISE_SCALE, and
// eases from empty at DENSITY_LOW to full at DENSITY_HIGH
const NOISE_SCALE = 1 / 6;
const DENSITY_LOW = 0;
const DENSITY_HIGH = 0.5;
// narrow bands: the chance a section spacer becomes a band is
// NARROW_CHANCE × (0.5 + density), never twice in a row, and its tile
// rows are picked from the sizes for that column count
const NARROW_CHANCE = 0.7;
const NARROW_ROWS: Record<number, number[]> = { 8: [1, 2, 2, 4], 4: [1, 2] };
// the band after the content: tile rows, and the fewest and most
// tiles it shows, by column count
const END_ROWS: Record<number, number> = { 16: 4, 8: 2, 4: 2 };
const END_TILES: Record<number, [number, number]> = { 16: [1, 3], 8: [3, 3], 4: [2, 2] };

const isElement = (node: RootContent): node is Element =>
  node.type === "element";

export const isBlank = (node: RootContent) =>
  node.type === "text" && !node.value.trim();

// a paragraph holding only media (and whitespace) is an image block
export function isMediaParagraph (node: Element) {
  if (node.tagName !== "p") return false;
  const children = node.children.filter(child => !isBlank(child as RootContent));
  return children.length > 0 && children.every(child =>
    child.type === "element" && MEDIA.has(child.tagName)
  );
}

function classify (node: RootContent): BlockType {
  if (!isElement(node)) return "prose";
  if (HEADINGS.has(node.tagName)) return "heading";
  if (MEDIA.has(node.tagName) || isMediaParagraph(node)) return "image";
  if (node.tagName === "pre") return "code";
  if (node.tagName === "table") return "table";
  if (node.tagName === "blockquote") return "blockquote";
  return "prose";
}

const element = (
  tagName: string,
  className: string,
  style: string,
  children: RootContent[] = [],
  properties: Record<string, string | number> = {},
): Element => ({
  type: "element",
  tagName,
  properties: { className: className.split(" "), style, ...properties },
  children: children as ElementContent[],
});

/** Block heights (see measure.ts)
 * Measured in modules for each grid from 576px up. Below 1088px every
 * block spans the full 8 columns, and from there its own width. Below
 * 576px the module is fluid, so rows end on the baseline instead.
 */
type Size = "sm" | "md" | "lg" | "xl";
const SIZES: { size: Size; module: number; columns: number }[] = [
  { size: "sm", module: 64, columns: 8 },
  { size: "md", module: 80, columns: 8 },
  { size: "lg", module: 64, columns: COLUMNS },
  { size: "xl", module: 80, columns: COLUMNS },
];
// the 16-column grids, which margins are placed against
const MARGIN_SIZES: Size[] = ["lg", "xl"];
type Heights = Record<Size, number>;

const uniform = (n: number): Heights => ({ sm: n, md: n, lg: n, xl: n });

function heights (block: Block, span: Span): Heights {
  const out = uniform(1);
  for (const { size, module, columns } of SIZES) {
    const width = (columns === COLUMNS ? span.width : PROSE) * module;
    out[size] = modules(measureBlock(block.nodes, width), module);
  }
  return out;
}

type Block = { type: BlockType; nodes: RootContent[] };

type Section = {
  isBreak: boolean;
  blocks: Block[];
};

// a run of columns, 1-based start, in 16-column units
type Span = { start: number; width: number };
const key = (span: Span) => `${span.start}/${span.width}`;

// the columns a span leaves free on either side
function free (span?: Span): Span[] {
  if (!span) return [{ start: 1, width: COLUMNS }];
  const spans: Span[] = [];
  if (span.start > 1) spans.push({ start: 1, width: span.start - 1 });
  const end = span.start + span.width;
  if (end <= COLUMNS) spans.push({ start: end, width: COLUMNS + 1 - end });
  return spans;
}

// the smallest span covering both
function hull (a?: Span, b?: Span): Span | undefined {
  if (!a || !b) return a || b;
  const start = Math.min(a.start, b.start);
  const end = Math.max(a.start + a.width, b.start + b.width);
  return { start, width: end - start };
}

const fit = (start: number, width: number) =>
  Math.max(1, Math.min(start, COLUMNS + 1 - width));

// a block's columns, given its section's prose offset
function columns (r: Random, type: BlockType, offset: number): Span {
  if (type === "code" || type === "table") {
    // wider blocks shift left to stay inside the grid
    return { start: fit(offset, WIDE), width: WIDE };
  }
  if (type === "image") {
    // wider than the prose: flush with its left or right edge, or centered
    const width = PROSE + r.pick(IMAGE_EXTRA);
    const extra = width - PROSE;
    const starts = [offset, offset - extra, offset - extra / 2]
      .filter(n => Number.isInteger(n))
      .map(n => fit(n, width));
    return { start: r.pick([...new Set(starts)]), width };
  }
  return { start: offset, width: PROSE };
}

/** Pull quotes (docs/design.md, Layout)
 * Every blockquote but an embed becomes a pull quote: a bordered box
 * in the heading face. At 16 columns it's a rectangle of whole
 * modules, as tall as its text at each module size, and never taller
 * than it is wide. Of the widths that fit, it takes the one that
 * leaves the least empty area below the text, summed over both module
 * sizes. The box leaves the prose column for the free columns beside
 * it, flush with either edge of a side wide enough, or else stays
 * flush with an edge of the column on its own row. A quote too long
 * for any box keeps the column's width. Below 16 columns it stacks
 * like any block, at its measured height */
const hasClass = (node: Element, name: string) =>
  ([] as unknown[]).concat(node.properties.className ?? []).includes(name);

const isQuote = (node: RootContent) =>
  isElement(node) &&
  node.tagName === "blockquote" &&
  !hasClass(node, "twitter-tweet");

function pullQuote (r: Random, block: Block, offset: number) {
  if (!block.nodes.every(isQuote)) return;
  for (const quote of block.nodes as Element[]) {
    for (const child of quote.children) {
      if (child.type === "element" && isAttribution(child)) child.properties.className = ["attribution"];
    }
  }
  // heights in modules at a width, and the empty area they leave, in
  // square modules, at the 16-column grids
  const shape = (width: number) => {
    const heights = uniform(1);
    let waste = 0;
    for (const { size, module, columns } of SIZES) {
      const w = columns === COLUMNS ? width : PROSE;
      const box = measureQuote(block.nodes, w * module);
      heights[size] = modules(box, module);
      if (columns === COLUMNS) waste += w * (heights[size] - box.height / module);
    }
    return { width, heights, waste };
  };
  const column = { start: offset, width: PROSE };
  const sides = free(column);
  const shapes = QUOTE_WIDTHS.map(shape)
    .filter(({ width, heights }) => MARGIN_SIZES.every(size => heights[size] <= width));
  const beside = shapes.filter(({ width }) => sides.some(side => side.width >= width));
  const best = (beside.length ? beside : shapes).sort((a, b) => a.waste - b.waste)[0];
  if (!best) return { span: column, heights: shape(PROSE).heights };
  const { width, heights } = best;
  const starts = beside.length
    ? sides
      .filter(side => side.width >= width)
      .flatMap(side => [side.start, side.start + side.width - width])
    : [offset, offset + PROSE - width];
  return { span: { start: r.pick([...new Set(starts)]), width }, heights };
}

function pickOffset (r: Random, previous?: number) {
  return r.pick(OFFSETS.filter(n => n !== previous));
}

type Row = {
  el: Element;
  // height in modules, by grid
  heights: Heights;
  // columns holding content
  content?: Span;
  band?: boolean;
  // a spacer between sections
  boundary?: boolean;
};

type Run = Span & { row: number; rows: number; y: number; modules: number };

// merges consecutive rows with the same free span into one run
function runs (rows: { y: number; modules: number; free: Span[] }[]): Run[] {
  const done: Run[] = [];
  let open = new Map<string, Run>();
  rows.forEach((row, i) => {
    const next = new Map<string, Run>();
    for (const span of row.free) {
      const run = open.get(key(span)) || { ...span, row: i + 1, rows: 0, y: row.y, modules: 0 };
      run.rows++;
      run.modules += row.modules;
      next.set(key(span), run);
    }
    for (const [k, run] of open) if (!next.has(k)) done.push(run);
    open = next;
  });
  return [...done, ...open.values()];
}

// the density field tiles are placed against, in 16-column modules,
// shared with the blog index
export function densityField (seed: string) {
  const noise = perlin(rng(seed)("noise"));
  return (x: number, y: number) =>
    smoothstep(DENSITY_LOW, DENSITY_HIGH, noise(x * NOISE_SCALE, y * NOISE_SCALE));
}

// Band tiles for one column count. Packing passes repeat on the same
// grid until there are min tiles, raising the density floor a little
// each pass, so a band where the field is empty still fills. Tiles
// past max are dropped, last placed first, which never brings two
// tiles edge to edge
export function fillBand (
  r: Random,
  density: (x: number, y: number) => number,
  columns: number, rows: number, top: number, min: number, max = Infinity,
) {
  const grid = createGrid(columns, rows);
  const region = { x: 0, y: 0, w: columns, h: rows };
  const scale = COLUMNS / columns;
  const tiles: Tile[] = [];
  for (let i = 0; i < 20 && tiles.length < min; i++) {
    tiles.push(...place(r, grid, region, (x, y) =>
      Math.max(i / 10, density(x * scale, top + 1 + y))));
  }
  return tiles.slice(0, max);
}

// the band after the content, at every column count, from row top
export const endBands = (
  r: Random,
  density: (x: number, y: number) => number,
  top: number,
) => [COLUMNS, 8, 4].map(columns => {
  const rows = END_ROWS[columns];
  return { columns, rows, tiles: fillBand(r, density, columns, rows, top, ...END_TILES[columns]) };
});

export default function rehypeSections ({ seed }: { seed: string }) {
  return (tree: Root) => {
    const sections: Section[] = [{ isBreak: false, blocks: [] }];
    const current = () => sections[sections.length - 1];

    for (const node of tree.children) {
      if (node.type === "doctype" || isBlank(node)) continue;
      if (node.type === "comment") continue;

      if (isElement(node) && node.tagName === "hr") {
        sections.push({ isBreak: true, blocks: [] });
        continue;
      }
      // h2 opens a new section, unless the section is still empty
      if (isElement(node) && node.tagName === "h2" && current().blocks.length) {
        sections.push({ isBreak: false, blocks: [] });
      }

      const type = classify(node);
      const { blocks } = current();
      const last = blocks[blocks.length - 1];
      // consecutive prose nodes merge into one run, and so do
      // blockquotes, which often hold the attribution in their own
      if ((type === "prose" || type === "blockquote") && last?.type === type) {
        last.nodes.push(node);
      } else {
        blocks.push({ type, nodes: [node] });
      }
    }

    const random = rng(seed);
    const layout = random("layout");
    // its own stream, so pull quotes don't reshuffle the layout
    const quotes = random("quote");
    const density = densityField(seed);

    // 1. lay out the rows
    const rows: Row[] = [];
    const spacer = (className = "spacer") =>
      rows.push({ el: element("div", className, ""), heights: uniform(1) });
    let offset: number | undefined;

    sections
      .filter(section => section.blocks.length || section.isBreak)
      .forEach((section, i) => {
        if (section.isBreak) {
          rows.push({
            el: element("div", "spacer spacer-section spacer-break", ""),
            heights: uniform(BAND + 2),
            band: true,
            boundary: true,
          });
        } else if (i > 0) {
          spacer("spacer spacer-section");
          rows[rows.length - 1].boundary = true;
        }
        if (!section.blocks.length) return;

        offset = pickOffset(layout, offset);
        section.blocks.forEach((block, j) => {
          // a heading stays attached to the block it introduces
          if (j > 0 && section.blocks[j - 1].type !== "heading") spacer();
          const pull = block.type === "blockquote" ? pullQuote(quotes, block, offset!) : undefined;
          const span = pull?.span ?? columns(layout, block.type, offset!);
          const h = pull?.heights ?? heights(block, span);
          rows.push({
            el: element("div", `block block-${pull ? "pullquote" : block.type}`,
              `--start:${span.start};--w:${span.width};` +
              SIZES.map(({ size }) => `--h-${size}:${h[size]}`).join(";"),
              block.nodes),
            heights: h,
            content: span,
          });
        });
      });

    let count = 0;
    const toElements = (tiles: Tile[], top = 0) => tiles.map(tile =>
      element("div", "tile",
        `grid-area:${tile.y + top + 1} / ${tile.x + 1} / span ${tile.size} / span ${tile.size}`, [
        element("flourish-tile", "", "", [], {
          seed: `${seed}:flourish:${count++}`,
          size: tile.size,
        }),
      ])
    );
    // a band's tiles, for one column count, with an empty row around them
    const band = (className: string, rows: number, tiles: Tile[]) =>
      element("div", `band ${className}`, `--rows:${rows + 2}`, toElements(tiles, 1));

    // 2. stack the rows at one size's module heights
    const stack = (size: Size) => {
      let y = 0;
      const placed = rows.map((row, i) => {
        const spans = row.band ? [] : free(row.content
          // a spacer's margins stay clear of the blocks on either side
          ?? hull(rows[i - 1]?.content, rows[i + 1]?.content));
        const modules = row.heights[size];
        const out = { ...row, modules, y, free: spans };
        y += modules;
        return out;
      });
      return { placed, height: y };
    };

    // 3. for each 16-column grid, mark the content on an occupancy
    // grid, and place tiles in margins and bands, top to bottom. The
    // grids differ in module size, so each gets its own set, and CSS
    // shows the one that matches
    const margins: Element[] = [];
    for (const size of MARGIN_SIZES) {
      const flourish = random(size === "lg" ? "flourish" : `flourish:${size}`);
      const { placed, height } = stack(size);
      const grid = createGrid(COLUMNS, height);
      for (const row of placed) {
        if (row.content) occupy(grid, row.content.start - 1, row.y, row.content.width, row.modules);
      }

      const regions = [
        ...runs(placed).map(run => ({ run, y: run.y })),
        ...placed.filter(row => row.band).map(row => ({ band: row, y: row.y })),
      ].sort((a, b) => a.y - b.y);

      for (const region of regions) {
        if ("band" in region && region.band) {
          const { y } = region.band;
          const tiles = place(flourish, grid, { x: 0, y: y + 1, w: COLUMNS, h: BAND }, density);
          region.band.el.children.push(band(`band-${COLUMNS} band-${size}`, BAND, tiles));
        } else if ("run" in region && region.run) {
          const { run } = region;
          const tiles = place(flourish, grid, { x: run.start - 1, y: run.y, w: run.width, h: run.modules }, density);
          if (!tiles.length) continue;
          margins.push(element("div", `margin margin-${size}`,
            `grid-row:${run.row} / span ${run.rows};--start:${run.start};--span:${run.width}`,
            toElements(tiles)));
        }
      }
    }

    // the narrow bands below follow the density field at the 64px grid
    const { placed, height: y } = stack("lg");

    // 4. below 16 columns, some section spacers become bands. Band
    // tiles follow the density field at the band's place on the page,
    // with x scaled to 16 columns (see fillBand)
    const narrow = random("narrow");
    const fill = (columns: number, rows: number, top: number, min: number, max = Infinity) =>
      fillBand(narrow, density, columns, rows, top, min, max);
    let previous = false;
    for (const row of placed) {
      if (!row.boundary) continue;
      const chance = NARROW_CHANCE * (0.5 + density(COLUMNS / 2, row.y));
      previous = !previous && narrow.next() < chance;
      if (!previous) continue;
      for (const columns of [8, 4]) {
        const rows = narrow.pick(NARROW_ROWS[columns]);
        const tiles = fill(columns, rows, row.y, 1);
        if (!tiles.length) tiles.push({ x: narrow.int(columns - rows + 1), y: 0, size: rows });
        row.el.children.push(band(`band-${columns}`, rows, tiles));
      }
    }

    // 5. a band after the content, at every column count
    const end = element("div", "spacer spacer-end", "");
    for (const { columns, rows, tiles } of endBands(narrow, density, y)) {
      end.children.push(band(`band-${columns}`, rows, tiles));
    }

    tree.children = [
      ...[...rows, { el: end }].map((row, i) => {
        row.el.properties.style = `grid-row:${i + 1};${row.el.properties.style || ""}`;
        return row.el;
      }),
      ...margins,
    ];
  };
}
