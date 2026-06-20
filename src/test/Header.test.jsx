import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock react-i18next
const mockChangeLanguage = vi.fn();
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: mockChangeLanguage,
      language: 'EN',
    },
    t: (key) => key,
  }),
}));

// Mock framer-motion to render plain elements
vi.mock('framer-motion', () => ({
  motion: {
    header: ({ children, className, ...rest }) => <header className={className}>{children}</header>,
    div: ({ children, className, ...rest }) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock useAppStore — use the correct relative path from the test file
const mockSetLanguage = vi.fn();
vi.mock('../store/useAppStore', () => ({
  default: () => ({
    currentLanguage: 'EN',
    setLanguage: mockSetLanguage,
  }),
}));

import Header from '../components/Header/Header';

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the LUMIASIA logo text', () => {
    render(<Header />);
    expect(screen.getByText('LUMIASIA')).toBeInTheDocument();
  });

  it('should render all three language buttons (EN, GU, HI)', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /Switch to EN/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Switch to GU/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Switch to HI/i })).toBeInTheDocument();
  });

  it('should call setLanguage and i18n.changeLanguage when a language button is clicked', () => {
    render(<Header />);
    const guButton = screen.getByRole('button', { name: /Switch to GU/i });
    fireEvent.click(guButton);
    expect(mockSetLanguage).toHaveBeenCalledWith('GU');
    expect(mockChangeLanguage).toHaveBeenCalledWith('GU');
  });

  it('should have the language navigation with proper aria-label', () => {
    render(<Header />);
    expect(screen.getByRole('navigation', { name: /Language selection/i })).toBeInTheDocument();
  });
});
