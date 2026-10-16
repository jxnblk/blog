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

// dot grid: the "g" key or the G button
const gridButtons = document.querySelectorAll('.grid-button');
function setGrid (on) {
  document.documentElement.classList.toggle('show-grid', on);
  gridButtons.forEach(b => b.setAttribute('aria-pressed', String(on)));
  if (on) localStorage.setItem('grid', '1');
  else localStorage.removeItem('grid');
}
const toggleGrid = () => setGrid(!document.documentElement.classList.contains('show-grid'));

setGrid(!!localStorage.getItem('grid'));
gridButtons.forEach(b => b.addEventListener('click', toggleGrid));
document.addEventListener('keydown', e => {
  if (e.key !== 'g' || e.target !== document.body) return;
  toggleGrid();
});
