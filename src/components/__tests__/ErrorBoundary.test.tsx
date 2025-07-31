import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
import { ErrorHandler } from '../../utils/error-handler';
import React from 'react';

// Mock the error handler
vi.mock('../../utils/error-handler', () => ({
  ErrorHandler: {
    getInstance: vi.fn(() => ({
      handleError: vi.fn()
    }))
  }
}));

// Mock console.error to avoid noise in tests
vi.spyOn(console, 'error').mockImplementation(() => {});

// Component that throws an error for testing
const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Component that throws an error on button click
const ThrowErrorOnClick: React.FC = () => {
  const [shouldThrow, setShouldThrow] = React.useState(false);

  if (shouldThrow) {
    throw new Error('Click error');
  }

  return <button onClick={() => setShouldThrow(true)}>Throw Error</button>;
};

describe('ErrorBoundary', () => {
  let mockErrorHandler: any;

  beforeEach(() => {
    mockErrorHandler = {
      handleError: vi.fn()
    };
    (ErrorHandler.getInstance as any).mockReturnValue(mockErrorHandler);
    vi.clearAllMocks();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument();
  });

  it('should call error handler when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
      expect.any(Error),
      'system',
      'critical',
      expect.objectContaining({
        component: 'ErrorBoundary',
        errorBoundary: true
      })
    );
  });

  it('should reset error state when Try Again is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error UI should be visible
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Click Try Again
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    // Re-render with non-throwing component
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Should show normal content again
    expect(screen.getByText('No error')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('should handle Go Home button click', () => {
    // Mock window.location
    const mockLocation = {
      href: ''
    };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /go home/i }));

    expect(mockLocation.href).toBe('/');
  });

  it('should display custom fallback when provided', () => {
    const CustomFallback = () => <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('should handle errors in event handlers', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorOnClick />
      </ErrorBoundary>
    );

    // Initially should show the button
    expect(screen.getByRole('button', { name: /throw error/i })).toBeInTheDocument();

    // Click the button to trigger error
    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    // Should show error boundary UI
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should handle multiple errors', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // First error
    expect(mockErrorHandler.handleError).toHaveBeenCalledTimes(1);

    // Reset and throw another error
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should handle second error
    expect(mockErrorHandler.handleError).toHaveBeenCalledTimes(2);
  });

  it('should preserve error information in error handler call', () => {
    const testError = new Error('Specific test error');

    const ThrowSpecificError = () => {
      throw testError;
    };

    render(
      <ErrorBoundary>
        <ThrowSpecificError />
      </ErrorBoundary>
    );

    expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
      testError,
      'system',
      'critical',
      expect.objectContaining({
        component: 'ErrorBoundary',
        errorBoundary: true,
        errorInfo: expect.objectContaining({
          componentStack: expect.any(String)
        })
      })
    );
  });

  it('should handle errors with error info', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const errorHandlerCall = mockErrorHandler.handleError.mock.calls[0];
    const context = errorHandlerCall[3];

    expect(context.errorInfo).toBeDefined();
    expect(context.errorInfo.componentStack).toBeDefined();
    expect(typeof context.errorInfo.componentStack).toBe('string');
  });

  it('should not interfere with normal React lifecycle', () => {
    const TestComponent = () => {
      const [count, setCount] = React.useState(0);
      return (
        <div>
          <span>Count: {count}</span>
          <button onClick={() => setCount(c => c + 1)}>Increment</button>
        </div>
      );
    };

    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Count: 0')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /increment/i }));

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
    expect(mockErrorHandler.handleError).not.toHaveBeenCalled();
  });
});
