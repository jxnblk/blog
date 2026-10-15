import HTML from "./HTML";
import Header from "./Header";
import Footer from "./Footer";
import Flourish from "./Flourish";
import { densityField } from "./rehypeSections";
import { createGrid, occupy, place } from "./pack";
import { rng } from "./rng";

import type { PostData } from "./types";

export default function Blog (props: {
  posts: PostData[];
  css: string;
}) {
  const posts = props.posts?.sort((a, b) => {
    if (a.data.date < b.data.date) return 1;
    else if (a.data.date > b.data.date) return -1;
    else return 0;
  }).filter(p => !p.data.draft);

  return (
    <HTML
      path="blog"
      css={props.css}
      data={{
        title: "Blog",
      }}
    >
      <Header />
      <main className="main grid">
        <header className="post-header">
          <h1 className="post-title">
            Blog
          </h1>
        </header>
        <div className="spacer spacer-section" />
        <ul className="post-body blog-list">
          {posts?.map((post, i) => (
            <li
              key={post.path}
              className="block block-card"
              style={{ gridRow: i + 1 }}>
              <BlogPostCard {...post} />
            </li>
          ))}
          <BlogTiles posts={posts} />
        </ul>
      </main>
      <Footer />
    </HTML>
  );
};

export function BlogPostCard (props: PostData) {
  return (
    <>
      <h2>
        <a href={'/' + props.path}>
          {props.data.title}
        </a>
      </h2>
      <div className="flex wrap gap-1">
        <div>
          {props.data.date?.toLocaleDateString('en-US', { timeZone: 'UTC' })}
        </div>
        {props.data.tags?.map(tag => (
          <div
            key={tag}>
            #{tag}
          </div>
        ))}
      </div>
      {props.excerpt && (
        <>
          <div
            dangerouslySetInnerHTML={{
              __html: props.excerpt,
            }}
          />
          <a
            href={'/' + props.path}>
            Read more <span aria-hidden>{">>"}</span>
          </a>
        </>
      )}
    </>
  );
};

/** Tiles to the right of the list
 * Cards fill the left 8 of 16 columns, one row each, and a margin
 * spans the other 8 for every row. Tiles are placed in it the same way
 * as in a post (see rehypeSections), against card heights estimated
 * from the title length, and the client hides any that don't fit.
 * Below 16 columns the margin hides.
 */
const COLUMNS = 16;
const LIST = 8;
const CHARS_PER_LINE = Math.floor((LIST * 64) / (16 * 0.6));

// a title, plus the date and tags line, on two-baseline lines
const estimate = (post: PostData) =>
  Math.ceil((Math.ceil(post.data.title.length / CHARS_PER_LINE) + 1) / 2);

function BlogTiles ({ posts }: { posts: PostData[] }) {
  const seed = "blog";
  const height = posts.reduce((n, post) => n + estimate(post), 0);
  const grid = createGrid(COLUMNS, height);
  occupy(grid, 0, 0, LIST, height);
  const region = { x: LIST, y: 0, w: COLUMNS - LIST, h: height };
  const tiles = place(rng(seed)("flourish"), grid, region, densityField(seed));
  return (
    <li
      className="margin"
      style={{
        gridRow: `1 / span ${posts.length}`,
        "--start": LIST + 1,
        "--span": COLUMNS - LIST,
      } as React.CSSProperties}>
      {tiles.map((tile, i) => (
        <div
          key={i}
          className="tile"
          style={{
            gridArea: `${tile.y + 1} / ${tile.x + 1} / span ${tile.size} / span ${tile.size}`,
          }}>
          <Flourish seed={`${seed}:flourish:${i}`} size={tile.size} />
        </div>
      ))}
    </li>
  );
}

export const pad = (n: number) => ('00' + n).slice(-2);
