/**
 * Monitoring System Types
 * Defines interfaces for the monitoring dashboard and metrics
 */

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
  category: 'system' | 'api' | 'security' | 'compliance';
  type: 'security' | 'compliance' | 'authentication' | 'performance';
}

export interface Alert extends SystemAlert {}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  load: number;
  apiLatency: number;
  apiSuccessRate: number;
  activeAlerts: number;
  timestamp: string;
}

export interface MetricThresholds {
  WARNING_THRESHOLD: number;
  CRITICAL_THRESHOLD: number;
}

export interface ApiMetrics {
  successRate: number;
  errorRate: number;
  averageResponseTime: number;
  totalRequests: number;
  timestamp: string;
}

export interface ComplianceMetrics {
  overallScore: number;
  policyCompliance: number;
  dataQuality: number;
  auditStatus: 'pending' | 'passed' | 'failed';
  lastAudit: string;
}

export interface SecurityMetrics {
  threatLevel: 'low' | 'medium' | 'high';
  vulnerabilities: number;
  lastScan: string;
  securityScore: number;
}

export interface SystemOverview {
  systemHealth: 'healthy' | 'warning' | 'critical';
  apiStatus: 'operational' | 'degraded' | 'outage';
  activeAlerts: Alert[];
  metrics: SystemMetrics;
  overallHealth: 'healthy' | 'degraded' | 'critical';
  avgResponseTime: number;
  apiSuccessRate: number;
  complianceScore: number;
}

export interface MonitoringOverview extends SystemOverview {}

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
