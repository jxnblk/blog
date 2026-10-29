// Walks a resolved prefab and keeps what the web page draws: model
// instances, stickers, light quads and spinning nodes, with transforms
// converted from Unity (left-handed) to three.js/glTF (right-handed) by
// mirroring X: p = (-x, y, z), q = (x, -y, -z, w).
import { readFileSync } from "node:fs";
import { basename, dirname, extname } from "node:path";
import { Resolver, type Obj, type Table } from "./prefab";
import { readMaterial, type Mat } from "./material";
import { num } from "./unity-yaml";

export type Vec3 = [number, number, number];
export type Quat = [number, number, number, number];

export type StickerData = {
  sheet: string; // project path of the sticker sheet
  x: number;
  y: number;
  grid: number;
  size: number;
  texture: string; // output path, relative to the output dir
  material: string;
  tint: Vec3; // sRGB
  metalness: number;
  roughness: number;
  emissive?: Vec3; // linear, may exceed 1
};

export type LightData = {
  color: Vec3; // linear, may exceed 1
  blink?: number; // seconds per on/off step
};

export type Node = {
  name: string;
  p?: Vec3;
  q?: Quat;
  s?: Vec3;
  model?: string; // output path of the model's GLB, relative to the output dir
  part?: string; // with `model`: the one object to take from it, by name
  sticker?: StickerData;
  light?: LightData;
  spin?: number; // degrees per second about local +Y
  children?: Node[];
};

export type ModelUse = {
  path: string; // project path of the model file
  out: string;
  materials: Record<string, string>; // model material name -> Unity material path
  hide: string[];
  /** a parts file: only these objects, each at the origin, for renderers
   * that draw one of the model's meshes each */
  parts?: string[];
};

export type EntryConfig = {
  id: string;
  title: string;
  /** a prefab, or a model file placed in a scene as it is */
  prefab?: string;
  model?: string;
  /** for a model: model material name -> Unity material path, as the
   * scene's renderer sets them */
  materials?: Record<string, string>;
  /** the Unity project, if not the default */
  project?: string;
  caption?: string;
  /** model nodes to leave out, by name, for each model path. Nodes inside
   * a model are known to the prefab only by hashed fileIDs, so an inactive
   * one is reported and has to be named here. */
  hide?: Record<string, string[]>;
};

// materials whose objects are screen-space effects, not surfaces
export const EFFECT_MATERIAL = /haze|distortion/i;

const SCRIPTS = {
  sticker: "Assets/Scripts/Sticker.cs",
  dynamicLight: "Assets/Scripts/DynamicLight.cs",
  blinkingLight: "Assets/Scripts/BlinkingLight.cs",
  rotatable: "Assets/Scripts/Rotatable.cs",
};
const MODEL_EXT = /\.(fbx|obj|blend|dae)$/i;
const LIGHT_MODES = ["black", "white", "green", "orange", "blue", "red"];

export class Extractor {
  models = new Map<string, ModelUse>();
  materials = new Map<string, Mat>();
  stickers = new Map<string, StickerData>();

  constructor (public resolver: Resolver) {}

  get project () { return this.resolver.project; }
  get guids () { return this.resolver.guids; }
  warn (m: string) { this.resolver.warn(m); }

  material (path: string) {
    let m = this.materials.get(path);
    if (!m) {
      m = readMaterial(this.project, path, this.guids);
      this.materials.set(path, m);
    }
    return m;
  }

  /** model material name -> Unity material: the importer's remaps, then
   * a search by name the way the importer's settings ask for */
  modelMaterials (path: string) {
    const text = readFileSync(`${this.project}/${path}.meta`, "utf8");
    const out: Record<string, string> = {};
    const re = /name: (.+)\n\s+second: \{fileID: \d+, guid: (\w+)/g;
    for (const [, name, guid] of text.matchAll(re)) {
      const mat = this.guids.get(guid);
      if (mat) out[name.trim()] = mat;
    }
    const search = Number(text.match(/materialSearch: (\d)/)?.[1] ?? 1);
    for (const name of modelNames(this.project, path, "Material")) {
      if (out[name]) continue;
      const found = this.findMaterial(path, name, search);
      if (found) out[name] = found;
      else this.warn(`${basename(path)}: no Unity material for "${name}"`);
    }
    return out;
  }

  /** ModelImporter's search: 0 a Materials folder beside the model, 1 the
   * Materials folders up to Assets, 2 the whole project */
  findMaterial (model: string, name: string, search: number) {
    const all = [...this.guids.values()];
    if (search === 2) return all.find(p => basename(p) === `${name}.mat`);
    let dir = dirname(model);
    while (dir.startsWith("Assets")) {
      const p = `${dir}/Materials/${name}.mat`;
      if (all.includes(p)) return p;
      if (search === 0) break;
      dir = dirname(dir);
    }
  }

  entry (config: EntryConfig) {
    if (config.model) return { name: config.title, model: this.bareModel(config.model, config) };
    if (!config.prefab) throw new Error(`${config.id}: needs a prefab or a model`);
    const table = this.resolver.load(config.prefab);
    const ctx = new Context(table, this);
    const root = ctx.node(table.root, config, true);
    if (!root) throw new Error(`${config.prefab}: nothing to draw`);
    // the entry's own placement in a scene is not part of the model
    delete root.p; delete root.q; delete root.s;
    root.name = config.title;
    return root;
  }

  /** a model file on its own, with the materials the entry sets in place
   * of the importer's */
  bareModel (path: string, config: EntryConfig) {
    const remaps = this.modelMaterials(path);
    const names = modelNames(this.project, path, "Material");
    for (const [name, mat] of Object.entries(config.materials ?? {})) {
      if (!names.includes(name)) throw new Error(`${config.id}: ${basename(path)} has no material "${name}"`);
      if (![...this.guids.values()].includes(mat)) throw new Error(`${config.id}: no material at ${mat}`);
      remaps[name] = mat;
    }
    // its own GLB when the materials differ from the importer's
    const own = !!config.materials;
    const key = own ? `${path}#${config.id}` : path;
    const out = `models/${basename(path, extname(path))}${own ? `-${config.id}` : ""}.glb`;
    if (!this.models.has(key)) this.models.set(key, { path, out, materials: remaps, hide: config.hide?.[path] ?? [] });
    for (const m of Object.values(remaps)) if (!EFFECT_MATERIAL.test(m)) this.material(m);
    return out;
  }
}

class Context {
  children = new Map<string, string[]>();
  components = new Map<string, Obj[]>();

  constructor (public table: Table, public ex: Extractor) {
    for (const o of table.objects.values()) {
      if (o.classId === 4 || o.classId === 224) {
        const f = o.data.m_Father?.fileID ?? "0";
        if (!this.children.has(f)) this.children.set(f, []);
        this.children.get(f)!.push(o.id);
      }
      const go = o.data.m_GameObject?.fileID;
      if (go) {
        if (!this.components.has(go)) this.components.set(go, []);
        this.components.get(go)!.push(o);
      }
    }
    // keep the authored child order where it's known
    for (const [father, kids] of this.children) {
      const order: string[] = (table.objects.get(father)?.data.m_Children ?? []).map((c: any) => c.fileID);
      kids.sort((a, b) => rank(order, a) - rank(order, b));
    }
  }

  script (o: Obj) {
    return o.type === "MonoBehaviour" ? this.ex.guids.get(o.data.m_Script?.guid) : undefined;
  }

  node (transformId: string, config: EntryConfig, isRoot = false): Node | undefined {
    const tr = this.table.objects.get(transformId);
    if (!tr) return;
    const go = this.table.objects.get(tr.data.m_GameObject?.fileID);
    if (!go || go.data.m_IsActive === "0") return;
    const comps = (this.components.get(go.id) ?? []).filter(c => c !== tr);
    const byScript = (path: string) => comps.find(c => this.script(c) === path && c.data.m_Enabled !== "0");

    const node: Node = { name: go.data.m_Name ?? "", ...transform(tr.data) };

    if (tr.model) {
      const model = this.model(tr.model, config);
      if (!model) return;
      node.model = model;
    }

    const sticker = byScript(SCRIPTS.sticker);
    const light = byScript(SCRIPTS.blinkingLight) ?? byScript(SCRIPTS.dynamicLight);
    const renderer = comps.find(c => c.type === "MeshRenderer" && c.data.m_Enabled !== "0");
    const materials: string[] = (renderer?.data.m_Materials ?? [])
      .map((m: any) => this.ex.guids.get(m.guid)).filter(Boolean);
    // a renderer drawing one mesh out of a model file
    const filter = comps.find(c => c.type === "MeshFilter");
    const meshFile = this.ex.guids.get(filter?.data.m_Mesh?.guid);
    const isPart = !!(renderer && !tr.model && meshFile && MODEL_EXT.test(meshFile));

    if (sticker && renderer) {
      node.sticker = this.sticker(sticker, materials[0], light);
    } else if (light && renderer) {
      node.light = lightData(light, this.script(light) === SCRIPTS.blinkingLight);
    } else if (isPart) {
      if (materials.some(m => EFFECT_MATERIAL.test(m))) return;
      const name = this.meshName(meshFile!, filter!.data.m_Mesh.fileID);
      if (!name) {
        this.ex.warn(`${config.id}: no mesh in ${basename(meshFile!)} for "${go.data.m_Name}"`);
        return;
      }
      node.model = this.part(meshFile!, name, materials, config);
      node.part = name;
    } else if (renderer && !tr.model) {
      if (!materials.some(m => EFFECT_MATERIAL.test(m))) {
        this.ex.warn(`${config.id}: skipped mesh "${go.data.m_Name}" (${materials.map(m => basename(m)).join(", ")})`);
      }
    }

    const spin = byScript(SCRIPTS.rotatable);
    if (spin) node.spin = -num(spin.data.speed); // mirroring flips the turn

    const kids = (this.children.get(transformId) ?? [])
      .map(id => this.node(id, config))
      .filter((n): n is Node => !!n);
    if (kids.length) node.children = kids;

    if (!isRoot && !node.model && !node.sticker && !node.light && !kids.length) return;
    return node;
  }

  model (path: string, config: EntryConfig) {
    const remaps = this.ex.modelMaterials(path);
    // overrides on the model's own renderers; their nodes can't be named,
    // but if every material is an effect the whole model is one
    const inner = [...this.table.objects.values()].filter(o => o.modelInner?.model === path);
    const overrides: string[] = inner.flatMap(o => (o.data.m_Materials ?? [])
      .map((m: any) => this.ex.guids.get(m?.guid)).filter(Boolean));
    const all = [...Object.values(remaps), ...overrides];
    if (all.length && all.every(m => EFFECT_MATERIAL.test(m))) return;
    for (const m of overrides) {
      if (!EFFECT_MATERIAL.test(m) && !Object.values(remaps).includes(m)) {
        this.ex.warn(`${config.id}: ${basename(path)} overrides a node's material to ${basename(m)}; not applied`);
      }
    }

    const hide = config.hide?.[path] ?? [];
    const inactive = inner.filter(o => o.data.m_IsActive === "0");
    if (inactive.length !== hide.length) {
      this.ex.warn(`${config.id}: ${basename(path)} has ${inactive.length} inactive inner node(s) ` +
        `(fileIDs ${inactive.map(o => o.modelInner!.sourceId).join(", ") || "none"}) but ${hide.length} listed in hide`);
    }

    const name = basename(path, extname(path));
    const out = `models/${name}.glb`;
    const prev = this.ex.models.get(path);
    if (prev && JSON.stringify(prev.hide) !== JSON.stringify(hide)) {
      this.ex.warn(`${basename(path)} is used with different hidden nodes; using the first`);
    }
    if (!prev) this.ex.models.set(path, { path, out, materials: remaps, hide });
    for (const m of Object.values(remaps)) if (!EFFECT_MATERIAL.test(m)) this.ex.material(m);
    return out;
  }

  /** Unity names a model's meshes after their nodes, with the fileID
   * xxHash64("Type:Mesh->" + name + index), the index counting repeats */
  meshName (path: string, fileID: string) {
    for (const name of modelNames(this.ex.project, path, "Model")) {
      for (let i = 0; i < 4; i++) {
        if (BigInt.asIntN(64, Bun.hash.xxHash64(`Type:Mesh->${name}${i}`)).toString() === fileID) return name;
      }
    }
  }

  part (path: string, name: string, materials: string[], config: EntryConfig) {
    const remaps = this.ex.modelMaterials(path);
    for (const m of materials) {
      if (!Object.values(remaps).includes(m)) {
        this.ex.warn(`${config.id}: part "${name}" of ${basename(path)} uses ${basename(m)}; the model's own materials are used`);
      }
    }
    const key = path + "#parts";
    const out = `models/${basename(path, extname(path))}-parts.glb`;
    const prev = this.ex.models.get(key);
    if (prev) {
      if (!prev.parts!.includes(name)) prev.parts!.push(name);
    } else {
      this.ex.models.set(key, { path, out, materials: remaps, hide: [], parts: [name] });
    }
    for (const m of Object.values(remaps)) if (!EFFECT_MATERIAL.test(m)) this.ex.material(m);
    return out;
  }

  sticker (s: Obj, materialPath: string | undefined, light: Obj | undefined): StickerData | undefined {
    if (!materialPath) return;
    const mat = this.ex.material(materialPath);
    const sheet = mat.textures._BaseMap ?? mat.textures._MainTex;
    if (!sheet) {
      this.ex.warn(`sticker material ${mat.name} has no texture`);
      return;
    }
    const x = num(s.data.x), y = num(s.data.y);
    const grid = num(s.data.grid, 512), size = num(s.data.size, 4096);
    const key = `${basename(sheet, extname(sheet))}-${x}-${y}`;
    const base = mat.colors._BaseColor ?? [1, 1, 1, 1];
    const data: StickerData = {
      sheet, x, y, grid, size,
      texture: `stickers/${key}.png`,
      material: mat.name,
      tint: round([base[0], base[1], base[2]]),
      metalness: mat.floats._Metallic ?? 0,
      roughness: round1(1 - (mat.floats._Smoothness ?? 0.5)),
    };
    if (light) data.emissive = lightData(light, false).color;
    this.ex.stickers.set(key, data);
    return data;
  }
}

/** node ("Model") or material names in an FBX, binary or ASCII */
function modelNames (project: string, path: string, kind: "Model" | "Material") {
  if (!/\.fbx$/i.test(path)) return [];
  const buf = readFileSync(`${project}/${path}`);
  const text = buf.toString("latin1");
  const names = new Set<string>();
  if (text.startsWith("Kaydara FBX Binary")) {
    // a string property: "S", a uint32 length, then "name\x00\x01Model"
    const tail = `\x00\x01${kind}`;
    for (let i = text.indexOf(tail); i >= 0; i = text.indexOf(tail, i + 1)) {
      for (let start = i; start >= 5 && i - start <= 256; start--) {
        if (text[start - 5] === "S" && buf.readUInt32LE(start - 4) === i - start + tail.length) {
          names.add(text.slice(start, i));
          break;
        }
      }
    }
  } else {
    for (const m of text.matchAll(new RegExp(`${kind}: -?\\d+, "${kind}::([^"]*)"`, "g"))) names.add(m[1]);
  }
  return [...names];
}

function lightData (o: Obj, blinking: boolean): LightData {
  const mode = LIGHT_MODES[num(o.data.color)] ?? "black";
  const c = o.data[mode] ?? { r: 0, g: 0, b: 0 };
  const out: LightData = { color: hdr([num(c.r), num(c.g), num(c.b)]) };
  if (blinking) out.blink = num(o.data.delay, 0.5);
  return out;
}

/** an HDR color picked in sRGB and scaled by an intensity: linearize the
 * hue, keep the intensity */
export function hdr (c: Vec3): Vec3 {
  const k = Math.max(1, ...c);
  return round(c.map(v => srgbToLinear(v / k) * k) as Vec3);
}

const srgbToLinear = (v: number) =>
  v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);

function transform (d: any) {
  const p = d.m_LocalPosition ?? {}, q = d.m_LocalRotation ?? {}, s = d.m_LocalScale ?? {};
  const out: Pick<Node, "p" | "q" | "s"> = {};
  const pos = round<Vec3>([-num(p.x), num(p.y), num(p.z)]);
  const rot = round<Quat>([num(q.x), -num(q.y), -num(q.z), num(q.w, 1)], 6);
  const scl = round<Vec3>([num(s.x, 1), num(s.y, 1), num(s.z, 1)]);
  if (pos.some(v => v !== 0)) out.p = pos;
  if (!(rot[0] === 0 && rot[1] === 0 && rot[2] === 0 && Math.abs(rot[3]) === 1)) out.q = rot;
  if (scl.some(v => v !== 1)) out.s = scl;
  return out;
}

function round<T extends number[]> (v: T, digits = 5): T {
  const k = 10 ** digits;
  return v.map(x => {
    const r = Math.round(x * k) / k;
    return Object.is(r, -0) ? 0 : r;
  }) as T;
}
const round1 = (x: number) => round([x], 3)[0];

const rank = (order: string[], id: string) => {
  const i = order.indexOf(id);
  return i < 0 ? Number.MAX_SAFE_INTEGER : i;
};
