// Reads the few properties of a Unity .mat the web page needs.
import { join } from "node:path";
import { readUnityYAML } from "./unity-yaml";

export type Mat = {
  path: string;
  name: string;
  shader: string; // shader asset path, or the guid if not in Assets
  keywords: string[];
  textures: Record<string, string | undefined>; // property -> texture path
  floats: Record<string, number>;
  colors: Record<string, [number, number, number, number]>;
};

const entries = (list: any[]) => {
  const out: Record<string, any> = {};
  for (const e of list ?? []) Object.assign(out, e);
  return out;
};

export function readMaterial (project: string, path: string, guids: Map<string, string>): Mat {
  const doc = readUnityYAML(join(project, path)).find(o => o.type === "Material")!;
  const d = doc.data;
  const props = d.m_SavedProperties ?? {};
  const textures: Mat["textures"] = {};
  for (const [k, v] of Object.entries(entries(props.m_TexEnvs))) {
    const g = (v as any)?.m_Texture?.guid;
    if (g) textures[k] = guids.get(g) ?? g;
  }
  const floats: Mat["floats"] = {};
  for (const [k, v] of Object.entries(entries(props.m_Floats))) floats[k] = Number(v);
  const colors: Mat["colors"] = {};
  for (const [k, v] of Object.entries(entries(props.m_Colors)) as [string, any][]) {
    colors[k] = [Number(v.r), Number(v.g), Number(v.b), Number(v.a)];
  }
  return {
    path,
    name: d.m_Name,
    shader: guids.get(d.m_Shader?.guid) ?? d.m_Shader?.guid ?? "",
    keywords: d.m_ValidKeywords ?? (d.m_ShaderKeywords ? String(d.m_ShaderKeywords).split(" ") : []),
    textures,
    floats,
    colors,
  };
}
