import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Loader2, AlertCircle, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
export const LoadingSpinner = ({ size = 'md', text, className }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    };
    return (_jsxs("div", { className: cn('flex items-center justify-center gap-2', className), children: [_jsx(Loader2, { className: cn('animate-spin', sizeClasses[size]) }), text && _jsx("span", { className: "text-sm text-muted-foreground", children: text })] }));
};
export const PageLoading = ({ title = 'Loading...', description = 'Please wait while we fetch your data' }) => {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: _jsx(Card, { className: "w-full max-w-md", children: _jsxs(CardContent, { className: "pt-6 text-center", children: [_jsx(LoadingSpinner, { size: "lg", className: "mb-4" }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: title }), _jsx("p", { className: "text-muted-foreground", children: description })] }) }) }));
};
export const ErrorState = ({ title = 'Something went wrong', description = 'We encountered an error while loading this content.', onRetry, retryText = 'Try Again', className }) => {
    return (_jsxs("div", { className: cn('flex flex-col items-center justify-center p-8 text-center', className), children: [_jsx(AlertCircle, { className: "h-12 w-12 text-destructive mb-4" }), _jsx("h3", { className: "text-lg font-semibold mb-2", children: title }), _jsx("p", { className: "text-muted-foreground mb-4 max-w-md", children: description }), onRetry && (_jsx(Button, { onClick: onRetry, variant: "outline", children: retryText }))] }));
};
export const EmptyState = ({ title = 'No data available', description = 'There is nothing to display at the moment.', action, icon, className }) => {
    return (_jsxs("div", { className: cn('flex flex-col items-center justify-center p-8 text-center', className), children: [icon && _jsx("div", { className: "mb-4", children: icon }), _jsx("h3", { className: "text-lg font-semibold mb-2", children: title }), _jsx("p", { className: "text-muted-foreground mb-4 max-w-md", children: description }), action] }));
};
export const ConnectionStatus = ({ isOnline, className }) => {
    if (isOnline)
        return null;
    return (_jsxs(Alert, { className: cn('border-destructive bg-destructive/5', className), children: [_jsx(WifiOff, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: "You're currently offline. Some features may not be available." })] }));
};
// Network Status Hook
export const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = React.useState(navigator.onLine);
    React.useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    return isOnline;
};
// Loading State Hook
export const useLoadingState = (initialState = false) => {
    const [isLoading, setIsLoading] = React.useState(initialState);
    const withLoading = React.useCallback(async (asyncFn) => {
        setIsLoading(true);
        try {
            return await asyncFn();
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    return { isLoading, setIsLoading, withLoading };
};
