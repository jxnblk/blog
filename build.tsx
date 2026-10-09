import {
  readdirSync,
  readFileSync,
} from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import {
  join,
  extname,
  basename,
} from "node:path";
import matter from "gray-matter";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";

import Post from "./src/Post";

import type { Page, PostData, Metadata } from "./src/types";

const BASE_URL = "https://jxnblk.com";

function parseFile (filename: string) {
  const slug = basename(filename, ".md");
  const path = "blog/" + slug;
  const raw = readFileSync(filename);
  const fm = matter(raw);
  return {
    filename,
    slug,
    path,
    raw: String(raw),
    content: fm.content,
    data: fm.data as Metadata,
  };
}

async function parseMarkdown (post: Partial<PostData>) {
  const proc = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeRaw)
    .use(rehypeReact, { Fragment, jsx, jsxs })
  const tree = await proc.process(post.content);

  return {
    ...post,
    tree: tree.result,
  } as PostData;
}

async function readPosts (): Promise<PostData[]> {
  const filenames = readdirSync("src/posts")
    .filter(f => extname(f) === ".md")
    .map(f => join("src", "posts", f));
  const posts = await Promise.all(filenames
    .map(parseFile)
    .map(parseMarkdown)
  );

  console.log(posts.length);

  return posts;
}

function createPostPage (post: PostData): Page {
  const el = <Post {...post} />;
  const html = renderToStaticMarkup(el);
  return {
    path: post.path,
    html,
  };
}

async function getPages (posts: PostData[]): Promise<Page[]> {
  const pages = posts.map(createPostPage);
  pages.push({
    path: "",
    html: "<html>TODO</html>",
  });
  pages.push({
    path: "blog",
    html: "<html>TODO</html>",
  });
  pages.push({
    path: "404",
    html: "<html>TODO</html>",
  });
  return pages;
}

async function generateHTML (pages: Page[]) {
  for (const page of pages) {
    if (page.path) await mkdir(page.path, { recursive: true });
    let filename = join(page.path, "index.html");
    if (page.path === "404") filename = "404.html";
    await writeFile(filename, page.html, "utf8");
  }
  console.log(`Generated ${pages.length} pages`);
}

function postToJSON (post: PostData) {
  return {
    path: post.path,
    slug: post.slug,
    url: BASE_URL + post.path,
    content: post.content,
    data: post.data,
  };
}

async function generateJSON (posts: PostData[]) {
  const indexJSON = JSON.stringify(posts.map(postToJSON));
  await writeFile("api/index.json", indexJSON);
}

async function build () {
  // ?? clear existing HTML or just manual delete if needed?
  const posts = await readPosts();
  const pages = await getPages(posts);
  await Promise.all([
    generateHTML(pages),
    generateJSON(posts),
    // generateMD(pages),
  ]);
  console.log(`Build ${pages.length} pages`);
}

build();
