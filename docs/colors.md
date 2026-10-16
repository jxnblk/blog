# Colors

The site has one small set of hues. The flourish tiles are generated from
them, and the theme tokens are built from the same hues, so the page and the
tiles read as one palette.

## Tile colors

Tile colors are generated in `src/Flourish.tsx`. A runtime layer in
`src/wind-gl.js` animates on top of them.

### Base color

Each flourish picks one base color in HSL from its seed. 80% of the time it's
a foliage green. Otherwise it's one of four floral hues, each equally likely
(5% each).

| Family    | Hue (°)  | Saturation | Lightness | Chance |
| --------- | -------- | ---------- | --------- | ------ |
| Foliage   | 74–150   | 25–50%     | 22–50%    | 80%    |
| Poppy     | 0–8      | 60–80%     | 50–64%    | 5%     |
| Marigold  | 36–44    | 60–80%     | 50–64%    | 5%     |
| Hydrangea | 180–188  | 60–80%     | 50–64%    | 5%     |
| Violet    | 288–296  | 60–80%     | 50–64%    | 5%     |

Hue isn't the only difference between the families. Foliage is muted and
darker, while the florals are saturated and mid-light, so the florals stand
out as accents against a mostly green field.

### Drift through the subdivisions

Each split gives its child a color shifted from the parent:

- **Hue:** shifts by up to ±10°.
- **Saturation:** shifts by up to ±8%, kept within 10–90%.
- **Lightness:** shifts 4–10% up or down. The shift is always at least 4%,
  so neighboring pieces stay distinct. If a shift would leave the 12–80%
  range, it goes the other way instead.

The shifts add up, so each flourish wanders away from its base color. A
size-4 tile can go up to 8 levels deep. At that depth the hue usually drifts
about ±16°, and at most ±80°. Most tiles stay within their family, but deep
ones can wander: foliage toward yellow-green or teal, marigold toward poppy.

### Wind

The WebGL layer adds slow noise on top of each piece's color (`WIND.shift`):
up to ±12° hue, ±8% saturation and ±10% lightness. It also adds film grain.
This only animates the colors and leaves the base palette unchanged.

## How the hues relate

Foliage is centered on **112°**. Three of the florals form a **rectangular
tetrad** with it, with a 72° short side:

| Hue       | Center | Offset from foliage | Role                         |
| --------- | ------ | ------------------- | ---------------------------- |
| Foliage   | 112°   | 0°                  | anchor                       |
| Hydrangea | 184°   | +72°                | short side                   |
| Violet    | 292°   | +180°               | complement                   |
| Poppy     | 4°     | +252° (−108°)       | complement + 72°             |
| Marigold  | 40°    | −72°                | between poppy and foliage    |

Marigold isn't part of the tetrad. It sits 36° from poppy and 72° from
foliage, which connects the warm side of the palette.

## Building site colors

- **Use each family's center hue.** The tiles cover a range of drifting
  values, so a family is a band of hues rather than one color.
- **Check contrast directly.** HSL lightness isn't perceptually even: at the
  same HSL lightness, marigold looks much lighter than violet. For text and
  UI colors that need reliable contrast, measure the contrast, or set
  lightness and chroma in OKLCH.
- **Body text is always fixed ink on paper.** The seed never decides
  whether a post is readable.

## Tokens

Each color mode sets a few tokens. Everything else is derived from them in
`src/style.css`.

| Token        | Use                                              |
| ------------ | ------------------------------------------------ |
| `background` | page background                                  |
| `text`       | body text                                        |
| `primary`    | links, hover states and pull quotes (hydrangea)  |
| `code`       | inline and block code (violet)                   |
| `grid`       | the dot grid (marigold, or poppy on red)         |

The tints `--primary-0` to `--primary-2` and `--code-0` mix their color
toward the background. They're used for underlines, hover backgrounds,
table rules and code backgrounds. Because they mix toward the background,
they work in every mode without extra rules, and on black they come out as
dark shades. The dot grid mixes `grid` at about 15%, and at about 40% on
module lines.

## Modes

Paper is the default and lives in `:root`. Each other mode is a class on
`body` that sets only the tokens that differ from paper. The color mode
button cycles through the modes in the order listed below (`src/client.js`).

Contrast is against the mode's background. For `primary` and `code`, the
second number is the contrast on that token's own tint.

| Mode   | Background | Text      | Text contrast | Primary contrast | Code contrast   | Grid      |
| ------ | ---------- | --------- | ------------- | ---------------- | --------------- | --------- |
| Paper  | `#fcf6e8`  | `#120d03` | 17.97:1       | 5.78:1           | 7.84 / 7.08:1   | `#b88114` |
| Green  | `#ebf6ea`  | `#176b0b` | 6.01:1        | 5.61:1           | 7.61 / 6.87:1   | paper     |
| Brown  | `#d7c2a2`  | `#402607` | 8.09:1        | 6.19 / 5.64:1    | 7.52 / 6.82:1   | `#73510d` |
| Yellow | `#eebf63`  | `#402607` | 8.19:1        | 6.27 / 5.72:1    | 7.61 / 6.90:1   | `#73510d` |
| Red    | `#f5c0bc`  | `#790e06` | 7.00:1        | 5.26 / 4.84:1    | 7.10 / 6.45:1   | `#c32d22` |
| White  | `#ffffff`  | `#000000` | 21:1          | 6.23:1           | 8.45:1          | paper     |
| Black  | `#000000`  | `#ffffff` | 21:1          | 10.45 / 9.83:1   | 8.80 / 8.31:1   | `#e6a219` |

- **Paper:** warm off-white with near-black ink. Its accents are hydrangea
  `#146b71` and violet `#7d238b`, and the other modes keep these unless
  they need a different value.
- **Green:** a light tint of the foliage hue (112°), with foliage text.
  It uses the paper accents.
- **Brown:** kraft paper. The background is mid-tone, so the paper accents
  would lose contrast on it (links drop to about 3.5:1). Instead it uses
  darker versions of the same hues: `#084549` and `#51165a`.
- **Yellow:** a little lighter than the marigold tiles. It uses the same
  text and accents as brown.
- **Red:** rose, on the poppy hue (4°), with saturated red ink. Its
  hydrangea links sit directly opposite poppy on the color wheel.
- **White:** pure white and black, with the paper accents.
- **Black:** the only dark mode, an inverted white. It uses lighter
  versions of the accent hues: `#47c8d1` and `#d78de2`. Dark backgrounds
  need more contrast for the dot grid to look the same, so its module
  dots are stronger: about 2.2:1, against about 1.65:1 in the light modes.
