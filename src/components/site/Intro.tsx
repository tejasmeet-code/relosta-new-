import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

// GPU Shader configuration for high-performance coordinate morphing
const ParticleMorphShader = {
  uniforms: {
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#ffffff") },
    uOpacity: { value: 0 }
  },
  vertexShader: `
    uniform float uProgress;
    uniform float uTime;
    attribute vec3 aTarget;
    varying float vEaseT;

    float cubicEaseInOut(float t) {
      return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
    }

    void main() {
      // Sweep delay based on target X position (left-to-right wave)
      float waveDelay = (aTarget.x + 3.8) / 7.6;
      float localT = clamp((uProgress - waveDelay * 0.25) / 0.75, 0.0, 1.0);
      float easeT = cubicEaseInOut(localT);
      vEaseT = easeT;

      // Base coordinate linear-to-cubic interpolation
      vec3 mixedPosition = mix(position, aTarget, easeT);

      // GPU-calculated noise/turbulence during transformation flight
      if (uProgress > 0.02 && uProgress < 0.98) {
        float strength = sin(uProgress * 3.14159265);
        // Using sine vectors based on time and vertex ID to avoid CPU overhead
        float noise = sin(uTime * 3.5 + float(gl_VertexID) * 0.1);
        mixedPosition.x += cos(noise) * 0.16 * strength;
        mixedPosition.y += sin(noise * 1.6) * 0.16 * strength;
        mixedPosition.z += sin(noise) * cos(noise) * 0.22 * strength;
      }

      // Dispersion flutter at final assembly stage
      if (uProgress > 0.88) {
        float drift = (uProgress - 0.88) * 8.0;
        mixedPosition.x += sin(uTime * 4.0 + float(gl_VertexID)) * 0.006 * drift;
        mixedPosition.y += cos(uTime * 3.0 + float(gl_VertexID)) * 0.006 * drift;
        mixedPosition.z += sin(uTime * 2.0 + float(gl_VertexID)) * 0.012 * drift;
      }

      vec4 mvPosition = modelViewMatrix * vec4(mixedPosition, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Point size scaling based on camera distance (size attenuation)
      gl_PointSize = (45.0 / -mvPosition.z);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uOpacity;

    void main() {
      // Shape points as anti-aliased glowing circular particles
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      if (dist > 0.5) discard;
      
      // Soft radial edge falloff
      float alpha = smoothstep(0.5, 0.1, dist) * uOpacity;
      gl_FragColor = vec4(uColor, alpha);
    }
  `
};

// Samples points from text written on a 2D canvas and maps them to 3D space
function sampleTextPoints(text: string, count: number): Float32Array {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 140px 'Inter', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 512, 128);
  
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const whitePixels: { x: number; y: number }[] = [];
  
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const idx = (y * canvas.width + x) * 4;
      if (data[idx] > 128) {
        whitePixels.push({ x, y });
      }
    }
  }
  
  const points = new Float32Array(count * 3);
  if (whitePixels.length === 0) {
    for (let i = 0; i < count; i++) {
      points[i * 3] = (Math.random() - 0.5) * 6;
      points[i * 3 + 1] = (Math.random() - 0.5) * 2;
      points[i * 3 + 2] = 0;
    }
    return points;
  }
  
  for (let i = 0; i < count; i++) {
    const pixel = whitePixels[Math.floor((i / count) * whitePixels.length) % whitePixels.length];
    points[i * 3] = (pixel.x - 512) * 0.0075;
    points[i * 3 + 1] = -(pixel.y - 128) * 0.0075;
    points[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
  }
  
  return points;
}

function MorphingParticleSystem({ morphProgress, solidOpacity }: { morphProgress: { value: number }, solidOpacity: { value: number } }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Extract starting vertices from a high-density Torus Knot
  const [positions, targets, count] = useMemo(() => {
    const geom = new THREE.TorusKnotGeometry(0.85, 0.25, 200, 24);
    const posAttr = geom.attributes.position;
    const array = posAttr.array as Float32Array;
    const cnt = posAttr.count;

    const startArr = new Float32Array(cnt * 3);
    for (let i = 0; i < cnt * 3; i++) {
      startArr[i] = array[i];
    }

    const targetArr = sampleTextPoints("relosta.in", cnt);
    return [startArr, targetArr, cnt];
  }, []);

  // Update uniforms in the shader material (0 CPU coordinate computations at runtime!)
  useFrame((state) => {
    if (!pointsRef.current) return;
    const mat = pointsRef.current.material as THREE.ShaderMaterial;
    if (mat && mat.uniforms) {
      const t = morphProgress.value;
      mat.uniforms.uProgress.value = t;
      mat.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Calculate opacity curve
      if (t < 0.15) {
        mat.uniforms.uOpacity.value = (1 - solidOpacity.value) * 0.9;
      } else if (t > 0.8) {
        mat.uniforms.uOpacity.value = Math.max(0, 0.9 - (t - 0.8) * 4);
      } else {
        mat.uniforms.uOpacity.value = 0.9;
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aTarget"
          args={[targets, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        args={[ParticleMorphShader]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SolidStructure({ solidOpacity }: { solidOpacity: { value: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerWireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const op = solidOpacity.value;

    if (meshRef.current) {
      meshRef.current.rotation.x = elapsed * 0.45;
      meshRef.current.rotation.y = elapsed * 0.55;
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = op * 0.85;
      }
    }

    if (outerWireRef.current) {
      outerWireRef.current.rotation.x = -elapsed * 0.25;
      outerWireRef.current.rotation.y = -elapsed * 0.15;
      const mat = outerWireRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = op * 0.08;
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[0.85, 0.25, 120, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.15}
          metalness={0.95}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={outerWireRef}>
        <icosahedronGeometry args={[1.4, 2]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function Intro() {
  const [show, setShow] = useState(() => !sessionStorage.getItem("relosta-intro-seen"));
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // GSAP animated progress trackers
  const morphProgress = useRef({ value: 0 });
  const solidOpacity = useRef({ value: 1 });

  useEffect(() => {
    if (!show) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }

    document.documentElement.classList.add("intro-active");

    const letters = logoRef.current?.querySelectorAll(".intro-letter");
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("relosta-intro-seen", "1");
        document.documentElement.classList.remove("intro-active");
        setShow(false);
      }
    });

    // Reset layout
    gsap.set(logoRef.current, { opacity: 0, scale: 0.94, filter: "blur(12px)" });
    gsap.set(letters || [], { opacity: 0, y: 25 });
    gsap.set(underlineRef.current, { scaleX: 0 });
    gsap.set(taglineRef.current, { opacity: 0, y: 15, filter: "blur(8px)" });

    // 1. Let solid structure spin, then dissolve it into particles
    tl.to(solidOpacity.current, {
      value: 0,
      duration: 1.1,
      ease: "power2.inOut",
      delay: 1.2
    })
    // 2. Perform the GPU particle morph sweep into logo text
    .to(morphProgress.current, {
      value: 1.0,
      duration: 2.1,
      ease: "power2.inOut"
    }, "-=0.3")
    // 3. Smoothly fade out canvas and transition to sharp HTML logo
    .to(canvasContainerRef.current, { opacity: 0, duration: 0.6 }, "-=0.6")
    .to(logoRef.current, { 
      opacity: 1, 
      scale: 1, 
      filter: "blur(0px)", 
      duration: 0.8, 
      ease: "power3.out" 
    }, "-=0.4")
    .to(letters || [], {
      opacity: 1,
      y: 0,
      stagger: 0.05,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6")
    .to(underlineRef.current, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, "-=0.4")
    .to(taglineRef.current, { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      duration: 0.7, 
      ease: "power2.out" 
    }, "-=0.3")
    // 4. Fade whole screen out to site layout
    .to(containerRef.current, { 
      opacity: 0, 
      scale: 1.03, 
      duration: 0.8, 
      ease: "power3.inOut" 
    }, "+=0.6");

  }, [show]);

  if (!show) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[99999] bg-[#000000] flex flex-col items-center justify-center overflow-hidden select-none">
      
      {/* WebGL Canvas Layer */}
      <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full pointer-events-none">
        <Canvas camera={{ position: [0, 0, 3.25], fov: 50 }}>
          <ambientLight intensity={0.15} />
          <directionalLight position={[2, 4, 3]} color="#ffffff" intensity={2} />
          
          <SolidStructure solidOpacity={solidOpacity.current} />
          <MorphingParticleSystem morphProgress={morphProgress.current} solidOpacity={solidOpacity.current} />
        </Canvas>
      </div>

      {/* Layered SVG radial glow overlay to act as a fake bloom filter on the canvas */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

      {/* Synchronized typographic reveal */}
      <div className="relative z-10 flex flex-col items-center text-center px-4" style={{ transformPerspective: 1000 }}>
        <div ref={logoRef} className="text-6xl md:text-8xl font-bold font-heading tracking-tight flex text-white mb-2 opacity-0">
          {"relosta.in".split("").map((char, idx) => (
            <span key={idx} className="intro-letter inline-block transform-gpu">
              {char === "." ? <span className="text-white opacity-50">{char}</span> : char}
            </span>
          ))}
        </div>
        <div ref={underlineRef} className="h-[1px] w-64 bg-gradient-to-r from-transparent via-white to-transparent origin-center transform-gpu" />
        <p ref={taglineRef} className="text-muted-foreground mt-4 text-xs md:text-sm font-medium tracking-[0.3em] uppercase opacity-0">
          Multi-Agency Holding Co.
        </p>
      </div>
    </div>
  );
}
