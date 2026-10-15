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
// line, then hide margin tiles past the content. Margin heights are
// only estimated at build time
function snap () {
  const main = document.querySelector('.post-body');
  if (!main) return;
  const module = parseFloat(getComputedStyle(main.parentElement).gridTemplateColumns);
  if (!module) return;
  const blocks = [...main.querySelectorAll(':scope > .block')];
  const tiles = [...main.querySelectorAll('.margin > .tile')];
  // reset, read, then write, to avoid layout thrashing
  blocks.forEach(el => el.style.minHeight = '');
  tiles.forEach(el => el.hidden = false);
  const heights = blocks.map(el => el.offsetHeight);
  blocks.forEach((el, i) => {
    el.style.minHeight = Math.ceil(heights[i] / module - 0.01) * module + 'px';
  });
  const fits = tiles.map(el => el.offsetTop + el.offsetHeight <= el.parentElement.clientHeight + 1);
  tiles.forEach((el, i) => el.hidden = !fits[i]);
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
