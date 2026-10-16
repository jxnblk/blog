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

| Family   | Hue (°)   | Saturation | Lightness | Chance |
| -------- | --------- | ---------- | --------- | ------ |
| Foliage  | 85–160    | 25–50%     | 22–50%    | 80%    |
| Poppy    | 0–12      | 60–80%     | 50–64%    | 5%     |
| Marigold | 36–46     | 60–80%     | 50–64%    | 5%     |
| Violet   | 265–280   | 60–80%     | 50–64%    | 5%     |
| Peony    | 325–345   | 60–80%     | 50–64%    | 5%     |

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

## Do the hues relate to each other?

They weren't built from a harmony rule. The code names them after plants and
picks bands by eye, and there's no shared anchor hue or offset math. It's
**not tetradic**. A square tetrad on the foliage center (~122°) would be
122 / 212 / 302 / 32, and there's nothing near 212 (blue).

Measured against the foliage center of ~122°, though, the hand-picked hues
land close to classic relationships:

| Hue          | Center | Offset from foliage | Closest relationship                |
| ------------ | ------ | ------------------- | ----------------------------------- |
| Foliage      | ~122°  | 0°                  | anchor                              |
| Violet       | ~272°  | +150°               | split complement (122 + 150 = 272)  |
| Peony        | ~335°  | −147°               | split complement (122 + 210 = 332)  |
| Poppy        | ~6°    | −116°               | triadic (122 + 240 = 2)             |
| Marigold     | ~41°   | −81°                | none; a warm neighbor of poppy      |

The closest description is **green anchored, with split-complementary
accents** (violet and peony sit almost exactly at ±150°) and a warm pair
(poppy and marigold, 35° apart) on the other side of the wheel. Blue,
roughly 180–260°, is left out entirely, which keeps the palette earthy.

One more coincidence that's useful here: the current `paper` background
(`#faefd0`) is hue 44° at 81% saturation, inside the **marigold** band. Paper
is already a very light, desaturated marigold.

## Caveats for deriving site colors

- **HSL isn't perceptually even.** At the same HSL lightness, marigold looks
  much lighter than violet. For text and UI tokens that need dependable
  contrast, convert the family hues to OKLCH and set lightness and chroma
  there.
- The tiles are a field of drifting values, so "the tile color" means a hue
  band, not a single value. Site tokens should use each family's center hue.

## Default theme: paper

Start from the current `paper` values and darken the text.

| Token        | Current   | HSL          | Contrast on bg |
| ------------ | --------- | ------------ | -------------- |
| `background` | `#faefd0` | 44° 81% 90%  | —              |
| `text`       | `#4d4019` | 45° 51% 20%  | 8.88:1         |
| `primary`    | `#8e5200` | 35° 100% 28% | 5.46:1         |

Candidates for darker text, same hue and saturation:

| Text      | HSL         | Contrast |
| --------- | ----------- | -------- |
| `#3d3214` | 45° 51% 16% | 11.0:1   |
| `#2e260f` | 45° 51% 12% | 13.1:1   |

## Open questions

- Should text keep the marigold hue (warm brown ink), or lean toward a dark
  foliage green so body text ties to the dominant tile family?
- Should `primary` (links) come from a floral family, such as poppy or
  violet, rather than the current amber-brown?
- Should the other modes each be built around one family (a foliage mode, a
  violet or peony mode, and a dark mode)?
