<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useThemeStore } from '../../stores/theme';

const canvasRef = ref(null);
const themeStore = useThemeStore();

// Palet warna resmi DEKAVE
// Dark Mode: Deep Navy, Midnight Blue, Royal Blue, Sky Blue, Cyan Glow
const darkPalette = [
  [0.024, 0.043, 0.098], // #060B19 - Dark Navy Base
  [0.043, 0.078, 0.165], // #0B142A - Deep Midnight
  [0.008, 0.518, 0.780], // #0284C7 - Vibrant Sky Blue
  [0.145, 0.388, 0.922], // #2563EB - Royal Electric Blue
  [0.220, 0.741, 0.973], // #38BDF8 - Bright Cyan Accent
];

// Light Mode: Clean White, Soft Sky, Pastel Cyan, Light Indigo, Crisp Cyan
const lightPalette = [
  [0.965, 0.980, 1.000], // #F6FAFF - Crisp Light Sky White
  [0.878, 0.941, 0.992], // #E0F0FD - Soft Pastel Blue
  [0.729, 0.898, 0.988], // #BAE5FC - Sky Blue
  [0.850, 0.890, 0.990], // #D9E3FC - Soft Indigo Tint
  [0.490, 0.827, 0.988], // #7DD3FC - Bright Sky Highlight
];

// Current interpolated colors (for smooth dark/light transition)
let currentColors = (themeStore.isDark ? darkPalette : lightPalette).map(c => [...c]);
let targetPalette = themeStore.isDark ? darkPalette : lightPalette;

watch(() => themeStore.isDark, (isDark) => {
  targetPalette = isDark ? darkPalette : lightPalette;
});

let gl = null;
let program = null;
let animationFrameId = null;
let isVisible = true;
let startTime = performance.now();
let resizeObserver = null;
let intersectionObserver = null;

// Vertex Shader: Fullscreen quad
const vsSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Fragment Shader: 3D Silk Fluid Wave Gradient (Stripe/Neat style with specular sheen)
const fsSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_c1;
  uniform vec3 u_c2;
  uniform vec3 u_c3;
  uniform vec3 u_c4;
  uniform vec3 u_c5;

  // Wave function that creates layered liquid ribbon distortions
  vec2 wave(vec2 p, float t) {
    float x = sin(p.y * 2.2 + t * 0.6) * 0.45 + sin(p.y * 4.8 - t * 0.45) * 0.22;
    float y = cos(p.x * 1.8 - t * 0.55) * 0.45 + cos(p.x * 4.2 + t * 0.35) * 0.22;
    return vec2(x, y);
  }

  // 3D Height field evaluation
  float height(vec2 p, float t) {
    vec2 q = p + wave(p, t);
    vec2 r = p + wave(q + vec2(2.1, 4.3), t * 1.15);
    return 0.55 * sin(r.x * 2.8 + r.y * 2.2 + t) + 0.45 * cos(q.x * 1.9 - q.y * 2.8 - t * 0.75);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = uv;
    p.x *= aspect;

    // Smooth ambient speed
    float t = u_time * 0.32;

    // Evaluate waves and normal for 3D silk reflection
    float eps = 0.006;
    float h0 = height(p, t);
    float hx = height(p + vec2(eps, 0.0), t) - h0;
    float hy = height(p + vec2(0.0, eps), t) - h0;
    vec3 normal = normalize(vec3(-hx / eps, -hy / eps, 1.4));

    // Directional light from top-left (producing soft liquid ridges)
    vec3 lightDir = normalize(vec3(0.4, 0.7, 1.1));
    float diff = max(dot(normal, lightDir), 0.0);

    // Specular highlight / silk sheen
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 20.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.8);

    // Dynamic wave mixing factors
    float mix1 = smoothstep(-0.6, 0.7, h0);
    float mix2 = smoothstep(-0.4, 0.8, sin(p.x * 2.0 + p.y * 1.5 + t * 0.8));
    float mix3 = smoothstep(-0.5, 0.9, cos(p.x * 1.6 - p.y * 2.2 - t * 0.6));

    // Blend the 5 palette colors organically
    vec3 col = mix(u_c1, u_c2, mix1);
    col = mix(col, u_c3, mix2 * 0.75);
    col = mix(col, u_c4, mix3 * 0.65);

    // Add specular gloss & soft cyan glow along the wave crests
    col += u_c5 * (spec * 0.35 + fresnel * 0.25);

    // Soft organic vignette toward edges
    float vignette = 1.0 - length((uv - vec2(0.5, 0.45)) * vec2(0.7, 0.9)) * 0.35;
    col *= clamp(vignette, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function createShader(glCtx, type, source) {
  const shader = glCtx.createShader(type);
  glCtx.shaderSource(shader, source);
  glCtx.compileShader(shader);
  if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
    console.error('Shader compile error:', glCtx.getShaderInfoLog(shader));
    glCtx.deleteShader(shader);
    return null;
  }
  return shader;
}

function initWebGL() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    depth: false,
    stencil: false,
  });

  if (!gl) {
    console.warn('WebGL not supported, falling back to CSS gradient.');
    return;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return;

  program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return;
  }

  gl.useProgram(program);

  // Full-screen triangle covering [-1, 1]
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = new Float32Array([
    -1.0, -1.0,
     3.0, -1.0,
    -1.0,  3.0,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  resizeCanvas();
  render();
}

function resizeCanvas() {
  if (!gl || !canvasRef.value) return;
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.25); // Cap DPR at 1.25 for buttery 60fps & low battery consumption

  const width = Math.floor(rect.width * dpr);
  const height = Math.floor(rect.height * dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
}

function render() {
  if (!gl || !program) return;

  if (isVisible && !document.hidden) {
    const elapsed = (performance.now() - startTime) * 0.001;

    // Smooth color interpolation when toggling Dark/Light mode
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        currentColors[i][j] += (targetPalette[i][j] - currentColors[i][j]) * 0.04;
      }
    }

    gl.useProgram(program);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uC1 = gl.getUniformLocation(program, 'u_c1');
    const uC2 = gl.getUniformLocation(program, 'u_c2');
    const uC3 = gl.getUniformLocation(program, 'u_c3');
    const uC4 = gl.getUniformLocation(program, 'u_c4');
    const uC5 = gl.getUniformLocation(program, 'u_c5');

    gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(uTime, elapsed);
    gl.uniform3fv(uC1, currentColors[0]);
    gl.uniform3fv(uC2, currentColors[1]);
    gl.uniform3fv(uC3, currentColors[2]);
    gl.uniform3fv(uC4, currentColors[3]);
    gl.uniform3fv(uC5, currentColors[4]);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  animationFrameId = requestAnimationFrame(render);
}

onMounted(() => {
  initWebGL();

  // Resize handler
  if (window.ResizeObserver && canvasRef.value) {
    resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(canvasRef.value);
  } else {
    window.addEventListener('resize', resizeCanvas);
  }

  // Intersection Observer to pause rendering when scrolled off-screen
  if ('IntersectionObserver' in window && canvasRef.value) {
    intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    intersectionObserver.observe(canvasRef.value);
  }

  // Page visibility listener
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // Resume smoothly
      startTime = performance.now();
    }
  });
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (resizeObserver) resizeObserver.disconnect();
  if (intersectionObserver) intersectionObserver.disconnect();
  window.removeEventListener('resize', resizeCanvas);

  if (gl && program) {
    gl.deleteProgram(program);
  }
});
</script>

<template>
  <div class="absolute inset-0 pointer-events-none overflow-hidden select-none">
    <!-- WebGL Dynamic Fluid Wave Canvas -->
    <canvas
      ref="canvasRef"
      class="w-full h-full block object-cover transition-opacity duration-700 opacity-90 dark:opacity-85"
    ></canvas>

    <!-- Subtle gradient overlay at the bottom so it seamlessly fades into the following section -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/95 dark:to-[#050A17]/95 pointer-events-none"
    ></div>
  </div>
</template>
