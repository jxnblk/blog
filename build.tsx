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

import HTML from "./src/HTML";

import type { Page, Post } from "./src/types";

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
    data: fm.data,
  };
}

async function parseMarkdown (post: Partial<Post>) {
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
  } as Post;
}

async function readPosts (): Promise<Post[]> {
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

function PostPage ({ post }: {
  post: Post,
}) {
  return (
    <HTML {...post}>
      {post.tree}
    </HTML>
  );
}

function createPostPage (post: Post): Page {
  const el = <PostPage post={post} />;
  const html = renderToStaticMarkup(el);
  return {
    path: post.path,
    html,
  };
}

async function getPages (): Promise<Page[]> {
  const posts = await readPosts();
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

async function build () {
  // ?? clear existing HTML or just manual delete if needed?
  const pages = await getPages();
  await Promise.all([
    generateHTML(pages),
    // generateJSON(pages),
    // generateMD(pages),
  ]);
  console.log(`Build ${pages.length} pages`);
}

build();
