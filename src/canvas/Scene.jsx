import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';

function MassingStudy() {
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Base Plane */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[4, 0.2, 4]} />
        <meshStandardMaterial color="#2C2A29" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Main Tower */}
      <mesh position={[-0.5, 1.1, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 2.0, 1.2]} />
        <meshStandardMaterial color="#2C2A29" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Secondary Block */}
      <mesh position={[0.8, 0.6, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 1.0, 1.5]} />
        <meshStandardMaterial color="#2C2A29" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Accent Block */}
      <mesh position={[-0.2, 0.35, 1.2]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.5, 0.8]} />
        <meshStandardMaterial color="#2C2A29" roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  );
}

export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        color="#F9F8F6"
        castShadow
      />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.4}
        color="#F9F8F6"
      />

      <Environment preset="city" environmentIntensity={0.3} />

      <MassingStudy />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 4} // Restrict looking from too high above
        maxPolarAngle={Math.PI / 2.2} // Restrict looking from below the ground
        cursor="grab"
      />
    </>
  );
}
