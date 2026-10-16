/// <reference lib="dom" />
// Dev-only palette tuner: HSL sliders for each tile family's base color,
// plus background and text, previewed together. Run with `bun run palette`.
import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  layout,
  FOLIAGE,
  FLORAL,
  FLORAL_HUES,
  type Family,
  type HSL,
} from "../../src/Flourish";

type Key = Family | "background" | "text";
type Palette = Record<Key, HSL>;

const mid = ([a, b]: [number, number]) => (a + b) / 2;
const round = (c: HSL): HSL => c.map(n => Math.round(n)) as HSL;

// each family starts at the center of its range in Flourish.tsx
const FAMILY_CENTERS: Record<Family, HSL> = {
  foliage: [mid(FOLIAGE.hue), mid(FOLIAGE.sat), mid(FOLIAGE.light)],
  ...Object.fromEntries(FLORAL_HUES.map(f => [f.family, [mid(f.hue), mid(FLORAL.sat), mid(FLORAL.light)]])),
} as Record<Family, HSL>;

const FAMILIES: Family[] = ["foliage", "poppy", "marigold", "peony", "violet"];

const DEFAULTS: Palette = {
  background: [44, 81, 90], // paper, #faefd0
  text: [45, 51, 16],       // paper text, darkened
  ...Object.fromEntries(FAMILIES.map(f => [f, round(FAMILY_CENTERS[f])])),
} as Palette;

const STORAGE_KEY = "palette";

function load (): Palette {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (saved) return { ...DEFAULTS, ...saved };
  } catch {}
  return DEFAULTS;
}

// Color schemes: each derives the floral hues from the foliage hue, as
// offsets in degrees. Some take an adjustable angle.
type SchemeName =
  | "free"
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "split"
  | "triadic"
  | "square"
  | "rectangle";

type Scheme = {
  label: string;
  offsets: (angle: number) => number[];
  angle?: { label: string; min: number; max: number; default: number };
};

const SCHEMES: Record<Exclude<SchemeName, "free">, Scheme> = {
  monochromatic: { label: "Monochromatic", offsets: () => [0] },
  analogous: {
    label: "Analogous",
    offsets: a => [-2 * a, -a, a, 2 * a],
    angle: { label: "Step", min: 5, max: 60, default: 30 },
  },
  complementary: { label: "Complementary", offsets: () => [180] },
  split: {
    label: "Split complementary",
    offsets: a => [180 - a, 180 + a],
    angle: { label: "Spread from complement", min: 5, max: 90, default: 30 },
  },
  triadic: { label: "Triadic", offsets: () => [120, 240] },
  square: { label: "Tetradic: square", offsets: () => [90, 180, 270] },
  rectangle: {
    label: "Tetradic: rectangle",
    offsets: a => [a, 180, 180 + a],
    angle: { label: "Short side", min: 5, max: 90, default: 60 },
  },
};

const FLORALS = FAMILIES.slice(1);
const wrap = (h: number) => ((h % 360) + 360) % 360;
const distance = (a: number, b: number) => Math.min(wrap(a - b), wrap(b - a));

// Assigns each floral family to one of the scheme's hues. Every scheme hue
// gets at least one family, and families stay as close as they can to
// where they sit relative to foliage by default, so poppy stays on the
// warm side, violet on the cool side, and so on. Brute force: at most 4^4.
function assign (offsets: number[]): Record<string, number> {
  const home = FLORALS.map(f => FAMILY_CENTERS[f][0] - FAMILY_CENTERS.foliage[0]);
  let best: number[] = [];
  let bestCost = Infinity;
  const n = offsets.length;
  for (let i = 0; i < n ** FLORALS.length; i++) {
    const pick = FLORALS.map((_, j) => Math.floor(i / n ** j) % n);
    if (new Set(pick).size < Math.min(n, FLORALS.length)) continue;
    const cost = pick.reduce((sum, slot, j) => sum + distance(offsets[slot], home[j]), 0);
    if (cost < bestCost) [best, bestCost] = [pick, cost];
  }
  return Object.fromEntries(FLORALS.map((f, j) => [f, offsets[best[j]]]));
}

function applyScheme (palette: Palette, name: SchemeName, angle: number): Palette {
  if (name === "free") return palette;
  const offsets = assign(SCHEMES[name].offsets(angle));
  const base = palette.foliage[0];
  return {
    ...palette,
    ...Object.fromEntries(FLORALS.map(f => {
      const [, s, l] = palette[f];
      return [f, [Math.round(wrap(base + offsets[f])), s, l]];
    })),
  };
}

function loadJSON<T> (key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved != null) return JSON.parse(saved);
  } catch {}
  return fallback;
}

const css = ([h, s, l]: HSL) => `hsl(${h} ${s}% ${l}%)`;

function hex ([h, s, l]: HSL) {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function luminance (c: HSL) {
  const [r, g, b] = [1, 3, 5].map(i => {
    const v = parseInt(hex(c).slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast (a: HSL, b: HSL) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

const CHANNELS = [
  { label: "H", max: 360, unit: "°" },
  { label: "S", max: 100, unit: "%" },
  { label: "L", max: 100, unit: "%" },
];

function Control ({ name, value, onChange, lockHue }: {
  name: Key;
  value: HSL;
  onChange: (v: HSL) => void;
  lockHue?: boolean; // the hue comes from the color scheme
}) {
  return (
    <fieldset className="control">
      <legend>
        <span className="swatch" style={{ background: css(value) }} />
        {name}
        <code>{hex(value)}</code>
      </legend>
      {CHANNELS.map((ch, i) => (
        <label key={ch.label} className="slider">
          <span>{ch.label}</span>
          <input
            type="range"
            min={0}
            max={ch.max}
            value={value[i]}
            disabled={lockHue && i === 0}
            style={{ background: track(value, i) }}
            onChange={e => {
              const next = [...value] as HSL;
              next[i] = Number(e.target.value);
              onChange(next);
            }}
          />
          <output>{value[i]}{ch.unit}</output>
        </label>
      ))}
    </fieldset>
  );
}

// a gradient of the channel's range, holding the other two channels
function track ([h, s, l]: HSL, i: number) {
  const stops = i === 0
    ? [0, 60, 120, 180, 240, 300, 360].map(x => css([x, s, l]))
    : [0, 50, 100].map(x => css(i === 1 ? [h, x, l] : [h, s, x]));
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

function Tile ({ seed, size, color }: { seed: string; size: number; color: (family: Family, drawn: HSL) => HSL }) {
  const { leaves } = layout(seed, size, color);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} shapeRendering="crispEdges" className="tile">
      {leaves.map((leaf, i) => (
        <rect key={i} x={leaf.x} y={leaf.y} width={leaf.w} height={leaf.h} fill={leaf.fill} />
      ))}
    </svg>
  );
}

// the hue wheel, with a dot for each family. Hue 0 at the top, clockwise
function Wheel ({ colors }: { colors: Palette }) {
  return (
    <div className="wheel">
      {FAMILIES.map(f => {
        const t = (colors[f][0] * Math.PI) / 180;
        return (
          <span
            key={f}
            title={`${f} ${colors[f][0]}°`}
            className={f === "foliage" ? "dot base" : "dot"}
            style={{
              left: `${50 + 40 * Math.sin(t)}%`,
              top: `${50 - 40 * Math.cos(t)}%`,
              background: css(colors[f]),
            }}
          />
        );
      })}
    </div>
  );
}

function App () {
  const [palette, setPalette] = useState<Palette>(load);
  const [batch, setBatch] = useState(0);
  // keep each seed's offset from its range center, instead of one flat base
  const [spread, setSpread] = useState(false);
  const [scheme, setScheme] = useState<SchemeName>(() => loadJSON("palette-scheme", "free"));
  const [angle, setAngle] = useState<number>(() => loadJSON("palette-angle", 30));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(palette));
      localStorage.setItem("palette-scheme", JSON.stringify(scheme));
      localStorage.setItem("palette-angle", JSON.stringify(angle));
    } catch {}
  }, [palette, scheme, angle]);

  // the palette with scheme-derived floral hues; what everything renders
  const colors = applyScheme(palette, scheme, angle);
  const schemeDef = scheme === "free" ? null : SCHEMES[scheme];
  const locked = (f: Key) => schemeDef != null && (FLORALS as Key[]).includes(f);

  const chooseScheme = (name: SchemeName) => {
    setScheme(name);
    const a = name === "free" ? undefined : SCHEMES[name].angle;
    if (a) setAngle(a.default);
  };

  const seeds = useMemo(
    () => Array.from({ length: 32 }, (_, i) => `palette-${batch}-${i}`),
    [batch],
  );

  // a locked floral keeps its own stored hue, so switching back to free
  // restores it
  const set = (key: Key) => (value: HSL) => setPalette(p => ({
    ...p,
    [key]: locked(key) ? [p[key][0], value[1], value[2]] : value,
  }));

  const colorFor = (target?: Family) => (family: Family, drawn: HSL): HSL => {
    const f = target ?? family;
    const base = colors[f];
    if (!spread) return base;
    const c = FAMILY_CENTERS[family];
    return [(base[0] + drawn[0] - c[0] + 360) % 360, base[1] + drawn[1] - c[1], base[2] + drawn[2] - c[2]];
  };

  const output = [
    `--background: ${hex(colors.background)}; /* ${css(colors.background)} */`,
    `--text: ${hex(colors.text)}; /* ${css(colors.text)} */`,
    "",
    ...(schemeDef ? [`// ${schemeDef.label}${schemeDef.angle ? `, ${angle}°` : ""}`] : []),
    ...FAMILIES.map(f => `${f}: [${colors[f].join(", ")}], // ${hex(colors[f])}`),
  ].join("\n");

  const ratio = contrast(colors.text, colors.background);

  return (
    <div className="app">
      <aside className="panel">
        <Control name="background" value={colors.background} onChange={set("background")} />
        <Control name="text" value={colors.text} onChange={set("text")} />
        <p className="contrast">
          Text contrast <strong>{ratio.toFixed(2)}:1</strong>
          {ratio >= 7 ? " AAA" : ratio >= 4.5 ? " AA" : " fails AA"}
        </p>
        <fieldset className="control scheme">
          <legend>Scheme</legend>
          <select value={scheme} onChange={e => chooseScheme(e.target.value as SchemeName)}>
            <option value="free">Free: set each hue</option>
            {Object.entries(SCHEMES).map(([key, def]) => (
              <option key={key} value={key}>{def.label}</option>
            ))}
          </select>
          {schemeDef?.angle && (
            <label className="slider">
              <span>∠</span>
              <input
                type="range"
                min={schemeDef.angle.min}
                max={schemeDef.angle.max}
                value={angle}
                onChange={e => setAngle(Number(e.target.value))}
              />
              <output>{angle}°</output>
            </label>
          )}
          {schemeDef && (
            <p className="hint">
              {schemeDef.angle ? `${schemeDef.angle.label}. ` : ""}
              Floral hues follow the foliage hue; their S and L stay editable.{" "}
              <button onClick={() => { setPalette(colors); setScheme("free"); }}>
                Unlock hues
              </button>
            </p>
          )}
          <Wheel colors={colors} />
        </fieldset>
        {FAMILIES.map(f => (
          <Control key={f} name={f} value={colors[f]} onChange={set(f)} lockHue={locked(f)} />
        ))}
        <label className="check">
          <input type="checkbox" checked={spread} onChange={e => setSpread(e.target.checked)} />
          Keep per-seed spread around each base
        </label>
        <div className="buttons">
          <button onClick={() => setBatch(b => b + 1)}>New seeds</button>
          <button onClick={() => setPalette(DEFAULTS)}>Reset</button>
          <button onClick={() => navigator.clipboard.writeText(output)}>Copy values</button>
        </div>
        <pre className="output">{output}</pre>
      </aside>

      <main
        className="preview"
        style={{ background: css(colors.background), color: css(colors.text) }}
      >
        <h1>Palette</h1>
        <p>
          Every tile starts from one of the base colors on the left, then drifts a
          little with each subdivision. Foliage is picked 80% of the time and each
          floral family 5%, so the mixed grid below is mostly green, like the site.
        </p>

        <h2>Mixed</h2>
        <div className="grid">
          {seeds.slice(0, 16).map(s => <Tile key={s} seed={s} size={4} color={colorFor()} />)}
        </div>

        <h2>Sizes</h2>
        <div className="sizes">
          {[8, 4, 2, 1].map((size, i) => (
            <div key={size} style={{ width: size * 40 }}>
              <Tile seed={seeds[16 + i]} size={size} color={colorFor()} />
            </div>
          ))}
        </div>

        <h2>By family</h2>
        {FAMILIES.map(f => (
          <section key={f} className="family">
            <h3>{f}</h3>
            <div className="row">
              {seeds.slice(20, 28).map(s => <Tile key={s} seed={s} size={4} color={colorFor(f)} />)}
            </div>
          </section>
        ))}

        <h2>Text</h2>
        <p>
          The quick brown fox jumps over the lazy dog. Body copy sits on the paper
          background, so this is the pairing to judge for long reads. <strong>Bold
          text</strong> and <code>inline code</code> for good measure.
        </p>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
