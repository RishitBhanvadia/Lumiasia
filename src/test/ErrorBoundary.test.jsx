import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

// Suppress expected console.error output from React and ErrorBoundary
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// A component that throws on render
function ThrowingChild({ message }) {
  throw new Error(message || 'Test explosion');
}

// A component that renders fine
function GoodChild() {
  return <div data-testid="good-child">All good</div>;
}

describe('ErrorBoundary Component', () => {
  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('good-child')).toBeInTheDocument();
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('should render fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild message="Canvas crashed" />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Canvas crashed')).toBeInTheDocument();
  });

  it('should display a Reload button in the fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );

    const reloadBtn = screen.getByRole('button', { name: /Reload Page/i });
    expect(reloadBtn).toBeInTheDocument();
  });

  it('should call window.location.reload when Reload button is clicked', () => {
    // Mock window.location.reload
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, reload: vi.fn() };

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );

    const reloadBtn = screen.getByRole('button', { name: /Reload Page/i });
    fireEvent.click(reloadBtn);

    expect(window.location.reload).toHaveBeenCalled();

    // Restore
    window.location = originalLocation;
  });

  it('should log the error via console.error', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild message="Logged error" />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });
});
