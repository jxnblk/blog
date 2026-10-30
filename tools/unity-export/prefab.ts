// Resolves a Unity prefab, with its nested prefabs, variants and model
// instances, into one flat table of objects, the way the editor sees it
// after merging. Only the project's text files are read.
//
// Nested objects get the id `(prefabInstance ^ sourceId) & 0x7FFF…`,
// which is also the id of the stripped stand-ins the outer file writes
// for them, so references and modifications line up.
import { join, extname } from "node:path";
import { readUnityYAML, type UObject } from "./unity-yaml";

export const MODEL_ROOT_GO = "919132149155446097";
export const MODEL_ROOT_TRANSFORM = "-8679921383154817045";
const MODEL_EXT = new Set([".fbx", ".obj", ".blend", ".dae"]);
const MASK = (1n << 63n) - 1n;

export type Obj = UObject & {
  /** on a model's root GameObject and Transform: the model asset path */
  model?: string;
  /** a node inside a model that a modification touched; its name is a
   * hash, so it can't be matched to the file */
  modelInner?: { model: string; sourceId: string };
};

export type Table = {
  path: string;
  objects: Map<string, Obj>;
  root: string; // root Transform id
};

export const nestedId = (instance: string, source: string) =>
  (BigInt.asIntN(64, (BigInt(instance) ^ BigInt(source)) & MASK)).toString();

export class Resolver {
  cache = new Map<string, Table>();
  warnings: string[] = [];
  constructor (public project: string, public guids: Map<string, string>) {}

  warn (msg: string) {
    if (!this.warnings.includes(msg)) this.warnings.push(msg);
  }

  load (path: string): Table {
    let t = this.cache.get(path);
    if (!t) {
      t = MODEL_EXT.has(extname(path).toLowerCase()) ? this.model(path) : this.prefab(path);
      this.cache.set(path, t);
    }
    return t;
  }

  /** a model stands in as its root GameObject and Transform; its own
   * hierarchy stays inside the exported model file */
  model (path: string): Table {
    const objects = new Map<string, Obj>();
    objects.set(MODEL_ROOT_GO, {
      classId: 1, id: MODEL_ROOT_GO, stripped: false, type: "GameObject", model: path,
      data: {
        m_Component: [{ component: { fileID: MODEL_ROOT_TRANSFORM } }],
        m_Name: path.split("/").pop()!.replace(/\.\w+$/, ""),
        m_IsActive: "1",
      },
    });
    objects.set(MODEL_ROOT_TRANSFORM, {
      classId: 4, id: MODEL_ROOT_TRANSFORM, stripped: false, type: "Transform", model: path,
      data: {
        m_GameObject: { fileID: MODEL_ROOT_GO },
        m_LocalRotation: { x: "0", y: "0", z: "0", w: "1" },
        m_LocalPosition: { x: "0", y: "0", z: "0" },
        m_LocalScale: { x: "1", y: "1", z: "1" },
        m_Father: { fileID: "0" },
      },
    });
    return { path, objects, root: MODEL_ROOT_TRANSFORM };
  }

  prefab (path: string): Table {
    const docs = readUnityYAML(join(this.project, path));
    const objects = new Map<string, Obj>();
    for (const d of docs) if (!d.stripped && d.type !== "PrefabInstance") objects.set(d.id, d);

    for (const pi of docs.filter(d => d.type === "PrefabInstance")) {
      this.instance(path, pi, objects);
    }

    for (const d of docs) if (d.stripped && !objects.has(d.id)) {
      this.warn(`${path}: stripped ${d.type} &${d.id} has no matching nested object`);
    }

    const roots = [...objects.values()].filter(o =>
      (o.classId === 4 || o.classId === 224) && (o.data.m_Father?.fileID ?? "0") === "0");
    if (roots.length !== 1) this.warn(`${path}: ${roots.length} root transforms`);
    return { path, objects, root: roots[0]?.id };
  }

  instance (path: string, pi: UObject, objects: Map<string, Obj>) {
    const srcGuid = pi.data.m_SourcePrefab?.guid;
    const srcPath = this.guids.get(srcGuid);
    if (!srcPath) {
      this.warn(`${path}: prefab instance &${pi.id} source ${srcGuid} not found`);
      return;
    }
    const src = this.load(srcPath);
    const mod = pi.data.m_Modification ?? {};
    const map = (id: string) => nestedId(pi.id, id);

    // copy the source's objects into this file's id space
    for (const o of src.objects.values()) {
      const copy: Obj = {
        ...o,
        id: map(o.id),
        data: remap(structuredClone(o.data), src.objects, map),
      };
      if (o.modelInner) copy.modelInner = { ...o.modelInner };
      objects.set(copy.id, copy);
    }
    const root = objects.get(map(src.root));
    if (root) root.data.m_Father = mod.m_TransformParent ?? { fileID: "0" };

    for (const m of mod.m_Modifications ?? []) {
      const target = m.target ?? {};
      if (target.guid && target.guid !== srcGuid) continue;
      const id = map(target.fileID);
      let o = objects.get(id);
      if (!o) {
        if (!src.objects.has(target.fileID) && MODEL_EXT.has(extname(srcPath).toLowerCase())) {
          // a node inside a model: keep its overrides, so an inactive
          // flag can be reported
          o = { classId: 0, id, stripped: false, type: "ModelNode", data: {},
            modelInner: { model: srcPath, sourceId: target.fileID } };
          objects.set(id, o);
        } else {
          continue;
        }
      }
      setProperty(o.data, m.propertyPath, m.value, m.objectReference);
    }

    const remove = (refs: any[]) => {
      for (const r of refs ?? []) objects.delete(map(r.fileID));
    };
    remove(mod.m_RemovedComponents);
    for (const r of mod.m_RemovedGameObjects ?? []) {
      const go = map(r.fileID);
      for (const o of [...objects.values()]) if (o.data.m_GameObject?.fileID === go) objects.delete(o.id);
      objects.delete(go);
    }
    // m_AddedGameObjects and m_AddedComponents are ordinary objects in
    // this file that point at the stripped stand-ins; the tree is built
    // from those back-references, so they need nothing here
  }
}

/** rewrite in-file references `{fileID}` (no guid) that point into `table` */
function remap (data: any, table: Map<string, Obj>, map: (id: string) => string): any {
  if (Array.isArray(data)) return data.map(d => remap(d, table, map));
  if (data && typeof data === "object") {
    if ("fileID" in data && !data.guid && table.has(data.fileID)) {
      return { ...data, fileID: map(data.fileID) };
    }
    for (const k in data) data[k] = remap(data[k], table, map);
  }
  return data;
}

/** apply a modification path like `m_LocalPosition.x`,
 * `m_Materials.Array.data[0]` or `sounds.Array.size` */
export function setProperty (data: any, path: string, value: any, ref: any) {
  const keys: (string | number)[] = [];
  const parts = String(path).split(".");
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p === "Array") {
      const next = parts[++i];
      const m = next?.match(/^data\[(\d+)\]$/);
      if (m) keys.push(Number(m[1]));
      else if (next === "size") keys.push("length");
      continue;
    }
    keys.push(p);
  }
  let o = data;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (o[k] == null || typeof o[k] !== "object") o[k] = typeof keys[i + 1] === "number" || keys[i + 1] === "length" ? [] : {};
    o = o[k];
  }
  const last = keys[keys.length - 1];
  if (last === "length") {
    if (Array.isArray(o)) o.length = Number(value);
    return;
  }
  const isRef = ref && ref.fileID && ref.fileID !== "0" ||
    (o[last] && typeof o[last] === "object" && "fileID" in o[last]);
  o[last] = isRef ? { ...ref } : (value ?? "");
}
