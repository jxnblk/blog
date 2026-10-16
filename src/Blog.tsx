import HTML from "./HTML";
import Header from "./Header";
import Footer from "./Footer";
import Flourish from "./Flourish";
import { densityField, endBands } from "./rehypeSections";
import { createGrid, occupy, place, type Tile } from "./pack";
import { rng } from "./rng";
import { measureHeading, measureWrap, modules } from "./measure";

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
              style={{ gridRow: i + 1, ...cardStyle(post) }}>
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
      <h2 className="card-title">
        <a href={'/' + props.path}>
          {props.data.title}
        </a>
      </h2>
      <div className="card-meta flex wrap gap-1">
        <div>
          {date(props)}
        </div>
        {props.data.tags?.map(tag => (
          <div
            key={tag}>
            #{tag}
          </div>
        ))}
      </div>
    </>
  );
};

/** Tiles to the right of the list, and below it
 * Cards fill the left 8 of 16 columns, one row each, and a margin
 * spans the other 8 for every row. Tiles are placed in it the same way
 * as in a post (see rehypeSections), against card heights measured
 * from the title, date, and tags (see measure.ts), with one margin per
 * module size. Below 16 columns the margin hides. The end band after
 * the list is the same as a post's, at every column count.
 */
const SEED = "blog";
const COLUMNS = 16;
const LIST = 8;
const SIZES = [
  { size: "sm", module: 64 },
  { size: "md", module: 80 },
  { size: "lg", module: 64 },
  { size: "xl", module: 80 },
] as const;
type Size = typeof SIZES[number]["size"];

// the title and meta match a post's header (see style.css)
const TITLE_SIZE = 32;
const TITLE_LINE = 48;
const META_SIZE = 14;

const date = (post: PostData) =>
  post.data.date?.toLocaleDateString('en-US', { timeZone: 'UTC' }) ?? "";

// a title, then the date and tags, which wrap; cards are 8 modules
// wide at every grid, and at least 2 tall to keep the rhythm
const MIN_HEIGHT = 2;
function heights (post: PostData): Record<Size, number> {
  const out = {} as Record<Size, number>;
  for (const { size, module } of SIZES) {
    const width = LIST * module;
    const title = measureHeading(post.data.title, width, TITLE_SIZE, TITLE_LINE);
    const meta = measureWrap([date(post), ...(post.data.tags ?? []).map(tag => "#" + tag)], width, META_SIZE);
    out[size] = Math.max(MIN_HEIGHT, modules({
      height: title.height + meta.height,
      risky: title.risky || meta.risky,
    }, module));
  }
  return out;
}

const cardStyle = (post: PostData) => {
  const h = heights(post);
  return Object.fromEntries(SIZES.map(({ size }) => [`--h-${size}`, h[size]])) as React.CSSProperties;
};

function BlogTiles ({ posts }: { posts: PostData[] }) {
  const random = rng(SEED);
  const density = densityField(SEED);
  const cards = posts.map(heights);
  const total = (size: Size) => cards.reduce((n, h) => n + h[size], 0);
  let count = 0;
  const margins = (["lg", "xl"] as const).map(size => {
    const height = total(size);
    const grid = createGrid(COLUMNS, height);
    occupy(grid, 0, 0, LIST, height);
    const region = { x: LIST, y: 0, w: COLUMNS - LIST, h: height };
    const tiles = place(random(size === "lg" ? "flourish" : `flourish:${size}`), grid, region, density);
    const first = count;
    count += tiles.length;
    return { size, tiles, first };
  });
  const bands = endBands(random("narrow"), density, total("lg"));
  return (
    <>
      {margins.map(({ size, tiles, first }) => (
        <li
          key={size}
          className={`margin margin-${size}`}
          style={{
            gridRow: `1 / span ${posts.length}`,
            "--start": LIST + 1,
            "--span": COLUMNS - LIST,
          } as React.CSSProperties}>
          <Tiles tiles={tiles} first={first} />
        </li>
      ))}
      <li
        className="spacer spacer-end"
        style={{ gridRow: posts.length + 1 }}>
        {bands.map(band => {
          const first = count;
          count += band.tiles.length;
          return (
            <div
              key={band.columns}
              className={`band band-${band.columns}`}
              style={{ "--rows": band.rows + 2 } as React.CSSProperties}>
              {/* an empty row above the tiles */}
              <Tiles tiles={band.tiles} first={first} top={1} />
            </div>
          );
        })}
      </li>
    </>
  );
}

function Tiles ({ tiles, first, top = 0 }: { tiles: Tile[]; first: number; top?: number }) {
  return tiles.map((tile, i) => (
    <div
      key={i}
      className="tile"
      style={{
        gridArea: `${tile.y + top + 1} / ${tile.x + 1} / span ${tile.size} / span ${tile.size}`,
      }}>
      <Flourish seed={`${SEED}:flourish:${first + i}`} size={tile.size} />
    </div>
  ));
}

export const pad = (n: number) => ('00' + n).slice(-2);
