// tuna-based generative css lib
import iAWriterMono from "./ia-writer.css.tsx";

export const colors = [
  "light",
  "foliage",
  "paper",
  "amber",
  "tomato",
  "brown reverse",
  "dark reverse",
  "black reverse",
];

// gaps 7*32 = 224
// padding 64
// columns 8*96 = 768
// columns @ 80 = 640
const vars = `
:root {
  --text: #000;
  --background: #fff;
  --primary: #4c4cb1;
  --greeble: #bbb;
}
/* color modes */
.light  { --text: #000; --background: #fff; --greeble: #bbb; }
/** TODO */
  .bright  { --text: #000; --background: #fff; --greeble: #fda900; }
.foliage { --text: #3a6c0b; --background: #f0f4ec; --greeble: #a2c185; --primary: #5f8e33; }
.paper  { --text: #4d4019; --background: #faefd0; --greeble: #ccc09d; --primary: #8e5200; }
.amber  { --text: #422c00; --background: #e5b656; --greeble: #c3a058; --primary: #541c00; }
.tomato { --text: #32221b; --background: #ee976a; --greeble: #f05200; --primary: #003c5b; }
.brown  { --text: #dab9a8; --background: #422d23; --greeble: #634f44; --primary: #0cf }
.dark   { --text: #eee; --background: #222; --greeble: #666; --primary: #0cf }
.black  { --text: #fff; --background: #000; --greeble: #333; --primary: #0cf }
body {
  --primary-3: color-mix(in srgb, var(--primary) 50%, var(--background));
  --primary-2: color-mix(in srgb, var(--primary) 25%, var(--background));
  --primary-1: color-mix(in srgb, var(--primary) 12%, var(--background));
  --primary-0: color-mix(in srgb, var(--primary) 6%, var(--background));
  --primary-dark: color-mix(in srgb, var(--primary) 50%, var(--text));

  --highlight: #b1e5e5;
  --highlight-5: color-mix(in srgb, var(--highlight) 50%, var(--background));
  --highlight-2: color-mix(in srgb, var(--highlight) 25%, var(--background));
  --highlight-1: color-mix(in srgb, var(--highlight) 12%, var(--background));
  --highlight-0: color-mix(in srgb, var(--highlight) 6%, var(--background));
  --highlight-dark: color-mix(in srgb, var(--highlight) 50%, var(--text));

  --greeble: var(--highlight);
}
`;

const typography = `/** css */
* { box-sizing: border-box }
body {
  margin: 0;
  font-family: 'iA Writer Mono', Menlo, ui-monospace, monospace;
  font-size: 16px;
  line-height: 32px;
  color: var(--text);
  background-color: var(--background);
  transition: background-color 0.2s ease-in-out;
}

img {
  max-width: 100%;
  height: auto;
}

h1, h2, h3, h4, h5 {
  font-size: 16px; margin: 0;
}
h6, .h6 { font-size: 12px; margin: 0; }
h3, h4, h5, .h3, .h4, .h5 { margin-top: 32px; margin-bottom: 32px; }

p, ul, ol, blockquote {
  margin-top: 0;
  margin-bottom: 32px;
}

.bold { font-weight: bold }
.normal { font-weight: normal; }
.caps {
  text-transform: uppercase;
  letter-spacing: 0.125em;
}

a {
  color: var(--primary);
  text-decoration-color: var(--primary-2);
  transition-property: color, background-color, opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
}
a:hover {
  color: var(--primary);
  background-color: var(--primary-0);
  text-decoration-style: solid;
  text-decoration-color: var(--primary);
}

button {
  appearance: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  border: none;
  border-radius: none;
  background: none;
  color: inherit;
  cursor: pointer;
  outline: none;
}

code {
  font-size: 14px;
  color: var(--primary);
  background-color: var(--primary-0);
  padding: 2px 4px;
  border-radius: 3px;
}

/** todo */
pre {
  color: var(--primary);
  background-color: var(--primary-0);
  padding: 16px;
  font-size: 12px;
  border-radius: 4px;
  overflow: auto;
}
pre code {
  color: inherit;
  background-color: inherit;
  padding: 0;
  border-radius: 0;
}
ul {
  padding: 0;
}
ol {}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 32px;
}
tr {
  margin-top: -1px;
}
th {
  text-align: left;
  padding: 8px 0;
  border-bottom-style: solid;
}
td {
  text-align: left;
  padding: 8px 0;
  border-bottom: 1px solid;
  border-color: var(--primary-1);
}

/** home hero */
.display {
  /* font-family: "Archivo Black", sans-serif; */
  font-family: system-ui, sans-serif;
  font-weight: 900;
}
.hero-container {
  container-type: inline-size;
}
.h0 {
  /* font-size: clamp(16px, 10vi, 128px); */
  font-size: clamp(16px, 14cqw, 128px);
  max-width: 100%;
}
`;

const site = `
/* 8 80px cols with 32px gaps */
.container {
  max-width: 928px;
  margin-left: auto;
  margin-right: auto;
  padding: 32px;
}

.space-children {
  display: flex;
  flex-direction: column;
  gap: 64px;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 16px;
  padding-top: 16px;
  padding-bottom: 16px;
}
.navLink {
  text-decoration: none;
  color: inherit;
}
.button {
  display: inline-flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
}
.button:hover {
  color: var(--primary);
  background-color: var(--primary-0);
}
.posts {
  list-style: none;
  padding: 0;
}
.posts li {
  margin-top: 96px;
  margin-bottom: 96px;
}
.post-title {
  color: inherit;
  font-weight: bold;
  text-decoration: none;
}
.post-title:hover {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: var(--primary);
  background-color: var(--primary-1);
}

.bold-links a {
  font-weight: bold;
}
  .byline {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }
.right {
  text-align: right;
}

.promo {
  position: relative;
  container-type: inline-size;
}
.promo-inner {
  --base: 56.25cqw;
  height: var(--base);
  height: calc(var(--base) + 32px - mod(var(--base), 32px));
}
.promo-short {
  --base: 40cqw;
}
.promo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.promo a {
  display: block;
  padding: 4px 16px;
  font-size: 12px;
  color: var(--text);
  background-color: var(--background);
  text-decoration: none;
}
.anchor {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 8px;
}
.promo a:hover {
  background-color: var(--primary);
}
`;

const grid = `
.grid {
  display: grid;
  gridTemplateColumns: repeated(8, 96px);
  gridGap: 32px;
  gridAutoFlow: row dense;
  gridAutoRows: minmax(32px max-content);
}
/** todo grid system */
@media screen and (min-width: 1056px) {
}
`;

const debug = `
.guides {
  background-size: 32px 32px;
  background-image:
    linear-gradient(to right, var(--highlight-2) 1px, transparent 1px),
    linear-gradient(to bottom, var(--highlight-2) 1px, transparent 1px);
}
.baseline {
  background-size: 32px 32px;
  background-position: 0 22px;
  /*
    background-image: linear-gradient(to bottom, rgba(255, 0, 127, 0.1) 1px, transparent 1px);
  */
  background-image: linear-gradient(to bottom, var(--primary-0) 1px, transparent 1px);
}
.dotgrid {
  background-size: 32px 32px;
  background-position: calc(50% - 15px) -15px;
  background-image: radial-gradient(var(--primary-2) 1px, transparent 0);
}
`;

const angles = `
/* angled boxes */
.angr,
.angl {
  position: relative;
  height: 32px;
  background-color: var(--greeble);
  padding-left: 16px;
  padding-right: 16px;
}
.angr::after,
.angl::after {
  position: absolute;
  top: 0;
  bottom: 0;
  content: '';
  display: block;
  height: 32px;
  width: 32px;
}

.angr::after {
  right: -32px;
  background-image: linear-gradient(45deg, var(--greeble) 50%, transparent 50%);
}
.angl::after {
  left: -32px;
  background-image: linear-gradient(225deg, var(--greeble) 50%, transparent 50%);
}
.angr-up::after {
  /* angle up */
  background-image: linear-gradient(135deg, var(--greeble) 50%, transparent 50%);
}
.angl-up::after {
  background-image: linear-gradient(-45deg, var(--greeble) 50%, transparent 50%);
}
`;

const util = `
.ma { margin: auto }
.m0 { margin: 0 }
.mt { margin-top: 32px }
.mb { margin-bottom: 32px }

.mt2 { margin-top: 64px }
.mb2 { margin-bottom: 64px }

.pad { padding: 16px }
.pad2 { padding: 32px }

.flex { display: flex; align-items: center; column-gap: 32px }
.wrap { flex-wrap: wrap }
.gap0 { gap: 0 }
.gap2 { gap: 64px }
.grow { flex-grow: 1 }
.noshrink { flex-shrink: 0 }
.min { min-width: 0 }
.fullwidth { width: 100% }

@media screen and (min-width: 40em) {
  .md-hide {
    display: none;
  }
}

.greeble { color: var(--greeble) }
.invert {
  color: var(--background);
  background-color: var(--text);
}
`;

export const css = [
  iAWriterMono,
  vars,
  typography,
  site,
  grid,
  debug,
  angles,
  util,
].join("").replace(/\n/g, " ");
