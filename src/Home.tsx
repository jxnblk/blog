import HTML from "./HTML";
import Header from './Header';
import Footer from './Footer';
import Flourish from "./Flourish";
import { densityField, fillBand } from "./rehypeSections";
import { rng } from "./rng";
import { measureHeading, modules } from "./measure";
import type { PostData } from "./types";

export default function Home (props: {
  posts: PostData[];
  css: string;
  about: React.ReactElement;
}) {
  return (
    <HTML css={props.css} path="">
      <Header />
      <main className="main grid">
        <TitleBands position="above" />
        <header className="post-header home-header">
          <h1 className="home-title" style={titleStyle()}>
            {TITLE}
          </h1>
        </header>
        <TitleBands position="below" />
        {/* blocks, spacers, and margins come from rehypeSections */}
        <div className="post-body">
          {props.about}
        </div>
      </main>
      <Footer />
    </HTML>
  );
};

const TITLE = "Brent Jackson is a design engineer, aspiring indie game developer, and proud cat parent. Based in Brooklyn, NY";

/** Title height in modules, measured for each grid (see measure.ts)
 * The title is 32px on 48px lines, full width at 8 columns and 12
 * columns wide at 16 */
const TITLE_SIZE = 32;
const TITLE_LINE = 48;
const SIZES = [
  { size: "sm", module: 64, columns: 8 },
  { size: "md", module: 80, columns: 8 },
  { size: "lg", module: 64, columns: 12 },
  { size: "xl", module: 80, columns: 12 },
];

const titleStyle = () => Object.fromEntries(SIZES.map(({ size, module, columns }) => [
  `--h-${size}`,
  modules(measureHeading(TITLE, columns * module, TITLE_SIZE, TITLE_LINE), module),
])) as React.CSSProperties;

/** Bands of tiles above and below the title
 * The same bands as a post's section breaks, one per column count, with
 * an empty row around the tiles, so the title gets space on either
 * side. Seeded apart from the about text, which also uses "home"
 */
const SEED = "home:title";
// tile rows, and the fewest and most tiles, by column count
const BANDS: { columns: number; rows: number; tiles: [number, number] }[] = [
  { columns: 16, rows: 2, tiles: [2, 4] },
  { columns: 8, rows: 2, tiles: [1, 3] },
  { columns: 4, rows: 1, tiles: [1, 2] },
];

function TitleBands ({ position }: { position: "above" | "below" }) {
  const seed = `${SEED}:${position}`;
  const random = rng(seed)("tiles");
  const density = densityField(seed);
  return (
    <div className="spacer spacer-section">
      {BANDS.map(({ columns, rows, tiles: [min, max] }) => {
        const tiles = fillBand(random, density, columns, rows, 0, min, max);
        return (
          <div
            key={columns}
            className={`band band-${columns}`}
            style={{ "--rows": rows + 2 } as React.CSSProperties}>
            {tiles.map((tile, i) => (
              <div
                key={i}
                className="tile"
                style={{
                  // an empty row above the tiles
                  gridArea: `${tile.y + 2} / ${tile.x + 1} / span ${tile.size} / span ${tile.size}`,
                }}>
                <Flourish seed={`${seed}:${columns}:${i}`} size={tile.size} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
