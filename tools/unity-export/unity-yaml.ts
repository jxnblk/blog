// Unity's text serialization: a YAML stream of documents, each headed
// `--- !u!<classId> &<fileID>[ stripped]`. Parsed with the failsafe
// schema so every scalar stays a string: fileIDs overflow doubles, and
// some guids (all digits and one "e") would otherwise read as floats.
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { parse } from "yaml";

export type UObject = {
  classId: number;
  id: string;
  stripped: boolean;
  type: string;
  data: any;
};

const HEADER = /^--- !u!(\d+) &(-?\d+)( stripped)?[^\n]*$/gm;

export function parseUnityYAML (text: string): UObject[] {
  const heads = [...text.matchAll(HEADER)];
  return heads.map((h, i) => {
    const start = h.index! + h[0].length;
    const end = i + 1 < heads.length ? heads[i + 1].index! : text.length;
    const doc = parse(text.slice(start, end), { schema: "failsafe" }) ?? {};
    const type = Object.keys(doc)[0];
    return {
      classId: Number(h[1]),
      id: h[2],
      stripped: !!h[3],
      type,
      data: doc[type] ?? {},
    };
  });
}

export function readUnityYAML (path: string) {
  return parseUnityYAML(readFileSync(path, "utf8"));
}

/** guid → asset path (relative to the project), from every .meta under Assets */
export function indexGuids (project: string) {
  const guids = new Map<string, string>();
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".meta")) {
        const head = readFileSync(p, "utf8").slice(0, 400);
        const m = head.match(/^guid: (\w+)/m);
        if (m) guids.set(m[1], relative(project, p.slice(0, -5)));
      }
    }
  };
  walk(join(project, "Assets"));
  return guids;
}

export type Ref = { fileID: string; guid?: string; type?: string };

export const num = (v: any, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
