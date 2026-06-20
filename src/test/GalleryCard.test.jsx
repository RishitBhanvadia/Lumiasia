import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GalleryCard from '../components/GalleryCard/GalleryCard';

// Mock GSAP and ScrollTrigger to avoid DOM measurement errors in jsdom
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
    fromTo: vi.fn(),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

describe('GalleryCard Component', () => {
  it('should render wireframe and reality images when URLs are provided', () => {
    render(
      <GalleryCard
        wireframeImg="https://example.com/wireframe.jpg"
        finalImg="https://example.com/final.jpg"
      />
    );

    const wireframeImg = screen.getByAltText('Architectural wireframe');
    const realityImg = screen.getByAltText('Photorealistic render');

    expect(wireframeImg).toBeInTheDocument();
    expect(wireframeImg).toHaveAttribute('src', 'https://example.com/wireframe.jpg');
    expect(realityImg).toBeInTheDocument();
    expect(realityImg).toHaveAttribute('src', 'https://example.com/final.jpg');
  });

  it('should render SVG placeholders when no image URLs are provided', () => {
    const { container } = render(<GalleryCard />);

    const placeholders = container.querySelectorAll('.gallery-card__placeholder');
    expect(placeholders.length).toBe(2);

    // Should have placeholder text
    expect(screen.getByText('Blueprint')).toBeInTheDocument();
    expect(screen.getByText('Reality')).toBeInTheDocument();
  });

  it('should render SVG placeholders for empty string URLs', () => {
    const { container } = render(<GalleryCard wireframeImg="" finalImg="" />);

    const placeholders = container.querySelectorAll('.gallery-card__placeholder');
    expect(placeholders.length).toBe(2);
  });

  it('should have lazy loading and async decoding on images', () => {
    render(
      <GalleryCard
        wireframeImg="https://example.com/wireframe.jpg"
        finalImg="https://example.com/final.jpg"
      />
    );

    const images = screen.getAllByRole('img');
    images.forEach((img) => {
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('decoding', 'async');
    });
  });
});
