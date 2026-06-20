import { create } from 'zustand';
import { fetchProjectsData } from '../utils/api';

const useAppStore = create((set) => ({
  // State — matches PRD §2.2 AppState interface
  activeCategory: null, // 'INTERIOR' | 'EXTERIOR' | null
  currentLanguage: 'EN', // 'EN' | 'GU' | 'HI'
  scrollProgress: 0, // 0.0 to 1.0
  isTransitioning: false,
  
  // Phase 2 State
  projects: [],
  isLoadingProjects: false,
  error: null,

  // Actions
  setCategory: (category) =>
    set({ activeCategory: category }),

  setLanguage: (language) =>
    set({ currentLanguage: language }),

  setScrollProgress: (progress) =>
    set({ scrollProgress: Math.max(0, Math.min(1, progress)) }),

  setTransitioning: (isTransitioning) =>
    set({ isTransitioning }),

  fetchProjects: async () => {
    set({ isLoadingProjects: true, error: null });
    try {
      const data = await fetchProjectsData();
      set({ projects: data, isLoadingProjects: false });
    } catch (error) {
      set({ error: error.message || 'Failed to fetch projects', isLoadingProjects: false });
    }
  },

  resetState: () =>
    set({
      activeCategory: null,
      scrollProgress: 0,
      isTransitioning: false,
    }),
}));

export default useAppStore;
