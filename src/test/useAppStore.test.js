import { describe, it, expect, afterEach, vi } from 'vitest';
import useAppStore from '../store/useAppStore';

// Mock the API utility
vi.mock('../utils/api', () => ({
  fetchProjectsData: vi.fn().mockResolvedValue([
    { project_id: 'mock-1', category: 'INTERIOR' }
  ])
}));

describe('useAppStore — Zustand Global State', () => {
  // Reset state before each test
  const initialState = useAppStore.getState();

  afterEach(() => {
    useAppStore.setState(initialState);
  });

  it('should have correct initial state matching PRD AppState interface', () => {
    const state = useAppStore.getState();
    expect(state.activeCategory).toBeNull();
    expect(state.currentLanguage).toBe('EN');
    expect(state.scrollProgress).toBe(0);
    expect(state.isTransitioning).toBe(false);
    expect(state.projects).toEqual([]);
    expect(state.isLoadingProjects).toBe(false);
  });

  it('setCategory should update activeCategory', () => {
    useAppStore.getState().setCategory('INTERIOR');
    expect(useAppStore.getState().activeCategory).toBe('INTERIOR');

    useAppStore.getState().setCategory('EXTERIOR');
    expect(useAppStore.getState().activeCategory).toBe('EXTERIOR');

    useAppStore.getState().setCategory(null);
    expect(useAppStore.getState().activeCategory).toBeNull();
  });

  it('setLanguage should update currentLanguage', () => {
    useAppStore.getState().setLanguage('GU');
    expect(useAppStore.getState().currentLanguage).toBe('GU');

    useAppStore.getState().setLanguage('HI');
    expect(useAppStore.getState().currentLanguage).toBe('HI');

    useAppStore.getState().setLanguage('EN');
    expect(useAppStore.getState().currentLanguage).toBe('EN');
  });

  it('setScrollProgress should clamp between 0 and 1', () => {
    useAppStore.getState().setScrollProgress(0.5);
    expect(useAppStore.getState().scrollProgress).toBe(0.5);

    // Should clamp to 1
    useAppStore.getState().setScrollProgress(1.5);
    expect(useAppStore.getState().scrollProgress).toBe(1);

    // Should clamp to 0
    useAppStore.getState().setScrollProgress(-0.3);
    expect(useAppStore.getState().scrollProgress).toBe(0);
  });

  it('setTransitioning should update isTransitioning', () => {
    useAppStore.getState().setTransitioning(true);
    expect(useAppStore.getState().isTransitioning).toBe(true);

    useAppStore.getState().setTransitioning(false);
    expect(useAppStore.getState().isTransitioning).toBe(false);
  });

  it('resetState should restore defaults but keep language', () => {
    useAppStore.getState().setCategory('INTERIOR');
    useAppStore.getState().setScrollProgress(0.7);
    useAppStore.getState().setTransitioning(true);
    useAppStore.getState().setLanguage('HI');

    useAppStore.getState().resetState();

    const state = useAppStore.getState();
    expect(state.activeCategory).toBeNull();
    expect(state.scrollProgress).toBe(0);
    expect(state.isTransitioning).toBe(false);
    // Language should persist through reset
    expect(state.currentLanguage).toBe('HI');
  });

  it('fetchProjects should fetch and set projects', async () => {
    const promise = useAppStore.getState().fetchProjects();
    
    // Immediately after calling, loading should be true
    expect(useAppStore.getState().isLoadingProjects).toBe(true);

    await promise;

    // After resolving
    expect(useAppStore.getState().isLoadingProjects).toBe(false);
    expect(useAppStore.getState().projects.length).toBeGreaterThan(0);
    expect(useAppStore.getState().projects[0]).toHaveProperty('project_id');
  });
});
