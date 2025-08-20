/**
 * API Health Monitoring Service
 * Provides real-time health monitoring, fallback logic, and performance tracking
 */
import { backendApiClient } from './backendApiClient';
import { nexusClient } from './nexusAgentClient';
class ApiHealthMonitor {
    healthData = new Map();
    checkInterval = 60000; // 1 minute
    intervalId = null;
    listeners = [];
    /**
     * Start monitoring API health
     */
    startMonitoring() {
        if (this.intervalId) {
            this.stopMonitoring();
        }
        // Initial check
        this.performHealthCheck();
        // Schedule regular checks
        this.intervalId = setInterval(() => {
            this.performHealthCheck();
        }, this.checkInterval);
        console.log('🔍 API Health Monitoring started');
    }
    /**
     * Stop monitoring
     */
    stopMonitoring() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        console.log('🔍 API Health Monitoring stopped');
    }
    /**
     * Add health status listener
     */
    addListener(listener) {
        this.listeners.push(listener);
    }
    /**
     * Remove health status listener
     */
    removeListener(listener) {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
    /**
     * Get current system health
     */
    getSystemHealth() {
        const services = Array.from(this.healthData.values());
        const healthyServices = services.filter(s => s.status === 'healthy').length;
        const degradedServices = services.filter(s => s.status === 'degraded').length;
        const unhealthyServices = services.filter(s => s.status === 'unhealthy').length;
        let overall;
        if (unhealthyServices > 0) {
            overall = healthyServices > 0 ? 'degraded' : 'unhealthy';
        }
        else if (degradedServices > 0) {
            overall = 'degraded';
        }
        else {
            overall = 'healthy';
        }
        const recommendations = this.generateRecommendations(services);
        return { overall, services, recommendations };
    }
    /**
     * Perform health check on all services
     */
    async performHealthCheck() {
        const checks = [
            this.checkExternalApi(),
            this.checkSupabaseEdgeFunctions(),
            this.checkLLMIntegration()
        ];
        await Promise.allSettled(checks);
        // Notify listeners
        const systemHealth = this.getSystemHealth();
        this.listeners.forEach(listener => listener(systemHealth));
    }
    /**
     * Check external API health
     */
    async checkExternalApi() {
        const startTime = Date.now();
        const serviceName = 'External API (api.joinsynapses.com)';
        try {
            const response = await backendApiClient.healthCheck();
            const responseTime = Date.now() - startTime;
            if (response.error) {
                this.updateHealthStatus(serviceName, {
                    status: response.status === 0 ? 'unhealthy' : 'degraded',
                    responseTime,
                    error: response.error,
                    fallbackAvailable: true
                });
            }
            else {
                this.updateHealthStatus(serviceName, {
                    status: responseTime > 5000 ? 'degraded' : 'healthy',
                    responseTime,
                    fallbackAvailable: true
                });
            }
        }
        catch (error) {
            this.updateHealthStatus(serviceName, {
                status: 'unhealthy',
                responseTime: Date.now() - startTime,
                error: error instanceof Error ? error.message : 'Unknown error',
                fallbackAvailable: true
            });
        }
    }
    /**
     * Check Supabase Edge Functions health
     */
    async checkSupabaseEdgeFunctions() {
        const startTime = Date.now();
        const serviceName = 'Supabase Edge Functions';
        try {
            await nexusClient.getHealth();
            const responseTime = Date.now() - startTime;
            this.updateHealthStatus(serviceName, {
                status: responseTime > 3000 ? 'degraded' : 'healthy',
                responseTime,
                fallbackAvailable: false
            });
        }
        catch (error) {
            this.updateHealthStatus(serviceName, {
                status: 'degraded',
                responseTime: Date.now() - startTime,
                error: error instanceof Error ? error.message : 'Unknown error',
                fallbackAvailable: false
            });
        }
    }
    /**
     * Check LLM integration health
     */
    async checkLLMIntegration() {
        const startTime = Date.now();
        const serviceName = 'LLM Integration';
        try {
            const testRequest = {
                text: 'Health check test for SFDR classification',
                document_type: 'health_check',
                strategy: 'primary'
            };
            const response = await backendApiClient.classifyDocument(testRequest);
            const responseTime = Date.now() - startTime;
            if (response.error) {
                this.updateHealthStatus(serviceName, {
                    status: 'degraded',
                    responseTime,
                    error: response.error,
                    fallbackAvailable: true
                });
            }
            else {
                this.updateHealthStatus(serviceName, {
                    status: responseTime > 10000 ? 'degraded' : 'healthy',
                    responseTime,
                    fallbackAvailable: true
                });
            }
        }
        catch (error) {
            this.updateHealthStatus(serviceName, {
                status: 'degraded',
                responseTime: Date.now() - startTime,
                error: error instanceof Error ? error.message : 'Unknown error',
                fallbackAvailable: true
            });
        }
    }
    /**
     * Update health status for a service
     */
    updateHealthStatus(service, update) {
        this.healthData.set(service, {
            service,
            lastChecked: new Date(),
            ...update
        });
    }
    /**
     * Generate recommendations based on current health status
     */
    generateRecommendations(services) {
        const recommendations = [];
        const externalApi = services.find(s => s.service.includes('External API'));
        const supabase = services.find(s => s.service.includes('Supabase'));
        const llm = services.find(s => s.service.includes('LLM'));
        if (externalApi?.status === 'unhealthy') {
            recommendations.push('External API is unreachable. Verify network connectivity and API status.');
            recommendations.push('Configure NEXUS_API_KEY in Supabase secrets for authentication.');
        }
        if (externalApi?.status === 'degraded') {
            recommendations.push('External API is responding slowly. Consider implementing request caching.');
        }
        if (llm?.status === 'degraded') {
            recommendations.push('LLM integration is experiencing issues. Check API quotas and rate limits.');
        }
        if (supabase?.status === 'degraded') {
            recommendations.push('Supabase Edge Functions are responding slowly. Monitor database performance.');
        }
        const unhealthyCount = services.filter(s => s.status === 'unhealthy').length;
        if (unhealthyCount > 1) {
            recommendations.push('Multiple services are unhealthy. Consider activating fallback mode.');
        }
        if (recommendations.length === 0) {
            recommendations.push('All systems are operating normally.');
        }
        return recommendations;
    }
    /**
     * Get recommended backend strategy based on health status
     */
    getRecommendedStrategy() {
        const externalApi = this.healthData.get('External API (api.joinsynapses.com)');
        const supabase = this.healthData.get('Supabase Edge Functions');
        if (externalApi?.status === 'healthy') {
            return 'external';
        }
        else if (supabase?.status === 'healthy') {
            return 'supabase';
        }
        else {
            return 'hybrid';
        }
    }
}
// Export singleton instance
export const apiHealthMonitor = new ApiHealthMonitor();
// Auto-start monitoring in production
if (typeof window !== 'undefined') {
    apiHealthMonitor.startMonitoring();
}
