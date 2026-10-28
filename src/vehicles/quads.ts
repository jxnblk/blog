// Stickers and light quads. Both are Unity quads: 1x1 in the XY plane,
// facing -Z. Turning three's plane (which faces +Z) half way round Y
// matches that, and keeps sticker UVs reading the right way after the
// X mirror from Unity's left-handed space.
import { Color, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import { loadSticker, type Materials, type Mode, type StickerInfo } from "./materials";

export const quad = new PlaneGeometry(1, 1).rotateY(Math.PI);

export type LightInfo = {
  color: [number, number, number]; // linear HDR
  blink?: number; // seconds on, then off
};

export async function sticker (base: string, info: StickerInfo, materials: Materials, mode: Mode) {
  const map = await loadSticker(base + info.texture);
  const mesh = new Mesh(quad);
  mesh.userData.part = { type: "sticker", sticker: info, map };
  mesh.material = materials.get(mesh.userData.part, mode);
  mesh.renderOrder = 1;
  return mesh;
}

export type Blinker = { mesh: Mesh; color: Color; delay: number; timer: number; lit: boolean };

// Unity's lights are HDR colors near 1; brighter here so they clear the
// bloom threshold, which sits above the page background
const BOOST = 3;

export function light (info: LightInfo, materials: Materials, blinkers: Blinker[]) {
  const color = new Color(...info.color).multiplyScalar(BOOST);
  const mesh = new Mesh(quad);
  mesh.userData.part = { type: "light", color };
  if (info.blink) {
    // its own material, to switch on and off
    mesh.material = new MeshBasicMaterial({ color: color.clone(), toneMapped: false, side: DoubleSide });
    blinkers.push({ mesh, color, delay: info.blink, timer: info.blink, lit: true });
  } else {
    mesh.material = materials.light(color);
  }
  return mesh;
}

const OFF = new Color(0, 0, 0);

/** BlinkingLight.cs, as meant: on for `delay` seconds, then off */
export function blink (blinkers: Blinker[], dt: number) {
  for (const b of blinkers) {
    b.timer -= dt;
    if (b.timer > 0) continue;
    b.timer += b.delay;
    b.lit = !b.lit;
    (b.mesh.material as MeshBasicMaterial).color.copy(b.lit ? b.color : OFF);
  }
}
