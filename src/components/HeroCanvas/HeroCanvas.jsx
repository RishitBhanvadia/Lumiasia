import { Canvas } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import Scene from '../../canvas/Scene';
import { checkWebGLSupport } from '../../utils/webglCheck';

/**
 * <HeroCanvas />
 * PRD §6 — Persistent Three.js context spanning 100vw/100vh, fixed behind DOM.
 * Uses @react-three/fiber Canvas with the Scene component.
 */
export default function HeroCanvas() {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const { supported } = checkWebGLSupport();
    if (!supported) {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return (
      <div 
        className="hero-canvas fallback-2d" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          backgroundColor: 'var(--color-bg-base)',
          backgroundImage: 'radial-gradient(circle at center, var(--color-bg-surface) 0%, var(--color-bg-base) 100%)'
        }}
      >
        {/* PRD §7.2 - Fallback for low-end/no-WebGL devices */}
      </div>
    );
  }

  return (
    <div className="hero-canvas">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
