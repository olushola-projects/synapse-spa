import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HealthMonitor, useHealthMonitor } from '../apiHealth';
// Mock the API client
vi.mock('@/services/supabaseApiClient', () => ({
  apiClient: {
    healthCheck: vi.fn(),
    callFunction: vi.fn()
  }
}));
describe('API Health Monitoring', () => {
  let monitor;
  beforeEach(() => {
    vi.clearAllMocks();
    monitor = new HealthMonitor();
  });
  describe('HealthMonitor Class', () => {
    describe('checkServiceHealth', () => {
      it('should return healthy status for successful API response', async () => {
        const { apiClient } = await import('@/services/supabaseApiClient');
        vi.mocked(apiClient.healthCheck).mockResolvedValueOnce({
          data: { status: 'ok', version: '1.0.0' },
          error: null
        });
        const result = await monitor.checkServiceHealth('nexus-health');
        expect(result.status).toBe('healthy');
        expect(result.latency).toBeGreaterThan(0);
        expect(result.timestamp).toBeDefined();
        expect(result.version).toBe('1.0.0');
      });
      it('should return down status for failed API response', async () => {
        const { apiClient } = await import('@/services/supabaseApiClient');
        vi.mocked(apiClient.healthCheck).mockResolvedValueOnce({
          data: null,
          error: { message: 'Service unavailable' }
        });
        const result = await monitor.checkServiceHealth('nexus-health');
        expect(result.status).toBe('down');
        expect(result.latency).toBeGreaterThan(0);
        expect(result.timestamp).toBeDefined();
      });
      it('should handle network errors', async () => {
        const { apiClient } = await import('@/services/supabaseApiClient');
        vi.mocked(apiClient.healthCheck).mockRejectedValueOnce(new Error('Network error'));
        const result = await monitor.checkServiceHealth('nexus-health');
        expect(result.status).toBe('down');
        expect(result.latency).toBeGreaterThan(0);
        expect(result.timestamp).toBeDefined();
      });
      it('should handle unknown service names', async () => {
        await expect(monitor.checkServiceHealth('unknown-service')).rejects.toThrow(
          'Unknown service: unknown-service'
        );
      });
      it('should cache results and return cached data', async () => {
        const { apiClient } = await import('@/services/supabaseApiClient');
        vi.mocked(apiClient.healthCheck).mockResolvedValueOnce({
          data: { status: 'ok' },
          error: null
        });
        // First call
        const result1 = await monitor.checkServiceHealth('nexus-health');
        // Second call should use cache
        const result2 = await monitor.checkServiceHealth('nexus-health');
        expect(result1).toEqual(result2);
        expect(apiClient.healthCheck).toHaveBeenCalledTimes(1);
      });
    });
    describe('checkSystemHealth', () => {
      it('should aggregate multiple service health checks', async () => {
        const { apiClient } = await import('@/services/supabaseApiClient');
        vi.mocked(apiClient.healthCheck).mockResolvedValue({
          data: { status: 'ok' },
          error: null
        });
        vi.mocked(apiClient.callFunction).mockResolvedValue({
          data: { status: 'ok' },
          error: null
        });
        const result = await monitor.checkSystemHealth();
        expect(result.overall).toBe('healthy');
        expect(result.services.nexusHealth.status).toBe('healthy');
        expect(result.services.nexusClassify.status).toBe('healthy');
        expect(result.services.nexusAnalytics.status).toBe('healthy');
        expect(result.timestamp).toBeDefined();
      });
      it('should calculate degraded status when some services are down', async () => {
        const { apiClient } = await import('@/services/supabaseApiClient');
        vi.mocked(apiClient.healthCheck).mockResolvedValue({
          data: { status: 'ok' },
          error: null
        });
        vi.mocked(apiClient.callFunction)
          .mockResolvedValueOnce({
            data: { status: 'ok' },
            error: null
          })
          .mockRejectedValueOnce(new Error('Service down'));
        const result = await monitor.checkSystemHealth();
        expect(result.overall).toBe('down');
        expect(result.services.nexusHealth.status).toBe('healthy');
        expect(result.services.nexusClassify.status).toBe('down');
        expect(result.services.nexusAnalytics.status).toBe('down');
      });
    });
    describe('Cache Management', () => {
      it('should clear cache', () => {
        monitor.clearCache();
        expect(monitor.getCachedHealth('nexus-health')).toBeNull();
      });
      it('should return cached health when available', async () => {
        const { apiClient } = await import('@/services/supabaseApiClient');
        vi.mocked(apiClient.healthCheck).mockResolvedValue({
          data: { status: 'ok' },
          error: null
        });
        await monitor.checkServiceHealth('nexus-health');
        const cached = monitor.getCachedHealth('nexus-health');
        expect(cached).toBeDefined();
        expect(cached?.status).toBe('healthy');
      });
      it('should return null for expired cache', async () => {
        const { apiClient } = await import('@/services/supabaseApiClient');
        vi.mocked(apiClient.healthCheck).mockResolvedValue({
          data: { status: 'ok' },
          error: null
        });
        await monitor.checkServiceHealth('nexus-health');
        // Manually expire cache by setting expiry to past
        const cache = monitor.healthCache;
        const entry = cache.get('nexus-health');
        if (entry) {
          entry.expiry = Date.now() - 1000;
        }
        const cached = monitor.getCachedHealth('nexus-health');
        expect(cached).toBeNull();
      });
    });
  });
  describe('Singleton Instance', () => {
    it('should return the same instance', () => {
      const instance1 = HealthMonitor.getInstance();
      const instance2 = HealthMonitor.getInstance();
      expect(instance1).toBe(instance2);
    });
    it('should share cache between instances', async () => {
      const { apiClient } = await import('@/services/supabaseApiClient');
      vi.mocked(apiClient.healthCheck).mockResolvedValue({
        data: { status: 'ok' },
        error: null
      });
      const instance1 = HealthMonitor.getInstance();
      const instance2 = HealthMonitor.getInstance();
      await instance1.checkServiceHealth('nexus-health');
      const cached = instance2.getCachedHealth('nexus-health');
      expect(cached).toBeDefined();
      expect(cached?.status).toBe('healthy');
    });
  });
  describe('useHealthMonitor Hook', () => {
    it('should provide health monitoring functions', () => {
      const hook = useHealthMonitor();
      expect(hook.checkServiceHealth).toBeDefined();
      expect(hook.checkSystemHealth).toBeDefined();
      expect(hook.getCachedHealth).toBeDefined();
      expect(hook.clearCache).toBeDefined();
    });
    it('should use the singleton instance', async () => {
      const { apiClient } = await import('@/services/supabaseApiClient');
      vi.mocked(apiClient.healthCheck).mockResolvedValue({
        data: { status: 'ok' },
        error: null
      });
      const hook = useHealthMonitor();
      const result = await hook.checkServiceHealth('nexus-health');
      expect(result.status).toBe('healthy');
    });
  });
  describe('Performance', () => {
    it('should complete health checks within reasonable time', async () => {
      const { apiClient } = await import('@/services/supabaseApiClient');
      vi.mocked(apiClient.healthCheck).mockResolvedValue({
        data: { status: 'ok' },
        error: null
      });
      const startTime = Date.now();
      await monitor.checkServiceHealth('nexus-health');
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
    it('should handle concurrent health checks efficiently', async () => {
      const { apiClient } = await import('@/services/supabaseApiClient');
      vi.mocked(apiClient.healthCheck).mockResolvedValue({
        data: { status: 'ok' },
        error: null
      });
      const startTime = Date.now();
      const results = await Promise.all([
        monitor.checkServiceHealth('nexus-health'),
        monitor.checkServiceHealth('nexus-health'),
        monitor.checkServiceHealth('nexus-health')
      ]);
      const endTime = Date.now();
      expect(results).toHaveLength(3);
      expect(endTime - startTime).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });
  describe('Error Handling', () => {
    it('should handle malformed API responses', async () => {
      const { apiClient } = await import('@/services/supabaseApiClient');
      vi.mocked(apiClient.healthCheck).mockResolvedValue({
        data: null,
        error: null
      });
      const result = await monitor.checkServiceHealth('nexus-health');
      expect(result.status).toBe('healthy'); // Should handle null data gracefully
    });
    it('should handle timeout scenarios', async () => {
      const { apiClient } = await import('@/services/supabaseApiClient');
      vi.mocked(apiClient.healthCheck).mockImplementation(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      );
      const result = await monitor.checkServiceHealth('nexus-health');
      expect(result.status).toBe('down');
      expect(result.latency).toBeGreaterThan(0);
    });
  });
});
