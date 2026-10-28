# Unity vehicle export

Exports the Novantica vehicles from the Unity project for the `/vehicles`
page. The output in `images/vehicles/` is committed, so building the site
(and CI) needs neither Unity nor Blender.

```sh
bun run export:vehicles [--project ~/unity/na-map-prototype] [--out images/vehicles]
```

## Requirements

- Bun
- Blender 4.2 or newer (tested with 5.1), at
  `/Applications/Blender.app/Contents/MacOS/Blender` or set by `BLENDER=/path/to/blender`

Unity doesn't need to be installed or open.

## What it reads

Only text and source files under the project's `Assets/`, read-only. It never
writes to the Unity project and doesn't use `Library/`.

- `*.meta` for the guid → path index, and FBX material remaps
- the vehicle prefabs in `vehicles.ts`, with the prefabs, variants and
  models they nest
- `.mat` files for material colors and textures
- the FBX models, the Polyperfect palette atlas, and the sticker sheets
  (through Blender)

## What it writes

- `index.json`: the vehicle list, with counts, and the model materials
- `<id>.json`: each vehicle as a tree of nodes, in three.js/glTF space
  (Unity's X is mirrored), with `model`, `sticker`, `light` and `spin` nodes
- `models/*.glb`: one per FBX, without textures; material names are the
  Unity material names
- `palette.png`, `palette-emission.png`, `palette-mr.png`: only the palette
  swatches the models use, repacked into a small atlas (the model UVs are
  moved to match). The original atlas isn't shipped.
- `stickers/*.png`: the sticker sheet cells the vehicles use, 256px

## How it works

- `unity-yaml.ts` splits Unity's YAML on `--- !u!<class> &<fileID>` headers
  and parses each document with every value as a string, since fileIDs
  overflow doubles.
- `prefab.ts` merges nested prefabs into one table. A nested object's id
  is `(prefabInstance ^ sourceId) & 0x7FFFFFFFFFFFFFFF`, then each
  instance's modifications, removed components, and added objects apply
  from the inside out.
- `extract.ts` keeps the active objects that draw: model roots, `Sticker`
  quads, `DynamicLight`/`BlinkingLight` quads, and `Rotatable` spins.
  Models whose materials are all haze/distortion effects are skipped.
- `blender/convert.py` converts the models and builds the palette and
  sticker images.

## Caveats

- Nodes inside a model are known to a prefab only by hashed fileIDs. When a
  prefab switches one off, the export warns, and the node has to be named in
  `hide` in `vehicles.ts` (as for the Javelin's `nose tail lights.001`).
  Material overrides on those nodes are reported, not applied.
- A model with a single top-level node has that node's own transform
  replaced by the prefab's, as in Unity.
- Skipped: particles, trails, HUDs (inactive until mounted), haze quads,
  and other textured quads such as the Hoverbike's QR code.
