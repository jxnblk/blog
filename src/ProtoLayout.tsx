import HTML from "./HTML";
import Header from "./Header";
import Footer from "./Footer";

// Static grid prototype. Press "g" to toggle the module/baseline overlay.
export default function ProtoLayout (props: {
  css: string;
}) {
  return (
    <HTML path="layout" {...props}>
      <Header />
      <div className="main">
        {/* Title */}
        <div className="grid">
          <h1 className="text-block">
            Grid Prototype
          </h1>
          <div className="span-4 square fill" />
          <div className="span-4 square fill-tint" />
          <div className="span-2 square" />
          <div className="span-2 square fill" />
          <div className="span-2 square fill-tint" />
        </div>

        {/* Section: prose at start-1, flourish slots on the right */}
        <div className="grid">
          <div className="text-block start-1">
            <p>
              Every section's prose holds a fixed width of 8 modules for a
              comfortable measure. Its line-height is two baselines, so four
              lines fit in each square module.
            </p>
            <p>
              The negative space around it is where generative flourishes
              will go. These solid blocks are placeholders for those slots.
            </p>
          </div>
          <div className="span-4 square fill-tint" />
          <div className="span-2 square fill" />
          <div className="span-2 square" />
          <div className="span-2 square" />
          <div className="span-2 square fill" />
        </div>

        {/* Section: prose offset to start-9 */}
        <div className="grid">
          <div className="span-4 square fill" />
          <div className="span-4 square" />
          <div className="text-block start-9">
            <h2>Section</h2>
            <p>
              The next section moves to the right half. At 8 columns, prose
              spans the full width and spans halve, and at 4 columns they
              quarter.
            </p>
          </div>
          <div className="span-2 square fill-tint" />
          <div className="span-2 square fill" />
        </div>

        {/* Section break: full-width band */}
        <div className="grid">
          {[1, 2, 1, 4, 2, 1, 4, 1].map((n, i) => (
            <div
              key={i}
              className={`span-${n} square ${i % 2 ? "fill" : "fill-tint"}`}
            />
          ))}
        </div>

        {/* Module scale reference */}
        <div className="grid">
          <div className="span-1">1</div>
          <div className="span-2">2</div>
          <div className="span-4">4</div>
          <div className="span-8">8</div>
          <div className="span-16">16</div>
        </div>
      </div>
      <Footer />
    </HTML>
  );
}
