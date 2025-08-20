import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/**
 * Wraps a number around min and max values
 * Useful for carousel indices to create circular navigation
 */
export function wrap(min, max, value) {
    const range = max - min;
    // Return min if range is 0 to avoid division by zero
    if (range === 0) {
        return min;
    }
    // Calculate the wrapped value
    return ((((value - min) % range) + range) % range) + min;
}
