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
        <header className="post-header vehicles-header">
          <h1 className="post-title">
            Vehicles
          </h1>
        </header>
        <section
          id="vehicles"
          className="vehicles"
          data-src={VEHICLES_SRC}
          data-vehicle={first?.id}
          data-mode={MODES[0].id}>
          <div className="vehicles-stage">
            <div className="vehicles-viewer">
              <noscript>
                The viewer needs JavaScript and WebGL.
              </noscript>
            </div>
            <button
              type="button"
              className="vehicles-round vehicles-arrow vehicles-prev"
              data-step="-1"
              aria-label="Previous vehicle">
              <Chevron />
            </button>
            <button
              type="button"
              className="vehicles-round vehicles-arrow vehicles-next"
              data-step="1"
              aria-label="Next vehicle">
              <Chevron />
            </button>
            <p className="vehicles-name caps" aria-live="polite">
              {first?.title}
            </p>
          </div>
          <div className="vehicles-bar">
            <div className="vehicles-dots" role="group" aria-label="Vehicle">
              {props.vehicles.map(v => (
                <button
                  key={v.id}
                  type="button"
                  className="vehicles-dot"
                  data-vehicle={v.id}
                  aria-label={v.title}
                  aria-pressed={v.id === first?.id}
                />
              ))}
            </div>
            {/* cycles through MODES; the label names the current one */}
            <button
              type="button"
              className="vehicles-round vehicles-shading"
              data-modes={JSON.stringify(MODES)}
              aria-label={`Shading: ${MODES[0].title}`}
              title={`Shading: ${MODES[0].title}`}>
              <span className="vehicles-shading-icon" aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </HTML>
  );
};

// points left; the next button flips it in CSS
function Chevron () {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path
        d="M15 5l-7 7 7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
