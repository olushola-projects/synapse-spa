import { MONITORING_CONSTANTS } from '@/utils/constants';

export type MetricType = 'load' | 'memory' | 'cpu' | 'api_success' | 'api_latency';
export type MetricStatus = 'healthy' | 'warning' | 'critical';

interface MetricThresholds {
  WARNING_THRESHOLD?: number;
  CRITICAL_THRESHOLD?: number;
  WARNING_THRESHOLD_MB?: number;
  CRITICAL_THRESHOLD_MB?: number;
  WARNING_THRESHOLD_PERCENT?: number;
  CRITICAL_THRESHOLD_PERCENT?: number;
  WARNING_MS?: number;
  CRITICAL_MS?: number;
  isHigherBetter?: boolean;
}

function evaluateMetric(value: number, thresholds: MetricThresholds): MetricStatus {
  const { 
    WARNING_THRESHOLD, 
    CRITICAL_THRESHOLD, 
    WARNING_THRESHOLD_MB, 
    CRITICAL_THRESHOLD_MB,
    WARNING_THRESHOLD_PERCENT,
    CRITICAL_THRESHOLD_PERCENT,
    WARNING_MS,
    CRITICAL_MS,
    isHigherBetter = false 
  } = thresholds;

  // Use the appropriate threshold based on what's available
  const warningThreshold = WARNING_THRESHOLD || WARNING_THRESHOLD_MB || WARNING_THRESHOLD_PERCENT || WARNING_MS;
  const criticalThreshold = CRITICAL_THRESHOLD || CRITICAL_THRESHOLD_MB || CRITICAL_THRESHOLD_PERCENT || CRITICAL_MS;

  if (warningThreshold === undefined || criticalThreshold === undefined) {
    return 'healthy'; // Default to healthy if thresholds are not defined
  }

  if (isHigherBetter) {
    if (value >= criticalThreshold) {
      return 'healthy';
    }
    if (value >= warningThreshold) {
      return 'warning';
    }
    return 'critical';
  }

  if (value <= warningThreshold) {
    return 'healthy';
  }
  if (value <= criticalThreshold) {
    return 'warning';
  }
  return 'critical';
}

export function getMetricStatus(value: number, type: MetricType): MetricStatus {
  const thresholds = {
    load: MONITORING_CONSTANTS.METRICS.LOAD,
    memory: MONITORING_CONSTANTS.METRICS.MEMORY,
    cpu: MONITORING_CONSTANTS.METRICS.CPU,
    api_success: { ...MONITORING_CONSTANTS.METRICS.API.SUCCESS_RATE, isHigherBetter: true },
    api_latency: MONITORING_CONSTANTS.METRICS.API.LATENCY
  };

  return evaluateMetric(value, thresholds[type]);
}
