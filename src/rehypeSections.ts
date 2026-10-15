/** Content splitting and layout (DESIGN.md §5)
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
 * column chosen by rng('layout'). Block heights are estimated in
 * modules, and the content is marked on an occupancy grid for the
 * whole body. Runs of rows that share the same free columns get a
 * margin item, and tiles are placed in margins and bands against that
 * grid (see pack.ts), so they never sit edge to edge with content or
 * each other. The estimates can be off, so the client hides any tile
 * that ends up past its margin or touching content.
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

export type BlockType =
  | "heading"
  | "prose"
  | "image"
  | "code"
  | "table"
  | "blockquote";

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
const MEDIA = new Set(["img", "figure", "iframe", "video"]);

const COLUMNS = 16;
// prose column starts; the prose column is 8 wide
const OFFSETS = [1, 5, 9];
const PROSE = 8;
const WIDE = 12;
// images are one or two columns wider than the prose
const IMAGE_EXTRA = [1, 2];
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

const isBlank = (node: RootContent) =>
  node.type === "text" && !node.value.trim();

// a paragraph holding only media (and whitespace) is an image block
function isMediaParagraph (node: Element) {
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

/** Height estimate (DESIGN.md §1, Prose blocks)
 * Characters ÷ chars-per-line × line-height, rounded up to whole modules.
 * Measured against the 64px module, where blocks are tallest in
 * modules, so margins run long rather than short.
 */
const MODULE = 64;
const LINE = 32;
const CHARS_PER_LINE = Math.floor((PROSE * MODULE) / (16 * 0.6));
// image aspect ratio when the markup doesn't give a width and height
const IMAGE_RATIO = 9 / 16;

function toText (node: RootContent | ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(toText).join("");
  return "";
}

const lines = (text: string) =>
  Math.max(1, Math.ceil(text.trim().length / CHARS_PER_LINE));

function estimateLines (node: RootContent): number {
  if (!isElement(node)) return lines(toText(node));
  if (node.tagName === "pre") return toText(node).trimEnd().split("\n").length + 1;
  if (node.tagName === "table") {
    return node.children.reduce((n, child) =>
      n + (child.type === "element" ? child.children.filter(c => c.type === "element").length : 0), 0);
  }
  if (node.tagName === "ul" || node.tagName === "ol") {
    const items = node.children.filter(c => c.type === "element");
    return items.reduce((n, item) => n + lines(toText(item)), 0);
  }
  return lines(toText(node));
}

function findMedia (node: RootContent | ElementContent): Element | undefined {
  if (node.type !== "element") return;
  if (MEDIA.has(node.tagName)) return node;
  for (const child of node.children) {
    const media = findMedia(child);
    if (media) return media;
  }
}

function imageRatio (nodes: RootContent[]) {
  const media = nodes.map(findMedia).find(Boolean);
  const width = Number(media?.properties.width);
  const height = Number(media?.properties.height);
  return width && height ? height / width : IMAGE_RATIO;
}

function estimate (block: Block, width: number): number {
  const { type, nodes } = block;
  if (type === "heading") return 1;
  if (type === "image") return Math.max(1, Math.round(width * imageRatio(nodes)));
  // a blank line between nodes
  const total = nodes.reduce((n, node) => n + estimateLines(node), 0) + nodes.length - 1;
  return Math.max(1, Math.ceil((total * LINE) / MODULE));
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

function pickOffset (r: Random, previous?: number) {
  return r.pick(OFFSETS.filter(n => n !== previous));
}

type Row = {
  el: Element;
  // estimated height in modules
  modules: number;
  // columns holding content
  content?: Span;
  band?: boolean;
  // a spacer between sections
  boundary?: boolean;
};

type Run = Span & { row: number; rows: number; y: number; modules: number };

// merges consecutive rows with the same free span into one run
function runs (rows: (Row & { y: number; free: Span[] })[]): Run[] {
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
      // consecutive prose nodes merge into one run
      if (type === "prose" && last?.type === "prose") {
        last.nodes.push(node);
      } else {
        blocks.push({ type, nodes: [node] });
      }
    }

    const random = rng(seed);
    const layout = random("layout");
    const flourish = random("flourish");
    const noise = perlin(random("noise"));
    const density = (x: number, y: number) =>
      smoothstep(DENSITY_LOW, DENSITY_HIGH, noise(x * NOISE_SCALE, y * NOISE_SCALE));

    // 1. lay out the rows
    const rows: Row[] = [];
    const spacer = (className = "spacer") =>
      rows.push({ el: element("div", className, ""), modules: 1 });
    let offset: number | undefined;

    sections
      .filter(section => section.blocks.length || section.isBreak)
      .forEach((section, i) => {
        if (section.isBreak) {
          rows.push({
            el: element("div", "spacer spacer-section spacer-break", ""),
            modules: BAND + 2,
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
          const span = columns(layout, block.type, offset!);
          rows.push({
            el: element("div", `block block-${block.type}`,
              `--start:${span.start};--w:${span.width}`, block.nodes),
            modules: estimate(block, span.width),
            content: span,
          });
        });
      });

    // 2. mark the content on the occupancy grid
    let y = 0;
    const placed = rows.map((row, i) => {
      const spans = row.band ? [] : free(row.content
        // a spacer's margins stay clear of the blocks on either side
        ?? hull(rows[i - 1]?.content, rows[i + 1]?.content));
      const out = { ...row, y, free: spans };
      y += row.modules;
      return out;
    });
    const grid = createGrid(COLUMNS, y);
    for (const row of placed) {
      if (row.content) occupy(grid, row.content.start - 1, row.y, row.content.width, row.modules);
    }

    // 3. place tiles in margins and bands, top to bottom
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
    const band = (columns: number, rows: number, tiles: Tile[]) =>
      element("div", `band band-${columns}`, `--rows:${rows + 2}`, toElements(tiles, 1));

    const regions = [
      ...runs(placed).map(run => ({ run, y: run.y })),
      ...placed.filter(row => row.band).map(row => ({ band: row, y: row.y })),
    ].sort((a, b) => a.y - b.y);

    const margins: Element[] = [];
    for (const region of regions) {
      if ("band" in region && region.band) {
        const { y } = region.band;
        const tiles = place(flourish, grid, { x: 0, y: y + 1, w: COLUMNS, h: BAND }, density);
        region.band.el.children.push(band(COLUMNS, BAND, tiles));
      } else if ("run" in region && region.run) {
        const { run } = region;
        const tiles = place(flourish, grid, { x: run.start - 1, y: run.y, w: run.width, h: run.modules }, density);
        if (!tiles.length) continue;
        margins.push(element("div", "margin",
          `grid-row:${run.row} / span ${run.rows};--start:${run.start};--span:${run.width}`,
          toElements(tiles)));
      }
    }

    // 4. below 16 columns, some section spacers become bands. Band
    // tiles follow the density field at the band's place on the page,
    // with x scaled to 16 columns. Packing passes repeat on the same
    // grid until there are enough tiles, raising the density floor a
    // little each pass, so a band where the field is empty still fills
    const narrow = random("narrow");
    // tiles past max are dropped, last placed first, which never brings
    // two tiles edge to edge
    const fill = (columns: number, rows: number, top: number, min: number, max = Infinity) => {
      const grid = createGrid(columns, rows);
      const region = { x: 0, y: 0, w: columns, h: rows };
      const scale = COLUMNS / columns;
      const tiles: Tile[] = [];
      for (let i = 0; i < 20 && tiles.length < min; i++) {
        tiles.push(...place(narrow, grid, region, (x, y) =>
          Math.max(i / 10, density(x * scale, top + 1 + y))));
      }
      return tiles.slice(0, max);
    };
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
        row.el.children.push(band(columns, rows, tiles));
      }
    }

    // 5. a band after the content, at every column count
    const end = element("div", "spacer spacer-end", "");
    for (const columns of [COLUMNS, 8, 4]) {
      const rows = END_ROWS[columns];
      end.children.push(band(columns, rows, fill(columns, rows, y, ...END_TILES[columns])));
    }

    tree.children = [
      ...[...placed, { el: end }].map((row, i) => {
        row.el.properties.style = `grid-row:${i + 1};${row.el.properties.style || ""}`;
        return row.el;
      }),
      ...margins,
    ];
  };
}
