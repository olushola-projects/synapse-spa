import { MONITORING_CONSTANTS } from '@/utils/constants';
function evaluateMetric(value, thresholds) {
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
  const warningThreshold =
    WARNING_THRESHOLD || WARNING_THRESHOLD_MB || WARNING_THRESHOLD_PERCENT || WARNING_MS;
  const criticalThreshold =
    CRITICAL_THRESHOLD || CRITICAL_THRESHOLD_MB || CRITICAL_THRESHOLD_PERCENT || CRITICAL_MS;
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
export function getMetricStatus(value, type) {
  const thresholds = {
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
      WARNING_THRESHOLD: MONITORING_CONSTANTS.METRICS.API.SUCCESS_RATE.WARNING_THRESHOLD,
      CRITICAL_THRESHOLD: MONITORING_CONSTANTS.METRICS.API.SUCCESS_RATE.CRITICAL_THRESHOLD,
      isHigherBetter: true
    },
    api_latency: {
      WARNING_THRESHOLD: MONITORING_CONSTANTS.METRICS.API.LATENCY.WARNING_MS,
      CRITICAL_THRESHOLD: MONITORING_CONSTANTS.METRICS.API.LATENCY.CRITICAL_MS
    }
  };
  return evaluateMetric(value, thresholds[type]);
}
