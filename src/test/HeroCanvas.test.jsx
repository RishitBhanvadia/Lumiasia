import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

// Mock the webglCheck utility — use correct relative path from test file
const mockCheckWebGLSupport = vi.fn();
vi.mock('../utils/webglCheck', () => ({
  checkWebGLSupport: (...args) => mockCheckWebGLSupport(...args),
}));

// Mock @react-three/fiber Canvas since jsdom has no WebGL
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="r3f-canvas">{children}</div>,
  useFrame: vi.fn(),
}));

// Mock the Scene component — correct relative path
vi.mock('../canvas/Scene', () => ({
  default: () => <div data-testid="scene">Scene</div>,
}));

import HeroCanvas from '../components/HeroCanvas/HeroCanvas';

describe('HeroCanvas Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render fallback div when WebGL is not supported', () => {
    mockCheckWebGLSupport.mockReturnValue({ supported: false, tier: 'unsupported' });

    const { container } = render(<HeroCanvas />);
    const fallback = container.querySelector('.fallback-2d');
    expect(fallback).toBeInTheDocument();
  });

  it('should render the Canvas wrapper when WebGL is supported', () => {
    mockCheckWebGLSupport.mockReturnValue({ supported: true, tier: 'high' });

    const { container } = render(<HeroCanvas />);
    const canvasDiv = container.querySelector('.hero-canvas');
    expect(canvasDiv).toBeInTheDocument();
  });
});
