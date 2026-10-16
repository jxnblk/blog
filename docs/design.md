# Design

The blog is a strict square-module grid with a mid-century poster and
magazine feel. Every post gets its own layout, flourishes and color, all
generated at build time from a seed, so a post always looks the same from
one build to the next.

The code is the source of truth for exact values. This doc covers the ideas
and the reasons behind them. For color, see [colors.md](colors.md).

## Principles

- **Everything sits on the grid.** Blocks, tiles and type line up with the
  module and the baseline, and nothing is placed by eye.
- **Readability isn't left to chance.** The prose column has a fixed width
  and body text uses fixed colors. Randomness only goes into the space
  around the reading.
- **Restraint.** The flourishes use a small vocabulary and a narrow palette,
  so they read as mid-century (Müller-Brockmann, Olle Eksell, Charley
  Harper) instead of noise.
- **Deterministic.** The same seed always produces the same design. Nothing
  is random at runtime except the animation.

## Grid

- Column counts are powers of two: 4, 8 and 16.
- Modules are square: a row is as tall as a column is wide.
- The module has a fixed size at each breakpoint, either 64px or 80px, and
  the container steps between those widths instead of stretching. Below
  576px the module is fluid at 4 columns.
- Line-height is 32px on a 16px baseline. Both divide 64 and 80 evenly, so
  text that ends on a baseline can end on a module line too.
- Layouts are authored at 16 columns. Below that, blocks stack full width
  and the margins hide.

| Width       | Columns | Module |
| ----------- | ------- | ------ |
| < 576       | 4       | fluid  |
| 576–703     | 8       | 64px   |
| 704–1087    | 8       | 80px   |
| 1088–1343   | 16      | 64px   |
| ≥ 1344      | 16      | 80px   |

## Determinism

- A post's seed is its slug, which frontmatter can override with `seed`.
  Using the slug instead of the content means editing a post doesn't
  change its design.
- `rng(seed)(stream)` gives each concern its own named stream (`layout`,
  `quote`, `flourish`, `narrow`, `noise` and so on). Tuning one system
  never reshuffles another, so when you add a new random decision, give it
  a new stream instead of drawing from an existing one.

## Layout

Layout works on the hast tree, before it's converted to React (see
`src/rehypeSections.ts`).

1. **Sections** start at each `h2` and `hr`. An `hr` turns into a band of
   flourishes that spans the full width.
2. **Blocks** are headings, prose runs, images, code, tables and
   blockquotes. Consecutive prose nodes merge into one block, and so do
   consecutive blockquotes.
3. **Placement** is one greedy pass, top to bottom, with one block per row.
   No constraint solver is involved. Each section moves its prose column
   to a new offset:
   - Prose is 8 columns wide, starting at column 1, 5 or 9.
   - Images are 1–2 columns wider than the prose, and line up with either
     of its edges or sit centered on it.
   - Code and tables are 12 columns wide, shifted to stay on the grid.
   - Pull quotes are bordered boxes, 4–8 modules wide, set in the heading
     face. When there's room they go in the free columns beside the prose.
     The width chosen is the one that leaves the least empty space below
     the text, and a box is never taller than it is wide.
4. **Heights** are measured at build time from the font metrics (see
   `src/measure.ts`) and rounded up to whole modules for each module size.
   A measurement that came within a pixel or two of wrapping differently
   adds a spare module, so text never overflows its row. There's no
   client-side measuring.
5. **Flourishes** fill the leftover space. Content is marked on an
   occupancy grid, and tiles are packed into the margins and bands around
   it.

## Flourishes

- **Packing** (see `src/pack.ts`): tiles are squares of 4, 2 or 1 modules,
  placed largest first. A tile never shares an edge with content or
  another tile, though corners may touch. A Perlin density field decides
  where tiles cluster, so the margins have both dense and empty stretches.
- **Tiles** (see `src/Flourish.tsx`): each tile is cut by binary space
  partitioning toward one corner. Each level splits the region in half,
  alternating direction, fills one half and recurses into the other, so
  detail gathers in that corner. Each fill is a small color shift from its
  parent. The result is SVG in module units, using only solid rectangles.
- **Bands:** below 16 columns, some section breaks become bands of tiles.
  Every post ends with a band at every column count.

## Color

Flourishes are mostly foliage greens, with an occasional floral accent.
Site colors come from the same hues, and body text is always fixed ink on
paper. See [colors.md](colors.md) for the hue families, how colors drift
and the theme tokens.

