/** Block heights from font metrics (DESIGN.md §1)
 * Lays out a block's text the way the browser will, with the same
 * font files the page loads, so the build knows each block's height in
 * modules. Text wraps greedily at spaces, and after hyphens and
 * slashes, the same break opportunities a browser takes in English
 * text. Every line is two baselines tall, and margins and padding
 * follow style.css.
 *
 * A measurement is risky when a line came within a pixel or two of
 * wrapping differently, or when the content can't be measured exactly
 * (tables, embeds). A risky block gets an extra module when the last
 * line sits close to its bottom edge, so a browser that wraps one more
 * line still fits.
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { openSync, type Font } from "fontkit";
import { imageSize } from "image-size";
import type { Element, ElementContent, RootContent } from "hast";

const FONTS = "node_modules/@fontsource/ia-writer-quattro/files/ia-writer-quattro-latin";
// the page only loads mono's regular face, and its glyphs share one width
const MONO = "node_modules/@fontsource/ia-writer-mono/files/ia-writer-mono-latin-400-normal.woff2";
// headings are always bold, and the page only loads the upright face
const HEADING = "node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff2";
const LINE = 32;
const BASELINE = 16;
const SIZE = 16;
const CODE_SIZE = 14;
// inline code's left and right padding
const CODE_PAD = 4;
// blockquote padding and border
const QUOTE_INSET = BASELINE + 4;
// the browser default list indent, which style.css only resets for ul
const OL_INSET = 40;
// a line this close to the edge could wrap either way
const TOLERANCE = 2;
// image aspect ratio when neither the markup nor the file gives one
const IMAGE_RATIO = 9 / 16;
// the browser default iframe height
const IFRAME_HEIGHT = 150;

const faces: Record<string, Font> = {};
function face ({ bold, italic, family }: Style): Font {
  if (family === "mono") return faces.mono ??= openSync(MONO) as Font;
  if (family === "heading") return faces.heading ??= openSync(HEADING) as Font;
  const name = `${bold ? 700 : 400}-${italic ? "italic" : "normal"}`;
  return faces[name] ??= openSync(`${FONTS}-${name}.woff2`) as Font;
}

type Family = "body" | "mono" | "heading";
type Style = { bold: boolean; italic: boolean; size: number; family: Family };
const BODY: Style = { bold: false, italic: false, size: SIZE, family: "body" };

const widths = new Map<string, number>();
function measure (text: string, style: Style) {
  const key = `${+style.bold}${+style.italic}${style.family}${style.size}:${text}`;
  let width = widths.get(key);
  if (width === undefined) {
    const font = face(style);
    width = font.layout(text).advanceWidth * style.size / font.unitsPerEm;
    widths.set(key, width);
  }
  return width;
}

export type Box = { height: number; risky: boolean };

const isElement = (node: RootContent | ElementContent): node is Element =>
  node.type === "element";

/* Inline layout
 * Inline content becomes a list of unbreakable words, each with the
 * width of the collapsed space before it, or none after a hyphen or
 * slash break, and the number of <br>s before it */
type Word = { width: number; space: number; breaks: number };

// break after a hyphen or slash, and around an em dash, unless a digit follows
const BREAKS = /(?<=[-/—])(?=[^\d\s])|(?=—)/;

function words (nodes: ElementContent[], style: Style): Word[] {
  const out: Word[] = [];
  let word: Word | null = null;
  let space = 0;
  let breaks = 0;
  let pad = 0;

  const chunk = (text: string, style: Style) => {
    if (!word) {
      word = { width: pad, space: breaks ? 0 : space, breaks };
      out.push(word);
      space = breaks = pad = 0;
    }
    word.width += measure(text, style);
  };
  const text = (value: string, style: Style) => {
    for (const part of value.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s/.test(part)) {
        // collapsed, and dropped at the start of a block
        if (word || (out.length && !space)) space = measure(" ", style);
        word = null;
        continue;
      }
      part.split(BREAKS).forEach((piece, i) => {
        if (i > 0) word = null;
        chunk(piece, style);
      });
    }
  };
  const walk = (node: ElementContent, style: Style) => {
    if (node.type === "text") return text(node.value, style);
    if (!isElement(node)) return;
    const tag = node.tagName;
    if (tag === "br") {
      word = null;
      breaks++;
      return;
    }
    if (tag === "script" || tag === "style" || tag === "img") return;
    const next = {
      bold: style.bold || tag === "strong" || tag === "b" || tag === "th",
      italic: style.italic || tag === "em" || tag === "i",
      size: tag === "code" ? CODE_SIZE : style.size,
      family: tag === "code" ? "mono" : style.family,
    };
    if (tag === "code") pad += CODE_PAD;
    node.children.forEach(child => walk(child, next));
    if (tag === "code") {
      if (word) (word as Word).width += CODE_PAD;
      else pad += CODE_PAD;
    }
  };

  nodes.forEach(node => walk(node, style));
  return out;
}

function lines (nodes: ElementContent[], width: number, style: Style, line = LINE): Box {
  const list = words(nodes, style);
  if (!list.length) return { height: 0, risky: false };
  let count = 1;
  let x = list[0].width;
  let risky = false;
  for (const word of list.slice(1)) {
    if (word.breaks) {
      count += word.breaks;
      x = word.width;
      continue;
    }
    const next = x + word.space + word.width;
    if (Math.abs(next - width) < TOLERANCE) risky = true;
    if (next <= width) {
      x = next;
    } else {
      count++;
      x = word.width;
    }
  }
  return { height: count * line, risky };
}

/* Block layout
 * Stacks block children, with inline runs between them as anonymous
 * blocks, and the margin style.css puts after every flow element but
 * the last */
const BLOCKS = new Set([
  "p", "ul", "ol", "li", "blockquote", "pre", "table", "figure", "figcaption",
  "div", "section", "h1", "h2", "h3", "h4", "h5", "h6", "img", "video", "iframe",
]);
const SPACED = new Set(["p", "ul", "ol", "blockquote", "pre", "table", "figure"]);

const sum = (boxes: Box[]): Box => ({
  height: boxes.reduce((n, box) => n + box.height, 0),
  risky: boxes.some(box => box.risky),
});

function flow (nodes: ElementContent[], width: number, style: Style): Box {
  const boxes: Box[] = [];
  let inline: ElementContent[] = [];
  const flush = () => {
    if (inline.length) boxes.push(lines(inline, width, style));
    inline = [];
  };
  const elements = nodes.filter(isElement);
  const last = elements[elements.length - 1];
  for (const node of nodes) {
    if (!isElement(node) || !BLOCKS.has(node.tagName)) {
      // media inside a link still display as blocks
      if (isElement(node) && hasMedia(node)) {
        flush();
        boxes.push(flow(node.children, width, style));
      } else {
        inline.push(node);
      }
      continue;
    }
    flush();
    boxes.push(block(node, width, style));
    if (SPACED.has(node.tagName) && node !== last) boxes.push({ height: LINE, risky: false });
  }
  flush();
  return sum(boxes);
}

function block (node: Element, width: number, style: Style): Box {
  const { tagName: tag, children } = node;
  if (/^h[1-6]$/.test(tag)) {
    return lines(children, width, { ...style, bold: true, size: tag === "h6" ? 12 : SIZE, family: "heading" });
  }
  if (tag === "img" || tag === "video" || tag === "iframe") return media(node, width);
  if (tag === "pre") return code(node, width);
  if (tag === "table") return table(node, width, style);
  if (tag === "ol") return flow(children, width - OL_INSET, style);
  if (tag === "blockquote") {
    const box = flow(children, width - QUOTE_INSET, style);
    // embeds replace their markup once their script runs
    return { ...box, risky: box.risky || hasClass(node, "twitter-tweet") };
  }
  return flow(children, width, style);
}

const MEDIA = new Set(["img", "video", "iframe"]);
const hasMedia = (node: Element): boolean =>
  MEDIA.has(node.tagName) || node.children.some(child => isElement(child) && hasMedia(child));

const hasClass = (node: Element, name: string) =>
  ([] as unknown[]).concat(node.properties.className ?? []).includes(name);

const toText = (node: ElementContent): string =>
  node.type === "text" ? node.value
  : isElement(node) ? node.children.map(toText).join("")
  : "";

// code keeps its lines, and scrolls rather than wrapping
function code (node: Element, width: number): Box {
  const rows = toText(node).replace(/\n$/, "").split("\n");
  const widest = Math.max(...rows.map(row => measure(row, { ...BODY, size: CODE_SIZE, family: "mono" })));
  return {
    height: rows.length * LINE + BASELINE * 2,
    // a scrollbar can add height outside macOS
    risky: widest > width - BASELINE * 2,
  };
}

// cells share the width evenly, which the browser only approximates
function table (node: Element, width: number, style: Style): Box {
  const rows: Element[] = [];
  const collect = (el: Element) => el.children.filter(isElement).forEach(child => {
    if (child.tagName === "tr") rows.push(child);
    else collect(child);
  });
  collect(node);
  const cell = { ...style, size: CODE_SIZE };
  const height = rows.reduce((n, row) => {
    const cells = row.children.filter(isElement);
    const inner = width / Math.max(1, cells.length) - BASELINE;
    return n + Math.max(LINE, ...cells.map(c => flow(c.children, inner, {
      ...cell, bold: c.tagName === "th",
    }).height));
  }, 0);
  return { height, risky: true };
}

/* Media fill the block's width. Images and video keep the ratio of
 * their width and height attributes, or of the image file when it's
 * in this repo, and iframes keep their height attribute */
const SITE = /^(https?:)?\/\/blog\.jxnblk\.com\//;

function ratio (node: Element): number | undefined {
  const width = Number(node.properties.width);
  const height = Number(node.properties.height);
  if (width && height) return height / width;
  const src = String(node.properties.src ?? "");
  if (!src.startsWith("/images/") && !SITE.test(src)) return;
  const file = join(".", src.replace(SITE, "/"));
  if (!existsSync(file)) return;
  try {
    const size = imageSize(readFileSync(file));
    if (size.width && size.height) return size.height / size.width;
  } catch {}
}

function media (node: Element, width: number): Box {
  if (node.tagName === "iframe") {
    const height = Number(node.properties.height);
    return { height: height || IFRAME_HEIGHT, risky: !height };
  }
  const known = ratio(node);
  return { height: width * (known ?? IMAGE_RATIO), risky: known === undefined };
}

/** Height in modules
 * A risky box gets an extra module when one more line wouldn't fit */
export function modules (box: Box, module: number) {
  const rows = Math.max(1, Math.ceil(box.height / module - 0.001));
  return box.risky && box.height + LINE > rows * module ? rows + 1 : rows;
}

/** A block's box at a width, from its top-level nodes. Image blocks
 * stack their media, which display as blocks */
export function measureBlock (nodes: RootContent[], width: number): Box {
  return flow(nodes as ElementContent[], width, BODY);
}

/** A flex row that wraps: items keep their own width, with a gap
 * between them, at body size by default */
export function measureWrap (items: string[], width: number, size = SIZE, gap = BASELINE): Box {
  if (!items.length) return { height: 0, risky: false };
  let count = 1;
  let x = -gap;
  let risky = false;
  for (const item of items) {
    const w = measure(item, { ...BODY, size });
    const next = x + gap + w;
    if (Math.abs(next - width) < TOLERANCE) risky = true;
    if (x < 0 || next <= width) x = next;
    else {
      count++;
      x = w;
    }
  }
  return { height: count * LINE, risky };
}

/** Heading text at a size and line height, body size by default */
export const measureHeading = (text: string, width: number, size = SIZE, line = LINE): Box =>
  lines([{ type: "text", value: text }], width, { ...BODY, bold: true, size, family: "heading" }, line);
