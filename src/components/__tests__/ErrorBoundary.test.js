import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
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
const ThrowError = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return _jsx('div', { children: 'No error' });
};
// Component that throws an error on button click
const ThrowErrorOnClick = () => {
  const [shouldThrow, setShouldThrow] = React.useState(false);
  if (shouldThrow) {
    throw new Error('Click error');
  }
  return _jsx('button', { onClick: () => setShouldThrow(true), children: 'Throw Error' });
};
describe('ErrorBoundary', () => {
  let mockErrorHandler;
  beforeEach(() => {
    mockErrorHandler = {
      handleError: vi.fn()
    };
    ErrorHandler.getInstance.mockReturnValue(mockErrorHandler);
    vi.clearAllMocks();
  });
  it('should render children when there is no error', () => {
    render(_jsx(ErrorBoundary, { children: _jsx('div', { children: 'Test content' }) }));
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
  it('should render error UI when child component throws', () => {
    render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true }) }));
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument();
  });
  it('should call error handler when error occurs', () => {
    render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true }) }));
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
      _jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true }) })
    );
    // Error UI should be visible
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    // Click Try Again
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    // Re-render with non-throwing component
    rerender(_jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: false }) }));
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
    render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true }) }));
    fireEvent.click(screen.getByRole('button', { name: /go home/i }));
    expect(mockLocation.href).toBe('/');
  });
  it('should display custom fallback when provided', () => {
    const CustomFallback = () => _jsx('div', { children: 'Custom error message' });
    render(
      _jsx(ErrorBoundary, {
        fallback: _jsx(CustomFallback, {}),
        children: _jsx(ThrowError, { shouldThrow: true })
      })
    );
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });
  it('should handle errors in event handlers', () => {
    render(_jsx(ErrorBoundary, { children: _jsx(ThrowErrorOnClick, {}) }));
    // Initially should show the button
    expect(screen.getByRole('button', { name: /throw error/i })).toBeInTheDocument();
    // Click the button to trigger error
    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    // Should show error boundary UI
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
  it('should handle multiple errors', () => {
    const { rerender } = render(
      _jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true }) })
    );
    // First error
    expect(mockErrorHandler.handleError).toHaveBeenCalledTimes(1);
    // Reset and throw another error
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    rerender(_jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true }) }));
    // Should handle second error
    expect(mockErrorHandler.handleError).toHaveBeenCalledTimes(2);
  });
  it('should preserve error information in error handler call', () => {
    const testError = new Error('Specific test error');
    const ThrowSpecificError = () => {
      throw testError;
    };
    render(_jsx(ErrorBoundary, { children: _jsx(ThrowSpecificError, {}) }));
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
    render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true }) }));
    const errorHandlerCall = mockErrorHandler.handleError.mock.calls[0];
    const context = errorHandlerCall[3];
    expect(context.errorInfo).toBeDefined();
    expect(context.errorInfo.componentStack).toBeDefined();
    expect(typeof context.errorInfo.componentStack).toBe('string');
  });
  it('should not interfere with normal React lifecycle', () => {
    const TestComponent = () => {
      const [count, setCount] = React.useState(0);
      return _jsxs('div', {
        children: [
          _jsxs('span', { children: ['Count: ', count] }),
          _jsx('button', { onClick: () => setCount(c => c + 1), children: 'Increment' })
        ]
      });
    };
    render(_jsx(ErrorBoundary, { children: _jsx(TestComponent, {}) }));
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /increment/i }));
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
    expect(mockErrorHandler.handleError).not.toHaveBeenCalled();
  });
});
