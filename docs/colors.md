# Colors

Working notes for the new color themes. The goal: derive every site color from
the palette the tile flourishes already use, starting with a default theme
built on the "paper" background.

The current modes (`light`, `foliage`, `paper`, `amber`, `tomato` in
`src/style.css` and `src/client.js`) stay in place as reference until the new
set replaces them.

## How the tile colors are derived

All of this lives in `src/Flourish.tsx`, with a runtime layer in
`src/wind-gl.js`.

### 1. A base color per flourish

Each flourish picks one base color in HSL from its seed. 80% of the time it's
a foliage green; otherwise it's one of four floral hues, each equally likely
(5% each).

| Family    | Hue (°)  | Saturation | Lightness | Chance |
| --------- | -------- | ---------- | --------- | ------ |
| Foliage   | 74–150   | 25–50%     | 22–50%    | 80%    |
| Poppy     | 0–8      | 60–80%     | 50–64%    | 5%     |
| Marigold  | 36–44    | 60–80%     | 50–64%    | 5%     |
| Hydrangea | 180–188  | 60–80%     | 50–64%    | 5%     |
| Violet    | 288–296  | 60–80%     | 50–64%    | 5%     |

The families differ in more than hue. Foliage is muted and darker, and the
florals are saturated and mid-light, so the florals read as accents against a
mostly green field.

### 2. Drift through the subdivisions

Each split hands its child a color shifted from the parent:

- **Hue:** ±10° (uniform)
- **Saturation:** ±8%, clamped to 10–90%
- **Lightness:** 4–10% in a random direction, never less than 4% so
  neighboring blocks stay distinct, and bounced back if it would leave 12–80%

The shifts compound, so each flourish is a random walk away from its base
color. A size-4 tile goes up to 8 levels deep. The typical hue drift there is
around ±16°, and the worst case is ±80°. Most tiles stay inside their family,
but deep ones can wander: foliage into yellow-green or teal, marigold toward
poppy.

### 3. Wind (runtime only)

The WebGL layer pushes each block further with slow noise, up to ±12° hue,
±8% saturation, and ±10% lightness (`WIND.shift`), then adds film grain. This
only animates on top of the base colors. It doesn't change the palette.

## How the hues relate

Foliage is centered on **112°**. Three florals form a **rectangular
tetrad** on it with a 72° short side:

| Hue       | Center | Offset from foliage | Role                         |
| --------- | ------ | ------------------- | ---------------------------- |
| Foliage   | 112°   | 0°                  | anchor                       |
| Hydrangea | 184°   | +72°                | short side                   |
| Violet    | 292°   | +180°               | complement                   |
| Poppy     | 4°     | +252° (−108°)       | complement + 72°             |
| Marigold  | 40°    | −72°                | in between, poppy → foliage  |

Marigold isn't part of the tetrad. It sits 36° from poppy and 72° from
foliage, so it bridges the warm side.

(The earlier hand-picked set was foliage ~122°, poppy ~6°, marigold ~41°,
violet ~272°, and peony ~335°. That set wasn't built from a harmony rule.)

## Caveats for deriving site colors

- **HSL isn't perceptually even.** At the same HSL lightness, marigold looks
  much lighter than violet. For text and UI tokens that need dependable
  contrast, convert the family hues to OKLCH and set lightness and chroma
  there.
- The tiles are a field of drifting values, so "the tile color" means a hue
  band, not a single value. Site tokens should use each family's center hue.

## Default theme: paper

Links and their highlights use `primary`, which is the hydrangea hue. The
tints (`--primary-0` through `--primary-3`, used for underlines, hover
backgrounds, and table rules) mix it toward the background, so they follow
automatically.

Paper is now the default (`:root` in `src/style.css`). The old modes stay
available as classes for reference, including `.light` (the old white
default) and `.paper` (the old paper values).

| Token        | Value     | HSL          | Contrast on bg |
| ------------ | --------- | ------------ | -------------- |
| `background` | `#fcf6e8` | 42° 77% 95%  | —              |
| `text`       | `#120d03` | 40° 71% 4%   | 17.97:1        |
| `primary`    | `#146b71` | 184° 70% 26% | 5.78:1 (hydrangea) |
| `code`       | `#7d238b` | 292° 60% 34% | 7.84:1 (violet); 7.08:1 on its `--code-0` tint |
| `grid`       | `#b88114` | 40° 80% 40%  | dots mixed at 15% (1.17:1) and 40% on module lines (1.52:1) (marigold) |
| `greeble`    | `#ccc09d` | —            | (old paper value, to redo) |

## Green

Built on the foliage hue (112°). It sets only `text` and `background`; the
accents (`primary`, `code`, `grid`) come from paper.

| Token        | Value     | HSL          | Contrast on bg |
| ------------ | --------- | ------------ | -------------- |
| `background` | `#ebf6ea` | 112° 40% 94% | —              |
| `text`       | `#176b0b` | 112° 82% 23% | 6.01:1 (old foliage text at 112°) |
| `primary`    | `#146b71` | (from paper) | 5.61:1         |
| `code`       | `#7d238b` | (from paper) | 7.61:1; 6.87:1 on its tint |
| `grid`       | `#b88114` | (from paper) | dots 1.17:1 / 1.51:1 |

The color mode button cycles only default (paper) and green. The old
modes stay in `src/style.css` for reference.

## Open questions

- Should the other modes each be built around one family (a foliage mode, a
  violet or hydrangea mode, and a dark mode)?
