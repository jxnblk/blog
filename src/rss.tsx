/** RSS feed
 * An RSS 2.0 feed of published posts, newest first, with each post's
 * excerpt as its description (see rehypeExcerpt). Links in the excerpt
 * are made absolute against the post's URL, since feed readers show
 * them outside the site. Links and guids match the old feed, so
 * readers don't see old posts as new.
 */
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { Root, Element, ElementContent, RootContent } from "hast";
import type { PostData } from "./types";

const TITLE = "Jxnblk Blog";
const DESCRIPTION = "Brent Jackson - design engineer and aspiring indie game dev";
export const FEED_PATH = "rss.xml";

const URL_PROPS = ["href", "src"];

const escapeXml = (str: string) =>
  str.replace(/[<>&'"]/g, c => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  })[c]!);

function absolute (node: RootContent | ElementContent, base: string) {
  if (node.type !== "element") return;
  for (const prop of URL_PROPS) {
    const value = (node as Element).properties[prop];
    if (typeof value === "string") node.properties[prop] = new URL(value, base).href;
  }
  node.children.forEach(child => absolute(child, base));
}

function excerptHTML (excerpt: Root, base: string) {
  const hast = structuredClone(excerpt);
  hast.children.forEach(child => absolute(child, base));
  return renderToStaticMarkup(toJsxRuntime(hast, { Fragment, jsx, jsxs } as any));
}

/** `posts` are published and sorted newest first by build.tsx */
export function generateRSS (posts: PostData[], baseURL: string) {
  const items = posts;
  const updated = items.length ? new Date(items[0].data.date) : new Date();

  const item = (post: PostData) => {
    const url = `${baseURL}/${post.path}`;
    return [
      "<item>",
      `<title>${escapeXml(post.data.title)}</title>`,
      `<link>${url}</link>`,
      `<guid isPermaLink="true">${url}</guid>`,
      `<pubDate>${new Date(post.data.date).toUTCString()}</pubDate>`,
      ...(post.data.tags ?? []).map(tag => `<category>${escapeXml(tag)}</category>`),
      post.excerpt && `<description>${escapeXml(excerptHTML(post.excerpt.hast, url))}</description>`,
      "</item>",
    ].filter(Boolean).join("\n");
  };

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
    "<channel>",
    `<title>${TITLE}</title>`,
    `<link>${baseURL}/blog</link>`,
    `<description>${escapeXml(DESCRIPTION)}</description>`,
    `<language>en-us</language>`,
    `<lastBuildDate>${updated.toUTCString()}</lastBuildDate>`,
    `<atom:link href="${baseURL}/${FEED_PATH}" rel="self" type="application/rss+xml" />`,
    ...items.map(item),
    "</channel>",
    "</rss>",
  ].join("\n");
}
