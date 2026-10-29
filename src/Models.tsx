import HTML from "./HTML";
import Header from "./Header";
import Footer from "./Footer";

/** /models: models from Novantica in a three.js viewer (models/main.ts).
 * The models, stickers, and lights come from the Unity project through
 * tools/unity-export, which writes images/models. */
export type EntrySummary = {
  id: string;
  title: string;
  caption?: string;
  stickers: number;
  lights: number;
  blinking: number;
  spinning: number;
};

export const MODELS_SRC = "/images/models/";

const MODES = [
  { id: "studio", title: "Studio" },
  { id: "toon", title: "Toon" },
  { id: "blueprint", title: "Blueprint" },
];

export default function Models (props: {
  css: string;
  entries: EntrySummary[];
}) {
  const [first] = props.entries;
  return (
    <HTML
      path="models"
      css={props.css}
      scripts={["/js/models.js"]}
      data={{
        title: "Models",
        description: "Models from Novantica, rendered with three.js",
      }}
    >
      <Header />
      <main className="main grid">
        <header className="post-header models-header">
          <h1 className="post-title">
            Models
          </h1>
        </header>
        <section
          id="models"
          className="models"
          data-src={MODELS_SRC}
          data-entry={first?.id}
          data-mode={MODES[0].id}>
          <div className="models-stage">
            <div className="models-viewer">
              <noscript>
                The viewer needs JavaScript and WebGL.
              </noscript>
            </div>
            <button
              type="button"
              className="models-round models-arrow models-prev"
              data-step="-1"
              aria-label="Previous model">
              <Chevron />
            </button>
            <button
              type="button"
              className="models-round models-arrow models-next"
              data-step="1"
              aria-label="Next model">
              <Chevron />
            </button>
            <p className="models-name caps" aria-live="polite">
              {first?.title}
            </p>
          </div>
          <div className="models-bar">
            <div className="models-dots" role="group" aria-label="Model">
              {props.entries.map(v => (
                <button
                  key={v.id}
                  type="button"
                  className="models-dot"
                  data-entry={v.id}
                  aria-label={v.title}
                  aria-pressed={v.id === first?.id}
                />
              ))}
            </div>
            {/* cycles through MODES; the label names the current one */}
            <button
              type="button"
              className="models-round models-shading"
              data-modes={JSON.stringify(MODES)}
              aria-label={`Shading: ${MODES[0].title}`}
              title={`Shading: ${MODES[0].title}`}>
              <span className="models-shading-icon" aria-hidden="true" />
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
