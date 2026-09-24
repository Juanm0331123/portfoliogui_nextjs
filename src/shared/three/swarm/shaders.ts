/**
 * The swarm's shaders.
 *
 * Every particle carries all seven formations as attributes. A single scalar,
 * the formation coordinate (0..7, derived from the scroll), picks the two
 * formations it sits between and how far along it is. The engine splits it
 * into `uStageA` / `uStageB` / `uFrac`; the vertex shader does the rest. So the
 * whole choreography costs no buffer uploads and no per-particle CPU work, and
 * the same coordinate always draws the same frame.
 *
 * Two rules for whoever touches this next:
 *
 * - A Points shader that never writes `gl_PointSize` compiles, links, and
 *   draws nothing. Size attenuation is done by hand below (`uPixelScale` is
 *   half the drawing buffer's height, as Three's own PointsMaterial uses).
 * - Nothing here may keep state between frames. Motion that is not driven by
 *   `uProgress` is a pure function of `uTime` (noise, spin, breathing), so
 *   coming back to a scroll position gives back the same formation.
 */

// Ashima Arts / Stefan Gustavson 3D simplex noise with analytic gradient (MIT).
const noise = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v, out vec3 gradient) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    vec4 m2 = m * m;
    vec4 m4 = m2 * m2;
    vec4 pdotx = vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3));

    vec4 temp = m2 * m * pdotx;
    gradient = -8.0 * (temp.x * x0 + temp.y * x1 + temp.z * x2 + temp.w * x3);
    gradient += m4.x * p0 + m4.y * p1 + m4.z * p2 + m4.w * p3;
    gradient *= 105.0;

    return 105.0 * dot(m4, pdotx);
  }

  // Divergence-free flow from two noise evaluations: the cross product of two
  // gradients has zero divergence, so particles swirl around each other
  // instead of clumping or thinning out — at two thirds of the cost of the
  // classic three-potential curl.
  vec3 curlNoise(vec3 p) {
    vec3 g1;
    vec3 g2;
    snoise(p, g1);
    snoise(p.yzx * 1.31 + vec3(31.416, -47.853, 12.793), g2);
    return cross(g1, g2) * 0.18;
  }
`

export const swarmVertexShader = /* glsl */ `
  #define PI 3.14159265359

  // The two formations the swarm is between, and how far along it is. The
  // CPU works these out and hands them over as plain uniforms: reading a
  // uniform array with a computed index is not reliable across GPU drivers —
  // on Chrome/ANGLE it returned the wrong matrix and made formations snap
  // into place at every boundary.
  uniform float uStageA;
  uniform float uStageB;
  uniform float uFrac;
  uniform float uReducedFade;
  uniform float uIntro;
  uniform float uTime;
  uniform float uStagger;
  uniform float uFlight;
  uniform float uCurlAmp;
  uniform float uCurlFreq;
  uniform float uCurlSpeed;
  uniform float uSingularity;
  uniform float uDustGain;

  uniform mat3 uRotA;
  uniform mat3 uRotB;
  uniform vec3 uOffsetA;
  uniform vec3 uOffsetB;
  uniform float uScaleA;
  uniform float uScaleB;
  uniform float uGainA;
  uniform float uGainB;
  uniform float uSizeA;
  uniform float uSizeB;
  uniform float uWarmA;
  uniform float uWarmB;
  uniform float uLobeA;
  uniform float uLobeB;

  uniform vec3 uCool;
  uniform vec3 uCoolDeep;
  uniform vec3 uWarmTone;
  uniform vec3 uWarmDeep;
  uniform vec3 uViolet;

  uniform float uPointSize;
  uniform float uPixelScale;
  uniform float uDensity;
  uniform float uOpacity;

  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uMouseRadius;
  uniform float uAspect;
  uniform vec4 uFace;
  uniform float uFaceStrength;
  uniform float uFocus;
  uniform float uDof;

  attribute vec4 aHero;
  attribute vec4 aAbout;
  attribute vec4 aSkills;
  attribute vec4 aProjects;
  attribute vec4 aExperience;
  attribute vec4 aContact;
  attribute vec4 aFooter;
  attribute vec4 aSeed;
  attribute vec4 aSeed2;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vBlur;

  ${noise}

  vec4 singularityTarget() {
    float theta = aSeed2.x * 2.0 * PI;
    float cz = aSeed2.y * 2.0 - 1.0;
    float sz = sqrt(max(1.0 - cz * cz, 0.0));
    vec3 dir = vec3(sz * cos(theta), sz * sin(theta), cz);
    // Breathing: a slow global swell plus a faster per-particle shimmer.
    float breath = 1.0 + 0.18 * sin(uTime * 1.3) + 0.06 * sin(uTime * 3.4 + aSeed2.z * 6.2831);
    return vec4(dir * uSingularity * pow(aSeed2.z, 2.4) * breath, 1.0);
  }

  // The Hero's ring: every strand's radius ripples with a flowing noise field
  // sampled around the circle, so the fibres wave together like a current.
  // The band is thicker at the top, where the light pools.
  vec4 ringTarget(vec4 v) {
    vec3 g;
    float u = v.z;
    float n1 = snoise(vec3(v.x * 1.6, v.y * 1.6, u * 0.8 + uTime * 0.13), g);
    float n2 = snoise(vec3(v.x * 4.2 + 7.1, v.y * 4.2 - 3.3, u * 2.4 - uTime * 0.21), g);
    float band = 0.2 * (1.0 + 0.6 * max(v.y, 0.0));
    float r = 1.0 + (u - 0.5) * band + n1 * 0.06 + n2 * 0.022;
    float z = (u - 0.5) * 0.3 + n1 * 0.12;
    float light = 0.8 + 0.35 * max(v.y, 0.0) + n1 * 0.25;
    return vec4(v.x * r, v.y * r, z, v.w * light);
  }

  vec4 flowTarget(vec4 v) {
    float speed = 0.4 + aSeed.y * 0.6;
    float x = mod(v.x + 17.0 + uTime * speed, 34.0) - 17.0;
    float y = v.y + 0.42 * sin(x * 0.28 + v.y * 1.7 + uTime * 0.22) + 0.16 * sin(x * 0.85 - v.y * 2.3 - uTime * 0.31);
    // Particles wrap at the field's edges, well outside the viewport; fading
    // them there keeps the wrap from ever reading as a jump.
    float edge = 1.0 - smoothstep(12.5, 16.0, abs(x));
    return vec4(x, y, v.z, v.w * edge);
  }

  vec4 waveTarget(vec4 v) {
    float y = 0.36 * sin(v.x * 0.5 + v.z * 0.32 + uTime * 0.55)
            + 0.16 * sin(v.x * 1.2 - v.z * 0.7 + uTime * 0.8)
            + 0.07 * sin(v.x * 2.7 + v.z * 1.9 - uTime * 1.1);
    float crest = smoothstep(-0.4, 0.55, y);
    return vec4(v.x, y, v.z, v.w * (0.4 + crest * 0.85));
  }

  vec4 vortexTarget(vec4 v) {
    float theta = v.y + uTime * 0.5 / (0.4 + v.x * 0.55);
    return vec4(cos(theta) * v.x, sin(theta) * v.x, v.z, v.w);
  }

  // k is the same for the whole draw, so these branches never diverge.
  vec4 stageLocal(float k) {
    if (k < 0.5) return singularityTarget();
    if (k < 1.5) return aHero.w < 0.0 ? aHero : ringTarget(aHero);
    if (k < 2.5) return aAbout;
    if (k < 3.5) return aSkills;
    if (k < 4.5) return aProjects.w < 0.0 ? aProjects : flowTarget(aProjects);
    if (k < 5.5) return aExperience.w < 0.0 ? aExperience : waveTarget(aExperience);
    if (k < 6.5) return aContact.w < 0.0 ? aContact : vortexTarget(aContact);
    return aFooter;
  }

  vec3 toWorld(vec4 t, mat3 rot, vec3 offset, float scale, float lobe) {
    if (t.w < 0.0) return t.xyz;
    vec3 p = t.xyz;
    if (lobe > 0.0) {
      // Low-frequency swelling along the radial direction: the surface
      // breathes in lobes instead of sitting as a perfect primitive.
      vec3 unused;
      float n = snoise(p * 1.15 + vec3(0.0, 0.0, uTime * 0.11), unused);
      float len = length(p);
      if (len > 1e-4) p += (p / len) * n * lobe;
    }
    return rot * (p * scale) + offset;
  }

  float stageLum(float gain, float w) {
    return w < 0.0 ? -w * uDustGain : w * gain;
  }

  void main() {
    float f = uFrac;

    // Each particle gets its own window inside the transition. That is what
    // makes a formation assemble as a sweep rather than slide as one mesh.
    float delay = aSeed.x * uStagger;
    float t = smoothstep(delay, delay + (1.0 - uStagger), f);
    float flight = sin(t * PI);

    vec4 A = stageLocal(uStageA);
    vec4 B = stageLocal(uStageB);
    vec3 p = mix(toWorld(A, uRotA, uOffsetA, uScaleA, uLobeA), toWorld(B, uRotB, uOffsetB, uScaleB, uLobeB), t);
    float lum = mix(stageLum(uGainA, A.w), stageLum(uGainB, B.w), t);

    // The Loader's wordmark (in \`position\`) hands over to the swarm.
    float introDelay = aSeed.x * 0.45;
    float ti = smoothstep(introDelay, introDelay + 0.55, uIntro);
    p = mix(position, p, ti);
    // Dim enough to read as letters made of points, not a glowing smear:
    // tens of thousands of particles share the wordmark's thin strokes.
    lum = mix(0.42, lum, ti);
    flight = max(flight, sin(ti * PI));

    // Ambient life is noise over time, never accumulated. The singularity is
    // held still so it reads as one point, not as a smudge.
    float ambient = uStageA < 0.5 ? t : 1.0;
    vec3 curl = curlNoise(p * uCurlFreq + vec3(0.0, 0.0, uTime * uCurlSpeed));
    p += curl * (uCurlAmp * ambient + uFlight * flight);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    // Pointer repulsion, measured on screen so it pushes whatever is under
    // the cursor regardless of depth, then applied in view space.
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;
    vec2 dm = (ndc - uMouse) * vec2(uAspect, 1.0);
    float dist = length(dm);
    float push = uMouseStrength * exp(-(dist * dist) / (uMouseRadius * uMouseRadius));
    vec2 away = dist > 1e-4 ? dm / dist : vec2(0.0);
    mv.xy += away * push * (-mv.z) * 0.085;

    gl_Position = projectionMatrix * mv;

    // Keep the swarm off the portrait's face.
    vec2 screen = gl_Position.xy / gl_Position.w;
    vec2 fe = (screen - uFace.xy) / max(uFace.zw, vec2(1e-4));
    float faceFade = mix(1.0, smoothstep(0.8, 1.35, length(fe)), uFaceStrength);

    // Depth of field: away from the focal distance a point grows into a soft,
    // dim disc — bokeh — so the field has depth instead of flat specks.
    float viewDepth = -mv.z;
    float coc = clamp(abs(viewDepth - uFocus) * uDof, 0.0, 1.0);

    float size = mix(uSizeA, uSizeB, t);
    float worldSize = uPointSize * uDensity * size * (0.55 + aSeed.w * 0.9) * (1.0 + flight * 0.35) * (1.0 + coc * 2.2);
    float px = worldSize * uPixelScale / max(viewDepth, 0.05);
    gl_PointSize = max(px, 1.0);
    // Below a pixel the point cannot shrink any further, so it dims instead.
    float subpixel = clamp(px, 0.0, 1.0);

    float twinkle = 0.72 + 0.28 * sin(uTime * (0.7 + aSeed.y * 2.3) + aSeed.z * 6.2831);
    float depthFade = smoothstep(46.0, 12.0, -mv.z) * smoothstep(0.3, 1.4, -mv.z);

    // Color: a vertical gradient across each formation, warm at the top and
    // blue at the bottom, meeting in violet (the two mix in linear light).
    // Each formation's temperature slides that gradient: cool stretches of the
    // page are mostly blue, warm ones mostly amber. It is computed per
    // particle with the same stagger as the shape, so the shift sweeps.
    vec3 centre = mix(uOffsetA, uOffsetB, t);
    vec3 rel = p - centre;
    float span = 0.6 + mix(uScaleA, uScaleB, t) * 1.1;
    float height = clamp(0.5 + 0.5 * rel.y / span, 0.0, 1.0);
    float bias = mix(uWarmA, uWarmB, t);
    float g = smoothstep(0.1, 0.9, clamp(height + (bias - 0.5) * 1.3, 0.0, 1.0));
    // Three stops: blue base, a wide violet middle, amber only on the crown.
    // (Previous two-stop version: mix(uCoolDeep, uWarmTone, g).)
    vec3 color = g < 0.62
      ? mix(uCoolDeep, uViolet, smoothstep(0.0, 0.62, g))
      : mix(uViolet, uWarmTone, smoothstep(0.62, 1.0, g));
    color = mix(color, uCool, (1.0 - smoothstep(0.0, 0.3, g)) * 0.3);
    float sparkle = step(0.965, aSeed2.w);
    color = mix(color, vec3(1.0), sparkle * 0.5);

    vColor = color * lum * twinkle * (1.0 + sparkle * 0.7) * (1.0 + flight * 0.35);
    vAlpha = uOpacity * depthFade * faceFade * subpixel * uReducedFade / (1.0 + coc * 9.0);
    vBlur = coc;
  }
`

export const swarmFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vBlur;

  void main() {
    // In focus: a crisp dot with a short soft edge — at this density sharp
    // points read as a surface. Out of focus: a flat disc with a soft rim,
    // the shape a lens gives an out-of-focus light.
    vec2 c = gl_PointCoord - 0.5;
    float r2 = dot(c, c) * 4.0;
    if (r2 > 1.0) discard;
    float crisp = 1.0 - smoothstep(0.3, 1.0, r2);
    float bokeh = (1.0 - smoothstep(0.55, 1.0, r2)) * 0.85;
    gl_FragColor = vec4(vColor, vAlpha * mix(crisp, bokeh, vBlur));
  }
`

/** Full-screen backdrop: near black with two slow, very soft glows. */
export const backdropVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

export const backdropFragmentShader = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uGlow;
  uniform vec3 uGlowDeep;
  uniform float uAspect;
  uniform float uTime;
  uniform float uStrength;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - 0.5;
    p.x *= uAspect;
    vec2 c1 = vec2(-0.42 * uAspect + 0.04 * sin(uTime * 0.05), 0.34 + 0.03 * cos(uTime * 0.04));
    vec2 c2 = vec2(0.46 * uAspect + 0.05 * cos(uTime * 0.045), -0.38);
    float g1 = exp(-dot(p - c1, p - c1) / 0.16);
    float g2 = exp(-dot(p - c2, p - c2) / 0.22);
    gl_FragColor = vec4(uBase + (uGlow * g1 + uGlowDeep * g2 * 0.8) * uStrength, 1.0);
  }
`
