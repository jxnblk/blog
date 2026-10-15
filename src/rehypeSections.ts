/** Content splitting (DESIGN.md §5)
 * Groups the top-level hast nodes into blocks, flat, so every block is
 * a direct item of the post's single grid. Spacer elements separate
 * the blocks:
 *
 *   <div class="block block-heading">…</div>
 *   <div class="spacer"></div>
 *   <div class="block block-prose">…</div>
 *   <div class="spacer spacer-section"></div>
 *   <div class="block block-heading">…</div>
 *
 * Sections start at h2 and hr. The hr itself is dropped and the spacer
 * before its section gets `spacer-break`, a slot for a flourish band later.
 * Placement is CSS only for now: no layout variants yet.
 */
import type { Root, RootContent, Element } from "hast";

export type BlockType =
  | "heading"
  | "prose"
  | "image"
  | "code"
  | "table"
  | "blockquote";

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
const MEDIA = new Set(["img", "figure", "iframe", "video"]);

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

const div = (className: string, children: RootContent[] = []): Element => ({
  type: "element",
  tagName: "div",
  properties: { className: className.split(" ") },
  children: children as Element["children"],
});

type Section = {
  isBreak: boolean;
  blocks: { type: BlockType; nodes: RootContent[] }[];
};

export default function rehypeSections () {
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

    const children: Element[] = [];
    sections
      .filter(section => section.blocks.length || section.isBreak)
      .forEach((section, i) => {
        if (section.isBreak) children.push(div("spacer spacer-section spacer-break"));
        else if (i > 0) children.push(div("spacer spacer-section"));
        section.blocks.forEach((block, j) => {
          // a heading stays attached to the block it introduces
          if (j > 0 && section.blocks[j - 1].type !== "heading") children.push(div("spacer"));
          children.push(div(`block block-${block.type}`, block.nodes));
        });
      });
    tree.children = children;
  };
}
