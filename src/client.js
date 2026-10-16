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
