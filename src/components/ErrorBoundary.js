import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Component } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
export class ErrorBoundary extends Component {
  resetTimeoutId = null;
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }
  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('🚨 React Error Boundary caught an error:', error);
    console.error('🔍 Error Info:', errorInfo);
    // Update state with error info
    this.setState({
      error,
      errorInfo
    });
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    // Send error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }
  componentDidUpdate(prevProps) {
    const { resetOnPropsChange, children } = this.props;
    const { hasError } = this.state;
    // Reset error boundary when props change (if enabled)
    if (hasError && resetOnPropsChange && prevProps.children !== children) {
      this.resetError();
    }
  }
  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }
  reportError = async (error, errorInfo) => {
    try {
      // Enhanced error reporting for production
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: 'anonymous', // Would come from auth context
        buildVersion: '__APP_VERSION__',
        errorId: this.state.errorId,
        level: this.props.level || 'component'
      };
      // In a real app, this would send to monitoring service
      console.log('📊 Error Report (Production):', errorReport);
      // Could integrate with services like Sentry, LogRocket, etc.
      // await errorMonitoringService.reportError(errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };
  handleRetry = () => {
    this.resetError();
  };
  handleReload = () => {
    window.location.reload();
  };
  handleGoHome = () => {
    window.location.href = '/';
  };
  renderErrorUI() {
    const { level = 'component' } = this.props;
    const { error, errorId } = this.state;
    // Critical errors get full page treatment
    if (level === 'critical') {
      return _jsx('div', {
        className: 'min-h-screen flex items-center justify-center bg-gray-50 px-4',
        children: _jsxs(Card, {
          className: 'w-full max-w-md',
          children: [
            _jsxs(CardHeader, {
              className: 'text-center',
              children: [
                _jsx('div', {
                  className:
                    'mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4',
                  children: _jsx(AlertTriangle, { className: 'w-6 h-6 text-red-600' })
                }),
                _jsx(CardTitle, { className: 'text-red-900', children: 'Critical Error' })
              ]
            }),
            _jsxs(CardContent, {
              className: 'space-y-4',
              children: [
                _jsx('p', {
                  className: 'text-gray-600 text-center',
                  children:
                    'The application encountered a critical error and needs to be restarted.'
                }),
                process.env.NODE_ENV === 'development' &&
                  _jsxs(Alert, {
                    variant: 'destructive',
                    children: [
                      _jsx(Bug, { className: 'h-4 w-4' }),
                      _jsx(AlertTitle, { children: 'Development Error Details' }),
                      _jsx(AlertDescription, {
                        className: 'mt-2',
                        children: _jsxs('details', {
                          children: [
                            _jsx('summary', {
                              className: 'cursor-pointer font-medium',
                              children: 'Error Message'
                            }),
                            _jsx('pre', {
                              className:
                                'mt-2 text-xs overflow-auto bg-gray-900 text-green-400 p-2 rounded',
                              children: error?.message
                            })
                          ]
                        })
                      })
                    ]
                  }),
                _jsxs('div', {
                  className: 'flex flex-col space-y-2',
                  children: [
                    _jsxs(Button, {
                      onClick: this.handleReload,
                      className: 'w-full',
                      children: [
                        _jsx(RefreshCw, { className: 'w-4 h-4 mr-2' }),
                        'Reload Application'
                      ]
                    }),
                    _jsxs(Button, {
                      variant: 'outline',
                      onClick: this.handleGoHome,
                      className: 'w-full',
                      children: [_jsx(Home, { className: 'w-4 h-4 mr-2' }), 'Go to Homepage']
                    })
                  ]
                }),
                _jsxs('p', {
                  className: 'text-xs text-gray-500 text-center',
                  children: ['Error ID: ', errorId]
                })
              ]
            })
          ]
        })
      });
    }
    // Page-level errors
    if (level === 'page') {
      return _jsx('div', {
        className: 'container mx-auto px-4 py-16',
        children: _jsxs(Card, {
          className: 'max-w-lg mx-auto',
          children: [
            _jsxs(CardHeader, {
              className: 'text-center',
              children: [
                _jsx(AlertTriangle, { className: 'w-8 h-8 text-orange-500 mx-auto mb-2' }),
                _jsx(CardTitle, { children: 'Page Error' })
              ]
            }),
            _jsxs(CardContent, {
              className: 'space-y-4',
              children: [
                _jsx('p', {
                  className: 'text-center text-gray-600',
                  children:
                    'This page encountered an error. You can try refreshing or return to the dashboard.'
                }),
                _jsxs('div', {
                  className: 'flex space-x-2',
                  children: [
                    _jsxs(Button, {
                      onClick: this.handleRetry,
                      variant: 'outline',
                      className: 'flex-1',
                      children: [_jsx(RefreshCw, { className: 'w-4 h-4 mr-2' }), 'Try Again']
                    }),
                    _jsxs(Button, {
                      onClick: this.handleGoHome,
                      className: 'flex-1',
                      children: [_jsx(Home, { className: 'w-4 h-4 mr-2' }), 'Dashboard']
                    })
                  ]
                })
              ]
            })
          ]
        })
      });
    }
    // Component-level errors (default)
    return _jsxs(Alert, {
      variant: 'destructive',
      className: 'my-4',
      children: [
        _jsx(AlertTriangle, { className: 'h-4 w-4' }),
        _jsx(AlertTitle, { children: 'Component Error' }),
        _jsxs(AlertDescription, {
          className: 'mt-2',
          children: [
            _jsx('p', {
              children: "This component encountered an error and couldn't render properly."
            }),
            _jsxs(Button, {
              variant: 'outline',
              size: 'sm',
              onClick: this.handleRetry,
              className: 'mt-2',
              children: [_jsx(RefreshCw, { className: 'w-3 h-3 mr-1' }), 'Retry']
            })
          ]
        })
      ]
    });
  }
  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      // Default error UI based on level
      return this.renderErrorUI();
    }
    return this.props.children;
  }
}
// Higher-order component wrapper for easier usage
export const withErrorBoundary = (Component, options) => {
  const WrappedComponent = props =>
    _jsx(ErrorBoundary, { ...options, children: _jsx(Component, { ...props }) });
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};
// Hook for triggering error boundaries programmatically
export const useErrorHandler = () => {
  return (error, _errorInfo) => {
    // This will trigger the nearest error boundary
    throw error;
  };
};
