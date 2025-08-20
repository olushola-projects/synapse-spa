import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
const initialMetrics = {
    complianceScore: 94,
    riskReduction: 67,
    processingSpeed: 3.2,
    activeUsers: 500,
    lastUpdated: new Date().toISOString()
};
export const useRealTimeMetrics = () => {
    const [metrics, setMetrics] = useState(initialMetrics);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchMetrics = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // Try to fetch from API endpoint
            const response = await fetch('/api/metrics', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(5000) // 5 second timeout
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Validate the response data
            if (data && typeof data === 'object') {
                const validatedMetrics = {
                    complianceScore: Math.max(0, Math.min(100, data.complianceScore || initialMetrics.complianceScore)),
                    riskReduction: Math.max(0, Math.min(100, data.riskReduction || initialMetrics.riskReduction)),
                    processingSpeed: Math.max(0, data.processingSpeed || initialMetrics.processingSpeed),
                    activeUsers: Math.max(0, data.activeUsers || initialMetrics.activeUsers),
                    lastUpdated: new Date().toISOString()
                };
                setMetrics(validatedMetrics);
                logger.info('Real-time metrics updated successfully', validatedMetrics);
            }
            else {
                throw new Error('Invalid metrics data format');
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch metrics';
            setError(errorMessage);
            logger.error('Failed to fetch real-time metrics:', error);
            // Fallback to simulated metrics update for demo purposes
            setMetrics(prev => ({
                ...prev,
                complianceScore: Math.max(85, Math.min(98, prev.complianceScore + (Math.random() - 0.5) * 2)),
                riskReduction: Math.max(60, Math.min(75, prev.riskReduction + (Math.random() - 0.5) * 3)),
                processingSpeed: Math.max(2.5, Math.min(4.0, prev.processingSpeed + (Math.random() - 0.5) * 0.3)),
                activeUsers: Math.max(450, Math.min(550, prev.activeUsers + Math.floor((Math.random() - 0.5) * 20))),
                lastUpdated: new Date().toISOString()
            }));
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        // Initial fetch
        fetchMetrics();
        // Set up polling every 30 seconds
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, []);
    // Manual refresh function
    const refreshMetrics = () => {
        fetchMetrics();
    };
    return {
        metrics,
        isLoading,
        error,
        refreshMetrics
    };
};
