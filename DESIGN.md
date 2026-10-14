# 2026 Rebuild: Design Plan

A strict, square-module grid with mid-century poster/magazine sensibilities, and deterministic generative layouts, flourishes, and color per post.

## Decisions

- **Fixed layouts**: stepped, fixed-width containers per breakpoint (no fluid module).
- **Prose**: sections may be chunked and placed differently per post, but every prose block has a fixed width for a good measure. Negative space around prose is where generative flourishes live.
- **Light mode only** for now. No dark mode.

## 1. Grid

- Column counts are powers of 2: **4 / 8 / 16** across breakpoints.
- **Square modules**: row height equals column width (`grid-auto-rows: var(--module)`).
- Fixed module size, e.g. 64px (16 × 64 = 1024) or 80px (16 × 80 = 1280). Integer modules keep type and baselines locked to square edges.
- Halving columns doubles the module, so a 4×4 block at 16 columns maps to 2×2 at 8 columns. Responsive layouts become a mechanical transform.

### Typography on the grid

- Line-heights and spacing are power-of-2 fractions of the module (e.g. module 64px → 16px line-height = 4 lines per module).
- Display type is sized to fill exactly 1, 2, or 4 modules tall.
- Font candidates: iA Writer Quattro + Mono, Fraunces, Ferro, Lexend. Metrics will influence the final module size.

### Prose blocks

- Fixed width per breakpoint (e.g. 8 of 16 columns), with a 60–75ch measure.
- Horizontal position can vary per section (e.g. start at column 1, 3, 5, 9).
- Block height is estimated at build time (characters ÷ chars-per-line × line-height), rounded up to whole modules for placement.
- If exact snapping matters later: measure on the client and pad to the next whole module.

## 2. Determinism

- Seeded PRNG (mulberry32 or sfc32), seeded from a hash of the post **slug**. Using the slug rather than the content means editing a post doesn't change its design.
- **Named sub-streams** per concern, so tuning one system doesn't reshuffle the others:
  - `rng('palette')`
  - `rng('layout')`
  - `rng('flourish:<n>')`
- Frontmatter overrides: `seed`, `palette`, to re-roll or pin a post's design.

## 3. Flourishes: Recursive Subdivision

Rendered as SVG with a viewBox in module units.

1. Start with an empty grid region that's 2ⁿ modules square.
2. At each node, choose: split into 4 quadrants, split into 2 halves (2:1 rectangles), or stop. Lower the chance of splitting with depth, and set a minimum size (e.g. ¼ module).
3. Fill each leaf from a small motif vocabulary:
   - solid fill
   - quarter circle in one corner
   - half circle on one edge
   - diagonal triangle
   - ring
   - empty
4. Orientation (corner or edge) is chosen by the RNG.

Restraint matters: a small vocabulary and few colors read as mid-century (Müller-Brockmann, Olle Eksell, Charley Harper) rather than noise.

Content-derived parameters (ideas):

- word count → number or density of flourish areas
- section count → number of section breaks
- tags → motif or palette preferences

## 4. Color

- **Phase 1:** a curated set of ~10–15 mid-century palettes (paper, ink, 2–3 accents). The seed picks one.
- **Phase 2 (optional):** generated palettes in OKLCH. Hue from the seed, a relationship (complement, triad, analogous), and constrained lightness and chroma.
- Body text is always fixed ink on paper, so readability never depends on the seed.
- Accents go only to flourishes, rules, headings, and syntax highlighting.

## 5. Content Splitting and Layout

Operate on the **hast tree before conversion to React**.

1. **Split into sections** at `h2` and `hr`.
2. **Classify blocks**: heading, prose run, image, code, blockquote, list.
3. **Choose a placement variant** per block via `rng('layout')`:
   | Block | Variants |
   | --- | --- |
   | Title | full-width hero (4 modules tall); 2×2 type block beside a flourish |
   | Prose | fixed-width column, horizontal offset varies by section |
   | Image | full bleed (16 columns); 8 columns offset left or right; square crop |
   | Code | wider than the prose column |
   | Blockquote | pull quote in a square in the negative space |
   | Section break | full-width band of flourishes |
4. **Mark leftover grid regions** as flourish slots and fill them using subdivision (§3).

Placement can be a greedy row-by-row pass. No constraint solver is needed.

## 6. Responsive

- 16 → 8 → 4 columns, transforming the same layout tree.
- At 4 columns, prose spans the full width and flourishes collapse into bands between sections.

## 7. Iteration Plan

1. **Grid prototype route** with a toggleable debug overlay (modules and baselines). Static, no randomness.
2. **Type scale on the grid.** Test with a long real post and the candidate fonts, then settle the module size.
3. **Seeded flourish component and gallery page** rendering ~64 seeds side by side for tuning.
4. **Palettes**, added to the gallery.
5. **Section splitting and layout variants**, plus an index page of thumbnails for every post to check variety.
6. **Responsive collapse** to 8 and 4 columns.
7. **Extras:** reuse the generator for per-post OG images and favicons, and syntax highlighting colors derived from the palette.

## Open Questions

- Module size: 64px or 80px? (Decide after the type tests in step 2.)
- How far should prose offsets vary? Should every section be able to move, or only some?
- Curated palettes only, or move on to generated OKLCH palettes?
