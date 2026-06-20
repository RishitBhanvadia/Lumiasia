import { Canvas } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import Scene from '../../canvas/Scene';
import { checkWebGLSupport } from '../../utils/webglCheck';

/**
 * <HeroCanvas />
 * Inline 3D context for the Massing Study element.
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
          width: '100%',
          height: '380px',
          maxWidth: '380px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent'
        }}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>[ 3D View Unavailable ]</span>
      </div>
    );
  }

  return (
    <div className="hero-canvas" style={{ width: '100%', height: '380px', maxWidth: '380px', margin: '0 auto' }}>
      <Canvas
        camera={{ position: [0, 5, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
