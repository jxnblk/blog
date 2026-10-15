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
 * column chosen by rng('layout'). Runs of rows that share the same free
 * columns get a margin item, filled with flourish tiles. The margin's
 * height is estimated here in modules, and the client hides any tile
 * that ends up past the content.
 *
 * Columns are authored against 16 columns: below that, CSS stacks the
 * blocks full width and hides the margins.
 */
import type { Root, RootContent, Element, ElementContent } from "hast";
import { rng, type Random } from "./rng";
import { pack } from "./pack";

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
const WIDTHS: Record<BlockType, number> = {
  heading: 8,
  prose: 8,
  blockquote: 8,
  image: 8,
  code: 12,
  table: 12,
};
// section break bands, in modules
const BAND = 2;

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
const CHARS_PER_LINE = Math.floor((8 * MODULE) / (16 * 0.6));
const IMAGE_MODULES = 4;

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

function estimate (type: BlockType, nodes: RootContent[]): number {
  if (type === "heading") return 1;
  if (type === "image") return IMAGE_MODULES;
  // a blank line between nodes
  const total = nodes.reduce((n, node) => n + estimateLines(node), 0) + nodes.length - 1;
  return Math.max(1, Math.ceil((total * LINE) / MODULE));
}

type Block = { type: BlockType; nodes: RootContent[] };

type Section = {
  isBreak: boolean;
  blocks: Block[];
};

// a free run of columns, inclusive start, in 16-column units
type Span = { start: number; width: number };
const key = (span: Span) => `${span.start}/${span.width}`;

// the columns an occupied range leaves free on either side
function free (start: number, width: number): Span[] {
  const spans: Span[] = [];
  if (start > 1) spans.push({ start: 1, width: start - 1 });
  const end = start + width;
  if (end <= COLUMNS) spans.push({ start: end, width: COLUMNS + 1 - end });
  return spans;
}

function blockStart (type: BlockType, offset: number) {
  // wider blocks shift left to stay inside the grid
  return Math.min(offset, COLUMNS + 1 - WIDTHS[type]);
}

function pickOffset (r: Random, previous?: number) {
  return r.pick(OFFSETS.filter(n => n !== previous));
}

type Row = { free: Span[]; modules: number };

type Run = Span & { row: number; rows: number; modules: number };

// merges consecutive rows with the same free span into one run
function runs (rows: Row[], first: number): Run[] {
  const done: Run[] = [];
  let open = new Map<string, Run>();
  rows.forEach((row, i) => {
    const next = new Map<string, Run>();
    for (const span of row.free) {
      const run = open.get(key(span)) || { ...span, row: first + i, rows: 0, modules: 0 };
      run.rows++;
      run.modules += row.modules;
      next.set(key(span), run);
    }
    for (const [k, run] of open) if (!next.has(k)) done.push(run);
    open = next;
  });
  return [...done, ...open.values()];
}

function tiles (r: Random, seed: string, w: number, h: number, density: number, count: { n: number }) {
  return pack(r, w, h, density).map(tile =>
    element("div", "tile", `grid-area:${tile.y + 1} / ${tile.x + 1} / span ${tile.size} / span ${tile.size}`, [
      element("flourish-tile", "", "", [], {
        seed: `${seed}:flourish:${count.n++}`,
        size: tile.size,
      }),
    ])
  );
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
    const count = { n: 0 };

    const children: Element[] = [];
    const margins: Element[] = [];
    let row = 0;
    let offset: number | undefined;

    const push = (el: Element) => {
      row++;
      el.properties.style = `grid-row:${row};${el.properties.style || ""}`;
      children.push(el);
    };

    sections
      .filter(section => section.blocks.length || section.isBreak)
      .forEach((section, i) => {
        if (section.isBreak) {
          push(element("div", "spacer spacer-section spacer-break", "",
            tiles(flourish, seed, COLUMNS, BAND, 2, count)));
        } else if (i > 0) {
          push(element("div", "spacer spacer-section", ""));
        }
        if (!section.blocks.length) return;

        offset = pickOffset(layout, offset);
        const first = row + 1;
        const rows: Row[] = [];

        section.blocks.forEach((block, j) => {
          // a heading stays attached to the block it introduces
          if (j > 0 && section.blocks[j - 1].type !== "heading") {
            push(element("div", "spacer", ""));
            rows.push({ free: free(offset!, WIDTHS.prose), modules: 1 });
          }
          const start = blockStart(block.type, offset!);
          push(element("div", `block block-${block.type}`, `--start:${start}`, block.nodes));
          rows.push({
            free: free(start, WIDTHS[block.type]),
            modules: estimate(block.type, block.nodes),
          });
        });

        for (const run of runs(rows, first)) {
          const children = tiles(flourish, seed, run.width, run.modules, 1, count);
          if (!children.length) continue;
          margins.push(element("div", "margin",
            `grid-row:${run.row} / span ${run.rows};--start:${run.start};--span:${run.width}`,
            children));
        }
      });

    tree.children = [...children, ...margins];
  };
}
