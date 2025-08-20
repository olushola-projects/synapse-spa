import { logger } from '@/utils/logger';
/**
 * Handles monitoring-related errors with consistent logging and error reporting.
 * @param error - The error object to handle
 * @param context - Additional context about where the error occurred
 */
export function handleMonitoringError(error, context) {
    logger.error(`Error in monitoring dashboard: ${context}`, error);
}
/**
 * Wraps an async function with consistent error handling for monitoring operations.
 * @param operation - The async operation to execute
 * @param context - Description of the operation for error logging
 * @returns A promise that resolves to the operation result or undefined on error
 */
export async function withErrorHandling(operation, context) {
    try {
        return await operation();
    }
    catch (error) {
        handleMonitoringError(error, context);
        return undefined;
    }
}
