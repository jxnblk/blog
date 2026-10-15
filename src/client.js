// backup color modes script
const modes = [
  'light',
  'foliage',
  'paper',
  'amber',
  'tomato',
];

let index = 0;

const cn = localStorage.getItem('color');
document.body.className = cn;

if (cn) index = modes.indexOf(cn);

function cycle () {
  index = (index + 1) % modes.length;
  console.log("cycle", index);
  const next = modes[index];
  document.body.className = next;
  localStorage.setItem('color', next);
};

const el = document.querySelector('#color-button');
if (el != null) el.addEventListener('click', cycle);

// debug grid overlay
if (localStorage.getItem('grid')) document.documentElement.classList.add('show-grid');
document.addEventListener('keydown', e => {
  if (e.key !== 'g' || e.target !== document.body) return;
  const on = document.documentElement.classList.toggle('show-grid');
  if (on) localStorage.setItem('grid', '1');
  else localStorage.removeItem('grid');
});

// Snap post blocks to whole modules, so every row ends on a module
// line. Tiles are placed against estimated heights at build time, so
// then hide any tile that doesn't fit inside its margin or band, or
// that shares an edge with a block or another tile
function snap () {
  const main = document.querySelector('.post-body');
  if (!main) return;
  const module = parseFloat(getComputedStyle(main.parentElement).gridTemplateColumns);
  if (!module) return;
  const blocks = [...main.querySelectorAll(':scope > .block')];
  const tiles = [...main.querySelectorAll('.tile')];
  // reset, read, then write, to avoid layout thrashing
  blocks.forEach(el => el.style.minHeight = '');
  tiles.forEach(el => el.hidden = false);
  const heights = blocks.map(el => el.offsetHeight);
  blocks.forEach((el, i) => {
    el.style.minHeight = Math.ceil(heights[i] / module - 0.01) * module + 'px';
  });
  const rects = blocks.map(el => el.getBoundingClientRect());
  const shown = [];
  const hide = tiles.map(el => {
    // tiles in hidden margins have no box
    if (!el.getClientRects().length) return false;
    const rect = el.getBoundingClientRect();
    const parent = el.parentElement.getBoundingClientRect();
    const ok = rect.bottom <= parent.bottom + 1
      && rect.right <= parent.right + 1
      && !rects.some(b => touches(rect, b))
      && !shown.some(t => touches(rect, t));
    if (ok) shown.push(rect);
    return !ok;
  });
  tiles.forEach((el, i) => el.hidden = hide[i]);
}

// rects overlap, or share an edge; touching corners is fine
function touches (a, b) {
  const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return (x > 1 && y > -1) || (y > 1 && x > -1);
}

let frame;
const schedule = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(snap);
};
snap();
document.fonts.ready.then(schedule);
window.addEventListener('load', schedule);
window.addEventListener('resize', schedule);
