/** Excerpts for the blog index and feeds
 * Copies the text blocks before a post's <!-- more --> comment to
 * file.data.excerpt, or its first paragraph when it has none. Media,
 * headings, and other markup are left out, so the excerpt reads as a
 * short run of prose. Runs before rehypeSections, which drops comments.
 */
import type { Root, RootContent, Element } from "hast";
import type { VFile } from "vfile";
import { isMediaParagraph } from "./rehypeSections";

declare module "vfile" {
  interface DataMap {
    excerpt: Root;
  }
}

const MORE = "more";
const PROSE = new Set(["p", "ul", "ol", "blockquote"]);

const isProse = (node: RootContent): node is Element =>
  node.type === "element" && PROSE.has(node.tagName) && !isMediaParagraph(node);

export default function rehypeExcerpt () {
  return (tree: Root, file: VFile) => {
    const more = tree.children.findIndex(node =>
      node.type === "comment" && node.value.trim() === MORE);
    const children = more > -1
      ? tree.children.slice(0, more).filter(isProse)
      : tree.children.filter(isProse).slice(0, 1);
    file.data.excerpt = {
      type: "root",
      // copied, since rehypeSections moves the originals into blocks
      children: structuredClone(children),
    };
  };
}
