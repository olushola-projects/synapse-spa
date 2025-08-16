import { MONITORING_CONSTANTS } from '@/utils/constants';

export type MetricType = 'load' | 'memory' | 'cpu' | 'api_success' | 'api_latency';
export type MetricStatus = 'healthy' | 'warning' | 'critical';

interface MetricThresholds {
  WARNING_THRESHOLD: number;
  CRITICAL_THRESHOLD: number;
  isHigherBetter?: boolean;
}

function evaluateMetric(value: number, thresholds: MetricThresholds): MetricStatus {
  const { WARNING_THRESHOLD, CRITICAL_THRESHOLD, isHigherBetter = false } = thresholds;

  if (isHigherBetter) {
    if (value >= CRITICAL_THRESHOLD) {
      return 'healthy';
    }
    if (value >= WARNING_THRESHOLD) {
      return 'warning';
    }
    return 'critical';
  }

  if (value <= WARNING_THRESHOLD) {
    return 'healthy';
  }
  if (value <= CRITICAL_THRESHOLD) {
    return 'warning';
  }
  return 'critical';
}

export function getMetricStatus(value: number, type: MetricType): MetricStatus {
  const thresholds: Record<MetricType, MetricThresholds> = {
    load: {
      WARNING_THRESHOLD: MONITORING_CONSTANTS.METRICS.LOAD.WARNING_THRESHOLD,
      CRITICAL_THRESHOLD: MONITORING_CONSTANTS.METRICS.LOAD.CRITICAL_THRESHOLD
    },
    memory: {
      WARNING_THRESHOLD: MONITORING_CONSTANTS.METRICS.MEMORY.WARNING_THRESHOLD_MB,
      CRITICAL_THRESHOLD: MONITORING_CONSTANTS.METRICS.MEMORY.CRITICAL_THRESHOLD_MB
    },
    cpu: {
      WARNING_THRESHOLD: MONITORING_CONSTANTS.METRICS.CPU.WARNING_THRESHOLD_PERCENT,
      CRITICAL_THRESHOLD: MONITORING_CONSTANTS.METRICS.CPU.CRITICAL_THRESHOLD_PERCENT
    },
    api_success: {
      WARNING_THRESHOLD: MONITORING_CONSTANTS.METRICS.API.WARNING_THRESHOLD,
      CRITICAL_THRESHOLD: MONITORING_CONSTANTS.METRICS.API.CRITICAL_THRESHOLD,
      isHigherBetter: true
    },
    api_latency: {
      WARNING_THRESHOLD: MONITORING_CONSTANTS.METRICS.API_LATENCY.WARNING_MS,
      CRITICAL_THRESHOLD: MONITORING_CONSTANTS.METRICS.API_LATENCY.CRITICAL_MS
    }
  };

  return evaluateMetric(value, thresholds[type]);
}
