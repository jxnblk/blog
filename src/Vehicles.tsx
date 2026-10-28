import HTML from "./HTML";
import Header from "./Header";
import Footer from "./Footer";

/** /vehicles: the Novantica vehicles in a three.js viewer (vehicles/main.ts).
 * The models, stickers, and lights come from the Unity project through
 * tools/unity-export, which writes images/vehicles. */
export type VehicleSummary = {
  id: string;
  title: string;
  caption?: string;
  stickers: number;
  lights: number;
  blinking: number;
  spinning: number;
};

export const VEHICLES_SRC = "/images/vehicles/";

const MODES = [
  { id: "studio", title: "Studio" },
  { id: "toon", title: "Toon" },
  { id: "blueprint", title: "Blueprint" },
];

export default function Vehicles (props: {
  css: string;
  vehicles: VehicleSummary[];
}) {
  const [first] = props.vehicles;
  return (
    <HTML
      path="vehicles"
      css={props.css}
      scripts={["/js/vehicles.js"]}
      data={{
        title: "Vehicles",
        description: "Vehicles from Novantica, rendered with three.js",
      }}
    >
      <Header />
      <main className="main grid">
        <header className="post-header">
          <h1 className="post-title">
            Vehicles
          </h1>
        </header>
        <p className="vehicles-intro">
          Vehicles from Novantica, exported from the Unity project with their
          stickers and lights. Drag to orbit, scroll or pinch to zoom.
        </p>
        <div className="spacer" />
        <section
          id="vehicles"
          className="vehicles"
          data-src={VEHICLES_SRC}
          data-vehicle={first?.id}
          data-mode={MODES[0].id}>
          <div className="vehicles-viewer">
            <noscript>
              The viewer needs JavaScript and WebGL.
            </noscript>
          </div>
          <div className="vehicles-controls">
            <div className="vehicles-group" role="group" aria-label="Vehicle">
              {props.vehicles.map(v => (
                <button
                  key={v.id}
                  type="button"
                  className="vehicles-button caps"
                  data-vehicle={v.id}
                  aria-pressed={v.id === first?.id}>
                  {v.title}
                </button>
              ))}
            </div>
            <div className="vehicles-group" role="group" aria-label="Shading">
              {MODES.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  className="vehicles-button caps"
                  data-mode={m.id}
                  aria-pressed={i === 0}>
                  {m.title}
                </button>
              ))}
            </div>
          </div>
          {props.vehicles.map(v => (
            <p
              key={v.id}
              className="vehicles-caption"
              data-vehicle={v.id}
              hidden={v.id !== first?.id}>
              {caption(v)}
            </p>
          ))}
        </section>
      </main>
      <Footer />
    </HTML>
  );
};

function caption (v: VehicleSummary) {
  if (v.caption) return v.caption;
  const parts = [];
  if (v.stickers) parts.push(count(v.stickers, "sticker"));
  if (v.lights) parts.push(count(v.lights, "light") + (v.blinking ? `, ${v.blinking} blinking` : ""));
  if (v.spinning) parts.push(count(v.spinning, "spinning ring"));
  return [v.title, ...parts].join(" · ");
}

const count = (n: number, noun: string) => `${n} ${noun}${n === 1 ? "" : "s"}`;
