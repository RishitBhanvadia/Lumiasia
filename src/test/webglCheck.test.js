import { describe, it, expect, vi } from 'vitest';
import { checkWebGLSupport } from '../utils/webglCheck';

describe('webglCheck', () => {
  it('should return supported if webgl is available', () => {
    const mockGetContext = vi.fn().mockImplementation((contextId) => {
      if (contextId === 'webgl2') return {
        getExtension: vi.fn(),
        getParameter: vi.fn()
      };
      return null;
    });

    // Mock document.createElement
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(() => {
      return { getContext: mockGetContext };
    });

    const result = checkWebGLSupport();
    expect(result.supported).toBe(true);
    expect(result.tier).toBeDefined();

    createElementSpy.mockRestore();
  });

  it('should return unsupported if webgl is not available', () => {
    const mockGetContext = vi.fn().mockReturnValue(null);
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(() => {
      return { getContext: mockGetContext };
    });

    const result = checkWebGLSupport();
    expect(result.supported).toBe(false);

    createElementSpy.mockRestore();
  });
});
