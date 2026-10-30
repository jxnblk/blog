// The /models viewer: loads the exported models (images/models,
// written by tools/unity-export) and draws one at a time.
import {
  Box3,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  type Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  PropertyBinding,
  Scene,
  Sphere,
  Timer,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { unityBloom } from "./bloom";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { loadPalette, Materials, type MaterialInfo, type Mode, type StickerInfo, type Theme } from "./materials";
import { blink, light, sticker, type Blinker, type LightInfo } from "./quads";

type Node = {
  name: string;
  p?: [number, number, number];
  q?: [number, number, number, number];
  s?: [number, number, number];
  model?: string;
  part?: string; // one object out of the model
  sticker?: StickerInfo;
  light?: LightInfo;
  spin?: number;
  children?: Node[];
};

type Index = {
  entries: { id: string; title: string }[];
  palette: { albedo: string; emission: string; mr: string };
  materials: Record<string, MaterialInfo>;
};

type Entry = {
  group: Group;
  blinkers: Blinker[];
  spinners: { node: Object3D; speed: number }[];
  sphere: Sphere;
  level: boolean; // framed from its own height, not from above
};

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

const root = document.getElementById("models");
if (root) main(root).catch(err => {
  console.error(err);
  root.querySelector(".models-viewer")!.textContent = "The viewer couldn't load.";
});

async function main (root: HTMLElement) {
  const base = root.dataset.src!;
  const viewer = root.querySelector<HTMLElement>(".models-viewer")!;

  // a transparent canvas, so the page (and its dot grid) shows through
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  viewer.append(renderer.domElement);

  const scene = new Scene();
  const theme = readTheme();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.6;
  scene.add(new HemisphereLight(0xffffff, 0x8a7a66, 1.2));
  const sun = new DirectionalLight(0xffffff, 2);
  sun.position.set(-3, 5, 4);
  scene.add(sun);

  const camera = new PerspectiveCamera(30, 1, 0.05, 200);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  // let wheel events scroll the page instead of zooming
  controls.enableZoom = false;
  controls.autoRotateSpeed = 1.5;

  // no tone mapping, so the paper-colored materials match the page.
  // Bloom, measured like Unity's (bloom.ts), starts above 1, so only
  // lights and the brightest highlights glow. The glow is additive
  // (bloom.ts), so it brightens the page behind the transparent canvas
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = unityBloom(0.4, 0.2, 1);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const index: Index = await (await fetch(base + "index.json")).json();
  const palette = await loadPalette(base, index.palette);
  const materials = new Materials(palette, index.materials, theme);
  const gltf = new GLTFLoader();
  const models = new Map<string, Promise<Group>>();
  const loadModel = (url: string) => {
    let m = models.get(url);
    if (!m) {
      m = gltf.loadAsync(url).then(g => g.scene);
      models.set(url, m);
    }
    return m;
  };

  let mode = (root.dataset.mode ?? "studio") as Mode;
  const entries = new Map<string, Promise<Entry>>();
  let current: Entry | undefined;
  let currentId = "";

  async function build (id: string): Promise<Entry> {
    const data: { root: Node; level?: boolean } = await (await fetch(`${base}${id}.json`)).json();
    const blinkers: Blinker[] = [];
    const spinners: Entry["spinners"] = [];
    const make = async (n: Node): Promise<Object3D> => {
      const o = new Group();
      o.name = n.name;
      if (n.p) o.position.fromArray(n.p);
      if (n.q) o.quaternion.fromArray(n.q);
      if (n.s) o.scale.fromArray(n.s);
      if (n.model) {
        const file = await loadModel(base + n.model);
        // the loader names nodes as animation tracks need: "zFT RB" -> "zFT_RB"
        const source = n.part ? file.getObjectByName(PropertyBinding.sanitizeNodeName(n.part)) : file;
        if (!source) throw new Error(`${n.model} has no part ${n.part}`);
        const model = source.clone();
        model.traverse(m => {
          if (m instanceof Mesh) {
            // Blender may suffix a repeated name: "universal-a.001"
            const name = String(m.material.name).replace(/\.\d+$/, "");
            m.userData.part = { type: "model", material: name };
          }
        });
        o.add(model);
      }
      if (n.sticker) o.add(await sticker(base, n.sticker, materials, mode));
      if (n.light) o.add(light(n.light, materials, blinkers));
      if (n.spin) spinners.push({ node: o, speed: n.spin * Math.PI / 180 });
      for (const c of await Promise.all((n.children ?? []).map(make))) o.add(c);
      return o;
    };
    const group = new Group();
    group.add(await make(data.root));
    materials.apply(group, mode);
    group.updateMatrixWorld(true);
    const sphere = new Box3().setFromObject(group).getBoundingSphere(new Sphere());
    return { group, blinkers, spinners, sphere, level: !!data.level };
  }

  async function show (id: string) {
    currentId = id;
    let v = entries.get(id);
    if (!v) {
      v = build(id);
      entries.set(id, v);
    }
    root.setAttribute("aria-busy", "true");
    const entry = await v;
    if (currentId !== id) return; // another was picked meanwhile
    root.removeAttribute("aria-busy");
    if (current) scene.remove(current.group);
    current = entry;
    materials.apply(entry.group, mode);
    scene.add(entry.group);
    frame(entry);
  }

  // a three-quarter view from the front left, from a little above (or
  // level), fitted to the model
  function frame ({ sphere, level }: Entry) {
    const fov = camera.fov * Math.PI / 180;
    const fit = Math.min(fov, 2 * Math.atan(Math.tan(fov / 2) * camera.aspect));
    // the bounding sphere is loose around long, thin models
    const distance = sphere.radius / Math.sin(fit / 2) * 0.95;
    const dir = new Vector3(1.6, level ? 0 : 0.6, 1.1).normalize();
    controls.target.copy(sphere.center);
    camera.position.copy(sphere.center).addScaledVector(dir, distance);
    camera.near = distance / 50;
    camera.far = distance * 10;
    camera.updateProjectionMatrix();
    controls.minDistance = sphere.radius * 0.8;
    controls.maxDistance = distance * 3;
    controls.update();
  }

  function setMode (m: Mode) {
    mode = m;
    root.dataset.mode = m;
    if (current) materials.apply(current.group, mode);
  }

  // controls
  const buttons = [...root.querySelectorAll<HTMLButtonElement>("button")];
  const press = (value: string) => {
    for (const b of buttons) {
      if (b.dataset.entry !== undefined) b.setAttribute("aria-pressed", String(b.dataset.entry === value));
    }
  };
  for (const b of buttons) {
    b.addEventListener("click", () => {
      if (b.dataset.entry) select(b.dataset.entry);
      if (b.dataset.step) step(Number(b.dataset.step));
      if (b.dataset.modes) cycleMode(b);
    });
  }
  // the shading button steps to the next mode in its list
  function cycleMode (b: HTMLButtonElement) {
    const modes: { id: Mode; title: string }[] = JSON.parse(b.dataset.modes!);
    const i = modes.findIndex(m => m.id === mode);
    const next = modes[(i + 1) % modes.length];
    setMode(next.id);
    const label = `Shading: ${next.title}`;
    b.setAttribute("aria-label", label);
    b.title = label;
  }
  const ids = index.entries.map(v => v.id);
  const name = root.querySelector<HTMLElement>(".models-name")!;
  function select (id: string, updateHash = true) {
    if (!ids.includes(id)) return;
    press(id);
    root.dataset.entry = id;
    name.textContent = index.entries.find(v => v.id === id)!.title;
    if (updateHash) history.replaceState(null, "", "#" + id);
    show(id);
  }
  // the carousel wraps around at both ends
  function step (by: number) {
    const i = ids.indexOf(root.dataset.entry ?? ids[0]);
    select(ids[(i + by + ids.length) % ids.length]);
  }
  // arrow keys step while focus is in the viewer's controls
  root.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
    else return;
    e.preventDefault();
  });
  addEventListener("hashchange", () => select(location.hash.slice(1), false));

  // follow the site's color mode (client.js sets a class on body)
  new MutationObserver(() => {
    materials.setTheme(readTheme());
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

  // size to the container
  const resize = () => {
    const w = viewer.clientWidth, h = viewer.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    composer.setSize(w, h);
    bloom.resolution.set(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (current) frame(current);
  };
  new ResizeObserver(resize).observe(viewer);
  resize();

  // draw only while on screen
  const timer = new Timer();
  const loop = () => {
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.1);
    const moving = !reducedMotion.matches;
    controls.autoRotate = moving;
    if (current && moving) {
      blink(current.blinkers, dt);
      for (const s of current.spinners) s.node.rotateY(s.speed * dt);
    }
    controls.update(dt);
    composer.render(dt);
  };
  new IntersectionObserver(([entry]) => {
    renderer.setAnimationLoop(entry.isIntersecting ? loop : null);
  }).observe(viewer);

  select(ids.includes(location.hash.slice(1)) ? location.hash.slice(1) : root.dataset.entry ?? ids[0], false);
}

function readTheme (): Theme {
  const style = getComputedStyle(document.body);
  const get = (name: string, fallback: string) => {
    const c = new Color();
    try {
      c.setStyle(style.getPropertyValue(name).trim() || fallback);
    } catch {
      c.setStyle(fallback);
    }
    return c;
  };
  return {
    background: get("--background", "#fcf6e8"),
    primary: get("--primary", "#146b71"),
    text: get("--text", "#120d03"),
  };
}
