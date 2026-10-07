// vanilla js client script for jxnblk.com
const API = "https://jxnblk-jxnblkio.web.val.run/";

let color = localStorage.getItem("color") || "light";
document.body.className = color;

const colors = [
  "light",
  "foliage",
  "paper",
  "amber",
  "tomato",
  "brown reverse",
  "dark reverse",
  "black reverse",
];

let button = document.getElementById("color-button");
let grid = document.getElementById("grid-button");
let dotgrid = document.getElementById("dotgrid");
const cycleColor = () => {
  let index = colors.indexOf(color);
  if (index < 0) index = 0;
  index = (index + 1) % colors.length;
  color = colors[index];
  localStorage.setItem("color", color);
  document.body.className = color;
};

const toggleGrid = () => {
  dotgrid.classList.toggle("dotgrid");
};

button.addEventListener("click", cycleColor);
grid.addEventListener("click", toggleGrid);
