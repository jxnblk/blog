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
import rehypeExcerpt from "./src/rehypeExcerpt";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { toHtml } from "hast-util-to-html";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";

import Post from "./src/Post";
import Home from "./src/Home";
import Blog from "./src/Blog";
import NotFound from "./src/404";
import Models, { type EntrySummary } from "./src/Models";
import { FlourishTile } from "./src/Flourish";
import { generateRSS, FEED_PATH } from "./src/rss";

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

// page scripts, bundled into build/js after the build dir is cleared
const SCRIPTS = ["src/models/main.ts"];

async function buildScripts () {
  const result = await Bun.build({
    entrypoints: SCRIPTS,
    outdir: join(OUT_DIR, "js"),
    // src/models/main.ts -> js/models.js
    root: "src",
    naming: "[dir].[ext]",
    minify: true,
    target: "browser",
  });
  if (!result.success) throw new AggregateError(result.logs, "Script build failed");
}

// committed output of `bun run export:models`
function readEntries (): EntrySummary[] {
  return JSON.parse(readFileSync("images/models/index.json", "utf8")).entries;
}

async function getAbout () {
  const raw = readFileSync(ABOUT, "utf8");
  // laid out like a post, seeded by the "home" slug
  const data = {
    slug: "home",
    content: raw,
  };
  return parseMarkdown(data, { sections: true });
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

const components = { "flourish-tile": FlourishTile };

declare module "vfile" {
  interface DataMap {
    hast: import("hast").Root;
  }
}

// the plain post markup, before rehypeSections lays it out, for api/all.json
const rehypeCopy = () => (tree: import("hast").Root, file: import("vfile").VFile) => {
  file.data.hast = structuredClone(tree);
};

async function parseMarkdown (post: Partial<PostData>, { sections = false } = {}) {
  const proc = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeCopy)
    .use(rehypeExcerpt)
    .use(sections ? [[rehypeSections, { seed: post.data?.seed ?? post.slug }]] : [])
    .use(rehypeReact, {
      Fragment,
      jsx,
      jsxs,
      components,
    } as any)
  const file = await proc.process(post.content);
  const hast = file.data.excerpt;

  return {
    ...post,
    tree: file.result,
    hast: file.data.hast,
    excerpt: hast?.children.length ? {
      hast,
      tree: toJsxRuntime(hast, { Fragment, jsx, jsxs, components } as any),
    } : undefined,
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

  console.log(`${posts.length} posts found`);

  // newest first; undated posts sort last
  return posts.sort((a, b) =>
    (b.data.date?.getTime() ?? -Infinity) - (a.data.date?.getTime() ?? -Infinity)
  );
}

const about = await getAbout();

const ctx: Context = {
  css,
  about: about.tree,
};

function createPostPage (post: PostData): Page {
  const el = <Post {...post} {...ctx} />;
  const html = renderToStaticMarkup(el);
  return {
    path: post.path,
    html,
  };
}


/** `posts` get a page each (drafts included, for preview); only `published`
 * posts are listed on the blog index */
async function getPages (posts: PostData[], published: PostData[]): Promise<Page[]> {
  const pages = posts.map(createPostPage);

  const home = <Home posts={published} {...ctx} />
  pages.push({
    path: "",
    html: renderToStaticMarkup(home),
  });

  const blog = <Blog posts={published} {...ctx} />;
  pages.push({
    path: "blog",
    html: renderToStaticMarkup(blog),
  });

  const models = <Models entries={readEntries()} {...ctx} />;
  pages.push({
    path: "models",
    html: renderToStaticMarkup(models),
  });

  const notfound = <NotFound {...ctx} />;
  pages.push({
    path: "404",
    html: renderToStaticMarkup(notfound),
  });
  return pages;
}

async function generateHTML (pages: Page[]) {
  for (const page of pages) {
    let filename = join(OUT_DIR, page.path, "index.html");
    if (page.path === "404") filename = join(OUT_DIR, "404.html");
    else await mkdir(join(OUT_DIR, page.path), { recursive: true });
    await writeFile(filename, "<!DOCTYPE html>\n" + page.html, "utf8");
  }
  console.log(`Generated ${pages.length} pages`);
}

function postToJSON (post: PostData) {
  return {
    path: post.path,
    slug: post.slug,
    url: BASE_URL + "/" + post.path,
    content: post.content,
    data: post.data,
  };
}

async function generateJSON (posts: PostData[]) {
  const indexJSON = JSON.stringify(posts.map(postToJSON));
  await mkdir(join(OUT_DIR, "api"), { recursive: true });
  await writeFile(join(OUT_DIR, "api", "index.json"), indexJSON);
}

/** api/all.json, in the shape the old build wrote, which the live site
 * still reads. Kept for the migration */
function postToLegacyJSON (post: Partial<PostData>) {
  return {
    path: post.path,
    slug: post.slug,
    title: post.data?.title,
    description: post.data?.description || null,
    date: post.data?.date,
    excerpt: post.excerpt ? toHtml(post.excerpt.hast) : "",
    html: post.hast ? toHtml(post.hast) : "",
    tags: post.data?.tags,
    image: post.data?.image,
  };
}

async function generateAllJSON (posts: PostData[]) {
  const all = {
    posts: posts.map(postToLegacyJSON),
    about: postToLegacyJSON({ ...about, path: "blog/about", slug: "about" }),
  };
  await mkdir(join(OUT_DIR, "api"), { recursive: true });
  await writeFile(join(OUT_DIR, "api", "all.json"), JSON.stringify(all));
}

async function generateFeed (posts: PostData[]) {
  await writeFile(join(OUT_DIR, FEED_PATH), generateRSS(posts, BASE_URL), "utf8");
}

// fontsource packages imported in style.css, served from /fonts
const FONTS = [
  "ia-writer-quattro",
  "ia-writer-mono",
  "plus-jakarta-sans",
];

async function copyStatic () {
  for (const font of FONTS) {
    await cp(`node_modules/@fontsource/${font}/files`, join(OUT_DIR, "fonts"), { recursive: true });
  }
  for (const name of STATIC) {
    await cp(name, join(OUT_DIR, name), { recursive: true });
  }
}

async function build () {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  const posts = await readPosts();
  // drafts and undated posts still get a page, but are left out of the
  // index, the api, and the feed
  const published = posts.filter(post => !post.data.draft && post.data.date);
  const pages = await getPages(posts, published);
  await Promise.all([
    generateHTML(pages),
    generateJSON(published),
    generateAllJSON(published),
    generateFeed(published),
    copyStatic(),
    buildScripts(),
    // generateMD(pages),
  ]);
  console.log(`Build ${pages.length} pages`);
}

build();
