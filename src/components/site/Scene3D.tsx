import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TorusKnot, Icosahedron, Sphere, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function DynamicStage({ currentPath, isMobileOrTablet }: { currentPath: string, isMobileOrTablet: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const meshOuterRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Render fewer particles on mobile/tablet to optimize performance
  const count = isMobileOrTablet ? 100 : 300;
  const positions = useRef<Float32Array | null>(null);
  if (!positions.current) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 10;
    }
    positions.current = pos;
  }

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    // Disable heavy mouse tracking computations on mobile devices
    if (groupRef.current && !isMobileOrTablet) {
      const targetX = state.pointer.x * 0.4;
      const targetY = state.pointer.y * 0.4;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.05);
    } else if (groupRef.current) {
      // Slowly spin the camera space on mobile/tablet
      groupRef.current.rotation.y = elapsed * 0.03;
    }

    if (meshRef.current) {
      meshRef.current.rotation.x = elapsed * 0.08;
      meshRef.current.rotation.y = elapsed * 0.12;
    }
    
    if (meshOuterRef.current) {
      meshOuterRef.current.rotation.x = -elapsed * 0.04;
      meshOuterRef.current.rotation.y = -elapsed * 0.06;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = elapsed * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]} color="#ffffff" intensity={1} />
      <pointLight position={[-5, -5, -5]} color="#ffffff" intensity={0.5} />

      {/* Main active meshes according to route */}
      {currentPath === "/" && (
        <group>
          <Icosahedron ref={meshRef} args={[1.3, 1]}>
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.06} />
          </Icosahedron>
          <Icosahedron ref={meshOuterRef} args={[2.0, 0]}>
            <meshBasicMaterial color="#7f7f7f" wireframe transparent opacity={0.03} />
          </Icosahedron>
        </group>
      )}

      {currentPath === "/media" && (
        <group>
          <TorusKnot ref={meshRef} args={[0.9, 0.28, 120, 16]} position={isMobileOrTablet ? [0, 0, 0] : [0.4, 0.1, 0]}>
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.08} />
          </TorusKnot>
          {!isMobileOrTablet && (
            <Sphere ref={meshOuterRef} args={[2.2, 8, 8]} position={[0.4, 0.1, 0]}>
              <meshBasicMaterial color="#7f7f7f" wireframe transparent opacity={0.02} />
            </Sphere>
          )}
        </group>
      )}

      {currentPath === "/services" && (
        <group>
          <Icosahedron ref={meshRef} args={[1.2, 0]} position={isMobileOrTablet ? [0, 0, 0] : [-0.4, -0.1, 0]}>
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.07} />
          </Icosahedron>
          {/* Ring system (hide on mobile to keep it lightweight) */}
          {!isMobileOrTablet && (
            <mesh ref={meshOuterRef} rotation={[Math.PI / 3, 0, 0]} position={[-0.4, -0.1, 0]}>
              <ringGeometry args={[1.5, 1.8, 30]} />
              <meshBasicMaterial color="#7f7f7f" side={THREE.DoubleSide} wireframe transparent opacity={0.05} />
            </mesh>
          )}
        </group>
      )}

      {currentPath === "/about" && (
        <group>
          <Sphere ref={meshRef} args={[1.3, 16, 16]}>
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
          </Sphere>
          {!isMobileOrTablet && (
            <TorusKnot ref={meshOuterRef} args={[1.8, 0.1, 100, 8]}>
              <meshBasicMaterial color="#7f7f7f" wireframe transparent opacity={0.03} />
            </TorusKnot>
          )}
        </group>
      )}

      {currentPath === "/contact" && (
        <group>
          <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -0.5, 0]}>
            <planeGeometry args={[10, 10, 10, 10]} />
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.04} />
          </mesh>
        </group>
      )}

      <Points ref={particlesRef} positions={positions.current} stride={3}>
        <PointMaterial transparent color="#ffffff" size={0.03} sizeAttenuation depthWrite={false} opacity={0.3} />
      </Points>
    </group>
  );
}

export default function Scene3D() {
  const location = useLocation();
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  return (
    <div className="fixed inset-0 z-0 w-full h-full pointer-events-none opacity-50 select-none bg-gradient-hero">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
        <DynamicStage currentPath={location.pathname} isMobileOrTablet={isMobileOrTablet} />
      </Canvas>
    </div>
  );
}
