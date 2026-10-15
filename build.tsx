import {
  readdirSync,
  readFileSync,
} from "node:fs";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
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
import rehypeSections from "./src/rehypeSections";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";

import Post from "./src/Post";
import Home from "./src/Home";
import Blog from "./src/Blog";
import NotFound from "./src/404";
import ProtoLayout from "./src/ProtoLayout";
import ProtoFlourish from "./src/ProtoFlourish";
import { FlourishTile } from "./src/Flourish";

import cssFile from "./src/style.css" with { type: "file" };

import type { Page, Context, PostData, Metadata } from "./src/types";

const BASE_URL = "https://jxnblk.com";
const OUT_DIR = "build";
const ABOUT = "src/about.md";

const STATIC = [
  "images",
  "favicon.png",
  "CNAME",
  ".nojekyll",
];

const bundle = await Bun.build({
  entrypoints: [cssFile],
  minify: true,
  external: [
    "images/*",
    "*.woff2",
    "*.woff",
  ],
});
const css = (await bundle.outputs[0].text()).replaceAll("./files/", "/fonts/");

async function getAbout () {
  const raw = readFileSync(ABOUT, "utf8");
  // laid out like a post, seeded by the "home" slug
  const data = {
    slug: "home",
    content: raw,
  };
  const md = await parseMarkdown(data, { sections: true });
  return md.tree;
}

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

async function parseMarkdown (post: Partial<PostData>, { sections = false } = {}) {
  const proc = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeRaw)
    .use(sections ? [[rehypeSections, { seed: post.data?.seed ?? post.slug }]] : [])
    .use(rehypeReact, {
      Fragment,
      jsx,
      jsxs,
      components: { "flourish-tile": FlourishTile },
    } as any)
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
    .map(post => parseMarkdown(post, { sections: true }))
  );

  console.log(posts.length);

  return posts;
}

const ctx: Context = {
  css,
  about: await getAbout(),
};

function createPostPage (post: PostData): Page {
  const el = <Post {...post} {...ctx} />;
  const html = renderToStaticMarkup(el);
  return {
    path: post.path,
    html,
  };
}


async function getPages (posts: PostData[]): Promise<Page[]> {
  const pages = posts.map(createPostPage);

  const home = <Home posts={posts} {...ctx} />
  pages.push({
    path: "",
    html: renderToStaticMarkup(home),
  });

  const blog = <Blog posts={posts} {...ctx} />;
  pages.push({
    path: "blog",
    html: renderToStaticMarkup(blog),
  });

  const notfound = <NotFound {...ctx} />;
  pages.push({
    path: "404",
    html: renderToStaticMarkup(notfound),
  });

  const protoLayout = <ProtoLayout {...ctx} />;
  pages.push({
    path: "layout",
    html: renderToStaticMarkup(protoLayout),
  });

  const protoFlourish = <ProtoFlourish {...ctx} />;
  pages.push({
    path: "flourish",
    html: renderToStaticMarkup(protoFlourish),
  });
  return pages;
}

async function generateHTML (pages: Page[]) {
  for (const page of pages) {
    let filename = join(OUT_DIR, page.path, "index.html");
    if (page.path === "404") filename = join(OUT_DIR, "404.html");
    else await mkdir(join(OUT_DIR, page.path), { recursive: true });
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
  await mkdir(join(OUT_DIR, "api"), { recursive: true });
  await writeFile(join(OUT_DIR, "api", "index.json"), indexJSON);
}

async function copyStatic () {
  await cp("node_modules/@fontsource/ia-writer-quattro/files", join(OUT_DIR, "fonts"), { recursive: true });
  for (const name of STATIC) {
    await cp(name, join(OUT_DIR, name), { recursive: true });
  }
}

async function build () {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  const posts = await readPosts();
  const pages = await getPages(posts);
  await Promise.all([
    generateHTML(pages),
    generateJSON(posts),
    copyStatic(),
    // generateMD(pages),
  ]);
  console.log(`Build ${pages.length} pages`);
}

build();
