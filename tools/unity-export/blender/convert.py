# Headless Blender step of the model export (see ../README.md).
#
#   Blender -b --factory-startup -P convert.py -- job.json
#
# For each model: import the FBX, drop hidden nodes, name its materials
# after the Unity materials they map to, move every palette face onto a
# small repacked palette, and export a GLB with no textures. Then write
# the repacked palette images and crop the referenced sticker cells.
# Reads only the paths in the job; writes only to its output paths.

import bpy, bmesh, json, math, os, sys
import numpy as np
from mathutils import Matrix

job = json.load(open(sys.argv[sys.argv.index("--") + 1]))
P = job["palette"]
ATLASES = P["atlases"]    # source palette textures, each with its grid
BLOCK = P["block"]        # pixels per swatch side in the output
INSET = 0.1               # ignore UVs this close to a cell edge, in cells

report = {"models": {}, "palette": {}, "warnings": []}

def warn (msg):
  print("WARN", msg)
  report["warnings"].append(msg)

def reset ():
  bpy.ops.wm.read_factory_settings(use_empty=True)

def import_model (m):
  reset()
  bpy.ops.import_scene.fbx(filepath=m["src"])
  for name in m["hide"]:
    o = bpy.data.objects.get(name)
    if not o:
      warn(f"{m['name']}: no node named {name!r} to hide")
      continue
    for c in [o, *o.children_recursive]:
      bpy.data.objects.remove(c, do_unlink=True)
  if m.get("parts"):
    return import_parts(m)
  # Unity makes a lone top-level node the model root, and the prefab's
  # root transform replaces that node's own; keep only the import's
  # axis and unit conversion
  tops = [o for o in bpy.data.objects if o.parent is None]
  if len(tops) == 1:
    o = tops[0]
    loc, rot, scl = o.matrix_basis.decompose()
    if loc.length > 1e-6:
      print(f"  {m['name']}: lone root {o.name!r} offset {tuple(round(v, 4) for v in loc)} dropped")
    o.location = (0, 0, 0)
  return [o for o in bpy.data.objects if o.type == "MESH"]

def import_parts (m):
  """A Unity mesh is the file's raw geometry in meters, without its
  node's transform (the prefab places it). Keep the named objects, each
  with only the import's axis and unit conversion, so the GLB has them
  at the origin, named for the page to pick out."""
  keep = []
  for name in m["parts"]:
    o = bpy.data.objects.get(name)
    if not o or o.type != "MESH":
      warn(f"{m['name']}: no mesh named {name!r}")
    else:
      keep.append(o)
  for o in [o for o in bpy.data.objects if o not in keep]:
    bpy.data.objects.remove(o, do_unlink=True)
  for o in keep:
    # a mirrored node reads as a negative scale; the mesh itself isn't
    # mirrored (a prefab mirrors it with its own negative scale)
    scale = [abs(v) for v in o.matrix_world.to_scale()]
    if max(scale) - min(scale) > 1e-6:
      warn(f"{m['name']}: {o.name} has a non-uniform scale {tuple(scale)}")
    o.parent = None
    # Blender reads the files as Y-up and turns them a quarter round X
    o.matrix_world = Matrix.Rotation(math.pi / 2, 4, "X") @ Matrix.Scale(scale[0], 4)
  return keep

def strip (name):
  # Blender suffixes duplicate names: "Universal.001"
  base, _, tail = name.rpartition(".")
  return base if base and tail.isdigit() else name

def load_pixels (path):
  img = bpy.data.images.load(path)
  img.colorspace_settings.name = "Non-Color"  # raw stored values
  w, h = img.size
  px = np.empty(w * h * 4, dtype=np.float32)
  img.pixels.foreach_get(px)
  bpy.data.images.remove(img)
  return px.reshape(h, w, 4), w, h

_colors = {}
def cell_color (cell):
  """median albedo of an atlas cell, to tell apart neighbors that differ"""
  a, cx, cy = cell
  if a not in _colors:
    px, w, h = load_pixels(ATLASES[a]["albedo"])
    g = ATLASES[a]["grid"]
    cw, ch = w // g, h // g
    pad = max(1, int(cw * 0.15))
    _colors[a] = {(x, y): np.round(np.median(px[y * ch + pad:(y + 1) * ch - pad, x * cw + pad:(x + 1) * cw - pad].reshape(-1, 4), axis=0), 2)
                  for x in range(g) for y in range(g)}
  return _colors[a].get((cx % ATLASES[a]["grid"], cy % ATLASES[a]["grid"]))

def face_cells (m, mesh, uv):
  """(atlas, x, y) cell of each palette face, or None, and whether the
  face spans more than one cell"""
  out = []
  for poly in mesh.polygons:
    mat = mesh.materials[poly.material_index] if mesh.materials else None
    # by the model's own material names, before they're renamed
    a = m["atlases"].get(m["materials"].get(strip(mat.name))) if mat else None
    if a is None:
      out.append((None, False))
      continue
    grid = ATLASES[a]["grid"]
    us = [uv.data[i].uv for i in poly.loop_indices]
    cu = sum(u.x for u in us) / len(us)
    cv = sum(u.y for u in us) / len(us)
    cell = (a, int(math.floor(cu % 1 * grid)), int(math.floor(cv % 1 * grid)))
    spans = False
    for u in us:
      fx, fy = u.x % 1 * grid, u.y % 1 * grid
      c = (a, int(math.floor(fx)), int(math.floor(fy)))
      if c != cell and min(abs(fx - round(fx)), abs(fy - round(fy))) > INSET \
          and not np.array_equal(cell_color(c), cell_color(cell)):
        spans = True
    out.append((cell, spans))
  return out

# pass 1: collect the cells every palette face samples
used = {}
for m in job["models"]:
  objs = import_model(m)
  spans = 0
  for o in objs:
    mesh = o.data
    uv = mesh.uv_layers.active
    if not uv: continue
    for cell, span in face_cells(m, mesh, uv):
      if cell is None: continue
      used[cell] = used.get(cell, 0) + 1
      spans += span
  if spans: warn(f"{m['name']}: {spans} face(s) span more than one palette cell")

cells = sorted(used, key=lambda c: (c[0], -c[2], c[1]))  # by atlas, top row first
side = max(1, math.ceil(math.sqrt(len(cells))))
slot = {c: i for i, c in enumerate(cells)}
size = side * BLOCK
print(f"palette: {len(cells)} swatches in a {side}x{side} grid, {size}px")

def slot_uv (cell):
  i = slot[cell]
  sx, sy = i % side, side - 1 - i // side
  return ((sx + 0.5) / side, (sy + 0.5) / side)

# pass 2: rewrite UVs, rename materials, export
for m in job["models"]:
  objs = import_model(m)
  tris = 0
  for o in objs:
    mesh = o.data
    tris += sum(len(p.vertices) - 2 for p in mesh.polygons)
    uv = mesh.uv_layers.active
    if not uv: continue
    for poly, (cell, _) in zip(mesh.polygons, face_cells(m, mesh, uv)):
      if cell not in slot: continue
      u, v = slot_uv(cell)
      for i in poly.loop_indices:
        uv.data[i].uv = (u, v)
    # extra UV maps would only add bytes
    for layer in [l for l in mesh.uv_layers if l != uv]:
      mesh.uv_layers.remove(layer)
    for attr in [a for a in mesh.color_attributes]:
      mesh.color_attributes.remove(attr)
  for mat in list(bpy.data.materials):
    page = m["materials"].get(strip(mat.name))
    if page:
      mat.name = page
    else:
      warn(f"{m['name']}: material {mat.name!r} has no Unity material")
    if mat.node_tree:  # textures stay out of the GLB; the page has its own
      for n in [n for n in mat.node_tree.nodes if n.type == "TEX_IMAGE"]:
        mat.node_tree.nodes.remove(n)
  bpy.ops.export_scene.gltf(
    filepath=m["out"],
    export_format="GLB",
    export_materials="EXPORT",
    export_image_format="NONE",
    export_yup=True,
    export_apply=True,
    export_animations=False,
    export_cameras=False,
    export_lights=False,
    export_copyright=job["copyright"],
  )
  report["models"][m["name"]] = {"tris": tris, "bytes": os.path.getsize(m["out"])}
  print(f"  {m['name']}: {tris} tris, {os.path.getsize(m['out']) // 1024}KB")

# pass 3: the repacked palette images
def cell_medians (key, fallback):
  """median of each used cell in each atlas's `key` texture, or fallback
  for an atlas without one"""
  out = {}
  for a, atlas in enumerate(ATLASES):
    mine = [c for c in cells if c[0] == a]
    if not mine: continue
    if not atlas.get(key):
      for c in mine: out[c] = np.array(fallback(atlas), dtype=np.float32)
      continue
    px, w, h = load_pixels(atlas[key])
    grid = atlas["grid"]
    cw, ch = w // grid, h // grid
    pad = max(1, int(cw * 0.15))
    for (_, cx, cy) in mine:
      block = px[cy * ch + pad:(cy + 1) * ch - pad, cx * cw + pad:(cx + 1) * cw - pad].reshape(-1, 4)
      out[(a, cx, cy)] = np.median(block, axis=0)
  return out

def write (path, colors, srgb):
  img = bpy.data.images.new(os.path.basename(path), size, size, alpha=True)
  img.colorspace_settings.name = "sRGB" if srgb else "Non-Color"
  buf = np.zeros((size, size, 4), dtype=np.float32)
  for cell in cells:
    i = slot[cell]
    sx, sy = i % side, side - 1 - i // side
    buf[sy * BLOCK:(sy + 1) * BLOCK, sx * BLOCK:(sx + 1) * BLOCK] = colors[cell]
  img.pixels.foreach_set(buf.ravel())
  img.filepath_raw = path
  img.file_format = "PNG"
  img.save()
  bpy.data.images.remove(img)

albedo = cell_medians("albedo", lambda a: [1, 1, 1, 1])
emission = cell_medians("emission", lambda a: [0, 0, 0, 1])
# URP's mask: R metallic, A smoothness
mask = cell_medians("mask", lambda a: [a["metallic"], 0, 0, a["smoothness"]])
mr = {}
for c in cells:
  metallic, smooth = mask[c][0], mask[c][3]
  mr[c] = np.array([0, 1 - smooth, metallic, 1], dtype=np.float32)  # glTF: G rough, B metal
for c in cells:
  emission[c][3] = 1
write(P["out"]["albedo"], albedo, True)
write(P["out"]["emission"], emission, True)
write(P["out"]["mr"], mr, False)
for c in cells:
  report["palette"][",".join(map(str, c))] = {
    "uses": used[c],
    "albedo": [round(float(v), 3) for v in albedo[c]],
    "emission": [round(float(v), 3) for v in emission[c][:3]],
    "metallic": round(float(mask[c][0]), 3),
    "smoothness": round(float(mask[c][3]), 3),
  }

# pass 4: sticker cells
for s in job["stickers"]:
  img = bpy.data.images.get(os.path.basename(s["sheet"])) or bpy.data.images.load(s["sheet"])
  img.colorspace_settings.name = "Non-Color"
  w, h = img.size
  px = np.empty(w * h * 4, dtype=np.float32)
  img.pixels.foreach_get(px)
  px = px.reshape(h, w, 4)
  k = s["size"] / w  # sheet units per pixel
  g = int(s["grid"] / k)
  x0, y0 = int(s["x"] * g), int(s["y"] * g)
  crop = px[y0:y0 + g, x0:x0 + g].copy()
  out = bpy.data.images.new(os.path.basename(s["out"]), g, g, alpha=True)
  out.colorspace_settings.name = "Non-Color"
  out.pixels.foreach_set(crop.ravel())
  if g != s["px"]: out.scale(s["px"], s["px"])
  out.filepath_raw = s["out"]
  out.file_format = "PNG"
  out.save()
  bpy.data.images.remove(out)

json.dump(report, open(job["report"], "w"), indent=2)
print("DONE")
