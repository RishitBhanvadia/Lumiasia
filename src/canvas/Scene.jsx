import { useRef, Suspense, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import useAppStore from '../store/useAppStore';

/**
 * Scene.jsx
 * PRD §5.1 — Perspective Shift Hero Element
 * Contains geometry, lighting, and camera animation logic.
 */

function ArchitecturalPlaceholder() {
  const meshRef = useRef();
  const groupRef = useRef();

  // Subtle continuous rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  // Abstract architectural form
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Main tower */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 2.4, 0.8]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.3}
            roughness={0.6}
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Secondary block */}
        <mesh position={[-0.6, -0.5, 0.3]}>
          <boxGeometry args={[0.6, 1.4, 0.6]} />
          <meshStandardMaterial
            color="#B8941F"
            metalness={0.2}
            roughness={0.7}
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Accent plane */}
        <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial
            color="#F2F0EB"
            metalness={0}
            roughness={1}
            transparent
            opacity={0.08}
          />
        </mesh>

        {/* Wireframe overlay */}
        <mesh position={[0, 0, 0]} ref={meshRef}>
          <boxGeometry args={[0.82, 2.42, 0.82]} />
          <meshBasicMaterial
            color="#D4AF37"
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      </group>
    </Float>
  );
}

/**
 * PRD §7.2 - Dynamic Asset Loading
 * Renders actual .glb architectural models when provided.
 */
function ArchitecturalModel({ url }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef}>
        <primitive object={scene} scale={[0.5, 0.5, 0.5]} />
      </group>
    </Float>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="text-[var(--color-accent-gold)] font-body text-sm tracking-widest uppercase">
        Loading...
      </div>
    </Html>
  );
}

function CameraController() {
  const { activeCategory, setTransitioning } = useAppStore();
  const cameraRef = useRef();

  useFrame(({ camera }) => {
    cameraRef.current = camera;
  });

  useEffect(() => {
    if (!cameraRef.current || activeCategory === null) return;

    setTransitioning(true);

    const targetPosition = activeCategory === 'INTERIOR'
      ? { x: 0, y: 0, z: -45 }  // Zoom inward (Z-axis -50 from initial 5)
      : { x: 0, y: 10, z: 55 };  // Pan outward + up (Z+50, Y+10)

    gsap.to(cameraRef.current.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 2.4,
      ease: 'cubic-bezier(0.85, 0, 0.15, 1)',
      onComplete: () => setTransitioning(false),
    });
  }, [activeCategory, setTransitioning]);

  return null;
}

export default function Scene() {
  const { activeCategory, projects } = useAppStore();
  
  // Try to find a project in the active category that has a 3D model
  const activeProject = projects?.find(p => 
    (!activeCategory || p.category === activeCategory) && p.model_3d_url
  );
  
  const modelUrl = activeProject?.model_3d_url;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.6}
        color="#F9F8F6"
        castShadow={false}
      />
      <pointLight
        position={[-3, 2, -2]}
        intensity={0.3}
        color="#D4AF37"
      />

      {/* Environment for reflections */}
      <Environment preset="city" environmentIntensity={0.2} />

      {/* Conditional Rendering of Assets vs Placeholders */}
      <Suspense fallback={<Loader />}>
        {modelUrl ? (
          <ArchitecturalModel url={modelUrl} />
        ) : (
          <ArchitecturalPlaceholder />
        )}
      </Suspense>

      {/* Camera animation controller */}
      <CameraController />
    </>
  );
}
