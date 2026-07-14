"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT_DESKTOP = 9000;
const COUNT_MOBILE = 3500;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform float uPixelRatio;

  attribute float aScale;
  attribute float aPhase;

  varying float vAlpha;

  //
  // Simplex 3D noise (Ashima Arts / Stefan Gustavson, MIT)
  //
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0/7.0;
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

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 snoiseVec3(vec3 x){
    return vec3(
      snoise(x),
      snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2)),
      snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4))
    );
  }

  vec3 curlNoise(vec3 p){
    const float e = 0.12;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);

    vec3 x0 = snoiseVec3(p - dx);
    vec3 x1 = snoiseVec3(p + dx);
    vec3 y0 = snoiseVec3(p - dy);
    vec3 y1 = snoiseVec3(p + dy);
    vec3 z0 = snoiseVec3(p - dz);
    vec3 z1 = snoiseVec3(p + dz);

    float x = (y1.z - y0.z) - (z1.y - z0.y);
    float y = (z1.x - z0.x) - (x1.z - x0.z);
    float z = (x1.y - x0.y) - (y1.x - y0.x);

    return normalize(vec3(x, y, z) / (2.0 * e));
  }

  void main() {
    vec3 p = position;

    // Slow drift along an evolving divergence-free vector field.
    float t = uTime * 0.045;
    vec3 flow = curlNoise(p * 0.32 + vec3(0.0, 0.0, t));
    // A second, larger octave gives the field global structure.
    vec3 swell = curlNoise(p * 0.07 - vec3(t * 0.6, 0.0, 0.0));

    p += flow * uAmplitude * (0.55 + 0.45 * sin(aPhase + uTime * 0.05));
    p += swell * uAmplitude * 1.6;

    // A weak gravitational pull toward the cursor.
    vec3 toMouse = uMouse - p;
    float d = length(toMouse);
    float g = uMouseStrength * exp(-d * d * 0.55);
    p += toMouse * g;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = aScale * uPixelRatio * (26.0 / -mv.z);
    gl_PointSize = max(size, 0.75);

    // Fade with depth so the field feels dimensional, not flat.
    float depthFade = smoothstep(-16.0, -6.0, mv.z);
    vAlpha = (0.18 + 0.5 * aScale) * mix(0.35, 1.0, depthFade);

    // Slowly breathing density: filaments condense and dissolve.
    float density = snoise(p * 0.16 + vec3(0.0, t * 0.4, 0.0));
    vAlpha *= 0.3 + 0.7 * smoothstep(-0.55, 0.75, density);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.05, r);
    gl_FragColor = vec4(vec3(0.96), vAlpha * soft);
  }
`;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function Particles({ reducedMotion }: { reducedMotion: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();
  const mouseTarget = useRef(new THREE.Vector3(0, 0, 0));
  const time = useRef(0);

  const count = useMemo(() => {
    if (typeof window === "undefined") return COUNT_DESKTOP;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    return coarse || window.innerWidth < 768 ? COUNT_MOBILE : COUNT_DESKTOP;
  }, []);

  const { positions, scales, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    // Spread across a volume comfortably wider than any viewport.
    const spreadX = 20;
    const spreadY = 12;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * spreadX;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      scales[i] = 0.35 + Math.pow(Math.random(), 2.2) * 1.1;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, scales, phases };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 0.9 },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uMouseStrength: { value: 0 },
      uPixelRatio: { value: 1 },
    }),
    []
  );

  useEffect(() => {
    uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
  }, [uniforms, size]);

  useFrame((state, delta) => {
    const mat = materialRef.current;
    if (!mat) return;

    if (!reducedMotion) {
      time.current += Math.min(delta, 1 / 30);
    }
    mat.uniforms.uTime.value = time.current;

    // Pointer in world units on the z = 0 plane.
    mouseTarget.current.set(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
      0
    );
    const current = mat.uniforms.uMouse.value as THREE.Vector3;
    current.lerp(mouseTarget.current, 1 - Math.exp(-delta * 2.2));

    const targetStrength = reducedMotion ? 0 : 0.06;
    mat.uniforms.uMouseStrength.value +=
      (targetStrength - mat.uniforms.uMouseStrength.value) * (1 - Math.exp(-delta * 2));
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Field() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      aria-hidden
      camera={{ position: [0, 0, 9], fov: 50, near: 0.1, far: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
    >
      <Particles reducedMotion={reducedMotion} />
    </Canvas>
  );
}
