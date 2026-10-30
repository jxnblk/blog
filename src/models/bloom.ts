// Three's UnrealBloomPass, with Unity URP's bloom prefilter in place of
// its luminance high pass. Unity measures a pixel by its brightest
// channel, so a white, red, or blue light at the same value glow the
// same, and passes on only the part over the threshold, with a soft knee
// below it. Three's pass measures luminance (so pure blue barely counts)
// and passes the whole pixel once it's over.
import { Vector2 } from "three";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

// URP's Bloom.shader prefilter, written for three's high pass uniforms
const prefilter = /* glsl */`
uniform sampler2D tDiffuse;
uniform float luminosityThreshold;
uniform float knee;
varying vec2 vUv;

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  float brightness = max(texel.r, max(texel.g, texel.b));
  float soft = clamp(brightness - luminosityThreshold + knee, 0.0, 2.0 * knee);
  soft = soft * soft / (4.0 * knee + 1e-4);
  float multiplier = max(brightness - luminosityThreshold, soft) / max(brightness, 1e-4);
  gl_FragColor = vec4(texel.rgb * multiplier, texel.a);
}`;

/** knee: how far below the threshold the glow fades in. Unity's default
 * is half the threshold; smaller here, so the paper-colored materials
 * (just under 1) don't haze */
export function unityBloom (strength: number, radius: number, threshold: number, knee = 0.1) {
  const bloom = new UnrealBloomPass(new Vector2(1, 1), strength, radius, threshold);
  const material = bloom.materialHighPassFilter;
  material.uniforms.knee = { value: knee };
  material.fragmentShader = prefilter;
  material.needsUpdate = true;

  // the composite gives the glow an alpha (its brightest channel), so on
  // a transparent canvas it would partly cover the page. Leaving alpha to
  // the model lets the glow only add light, as on an opaque background
  const composite = bloom.compositeMaterial;
  composite.fragmentShader = composite.fragmentShader
    .replace("vec4( bloom, bloomAlpha )", "vec4( bloom, 0.0 )");
  composite.needsUpdate = true;
  return bloom;
}

