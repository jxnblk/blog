// Exports the Novantica vehicles for the /vehicles page.
//
//   bun run export:vehicles [--project ~/unity/na-map-prototype] [--out images/vehicles]
//
// Reads the Unity project (never writes to it), runs Blender headless
// for the models and textures, and writes JSON, GLB and PNG files that
// are committed with the site. See README.md.
import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";
import { homedir, tmpdir } from "node:os";
import { parseArgs } from "node:util";
import { indexGuids } from "./unity-yaml";
import { Resolver } from "./prefab";
import { Extractor, EFFECT_MATERIAL, type Node } from "./extract";
import { VEHICLES } from "./vehicles";

const { values: args } = parseArgs({
  options: {
    project: { type: "string", default: join(homedir(), "unity/na-map-prototype") },
    out: { type: "string", default: "images/vehicles" },
  },
});
const project = resolve(args.project!.replace(/^~/, homedir()));
const out = resolve(args.out!);
const BLENDER = process.env.BLENDER ?? "/Applications/Blender.app/Contents/MacOS/Blender";
const PALETTE_GRID = 32; // the Polyperfect atlas: 32x32 swatches
const PALETTE_BLOCK = 4; // pixels per swatch in the repacked palette
const STICKER_PX = 256;

if (!existsSync(join(project, "Assets"))) throw new Error(`No Unity project at ${project}`);
if (!existsSync(BLENDER)) throw new Error(`Blender not found at ${BLENDER}; set BLENDER`);

console.log(`Reading ${project}`);
const guids = indexGuids(project);
const resolver = new Resolver(project, guids);
const ex = new Extractor(resolver);
const vehicles = VEHICLES.map(v => ({ config: v, root: ex.vehicle(v) }));

// materials the models use, by Unity path
const materials: Record<string, any> = {};
let atlas: Record<string, string> | undefined;
for (const m of ex.models.values()) {
  for (const path of Object.values(m.materials)) {
    if (materials[path] || EFFECT_MATERIAL.test(path)) continue;
    const mat = ex.material(path);
    const albedo = mat.textures._BaseMap ?? mat.textures._MainTex;
    const transparent = mat.floats._Surface === 1;
    const base = mat.colors._BaseColor ?? [1, 1, 1, 1];
    if (albedo) {
      const set = {
        albedo,
        emission: mat.textures._EmissionMap,
        mask: mat.textures._MetallicGlossMap ?? mat.textures._MaskMap,
      } as Record<string, string>;
      if (atlas && atlas.albedo !== set.albedo) {
        throw new Error(`${mat.name} uses a second palette atlas (${basename(albedo)}); only one is supported`);
      }
      atlas = set;
    }
    materials[path] = {
      name: mat.name,
      kind: albedo ? (transparent ? "glass" : "palette") : "solid",
      color: base.slice(0, 3),
      opacity: base[3],
      metalness: mat.floats._Metallic ?? 0,
      roughness: Math.round((1 - (mat.floats._Smoothness ?? 0.5)) * 1000) / 1000,
    };
  }
}
if (!atlas?.emission || !atlas.mask) throw new Error("Palette atlas, emission or mask map not found");

// Blender writes into a temp dir; the output is swapped in at the end
const tmp = join(tmpdir(), `unity-export-${process.pid}`);
rmSync(tmp, { recursive: true, force: true });
mkdirSync(join(tmp, "models"), { recursive: true });
mkdirSync(join(tmp, "stickers"), { recursive: true });

const abs = (p: string) => join(project, p);
const job = {
  models: [...ex.models.values()].map(m => ({
    name: basename(m.out, ".glb"),
    src: abs(m.path),
    out: join(tmp, m.out),
    materials: m.materials,
    hide: m.hide,
  })),
  materials,
  palette: {
    grid: PALETTE_GRID,
    block: PALETTE_BLOCK,
    albedo: abs(atlas.albedo),
    emission: abs(atlas.emission),
    mask: abs(atlas.mask),
    out: {
      albedo: join(tmp, "palette.png"),
      emission: join(tmp, "palette-emission.png"),
      mr: join(tmp, "palette-mr.png"),
    },
  },
  stickers: [...ex.stickers.values()].map(s => ({
    sheet: abs(s.sheet), x: s.x, y: s.y, grid: s.grid, size: s.size,
    px: STICKER_PX, out: join(tmp, s.texture),
  })),
  report: join(tmp, "report.json"),
};
writeFileSync(join(tmp, "job.json"), JSON.stringify(job, null, 2));

console.log(`Running Blender on ${job.models.length} models`);
const script = join(import.meta.dir, "blender/convert.py");
const proc = Bun.spawnSync([BLENDER, "-b", "--factory-startup", "-P", script, "--", join(tmp, "job.json")], {
  stdout: "pipe", stderr: "pipe",
});
const log = proc.stdout.toString();
for (const line of log.split("\n")) {
  if (/^(palette:|  \S|WARN|DONE)/.test(line)) console.log("  blender:", line.trim());
}
if (proc.exitCode !== 0 || !log.includes("DONE")) {
  console.error(log.slice(-4000), proc.stderr.toString().slice(-4000));
  throw new Error(`Blender failed (${proc.exitCode})`);
}
const report = JSON.parse(readFileSync(job.report, "utf8"));
rmSync(job.report);
rmSync(join(tmp, "job.json"));

// JSON for the page
const index = {
  vehicles: vehicles.map(({ config, root }) => ({
    id: config.id,
    title: config.title,
    caption: config.caption,
    ...stats(root),
  })),
  palette: { albedo: "palette.png", emission: "palette-emission.png", mr: "palette-mr.png" },
  materials: Object.fromEntries(Object.values(materials).map(({ name, ...m }) => [name, m])),
};
writeFileSync(join(tmp, "index.json"), JSON.stringify(index, null, 2) + "\n");
for (const { config, root } of vehicles) {
  writeFileSync(join(tmp, `${config.id}.json`), JSON.stringify({ id: config.id, title: config.title, root }, publicFields) + "\n");
}

rmSync(out, { recursive: true, force: true });
mkdirSync(dirname(out), { recursive: true });
Bun.spawnSync(["mv", tmp, out]);

// summary
console.log("");
for (const v of index.vehicles) {
  console.log(`${v.title.padEnd(12)} ${v.models} model(s), ${v.stickers} sticker(s), ${v.lights} light(s)` +
    (v.blinking ? ` (${v.blinking} blinking)` : "") + (v.spinning ? `, ${v.spinning} spinning` : ""));
}
console.log(`Palette: ${Object.keys(report.palette).length} swatches`);
const warnings = [...resolver.warnings, ...report.warnings];
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log("  - " + w);
}
const size = Bun.spawnSync(["du", "-sh", out]).stdout.toString().split("\t")[0];
console.log(`\nWrote ${out} (${size})`);

// sticker source details stay out of the published JSON
function publicFields (this: any, key: string, value: any) {
  if (this?.texture && ["sheet", "x", "y", "grid", "size"].includes(key)) return undefined;
  return value;
}

function stats (root: Node) {
  const s = { models: 0, stickers: 0, lights: 0, blinking: 0, spinning: 0 };
  const walk = (n: Node) => {
    if (n.model) s.models++;
    if (n.sticker) s.stickers++;
    if (n.light) s.lights++;
    if (n.light?.blink) s.blinking++;
    if (n.spin) s.spinning++;
    n.children?.forEach(walk);
  };
  walk(root);
  return s;
}
