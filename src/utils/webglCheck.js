/**
 * Utility to detect WebGL support and basic performance tier.
 * Used for PRD §7.2 Performance Optimization.
 */
export const checkWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    // Try webgl2 first, fallback to webgl
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { supported: false, tier: 'unsupported' };
    }

    // Basic performance check (very simplified)
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase() : '';
    
    // Very rudimentary check for integrated vs dedicated graphics
    const isLowTier = renderer.includes('intel') || renderer.includes('hd graphics') || renderer.includes('mali') || renderer.includes('swiftshader');
    
    return {
      supported: true,
      tier: isLowTier ? 'low' : 'high',
      renderer
    };
  } catch (e) {
    return { supported: false, tier: 'error' };
  }
};
