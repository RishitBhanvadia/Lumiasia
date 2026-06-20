import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock framer-motion to render plain elements
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }) => <div className={className}>{children}</div>,
    h1: ({ children, className, ...props }) => <h1 className={className}>{children}</h1>,
    p: ({ children, className, ...props }) => <p className={className}>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'hero.title': 'Architecture & Design',
        'hero.subtitle': 'Where vision meets structure',
        'hero.interiors': 'Interiors',
        'hero.exteriors': 'Exteriors',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock GalleryCard
vi.mock('../components/GalleryCard/GalleryCard', () => ({
  default: ({ wireframeImg, finalImg }) => (
    <div data-testid="gallery-card">
      <span>{wireframeImg}</span>
      <span>{finalImg}</span>
    </div>
  ),
}));

// Create a mock store with controllable state
let mockState = {};
const mockSetCategory = vi.fn();
const mockResetState = vi.fn();

vi.mock('../store/useAppStore', () => ({
  default: (selector) => {
    const state = {
      activeCategory: mockState.activeCategory ?? null,
      currentLanguage: mockState.currentLanguage ?? 'EN',
      scrollProgress: 0,
      isTransitioning: false,
      projects: mockState.projects ?? [],
      isLoadingProjects: mockState.isLoadingProjects ?? false,
      error: null,
      setCategory: mockSetCategory,
      resetState: mockResetState,
      setScrollProgress: vi.fn(),
    };
    return selector ? selector(state) : state;
  },
}));

import JourneyFlow from '../components/JourneyFlow/JourneyFlow';

describe('JourneyFlow Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState = {};
  });

  it('should render the Hero split view when activeCategory is null', () => {
    mockState.activeCategory = null;
    const { container } = render(<JourneyFlow />);

    expect(screen.getByText('Architecture & Design')).toBeInTheDocument();
    expect(screen.getByText('Where vision meets structure')).toBeInTheDocument();

    const interiorBtn = screen.getByRole('button', { name: /View interior projects/i });
    const exteriorBtn = screen.getByRole('button', { name: /View exterior projects/i });
    expect(interiorBtn).toBeInTheDocument();
    expect(exteriorBtn).toBeInTheDocument();
  });

  it('should call setCategory("INTERIOR") when the interior button is clicked', () => {
    mockState.activeCategory = null;
    render(<JourneyFlow />);

    const interiorBtn = screen.getByRole('button', { name: /View interior projects/i });
    fireEvent.click(interiorBtn);
    expect(mockSetCategory).toHaveBeenCalledWith('INTERIOR');
  });

  it('should call setCategory("EXTERIOR") when the exterior button is clicked', () => {
    mockState.activeCategory = null;
    render(<JourneyFlow />);

    const exteriorBtn = screen.getByRole('button', { name: /View exterior projects/i });
    fireEvent.click(exteriorBtn);
    expect(mockSetCategory).toHaveBeenCalledWith('EXTERIOR');
  });

  it('should render the Gallery view when activeCategory is set', () => {
    mockState.activeCategory = 'INTERIOR';
    mockState.projects = [
      {
        project_id: '1',
        category: 'INTERIOR',
        title_i18n: { en: 'Test Project' },
        asset_wireframe_url: 'wireframe.jpg',
        asset_final_url: 'final.jpg',
      },
    ];
    const { container } = render(<JourneyFlow />);

    expect(screen.getByText('Interior Projects')).toBeInTheDocument();
    expect(screen.getByText('← Back')).toBeInTheDocument();
  });

  it('should call resetState when the Back button is clicked', () => {
    mockState.activeCategory = 'INTERIOR';
    mockState.projects = [];
    render(<JourneyFlow />);

    const backBtn = screen.getByRole('button', { name: /Go back to category selection/i });
    fireEvent.click(backBtn);
    expect(mockResetState).toHaveBeenCalled();
  });

  it('should show "Loading projects..." when isLoadingProjects is true', () => {
    mockState.activeCategory = 'INTERIOR';
    mockState.isLoadingProjects = true;
    render(<JourneyFlow />);

    expect(screen.getByText('Loading projects...')).toBeInTheDocument();
  });

  it('should show "No projects found." when there are no projects for the category', () => {
    mockState.activeCategory = 'EXTERIOR';
    mockState.projects = [
      { project_id: '1', category: 'INTERIOR', title_i18n: { en: 'Test' } },
    ];
    render(<JourneyFlow />);

    expect(screen.getByText('No projects found.')).toBeInTheDocument();
  });
});
