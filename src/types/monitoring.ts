/**
 * Monitoring Types
 * Type definitions for system monitoring and alerting
 */

export interface SystemAlert {
  id: string;
  type: 'authentication' | 'performance' | 'compliance' | 'security' | 'error' | 'warning' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  source?: string;
  metadata?: Record<string, any>;
}

export interface SystemOverview {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  apiSuccessRate: number;
  activeAlerts: SystemAlert[];
  lastUpdated: string;
  overallHealth: 'healthy' | 'degraded' | 'critical';
  avgResponseTime: number;
  complianceScore: number;
  criticalAlerts: number;
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

export interface HealthCheck {
  timestamp: string;
  status: 'healthy' | 'degraded' | 'critical';
  responseTime: number;
  error?: string;
}

export interface PerformanceMetric {
  timestamp: string;
  value: number;
  unit: string;
  type: string;
  metadata?: Record<string, any>;
}

export interface MonitoringConfig {
  updateInterval: number;
  alertThresholds: {
    responseTime: number;
    errorRate: number;
    cpuUsage: number;
    memoryUsage: number;
  };
  enabled: boolean;
}
