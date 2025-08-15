/**
 * Monitoring System Types
 * Defines interfaces for the monitoring dashboard and metrics
 */

export interface SystemMetrics {
  cpu: number;
  memory: number;
  load: number;
  apiLatency: number;
  apiSuccessRate: number;
  activeAlerts: number;
  timestamp: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
  category: 'system' | 'api' | 'security' | 'compliance';
}

export interface Alert extends SystemAlert {}

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
}

export interface MonitoringOverview extends SystemOverview {}