// Exports the Novantica models for the /models page.
//
//   bun run export:models [--project ~/unity/na-map-prototype] [--out images/models]
//
// --project is the default; an entry in entries.ts can name another.
// Reads the Unity project (never writes to it), runs Blender headless
// for the models and textures, and writes JSON, GLB and PNG files that
// are committed with the site. See README.md.
import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";
import { homedir, tmpdir } from "node:os";
import { parseArgs } from "node:util";
import { indexGuids } from "./unity-yaml";
import { Resolver } from "./prefab";
import { Extractor, EFFECT_MATERIAL, hdr, type ModelUse, type Node, type StickerData, type Vec3 } from "./extract";
import { ENTRIES } from "./entries";

const { values: args } = parseArgs({
  options: {
    project: { type: "string", default: join(homedir(), "unity/na-map-prototype") },
    out: { type: "string", default: "images/models" },
  },
});
const projectPath = (p: string) => resolve(p.replace(/^~/, homedir()));
const project = projectPath(args.project!);
const out = resolve(args.out!);
const BLENDER = process.env.BLENDER ?? "/Applications/Blender.app/Contents/MacOS/Blender";
const PALETTE_GRID = 32; // the Polyperfect atlas: 32x32 swatches
// other palette textures, by file name: swatches per side
const ATLAS_GRIDS: Record<string, number> = {
  "Bot Texture Cutout.png": 4, // the Scout's
};
const PALETTE_BLOCK = 4; // pixels per swatch in the repacked palette
const STICKER_PX = 256;
// written into every GLB's asset.copyright
const COPYRIGHT = "© Brent Jackson. All rights reserved.";

if (!existsSync(BLENDER)) throw new Error(`Blender not found at ${BLENDER}; set BLENDER`);

const abs = (ex: Extractor, p: string) => join(ex.project, p);

// one extractor per Unity project
const extractors = new Map<string, Extractor>();
function extractor (path: string) {
  let ex = extractors.get(path);
  if (!ex) {
    if (!existsSync(join(path, "Assets"))) throw new Error(`No Unity project at ${path}`);
    console.log(`Reading ${path}`);
    ex = new Extractor(new Resolver(path, indexGuids(path)));
    extractors.set(path, ex);
  }
  return ex;
}
const entries = ENTRIES.map(v => ({
  config: v,
  root: extractor(v.project ? projectPath(v.project) : project).entry(v),
}));
const warnings = [...extractors.values()].flatMap(ex => ex.resolver.warnings);

// models from every project; output names must not collide
const models = new Map<string, { ex: Extractor; use: ModelUse }>();
for (const ex of extractors.values()) {
  for (const use of ex.models.values()) {
    const prev = models.get(use.out);
    if (prev) {
      const same = prev.use.parts ? JSON.stringify(prev.use.parts) === JSON.stringify(use.parts) : true;
      if (!same || fileHash(prev.ex, prev.use.path) !== fileHash(ex, use.path)) {
        throw new Error(`${use.out} comes from two different files (${prev.use.path}, ${use.path})`);
      }
      continue;
    }
    models.set(use.out, { ex, use });
  }
}

// materials the models use, by name (the page's key)
const materials: Record<string, any> = {};
// palette textures; each palette material samples one, and their swatches
// share the repacked palette
type Atlas = { ex: Extractor; albedo: string; emission?: string; mask?: string; metallic: number; smoothness: number };
const atlases: Atlas[] = [];
const atlasOf: Record<string, number> = {}; // Unity material path -> atlas
for (const { ex, use: m } of models.values()) {
  for (const path of Object.values(m.materials)) {
    if (EFFECT_MATERIAL.test(path)) continue;
    const mat = ex.material(path);
    const albedo = mat.textures._BaseMap ?? mat.textures._MainTex;
    const transparent = mat.floats._Surface === 1;
    // MK Toon keeps its color in _AlbedoColor
    const base = (/MKToon/.test(mat.shader) ? mat.colors._AlbedoColor : undefined) ?? mat.colors._BaseColor ?? [1, 1, 1, 1];
    const glow = mat.keywords.includes("_EMISSION") ? mat.colors._EmissionColor : undefined;
    // both faces drawn: URP's Render Face (_Cull) or MK Toon's, at 0
    const doubleSided = (/MKToon/.test(mat.shader) ? mat.floats._RenderFace : mat.floats._Cull) === 0;
    if (albedo) {
      let i = atlases.findIndex(a => fileHash(a.ex, a.albedo) === fileHash(ex, albedo));
      if (i < 0) {
        // only the Polyperfect atlas goes without a listed grid
        if (!ATLAS_GRIDS[basename(albedo)] && atlases.some(a => !ATLAS_GRIDS[basename(a.albedo)])) {
          throw new Error(`${mat.name} uses another palette texture (${basename(albedo)}); add its grid to ATLAS_GRIDS`);
        }
        i = atlases.push({
          ex,
          albedo,
          emission: mat.keywords.includes("_EMISSION") ? mat.textures._EmissionMap : undefined,
          mask: mat.textures._MetallicGlossMap ?? mat.textures._MaskMap,
          // without a mask, the material's own values
          metallic: mat.floats._Metallic ?? 0,
          smoothness: mat.floats._Smoothness ?? 0.5,
        }) - 1;
      }
      atlasOf[path] = i;
    }
    const info = {
      name: mat.name,
      kind: albedo ? (transparent ? "glass" : "palette") : "solid",
      color: base.slice(0, 3),
      opacity: base[3],
      metalness: mat.floats._Metallic ?? 0,
      roughness: Math.round((1 - (mat.floats._Smoothness ?? 0.5)) * 1000) / 1000,
      ...(doubleSided ? { doubleSided } : {}),
      ...(!albedo && glow && Math.max(...glow.slice(0, 3)) > 0 ? { emissive: hdr(glow.slice(0, 3) as Vec3) } : {}),
    };
    const prev = materials[mat.name];
    if (prev && JSON.stringify(prev) !== JSON.stringify(info)) {
      warnings.push(`material ${mat.name} differs between projects; using the first`);
    }
    materials[mat.name] ??= info;
  }
}
const main = atlases.find(a => !ATLAS_GRIDS[basename(a.albedo)]);
if (!main?.emission || !main.mask) throw new Error("Palette atlas, emission or mask map not found");

// Blender writes into a temp dir; the output is swapped in at the end
const tmp = join(tmpdir(), `unity-export-${process.pid}`);
rmSync(tmp, { recursive: true, force: true });
mkdirSync(join(tmp, "models"), { recursive: true });
mkdirSync(join(tmp, "stickers"), { recursive: true });

// stickers by output file; the same cell from two projects is one file
const stickers = new Map<string, { ex: Extractor; s: StickerData }>();
for (const ex of extractors.values()) {
  for (const s of ex.stickers.values()) if (!stickers.has(s.texture)) stickers.set(s.texture, { ex, s });
}
const job = {
  copyright: COPYRIGHT,
  models: [...models.values()].map(({ ex, use: m }) => ({
    name: basename(m.out, ".glb"),
    src: abs(ex, m.path),
    out: join(tmp, m.out),
    // model material name -> page material name
    materials: Object.fromEntries(Object.entries(m.materials).map(([k, path]) =>
      [k, EFFECT_MATERIAL.test(path) ? basename(path, ".mat") : ex.material(path).name])),
    // page material name -> palette atlas
    atlases: Object.fromEntries(Object.values(m.materials).filter(path => path in atlasOf)
      .map(path => [ex.material(path).name, atlasOf[path]])),
    hide: m.hide,
    parts: m.parts,
  })),
  materials,
  palette: {
    block: PALETTE_BLOCK,
    atlases: atlases.map(a => ({
      grid: ATLAS_GRIDS[basename(a.albedo)] ?? PALETTE_GRID,
      albedo: abs(a.ex, a.albedo),
      emission: a.emission && abs(a.ex, a.emission),
      mask: a.mask && abs(a.ex, a.mask),
      metallic: a.metallic,
      smoothness: a.smoothness,
    })),
    out: {
      albedo: join(tmp, "palette.png"),
      emission: join(tmp, "palette-emission.png"),
      mr: join(tmp, "palette-mr.png"),
    },
  },
  stickers: [...stickers.values()].map(({ ex, s }) => ({
    sheet: abs(ex, s.sheet), x: s.x, y: s.y, grid: s.grid, size: s.size,
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
  entries: entries.map(({ config, root }) => ({
    id: config.id,
    title: config.title,
    caption: config.caption,
    ...stats(root),
  })),
  palette: { albedo: "palette.png", emission: "palette-emission.png", mr: "palette-mr.png" },
  materials: Object.fromEntries(Object.values(materials).map(({ name, ...m }) => [name, m])),
};
writeFileSync(join(tmp, "index.json"), JSON.stringify(index, null, 2) + "\n");
for (const { config, root } of entries) {
  writeFileSync(join(tmp, `${config.id}.json`), JSON.stringify({ id: config.id, title: config.title, ...(config.level ? { level: true } : {}), root }, publicFields) + "\n");
}

rmSync(out, { recursive: true, force: true });
mkdirSync(dirname(out), { recursive: true });
Bun.spawnSync(["mv", tmp, out]);

// summary
console.log("");
for (const v of index.entries) {
  console.log(`${v.title.padEnd(12)} ${v.models} model(s), ${v.stickers} sticker(s), ${v.lights} light(s)` +
    (v.blinking ? ` (${v.blinking} blinking)` : "") + (v.spinning ? `, ${v.spinning} spinning` : ""));
}
console.log(`Palette: ${Object.keys(report.palette).length} swatches`);
warnings.push(...report.warnings);
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

function fileHash (ex: Extractor, path: string) {
  return Bun.hash(readFileSync(abs(ex, path))).toString();
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
