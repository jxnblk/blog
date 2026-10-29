# Unity model export

Exports the Novantica models from the Unity projects for the `/models`
page. The output in `images/models/` is committed, so building the site
(and CI) needs neither Unity nor Blender.

```sh
bun run export:models [--project ~/unity/na-map-prototype] [--out images/models]
```

## Requirements

- Bun
- Blender 4.2 or newer (tested with 5.1), at
  `/Applications/Blender.app/Contents/MacOS/Blender` or set by `BLENDER=/path/to/blender`

Unity doesn't need to be installed or open.

`--project` is the default project. An entry in `entries.ts` can set its
own `project` (the bots and props come from `~/unity/ac-mini`). The
projects must share the palette atlas; a model, material or sticker found
in both is written once.

## What it reads

Only text and source files under the project's `Assets/`, read-only. It never
writes to the Unity project and doesn't use `Library/`.

- `*.meta` for the guid → path index, and FBX material remaps
- the prefabs in `entries.ts`, with the prefabs, variants and
  models they nest
- `.mat` files for material colors and textures
- the FBX models, the Polyperfect palette atlas, and the sticker sheets
  (through Blender)

## What it writes

- `index.json`: the list of entries, with counts, and the model materials
- `<id>.json`: each entry as a tree of nodes, in three.js/glTF space
  (Unity's X is mirrored), with `model`, `sticker`, `light` and `spin` nodes
- `models/*.glb`: one per FBX, without textures; material names are the
  Unity material names
- `palette.png`, `palette-emission.png`, `palette-mr.png`: only the palette
  swatches the models use, repacked into a small atlas (the model UVs are
  moved to match). The original atlas isn't shipped.
- `stickers/*.png`: the sticker sheet cells the entries use, 256px

## How it works

- `unity-yaml.ts` splits Unity's YAML on `--- !u!<class> &<fileID>` headers
  and parses each document with every value as a string, since fileIDs
  overflow doubles.
- `prefab.ts` merges nested prefabs into one table. A nested object's id
  is `(prefabInstance ^ sourceId) & 0x7FFFFFFFFFFFFFFF`, then each
  instance's modifications, removed components, and added objects apply
  from the inside out.
- A renderer that draws one mesh out of a model (not a placed model) is
  a part: Unity names a model's meshes after their nodes, with the fileID
  `xxHash64("Type:Mesh->" + name + "0")`, which `extract.ts` matches
  against the node names in the FBX. Each such model gets a
  `<name>-parts.glb` with those objects at the origin, and the node names
  its `part`.
- Model materials without a remap in the `.meta` are found by name, as the
  importer's `materialSearch` does (the `Materials` folders up to `Assets`).
- `extract.ts` keeps the active objects that draw: model roots, `Sticker`
  quads, `DynamicLight`/`BlinkingLight` quads, and `Rotatable` spins.
  Models whose materials are all haze/distortion effects are skipped.
- `blender/convert.py` converts the models and builds the palette and
  sticker images.

## Caveats

- Nodes inside a model are known to a prefab only by hashed fileIDs. When a
  prefab switches one off, the export warns, and the node has to be named in
  `hide` in `entries.ts` (as for the Javelin's `nose tail lights.001`).
  Material overrides on those nodes are reported, not applied.
- A model with a single top-level node has that node's own transform
  replaced by the prefab's, as in Unity.
- Skipped: particles, trails, HUDs (inactive until mounted), haze quads,
  and other textured quads such as the Hoverbike's QR code.
