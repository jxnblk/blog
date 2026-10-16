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
