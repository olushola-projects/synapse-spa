import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor, BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-otlp-http';
import { trace, metrics, context, SpanStatusCode, SpanKind } from '@opentelemetry/api';
import { env } from './env';

// Types for telemetry
export interface TelemetryConfig {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  enableTracing: boolean;
  enableMetrics: boolean;
  enableLogging: boolean;
  exporters: {
    console: boolean;
    jaeger: boolean;
    otlp: boolean;
    prometheus: boolean;
  };
  sampling: {
    ratio: number;
    rules?: SamplingRule[];
  };
}

export interface SamplingRule {
  service?: string;
  operation?: string;
  attributes?: Record<string, string>;
  ratio: number;
}

export interface CustomMetric {
  name: string;
  description: string;
  unit?: string;
  type: 'counter' | 'histogram' | 'gauge' | 'updowncounter';
  labels?: Record<string, string>;
}

export interface TraceContext {
  traceId: string;
  spanId: string;
  userId?: string;
  sessionId?: string;
  operation: string;
  service: string;
}

class TelemetryService {
  private sdk: NodeSDK | null = null;
  private tracer = trace.getTracer('synapses-grc', '1.0.0');
  private meter = metrics.getMeter('synapses-grc', '1.0.0');
  private config: TelemetryConfig;
  private customMetrics: Map<string, any> = new Map();
  private isInitialized = false;

  constructor() {
    this.config = this.getDefaultConfig();
  }

  // Initialize telemetry
  async initialize(config?: Partial<TelemetryConfig>): Promise<void> {
    if (this.isInitialized) {
      console.warn('Telemetry already initialized');
      return;
    }

    this.config = { ...this.config, ...config };

    try {
      // Create resource
      const resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: this.config.serviceName,
        [SemanticResourceAttributes.SERVICE_VERSION]: this.config.serviceVersion,
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: this.config.environment,
        [SemanticResourceAttributes.SERVICE_NAMESPACE]: 'synapses',
        [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: this.generateInstanceId()
      });

      // Configure exporters
      const traceExporters = this.createTraceExporters();
      const metricExporters = this.createMetricExporters();

      // Create SDK
      this.sdk = new NodeSDK({
        resource,
        traceExporter: traceExporters.length > 0 ? traceExporters[0] : undefined,
        metricReader: metricExporters.length > 0 ? metricExporters[0] : undefined,
        instrumentations: [getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-fs': {
            enabled: false // Disable file system instrumentation for performance
          },
          '@opentelemetry/instrumentation-http': {
            enabled: true,
            requestHook: (span, request) => {
              span.setAttributes({
                'http.request.header.user-agent': request.getHeader('user-agent'),
                'http.request.header.x-forwarded-for': request.getHeader('x-forwarded-for')
              });
            }
          },
          '@opentelemetry/instrumentation-express': {
            enabled: true
          }
        })]
      });

      // Start SDK
      this.sdk.start();

      // Initialize custom metrics
      this.initializeCustomMetrics();

      this.isInitialized = true;
      console.log('Telemetry initialized successfully');
    } catch (error) {
      console.error('Failed to initialize telemetry:', error);
      throw error;
    }
  }

  // Shutdown telemetry
  async shutdown(): Promise<void> {
    if (this.sdk) {
      await this.sdk.shutdown();
      this.isInitialized = false;
      console.log('Telemetry shutdown completed');
    }
  }

  // Tracing methods
  startSpan(name: string, options?: {
    kind?: SpanKind;
    attributes?: Record<string, string | number | boolean>;
    parent?: any;
  }) {
    const span = this.tracer.startSpan(name, {
      kind: options?.kind || SpanKind.INTERNAL,
      attributes: options?.attributes
    }, options?.parent);

    return span;
  }

  async traceFunction<T>(
    name: string,
    fn: () => Promise<T> | T,
    options?: {
      attributes?: Record<string, string | number | boolean>;
      kind?: SpanKind;
    }
  ): Promise<T> {
    const span = this.startSpan(name, options);
    
    try {
      const result = await fn();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  }

  // Metrics methods
  incrementCounter(name: string, value: number = 1, labels?: Record<string, string>): void {
    const counter = this.getOrCreateMetric(name, 'counter');
    counter.add(value, labels);
  }

  recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
    const histogram = this.getOrCreateMetric(name, 'histogram');
    histogram.record(value, labels);
  }

  setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const gauge = this.getOrCreateMetric(name, 'gauge');
    gauge.record(value, labels);
  }

  // Business metrics
  trackUserAction(action: string, userId?: string, metadata?: Record<string, any>): void {
    this.incrementCounter('user_actions_total', 1, {
      action,
      user_id: userId || 'anonymous'
    });

    // Create span for detailed tracking
    const span = this.startSpan(`user.${action}`, {
      attributes: {
        'user.id': userId || 'anonymous',
        'user.action': action,
        ...metadata
      }
    });
    span.end();
  }

  trackAPICall(endpoint: string, method: string, statusCode: number, duration: number): void {
    this.incrementCounter('api_requests_total', 1, {
      endpoint,
      method,
      status_code: statusCode.toString()
    });

    this.recordHistogram('api_request_duration_ms', duration, {
      endpoint,
      method
    });
  }

  trackDatabaseQuery(operation: string, table: string, duration: number, success: boolean): void {
    this.incrementCounter('database_queries_total', 1, {
      operation,
      table,
      success: success.toString()
    });

    this.recordHistogram('database_query_duration_ms', duration, {
      operation,
      table
    });
  }

  trackAIModelUsage(model: string, operation: string, tokens: number, duration: number): void {
    this.incrementCounter('ai_model_requests_total', 1, {
      model,
      operation
    });

    this.recordHistogram('ai_model_tokens_used', tokens, {
      model,
      operation
    });

    this.recordHistogram('ai_model_duration_ms', duration, {
      model,
      operation
    });
  }

  trackComplianceEvent(framework: string, event: string, severity: string): void {
    this.incrementCounter('compliance_events_total', 1, {
      framework,
      event,
      severity
    });
  }

  trackSecurityEvent(event: string, severity: string, userId?: string): void {
    this.incrementCounter('security_events_total', 1, {
      event,
      severity,
      user_id: userId || 'system'
    });

    // Create detailed span for security events
    const span = this.startSpan(`security.${event}`, {
      attributes: {
        'security.event': event,
        'security.severity': severity,
        'user.id': userId || 'system'
      }
    });
    span.end();
  }

  // Error tracking
  trackError(error: Error, context?: Record<string, any>): void {
    this.incrementCounter('errors_total', 1, {
      error_type: error.constructor.name,
      error_message: error.message
    });

    const span = this.startSpan('error.occurred', {
      attributes: {
        'error.type': error.constructor.name,
        'error.message': error.message,
        'error.stack': error.stack || '',
        ...context
      }
    });
    span.recordException(error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message
    });
    span.end();
  }

  // Performance monitoring
  startPerformanceTimer(name: string): () => void {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      this.recordHistogram(`performance_${name}_duration_ms`, duration);
    };
  }

  // Context management
  getCurrentTraceContext(): TraceContext | null {
    const activeSpan = trace.getActiveSpan();
    if (!activeSpan) return null;

    const spanContext = activeSpan.spanContext();
    return {
      traceId: spanContext.traceId,
      spanId: spanContext.spanId,
      operation: activeSpan.name || 'unknown',
      service: this.config.serviceName
    };
  }

  withContext<T>(context: Record<string, any>, fn: () => T): T {
    return context.with(context.active(), fn);
  }

  // Health checks
  getHealthStatus(): {
    telemetry: 'healthy' | 'unhealthy';
    initialized: boolean;
    metrics: Record<string, number>;
  } {
    return {
      telemetry: this.isInitialized ? 'healthy' : 'unhealthy',
      initialized: this.isInitialized,
      metrics: {
        custom_metrics_count: this.customMetrics.size,
        uptime_seconds: process.uptime()
      }
    };
  }

  // Private methods
  private getDefaultConfig(): TelemetryConfig {
    return {
      serviceName: 'synapses-grc',
      serviceVersion: '1.0.0',
      environment: env.NODE_ENV || 'development',
      enableTracing: true,
      enableMetrics: true,
      enableLogging: true,
      exporters: {
        console: env.NODE_ENV === 'development',
        jaeger: env.NODE_ENV !== 'development',
        otlp: false,
        prometheus: true
      },
      sampling: {
        ratio: env.NODE_ENV === 'development' ? 1.0 : 0.1
      }
    };
  }

  private createTraceExporters(): any[] {
    const exporters = [];

    if (this.config.exporters.console) {
      exporters.push(new ConsoleSpanExporter());
    }

    if (this.config.exporters.jaeger) {
      exporters.push(new JaegerExporter({
        endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces'
      }));
    }

    if (this.config.exporters.otlp) {
      exporters.push(new OTLPTraceExporter({
        url: process.env.OTLP_TRACE_ENDPOINT || 'http://localhost:4318/v1/traces'
      }));
    }

    return exporters;
  }

  private createMetricExporters(): any[] {
    const exporters = [];

    if (this.config.exporters.console) {
      exporters.push(new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
        exportIntervalMillis: 30000
      }));
    }

    if (this.config.exporters.prometheus) {
      exporters.push(new PrometheusExporter({
        port: parseInt(process.env.PROMETHEUS_PORT || '9090'),
        endpoint: '/metrics'
      }));
    }

    if (this.config.exporters.otlp) {
      exporters.push(new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: process.env.OTLP_METRIC_ENDPOINT || 'http://localhost:4318/v1/metrics'
        }),
        exportIntervalMillis: 30000
      }));
    }

    return exporters;
  }

  private initializeCustomMetrics(): void {
    // Initialize common business metrics
    const metrics = [
      { name: 'user_actions_total', type: 'counter', description: 'Total user actions' },
      { name: 'api_requests_total', type: 'counter', description: 'Total API requests' },
      { name: 'api_request_duration_ms', type: 'histogram', description: 'API request duration' },
      { name: 'database_queries_total', type: 'counter', description: 'Total database queries' },
      { name: 'database_query_duration_ms', type: 'histogram', description: 'Database query duration' },
      { name: 'ai_model_requests_total', type: 'counter', description: 'Total AI model requests' },
      { name: 'ai_model_tokens_used', type: 'histogram', description: 'AI model tokens used' },
      { name: 'ai_model_duration_ms', type: 'histogram', description: 'AI model request duration' },
      { name: 'compliance_events_total', type: 'counter', description: 'Total compliance events' },
      { name: 'security_events_total', type: 'counter', description: 'Total security events' },
      { name: 'errors_total', type: 'counter', description: 'Total errors' },
      { name: 'active_users', type: 'gauge', description: 'Currently active users' },
      { name: 'system_memory_usage', type: 'gauge', description: 'System memory usage' },
      { name: 'system_cpu_usage', type: 'gauge', description: 'System CPU usage' }
    ];

    metrics.forEach(metric => {
      this.getOrCreateMetric(metric.name, metric.type as any, metric.description);
    });
  }

  private getOrCreateMetric(name: string, type: 'counter' | 'histogram' | 'gauge' | 'updowncounter', description?: string): any {
    if (this.customMetrics.has(name)) {
      return this.customMetrics.get(name);
    }

    let metric;
    switch (type) {
      case 'counter':
        metric = this.meter.createCounter(name, { description });
        break;
      case 'histogram':
        metric = this.meter.createHistogram(name, { description });
        break;
      case 'gauge':
        metric = this.meter.createObservableGauge(name, { description });
        break;
      case 'updowncounter':
        metric = this.meter.createUpDownCounter(name, { description });
        break;
      default:
        throw new Error(`Unknown metric type: ${type}`);
    }

    this.customMetrics.set(name, metric);
    return metric;
  }

  private generateInstanceId(): string {
    return `${this.config.serviceName}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }
}

// Create singleton instance
export const telemetryService = new TelemetryService();

// Convenience functions
export const trace = (name: string, fn: () => any, options?: any) => 
  telemetryService.traceFunction(name, fn, options);

export const trackUserAction = (action: string, userId?: string, metadata?: Record<string, any>) =>
  telemetryService.trackUserAction(action, userId, metadata);

export const trackError = (error: Error, context?: Record<string, any>) =>
  telemetryService.trackError(error, context);

export const startTimer = (name: string) => telemetryService.startPerformanceTimer(name);

export default telemetryService;