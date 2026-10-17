// Wind: drift each flourish block's color through slow noise, like
// leaves in the wind, drawn on the GPU. One fixed canvas covers the
// viewport and draws every shown flourish block as an instanced quad;
// the vertex shader samples noise at the block's center, so each block
// stays one flat color. The SVGs stay underneath as the fallback,
// hidden once the canvas has drawn.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const WIND = {
    scale: 320,   // px per noise cell, for gusts
    speed: 0.1,   // average noise cells per second, the gusts drift sideways
    gusts: 0.1,   // how fast the wind strength changes, cycles per second
    calm: 0.3,    // speed and strength at the calmest, 1 is average
    gusty: 1.7,   // speed and strength at the gustiest
    evolve: 0.08, // how fast the gust shapes change
    flutter: 0.6, // faster, finer noise for single blocks
    shift: [12, 8, 10], // max hue, saturation, lightness shift
  };

  // glints: single blocks flash bright now and then, like sun catching
  // a wet tile; they gather in slow drifting patches of sunlight
  const GLINT = {
    rate: [0.15, 0.4], // flashes per second, slowest and fastest block
    sharpness: 40,     // higher is a shorter, rarer flash
    brighten: 15,      // lightness added at the peak, percent
    wash: 6,           // saturation removed at the peak, percent
    shimmer: [6, 4, 3], // max hue, saturation, lightness drift between peaks
    sun: 400,          // px per sunlit patch
    drift: 0.05,       // how fast the sunlit patches change
  };

  // film grain over the blocks; amount 0 turns it off
  const GRAIN = {
    amount: 0.03, // max brightness change, 0 to 1
    size: 1,      // grain size in css px
    fps: 0,       // new grain per second; 0 holds it still
  };

  const VERT = `#version 300 es
in vec2 corner;  // 0 to 1 quad corner
in vec4 rect;    // x, y, w, h in page px
in vec3 hsl;     // base color: degrees, percent, percent
uniform vec2 scroll;
uniform vec2 size;   // canvas size in device px
uniform float dpr;
uniform float time;
uniform float offset;    // how far the gusts have drifted, in noise cells
uniform float strength;  // wind strength right now, calm to gusty
uniform vec3 seed;
uniform vec3 shift;
uniform vec3 wind;   // scale, evolve, flutter
uniform vec4 glint;  // slowest rate, fastest rate, sharpness, sun scale
uniform vec3 light;  // brighten, wash, sun drift
uniform vec3 shimmer;
flat out vec3 color;

float hash (vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z) * 2.0 - 1.0;
}

// 3D value noise, roughly -1 to 1
float noise (vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1, 0, 0)), u.x),
        mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), u.x), u.y),
    mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), u.x),
        mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), u.x), u.y),
    u.z);
}

vec3 hsl2rgb (vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

void main () {
  vec2 center = rect.xy + rect.zw * 0.5;
  float gust = noise(vec3(center / wind.x - vec2(offset, 0.0), time * wind.y) + seed);
  // flutter is strongest where the gust is, and when the wind is strong
  float flutter = noise(vec3(center / 60.0, time * wind.z) + seed.zxy) * (0.4 + 0.6 * abs(gust)) * strength;
  // calm spells settle toward the base colors
  float n = (0.7 * gust + 0.3 * flutter) * mix(0.6, 1.0, clamp(strength, 0.0, 1.0));
  vec3 c = hsl + n * shift;

  // each block flashes on its own clock, brighter in the sunlit patches
  float phase = hash(vec3(center, 1.0) + seed);
  float rate = mix(glint.x, glint.y, hash(vec3(center, 2.0) + seed) * 0.5 + 0.5);
  float pulse = pow(max(0.0, sin((time * rate + phase) * 6.2832)), glint.z);
  float sun = smoothstep(-0.2, 0.6, noise(vec3(center / glint.w, time * light.z) + seed.zyx));
  float g = pulse * sun;
  c.z += g * light.x;
  c.y -= g * light.y;
  // between flashes, each block drifts gently on its own, more in the sun
  vec3 drift = vec3(
    sin((time * rate * 0.31 + hash(vec3(center, 3.0) + seed)) * 6.2832),
    sin((time * rate * 0.23 + hash(vec3(center, 4.0) + seed)) * 6.2832),
    sin((time * rate * 0.37 + hash(vec3(center, 5.0) + seed)) * 6.2832));
  c += drift * shimmer * (0.5 + 0.5 * sun);
  color = hsl2rgb(vec3(c.x / 360.0, clamp(c.yz / 100.0, 0.0, 1.0)));

  // snap edges to device pixels, so neighboring blocks share edges exactly
  vec2 px = floor((rect.xy + corner * rect.zw - scroll) * dpr + 0.5);
  vec2 clip = px / size * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`;

  const FRAG = `#version 300 es
precision highp float;
flat in vec3 color;
uniform vec2 scroll;
uniform float dpr;
uniform vec3 grain; // amount, size, frame
out vec4 outColor;

float hash (vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}

void main () {
  // grain cells anchored to the page, so held grain scrolls with it
  vec2 cell = floor((gl_FragCoord.xy + vec2(scroll.x, -scroll.y) * dpr) / (grain.y * dpr));
  // two samples averaged: softer, more film-like than flat white noise
  float g = hash(vec3(cell, grain.z)) + hash(vec3(cell + 71.0, grain.z + 13.0)) - 1.0;
  // monochrome, and lighter in the shadows and highlights, like film
  float l = dot(color, vec3(0.299, 0.587, 0.114));
  float weight = 1.0 - abs(l * 2.0 - 1.0) * 0.5;
  outColor = vec4(clamp(color + g * grain.x * weight, 0.0, 1.0), 1.0);
}`;

  const svgs = [...document.querySelectorAll('.tile svg, flourish-tile svg')];
  if (!svgs.length) return;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  });
  const gl = canvas.getContext('webgl2', { antialias: false });
  if (!gl) return;

  function compile (type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }
  const program = gl.createProgram();
  try {
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (err) {
    console.error('wind-gl', err);
    return;
  }
  gl.useProgram(program);
  const uniform = name => gl.getUniformLocation(program, name);
  const u = Object.fromEntries(
    ['scroll', 'size', 'dpr', 'time', 'offset', 'strength', 'seed', 'shift', 'wind', 'glint', 'light', 'shimmer', 'grain'].map(name => [name, uniform(name)]),
  );
  gl.uniform3f(u.seed, Math.random() * 100, Math.random() * 100, Math.random() * 100);
  gl.uniform3f(u.shift, ...WIND.shift);
  gl.uniform3f(u.wind, WIND.scale, WIND.evolve, WIND.flutter);
  gl.uniform4f(u.glint, ...GLINT.rate, GLINT.sharpness, GLINT.sun);
  gl.uniform3f(u.light, GLINT.brighten, GLINT.wash, GLINT.drift);
  gl.uniform3f(u.shimmer, ...GLINT.shimmer);

  // 1D value noise for the wind strength, 0 to 1
  const knots = Array.from({ length: 256 }, () => Math.random());
  function noise1 (x) {
    const i = Math.floor(x);
    const f = x - i;
    const t = f * f * (3 - 2 * f);
    return knots[i & 255] + (knots[(i + 1) & 255] - knots[i & 255]) * t;
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const attrib = name => gl.getAttribLocation(program, name);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attrib('corner'));
  gl.vertexAttribPointer(attrib('corner'), 2, gl.FLOAT, false, 0, 0);

  // per block: x, y, w, h, hue, saturation, lightness
  const instances = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instances);
  const STRIDE = 7 * 4;
  gl.enableVertexAttribArray(attrib('rect'));
  gl.vertexAttribPointer(attrib('rect'), 4, gl.FLOAT, false, STRIDE, 0);
  gl.vertexAttribDivisor(attrib('rect'), 1);
  gl.enableVertexAttribArray(attrib('hsl'));
  gl.vertexAttribPointer(attrib('hsl'), 3, gl.FLOAT, false, STRIDE, 4 * 4);
  gl.vertexAttribDivisor(attrib('hsl'), 1);

  // parse each tile's blocks once, in viewBox units
  const tiles = svgs.map(svg => ({
    svg,
    size: svg.viewBox.baseVal.width,
    blocks: [...svg.querySelectorAll('rect[data-hsl]')].map(el => [
      el.x.baseVal.value,
      el.y.baseVal.value,
      el.width.baseVal.value,
      el.height.baseVal.value,
      ...el.dataset.hsl.split(' ').map(Number),
    ]),
  }));

  // block rects in page px, for tiles the layout shows; called again
  // after anything that can move them
  let count = 0;
  function measure () {
    const data = [];
    for (const { svg, size, blocks } of tiles) {
      if (!svg.getClientRects().length) continue; // hidden tile or margin
      const box = svg.getBoundingClientRect();
      const k = box.width / size;
      const ox = box.left + window.scrollX;
      const oy = box.top + window.scrollY;
      for (const [x, y, w, h, ...hsl] of blocks) data.push(ox + x * k, oy + y * k, w * k, h * k, ...hsl);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, instances);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
    count = data.length / 7;
  }

  let raf;
  let shown = false;
  let last = 0;
  let offset = 0;
  function frame (now) {
    raf = requestAnimationFrame(frame);
    // the drift builds up frame by frame, so changing speed never jumps;
    // clamped so a backgrounded tab doesn't lurch on return
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    const strength = WIND.calm + (WIND.gusty - WIND.calm) * noise1(now / 1000 * WIND.gusts);
    offset += dt * WIND.speed * strength;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(u.size, w, h);
    gl.uniform1f(u.dpr, w / canvas.clientWidth);
    gl.uniform2f(u.scroll, window.scrollX, window.scrollY);
    gl.uniform1f(u.time, now / 1000);
    gl.uniform1f(u.offset, offset);
    gl.uniform1f(u.strength, strength);
    const grainFrame = GRAIN.fps ? Math.floor(now / 1000 * GRAIN.fps) % 1000 : 0;
    gl.uniform3f(u.grain, GRAIN.amount, GRAIN.size, grainFrame);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
    if (!shown) {
      shown = true;
      svgs.forEach(svg => svg.style.visibility = 'hidden');
    }
  }

  // fall back to the SVGs if the GPU drops the context
  canvas.addEventListener('webglcontextlost', () => {
    cancelAnimationFrame(raf);
    canvas.remove();
    svgs.forEach(svg => svg.style.visibility = '');
  });

  document.body.appendChild(canvas);
  measure();
  raf = requestAnimationFrame(frame);

  // the rAF lands after client.js snaps and hides tiles
  const remeasure = () => requestAnimationFrame(measure);
  window.addEventListener('load', remeasure);
  window.addEventListener('resize', remeasure);
  document.fonts.ready.then(remeasure);
  new ResizeObserver(remeasure).observe(document.body);
})();
