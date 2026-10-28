// Shading modes for the vehicle viewer. Every mesh records what it is in
// userData.part, and applyMode swaps its material for the current mode.
import {
  Color,
  DoubleSide,
  EdgesGeometry,
  FrontSide,
  LineBasicMaterial,
  LineSegments,
  type Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NearestFilter,
  NoColorSpace,
  type Object3D,
  ShaderMaterial,
  SRGBColorSpace,
  type Texture,
  TextureLoader,
  Vector3,
} from "three";

export type Mode = "studio" | "toon" | "blueprint";

export type MaterialInfo = {
  kind: "palette" | "glass" | "solid";
  color: [number, number, number]; // sRGB
  opacity: number;
  metalness: number;
  roughness: number;
};

export type StickerInfo = {
  texture: string;
  tint: [number, number, number]; // sRGB
  metalness: number;
  roughness: number;
  emissive?: [number, number, number]; // linear HDR
};

/** what a mesh is, so each mode can shade it */
export type Part =
  | { type: "model"; material: string }
  | { type: "sticker"; sticker: StickerInfo; map: Texture }
  | { type: "light"; color: Color };

export type Palette = { albedo: Texture; emission: Texture; mr: Texture };

export type Theme = { background: Color; primary: Color; text: Color };

const loader = new TextureLoader();

export async function loadPalette (base: string, files: Record<keyof Palette, string>): Promise<Palette> {
  const load = async (file: string, srgb: boolean) => {
    const t = await loader.loadAsync(base + file);
    t.colorSpace = srgb ? SRGBColorSpace : NoColorSpace;
    t.magFilter = t.minFilter = NearestFilter;
    t.generateMipmaps = false;
    t.flipY = false; // glTF UVs start at the top
    return t;
  };
  const [albedo, emission, mr] = await Promise.all([
    load(files.albedo, true),
    load(files.emission, true),
    load(files.mr, false),
  ]);
  return { albedo, emission, mr };
}

const stickerTextures = new Map<string, Promise<Texture>>();
export function loadSticker (url: string) {
  let t = stickerTextures.get(url);
  if (!t) {
    t = loader.loadAsync(url).then(tex => {
      tex.colorSpace = SRGBColorSpace;
      tex.anisotropy = 4;
      return tex;
    });
    stickerTextures.set(url, t);
  }
  return t;
}

export const srgb = (c: [number, number, number]) =>
  new Color().setRGB(c[0], c[1], c[2], SRGBColorSpace);

// stickers sit on surfaces: pull them toward the camera in depth
const decal = { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 };

/** builds and caches one material per part and mode */
export class Materials {
  cache = new Map<string, Material>();
  edges = new Map<Mesh, LineSegments>();
  lineMaterial = new LineBasicMaterial(); // blueprint, in --primary
  inkMaterial = new LineBasicMaterial(); // toon, in --text
  constructor (
    public palette: Palette,
    public info: Record<string, MaterialInfo>,
    public theme: Theme,
  ) {
    this.setTheme(theme);
  }

  setTheme (theme: Theme) {
    this.theme = theme;
    this.lineMaterial.color.copy(theme.primary);
    this.inkMaterial.color.copy(theme.text);
    for (const [key, m] of this.cache) {
      if (!key.startsWith("blueprint")) continue;
      const mat = m as MeshBasicMaterial;
      mat.color.copy(key.endsWith(":ink") ? theme.primary : theme.background);
    }
  }

  get (part: Part, mode: Mode): Material {
    if (part.type === "light") return this.light(part.color);
    const key = part.type === "model"
      ? `${mode}:model:${part.material}`
      : `${mode}:sticker:${part.sticker.texture}:${part.sticker.tint}${mode === "blueprint" ? ":ink" : ""}`;
    let m = this.cache.get(key);
    if (!m) {
      m = this.create(part, mode);
      this.cache.set(key, m);
    }
    return m;
  }

  create (part: Exclude<Part, { type: "light" }>, mode: Mode): Material {
    if (part.type === "sticker") return this.sticker(part, mode);
    const info = this.info[part.material] ?? {
      kind: "solid", color: [0.5, 0.5, 0.5], opacity: 1, metalness: 0, roughness: 0.6,
    } satisfies MaterialInfo;
    const { albedo, emission, mr } = this.palette;
    const textured = info.kind !== "solid";
    const glass = info.kind === "glass";

    if (mode === "studio") {
      if (glass) {
        return new MeshPhysicalMaterial({
          map: albedo,
          transparent: true,
          metalness: 0,
          roughness: 0.05,
          clearcoat: 1,
          envMapIntensity: 1.5,
          depthWrite: false,
        });
      }
      return new MeshStandardMaterial(textured ? {
        map: albedo,
        metalnessMap: mr,
        roughnessMap: mr,
        metalness: 1,
        roughness: 1,
        emissiveMap: emission,
        emissive: 0xffffff,
        emissiveIntensity: 1.5,
      } : {
        color: srgb(info.color),
        metalness: info.metalness,
        roughness: info.roughness,
      });
    }

    if (mode === "toon") {
      return toon({
        map: textured ? albedo : undefined,
        emissiveMap: textured ? emission : undefined,
        color: srgb(info.color),
        transparent: glass,
      });
    }

    return new MeshBasicMaterial({
      color: this.theme.background,
      transparent: glass,
      opacity: glass ? 0.4 : 1,
      depthWrite: !glass,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
  }

  sticker (part: Extract<Part, { type: "sticker" }>, mode: Mode): Material {
    const s = part.sticker;
    if (mode === "studio") {
      return new MeshStandardMaterial({
        map: part.map,
        color: srgb(s.tint),
        metalness: s.metalness,
        roughness: s.roughness,
        alphaTest: 0.5,
        side: FrontSide,
        ...(s.emissive ? {
          emissive: new Color(...s.emissive),
          emissiveMap: part.map,
        } : {}),
        ...decal,
      });
    }
    if (mode === "toon") {
      return toon({
        map: part.map,
        color: srgb(s.tint),
        alphaTest: 0.5,
        emissive: s.emissive ? new Color(...s.emissive) : undefined,
        ...decal,
      });
    }
    return new MeshBasicMaterial({
      map: part.map,
      color: this.theme.primary,
      alphaTest: 0.5,
      ...decal,
    });
  }

  lights = new Map<string, MeshBasicMaterial>();
  light (color: Color) {
    const key = `${color.r},${color.g},${color.b}`;
    let m = this.lights.get(key);
    if (!m) {
      // HDR color, kept out of tone mapping so the bloom pass sees it
      m = new MeshBasicMaterial({ color, toneMapped: false, side: DoubleSide });
      this.lights.set(key, m);
    }
    return m;
  }

  /** set every mesh under root to the mode, with edge lines drawn over
   * models in toon (ink) and blueprint */
  apply (root: Object3D, mode: Mode) {
    root.traverse(o => {
      if (!(o instanceof Mesh) || !o.userData.part) return;
      const part = o.userData.part as Part;
      if (part.type === "light") return; // the same in every mode
      o.material = this.get(part, mode);
      if (part.type === "model") {
        let lines = this.edges.get(o);
        const lined = mode !== "studio";
        if (lined && !lines) {
          lines = new LineSegments(new EdgesGeometry(o.geometry, 25), this.lineMaterial);
          lines.raycast = () => {};
          o.add(lines);
          this.edges.set(o, lines);
        }
        if (lines) {
          lines.visible = lined;
          lines.material = mode === "toon" ? this.inkMaterial : this.lineMaterial;
        }
      }
    });
  }
}

const TOON_VERT = /* glsl */`
varying vec3 vNormal;
varying vec3 vView;
varying vec2 vUv;
void main () {
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = -mv.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}
`;

const TOON_FRAG = /* glsl */`
uniform sampler2D uMap;
uniform sampler2D uEmissiveMap;
uniform bool uUseMap;
uniform bool uUseEmissiveMap;
uniform vec3 uColor;
uniform vec3 uEmissive;
uniform vec3 uLight;
uniform float uBands;
uniform float uAlphaTest;
varying vec3 vNormal;
varying vec3 vView;
varying vec2 vUv;
void main () {
  vec4 base = vec4(uColor, 1.0);
  if (uUseMap) base *= texture2D(uMap, vUv);
  if (base.a < uAlphaTest) discard;
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(vView);
  // quantized lambert, lifted so the darkest band isn't black
  float d = max(dot(n, normalize(uLight)), 0.0);
  float band = floor(d * uBands + 0.5) / uBands;
  vec3 color = base.rgb * mix(0.3, 1.15, band);
  // hard fresnel rim
  float rim = smoothstep(0.62, 0.66, 1.0 - max(dot(n, v), 0.0));
  color += rim * 0.35 * (base.rgb + 0.15);
  vec3 glow = uEmissive;
  if (uUseEmissiveMap) glow *= texture2D(uEmissiveMap, vUv).rgb;
  gl_FragColor = vec4(color + glow, base.a);
  #include <colorspace_fragment>
}
`;

function toon (opts: {
  map?: Texture;
  emissiveMap?: Texture;
  color: Color;
  emissive?: Color;
  transparent?: boolean;
  alphaTest?: number;
  polygonOffset?: boolean;
  polygonOffsetFactor?: number;
  polygonOffsetUnits?: number;
}) {
  const { map, emissiveMap, color, emissive, alphaTest = 0, ...rest } = opts;
  return new ShaderMaterial({
    vertexShader: TOON_VERT,
    fragmentShader: TOON_FRAG,
    uniforms: {
      uMap: { value: map ?? null },
      uEmissiveMap: { value: emissiveMap ?? null },
      uUseMap: { value: !!map },
      uUseEmissiveMap: { value: !!emissiveMap },
      uColor: { value: color },
      uEmissive: { value: emissive ?? (emissiveMap ? new Color(2, 2, 2) : new Color(0, 0, 0)) },
      // fixed to the view, up and to the left of the camera
      uLight: { value: new Vector3(-0.5, 0.8, 0.6) },
      uBands: { value: 3 },
      uAlphaTest: { value: alphaTest },
    },
    depthWrite: !rest.transparent,
    ...rest,
  });
}
