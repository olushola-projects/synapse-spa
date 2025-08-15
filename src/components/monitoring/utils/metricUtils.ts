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
  const thresholds = {
    load: MONITORING_CONSTANTS.METRICS.LOAD,
    memory: MONITORING_CONSTANTS.METRICS.MEMORY,
    cpu: MONITORING_CONSTANTS.METRICS.CPU,
    api_success: { ...MONITORING_CONSTANTS.METRICS.API.SUCCESS_RATE, isHigherBetter: true },
    api_latency: MONITORING_CONSTANTS.METRICS.API.LATENCY
  };

  return evaluateMetric(value, thresholds[type]);
}
