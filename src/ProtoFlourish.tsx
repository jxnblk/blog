import HTML from "./HTML";
import Header from "./Header";
import Footer from "./Footer";
import Flourish from "./Flourish";
import { createRandom } from "./rng";

const SEEDS = Array.from({ length: 64 }, (_, i) => `seed-${i}`);

// Each flourish is preceded by 1–3 empty slots of the same size,
// so compositions don't run together
function Gallery ({ seeds, span }: { seeds: string[]; span: number }) {
  const r = createRandom(`gallery:${span}`);
  return seeds.flatMap(seed => [
    ...Array.from({ length: 1 + r.int(3) }, (_, i) => (
      <div key={`${seed}-gap-${i}`} className={`span-${span} square`} />
    )),
    <div key={seed} className={`span-${span} square`} title={seed}>
      <Flourish seed={seed} size={span} />
    </div>,
  ]);
}

// Flourish gallery for tuning. Press "g" to toggle the grid overlay.
export default function ProtoFlourish (props: {
  css: string;
}) {
  return (
    <HTML path="flourish" {...props}>
      <Header />
      <div className="main">
        <div className="grid">
          <h1 className="heading text-block">Flourishes</h1>
        </div>

        <div className="grid">
          <h2 className="heading span-16">4 × 4</h2>
          <Gallery seeds={SEEDS} span={4} />
        </div>

        <div className="grid">
          <h2 className="heading span-16">2 × 2</h2>
          <Gallery seeds={SEEDS} span={2} />
        </div>

        <div className="grid">
          <h2 className="heading span-16">8 × 8</h2>
          <Gallery seeds={SEEDS.slice(0, 8)} span={8} />
        </div>
      </div>
      <Footer />
    </HTML>
  );
}
