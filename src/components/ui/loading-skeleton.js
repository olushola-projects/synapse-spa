import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
function Skeleton({ className, ...props }) {
    return _jsx("div", { className: cn('animate-pulse rounded-md bg-muted', className), ...props });
}
// Specialized skeleton components for common patterns
export function CardSkeleton() {
    return (_jsxs("div", { className: 'space-y-3', children: [_jsx(Skeleton, { className: 'h-4 w-3/4' }), _jsx(Skeleton, { className: 'h-4 w-1/2' }), _jsx(Skeleton, { className: 'h-20 w-full' })] }));
}
export function ListSkeleton({ items = 3 }) {
    return (_jsx("div", { className: 'space-y-3', children: Array.from({ length: items }).map((_, i) => (_jsxs("div", { className: 'flex items-center space-x-4', children: [_jsx(Skeleton, { className: 'h-12 w-12 rounded-full' }), _jsxs("div", { className: 'space-y-2', children: [_jsx(Skeleton, { className: 'h-4 w-[200px]' }), _jsx(Skeleton, { className: 'h-4 w-[160px]' })] })] }, i))) }));
}
export function TableSkeleton({ rows = 5, columns = 4 }) {
    return (_jsx("div", { className: 'space-y-3', children: _jsx("div", { className: 'grid gap-3', style: { gridTemplateColumns: `repeat(${columns}, 1fr)` }, children: Array.from({ length: rows * columns }).map((_, i) => (_jsx(Skeleton, { className: 'h-4 w-full' }, i))) }) }));
}
export { Skeleton };
