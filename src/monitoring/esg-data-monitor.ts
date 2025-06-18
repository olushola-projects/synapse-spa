/**
 * ESG Data Sources Monitoring and Alerting System
 * 
 * This module provides comprehensive monitoring, alerting, and health checking
 * for the free ESG data sources integration in the Synapses SFDR Navigator Agent.
 */

import { EventEmitter } from 'events';
import { 
  getSourceConfig, 
  getFreeESGSources, 
  ESGSourceConfig,
  ESGDataQualityMetrics,
  calculateDataQualityScore 
} from '../config/esg-sources.config';
import { NayaOneESGData } from '../types/sfdr';

/**
 * Monitoring event types
 */
export enum MonitoringEventType {
  API_CALL_SUCCESS = 'api_call_success',
  API_CALL_FAILURE = 'api_call_failure',
  RATE_LIMIT_WARNING = 'rate_limit_warning',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  DATA_QUALITY_ALERT = 'data_quality_alert',
  SOURCE_UNAVAILABLE = 'source_unavailable',
  PERFORMANCE_DEGRADATION = 'performance_degradation',
  CACHE_HIT = 'cache_hit',
  CACHE_MISS = 'cache_miss',
  HEALTH_CHECK_PASSED = 'health_check_passed',
  HEALTH_CHECK_FAILED = 'health_check_failed'
}

/**
 * Alert severity levels
 */
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Monitoring event interface
 */
export interface MonitoringEvent {
  type: MonitoringEventType;
  severity: AlertSeverity;
  source: string;
  timestamp: Date;
  message: string;
  metadata?: Record<string, any>;
  duration?: number;
  error?: Error;
}

/**
 * API call metrics
 */
export interface APICallMetrics {
  source: string;
  endpoint: string;
  method: string;
  statusCode?: number;
  duration: number;
  success: boolean;
  error?: string;
  timestamp: Date;
  rateLimitRemaining?: number;
  rateLimitReset?: Date;
}

/**
 * Data quality metrics
 */
export interface DataQualityReport {
  source: string;
  recordCount: number;
  qualityScore: number;
  completeness: number;
  accuracy: number;
  timeliness: number;
  consistency: number;
  reliability: string;
  issues: string[];
  timestamp: Date;
}

/**
 * System health status
 */
export interface HealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  sources: Record<string, {
    status: 'online' | 'offline' | 'degraded';
    lastCheck: Date;
    responseTime: number;
    errorRate: number;
    rateLimitStatus: 'ok' | 'warning' | 'exceeded';
  }>;
  performance: {
    averageResponseTime: number;
    successRate: number;
    cacheHitRate: number;
  };
  dataQuality: {
    averageScore: number;
    sourceScores: Record<string, number>;
  };
  alerts: {
    active: number;
    critical: number;
    warnings: number;
  };
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  cacheHits: number;
  cacheMisses: number;
  rateLimitHits: number;
  dataPointsFetched: number;
  timeWindow: {
    start: Date;
    end: Date;
  };
}

/**
 * ESG Data Monitor Class
 */
export class ESGDataMonitor extends EventEmitter {
  private metrics: Map<string, APICallMetrics[]> = new Map();
  private qualityReports: Map<string, DataQualityReport[]> = new Map();
  private alerts: MonitoringEvent[] = [];
  private healthChecks: Map<string, Date> = new Map();
  private performanceWindow = 24 * 60 * 60 * 1000; // 24 hours
  private maxMetricsHistory = 1000;
  private maxAlertsHistory = 500;
  
  constructor() {
    super();
    this.setupEventHandlers();
    this.startPeriodicHealthChecks();
  }
  
  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    this.on(MonitoringEventType.API_CALL_FAILURE, this.handleAPIFailure.bind(this));
    this.on(MonitoringEventType.RATE_LIMIT_EXCEEDED, this.handleRateLimitExceeded.bind(this));
    this.on(MonitoringEventType.DATA_QUALITY_ALERT, this.handleDataQualityAlert.bind(this));
    this.on(MonitoringEventType.PERFORMANCE_DEGRADATION, this.handlePerformanceDegradation.bind(this));
  }
  
  /**
   * Record API call metrics
   */
  recordAPICall(metrics: APICallMetrics): void {
    const sourceMetrics = this.metrics.get(metrics.source) || [];
    sourceMetrics.push(metrics);
    
    // Keep only recent metrics
    if (sourceMetrics.length > this.maxMetricsHistory) {
      sourceMetrics.splice(0, sourceMetrics.length - this.maxMetricsHistory);
    }
    
    this.metrics.set(metrics.source, sourceMetrics);
    
    // Emit appropriate events
    if (metrics.success) {
      this.emit(MonitoringEventType.API_CALL_SUCCESS, {
        type: MonitoringEventType.API_CALL_SUCCESS,
        severity: AlertSeverity.INFO,
        source: metrics.source,
        timestamp: metrics.timestamp,
        message: `API call to ${metrics.endpoint} succeeded`,
        metadata: metrics,
        duration: metrics.duration
      });
    } else {
      this.emit(MonitoringEventType.API_CALL_FAILURE, {
        type: MonitoringEventType.API_CALL_FAILURE,
        severity: AlertSeverity.ERROR,
        source: metrics.source,
        timestamp: metrics.timestamp,
        message: `API call to ${metrics.endpoint} failed: ${metrics.error}`,
        metadata: metrics,
        duration: metrics.duration
      });
    }
    
    // Check rate limits
    if (metrics.rateLimitRemaining !== undefined) {
      this.checkRateLimits(metrics);
    }
    
    // Check performance
    this.checkPerformance(metrics.source);
  }
  
  /**
   * Record data quality report
   */
  recordDataQuality(report: DataQualityReport): void {
    const sourceReports = this.qualityReports.get(report.source) || [];
    sourceReports.push(report);
    
    // Keep only recent reports
    if (sourceReports.length > 100) {
      sourceReports.splice(0, sourceReports.length - 100);
    }
    
    this.qualityReports.set(report.source, sourceReports);
    
    // Check for quality issues
    this.checkDataQuality(report);
  }
  
  /**
   * Check rate limits and emit warnings
   */
  private checkRateLimits(metrics: APICallMetrics): void {
    if (metrics.rateLimitRemaining === 0) {
      this.emit(MonitoringEventType.RATE_LIMIT_EXCEEDED, {
        type: MonitoringEventType.RATE_LIMIT_EXCEEDED,
        severity: AlertSeverity.CRITICAL,
        source: metrics.source,
        timestamp: new Date(),
        message: `Rate limit exceeded for ${metrics.source}`,
        metadata: {
          resetTime: metrics.rateLimitReset,
          endpoint: metrics.endpoint
        }
      });
    } else if (metrics.rateLimitRemaining && metrics.rateLimitRemaining < 5) {
      this.emit(MonitoringEventType.RATE_LIMIT_WARNING, {
        type: MonitoringEventType.RATE_LIMIT_WARNING,
        severity: AlertSeverity.WARNING,
        source: metrics.source,
        timestamp: new Date(),
        message: `Rate limit warning for ${metrics.source}: ${metrics.rateLimitRemaining} requests remaining`,
        metadata: {
          remaining: metrics.rateLimitRemaining,
          resetTime: metrics.rateLimitReset
        }
      });
    }
  }
  
  /**
   * Check performance metrics
   */
  private checkPerformance(source: string): void {
    const sourceMetrics = this.metrics.get(source) || [];
    const recentMetrics = sourceMetrics.filter(
      m => Date.now() - m.timestamp.getTime() < 60 * 60 * 1000 // Last hour
    );
    
    if (recentMetrics.length < 5) return; // Need sufficient data
    
    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length;
    const errorRate = recentMetrics.filter(m => !m.success).length / recentMetrics.length;
    
    // Performance degradation thresholds
    const responseTimeThreshold = 5000; // 5 seconds
    const errorRateThreshold = 0.1; // 10%
    
    if (avgResponseTime > responseTimeThreshold || errorRate > errorRateThreshold) {
      this.emit(MonitoringEventType.PERFORMANCE_DEGRADATION, {
        type: MonitoringEventType.PERFORMANCE_DEGRADATION,
        severity: AlertSeverity.WARNING,
        source,
        timestamp: new Date(),
        message: `Performance degradation detected for ${source}`,
        metadata: {
          averageResponseTime: avgResponseTime,
          errorRate: errorRate,
          sampleSize: recentMetrics.length
        }
      });
    }
  }
  
  /**
   * Check data quality and emit alerts
   */
  private checkDataQuality(report: DataQualityReport): void {
    const qualityThreshold = 70; // Minimum acceptable quality score
    
    if (report.qualityScore < qualityThreshold) {
      this.emit(MonitoringEventType.DATA_QUALITY_ALERT, {
        type: MonitoringEventType.DATA_QUALITY_ALERT,
        severity: report.qualityScore < 50 ? AlertSeverity.CRITICAL : AlertSeverity.WARNING,
        source: report.source,
        timestamp: report.timestamp,
        message: `Data quality below threshold for ${report.source}: ${report.qualityScore}%`,
        metadata: {
          qualityScore: report.qualityScore,
          completeness: report.completeness,
          issues: report.issues,
          recordCount: report.recordCount
        }
      });
    }
  }
  
  /**
   * Perform health check for a specific source
   */
  async performHealthCheck(source: string): Promise<boolean> {
    const sourceConfig = getSourceConfig(source);
    if (!sourceConfig) {
      this.emit(MonitoringEventType.HEALTH_CHECK_FAILED, {
        type: MonitoringEventType.HEALTH_CHECK_FAILED,
        severity: AlertSeverity.ERROR,
        source,
        timestamp: new Date(),
        message: `Health check failed: Source configuration not found for ${source}`
      });
      return false;
    }
    
    try {
      const startTime = Date.now();
      let testUrl: string;
      
      // Determine test endpoint based on source
      switch (source) {
        case 'worldbank':
          testUrl = `${sourceConfig.baseUrl}/country?format=json&per_page=1`;
          break;
        case 'alphavantage':
          const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
          if (!apiKey || apiKey === 'your_alpha_vantage_api_key_here') {
            throw new Error('Alpha Vantage API key not configured');
          }
          testUrl = `${sourceConfig.baseUrl}?function=OVERVIEW&symbol=IBM&apikey=${apiKey}`;
          break;
        default:
          throw new Error(`Unknown source: ${source}`);
      }
      
      const response = await fetch(testUrl, {
        method: 'GET',
        timeout: 10000 // 10 second timeout
      });
      
      const duration = Date.now() - startTime;
      
      if (response.ok) {
        this.healthChecks.set(source, new Date());
        
        this.emit(MonitoringEventType.HEALTH_CHECK_PASSED, {
          type: MonitoringEventType.HEALTH_CHECK_PASSED,
          severity: AlertSeverity.INFO,
          source,
          timestamp: new Date(),
          message: `Health check passed for ${source}`,
          duration
        });
        
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      this.emit(MonitoringEventType.HEALTH_CHECK_FAILED, {
        type: MonitoringEventType.HEALTH_CHECK_FAILED,
        severity: AlertSeverity.ERROR,
        source,
        timestamp: new Date(),
        message: `Health check failed for ${source}: ${error}`,
        error: error as Error
      });
      
      return false;
    }
  }
  
  /**
   * Start periodic health checks
   */
  private startPeriodicHealthChecks(): void {
    const checkInterval = 5 * 60 * 1000; // 5 minutes
    
    setInterval(async () => {
      const sources = getFreeESGSources();
      for (const source of sources) {
        await this.performHealthCheck(source);
        // Add delay between checks to avoid overwhelming APIs
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }, checkInterval);
  }
  
  /**
   * Get current system health status
   */
  getHealthStatus(): HealthStatus {
    const sources = getFreeESGSources();
    const now = new Date();
    const oneHour = 60 * 60 * 1000;
    
    const sourceStatuses: Record<string, any> = {};
    let overallHealthy = true;
    
    // Analyze each source
    sources.forEach(source => {
      const sourceMetrics = this.metrics.get(source) || [];
      const recentMetrics = sourceMetrics.filter(
        m => now.getTime() - m.timestamp.getTime() < oneHour
      );
      
      const lastCheck = this.healthChecks.get(source);
      const responseTime = recentMetrics.length > 0 
        ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length 
        : 0;
      const errorRate = recentMetrics.length > 0 
        ? recentMetrics.filter(m => !m.success).length / recentMetrics.length 
        : 0;
      
      let status: 'online' | 'offline' | 'degraded' = 'online';
      if (!lastCheck || now.getTime() - lastCheck.getTime() > 10 * 60 * 1000) {
        status = 'offline';
        overallHealthy = false;
      } else if (errorRate > 0.1 || responseTime > 5000) {
        status = 'degraded';
      }
      
      // Rate limit status
      const latestMetric = recentMetrics[recentMetrics.length - 1];
      let rateLimitStatus: 'ok' | 'warning' | 'exceeded' = 'ok';
      if (latestMetric?.rateLimitRemaining === 0) {
        rateLimitStatus = 'exceeded';
      } else if (latestMetric?.rateLimitRemaining && latestMetric.rateLimitRemaining < 5) {
        rateLimitStatus = 'warning';
      }
      
      sourceStatuses[source] = {
        status,
        lastCheck: lastCheck || new Date(0),
        responseTime,
        errorRate,
        rateLimitStatus
      };
    });
    
    // Calculate overall performance
    const allMetrics = Array.from(this.metrics.values()).flat();
    const recentAllMetrics = allMetrics.filter(
      m => now.getTime() - m.timestamp.getTime() < oneHour
    );
    
    const averageResponseTime = recentAllMetrics.length > 0
      ? recentAllMetrics.reduce((sum, m) => sum + m.duration, 0) / recentAllMetrics.length
      : 0;
    const successRate = recentAllMetrics.length > 0
      ? recentAllMetrics.filter(m => m.success).length / recentAllMetrics.length
      : 1;
    
    // Calculate cache hit rate (placeholder - would need actual cache metrics)
    const cacheHitRate = 0.75; // Example value
    
    // Calculate data quality scores
    const allReports = Array.from(this.qualityReports.values()).flat();
    const recentReports = allReports.filter(
      r => now.getTime() - r.timestamp.getTime() < oneHour
    );
    
    const averageQualityScore = recentReports.length > 0
      ? recentReports.reduce((sum, r) => sum + r.qualityScore, 0) / recentReports.length
      : 100;
    
    const sourceQualityScores: Record<string, number> = {};
    sources.forEach(source => {
      const sourceReports = this.qualityReports.get(source) || [];
      const recentSourceReports = sourceReports.filter(
        r => now.getTime() - r.timestamp.getTime() < oneHour
      );
      sourceQualityScores[source] = recentSourceReports.length > 0
        ? recentSourceReports.reduce((sum, r) => sum + r.qualityScore, 0) / recentSourceReports.length
        : 100;
    });
    
    // Count alerts
    const recentAlerts = this.alerts.filter(
      a => now.getTime() - a.timestamp.getTime() < oneHour
    );
    const criticalAlerts = recentAlerts.filter(a => a.severity === AlertSeverity.CRITICAL).length;
    const warningAlerts = recentAlerts.filter(a => a.severity === AlertSeverity.WARNING).length;
    
    // Determine overall health
    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (!overallHealthy || criticalAlerts > 0 || averageQualityScore < 50) {
      overall = 'unhealthy';
    } else if (warningAlerts > 0 || averageQualityScore < 70 || successRate < 0.9) {
      overall = 'degraded';
    }
    
    return {
      overall,
      sources: sourceStatuses,
      performance: {
        averageResponseTime,
        successRate,
        cacheHitRate
      },
      dataQuality: {
        averageScore: averageQualityScore,
        sourceScores: sourceQualityScores
      },
      alerts: {
        active: recentAlerts.length,
        critical: criticalAlerts,
        warnings: warningAlerts
      }
    };
  }
  
  /**
   * Get performance metrics for a time window
   */
  getPerformanceMetrics(timeWindow?: { start: Date; end: Date }): PerformanceMetrics {
    const window = timeWindow || {
      start: new Date(Date.now() - this.performanceWindow),
      end: new Date()
    };
    
    const allMetrics = Array.from(this.metrics.values()).flat();
    const windowMetrics = allMetrics.filter(
      m => m.timestamp >= window.start && m.timestamp <= window.end
    );
    
    const totalRequests = windowMetrics.length;
    const successfulRequests = windowMetrics.filter(m => m.success).length;
    const failedRequests = totalRequests - successfulRequests;
    const averageResponseTime = totalRequests > 0
      ? windowMetrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests
      : 0;
    
    // Placeholder values for cache metrics (would need actual implementation)
    const cacheHits = Math.floor(totalRequests * 0.3);
    const cacheMisses = totalRequests - cacheHits;
    const rateLimitHits = windowMetrics.filter(m => m.rateLimitRemaining === 0).length;
    
    // Estimate data points fetched (would need actual tracking)
    const dataPointsFetched = successfulRequests * 50; // Estimate 50 data points per successful request
    
    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime,
      cacheHits,
      cacheMisses,
      rateLimitHits,
      dataPointsFetched,
      timeWindow: window
    };
  }
  
  /**
   * Get recent alerts
   */
  getRecentAlerts(limit = 50): MonitoringEvent[] {
    return this.alerts
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  /**
   * Clear old alerts and metrics
   */
  cleanup(): void {
    const cutoff = new Date(Date.now() - this.performanceWindow);
    
    // Clean up alerts
    this.alerts = this.alerts.filter(a => a.timestamp > cutoff);
    
    // Clean up metrics
    this.metrics.forEach((metrics, source) => {
      const filtered = metrics.filter(m => m.timestamp > cutoff);
      this.metrics.set(source, filtered);
    });
    
    // Clean up quality reports
    this.qualityReports.forEach((reports, source) => {
      const filtered = reports.filter(r => r.timestamp > cutoff);
      this.qualityReports.set(source, filtered);
    });
  }
  
  /**
   * Event handlers
   */
  private handleAPIFailure(event: MonitoringEvent): void {
    this.alerts.push(event);
    console.error(`[ESG Monitor] API Failure: ${event.message}`);
  }
  
  private handleRateLimitExceeded(event: MonitoringEvent): void {
    this.alerts.push(event);
    console.warn(`[ESG Monitor] Rate Limit Exceeded: ${event.message}`);
  }
  
  private handleDataQualityAlert(event: MonitoringEvent): void {
    this.alerts.push(event);
    console.warn(`[ESG Monitor] Data Quality Alert: ${event.message}`);
  }
  
  private handlePerformanceDegradation(event: MonitoringEvent): void {
    this.alerts.push(event);
    console.warn(`[ESG Monitor] Performance Degradation: ${event.message}`);
  }
}

/**
 * Global monitor instance
 */
export const esgDataMonitor = new ESGDataMonitor();

/**
 * Monitoring utilities
 */
export class MonitoringUtils {
  /**
   * Create a monitoring wrapper for API calls
   */
  static wrapAPICall<T>(
    source: string,
    endpoint: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    const timestamp = new Date();
    
    return apiCall()
      .then(result => {
        const duration = Date.now() - startTime;
        
        esgDataMonitor.recordAPICall({
          source,
          endpoint,
          method: 'GET',
          statusCode: 200,
          duration,
          success: true,
          timestamp
        });
        
        return result;
      })
      .catch(error => {
        const duration = Date.now() - startTime;
        
        esgDataMonitor.recordAPICall({
          source,
          endpoint,
          method: 'GET',
          statusCode: error.status || 500,
          duration,
          success: false,
          error: error.message,
          timestamp
        });
        
        throw error;
      });
  }
  
  /**
   * Assess and record data quality
   */
  static assessDataQuality(
    source: string,
    data: NayaOneESGData[]
  ): DataQualityReport {
    const issues: string[] = [];
    
    // Calculate completeness
    const totalFields = data.length * 10; // Estimate 10 key fields per record
    const populatedFields = data.reduce((count, record) => {
      let populated = 0;
      if (record.esgScore.overall > 0) populated++;
      if (record.esgScore.environmental > 0) populated++;
      if (record.esgScore.social > 0) populated++;
      if (record.esgScore.governance > 0) populated++;
      if (record.companyName || record.country) populated++;
      if (record.ticker) populated++;
      if (record.sector) populated++;
      if (record.lastUpdated) populated++;
      if (Object.keys(record.sfdrIndicators.principalAdverseImpacts).length > 0) populated++;
      if (record.sfdrIndicators.taxonomyAlignment > 0) populated++;
      return count + populated;
    }, 0);
    
    const completeness = totalFields > 0 ? (populatedFields / totalFields) * 100 : 0;
    
    // Check for common issues
    if (data.length === 0) {
      issues.push('No data returned');
    }
    
    const outdatedRecords = data.filter(record => {
      const lastUpdate = new Date(record.lastUpdated);
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
      return lastUpdate < sixMonthsAgo;
    }).length;
    
    if (outdatedRecords > data.length * 0.5) {
      issues.push(`${outdatedRecords} records are older than 6 months`);
    }
    
    const missingESGScores = data.filter(record => record.esgScore.overall === 0).length;
    if (missingESGScores > data.length * 0.3) {
      issues.push(`${missingESGScores} records missing ESG scores`);
    }
    
    // Calculate quality metrics
    const accuracy = 85; // Placeholder - would need validation logic
    const timeliness = Math.max(0, 100 - (outdatedRecords / data.length) * 100);
    const consistency = 80; // Placeholder - would need consistency checks
    const reliability = getSourceConfig(source)?.reliability || 'medium';
    
    const qualityMetrics: ESGDataQualityMetrics = {
      completeness,
      accuracy,
      timeliness,
      consistency,
      reliability,
      sourceCount: 1,
      lastUpdated: new Date().toISOString()
    };
    
    const qualityScore = calculateDataQualityScore(qualityMetrics);
    
    const report: DataQualityReport = {
      source,
      recordCount: data.length,
      qualityScore,
      completeness,
      accuracy,
      timeliness,
      consistency,
      reliability,
      issues,
      timestamp: new Date()
    };
    
    esgDataMonitor.recordDataQuality(report);
    
    return report;
  }
  
  /**
   * Generate monitoring dashboard data
   */
  static generateDashboardData(): {
    health: HealthStatus;
    performance: PerformanceMetrics;
    alerts: MonitoringEvent[];
    qualityTrends: Record<string, number[]>;
  } {
    const health = esgDataMonitor.getHealthStatus();
    const performance = esgDataMonitor.getPerformanceMetrics();
    const alerts = esgDataMonitor.getRecentAlerts(20);
    
    // Generate quality trends (last 7 days)
    const qualityTrends: Record<string, number[]> = {};
    const sources = getFreeESGSources();
    
    sources.forEach(source => {
      const reports = esgDataMonitor['qualityReports'].get(source) || [];
      const last7Days = reports
        .filter(r => Date.now() - r.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .map(r => r.qualityScore);
      
      qualityTrends[source] = last7Days;
    });
    
    return {
      health,
      performance,
      alerts,
      qualityTrends
    };
  }
}

export default ESGDataMonitor;