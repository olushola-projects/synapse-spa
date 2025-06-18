import { securityService } from './SecurityService';
import { EnhancedLLMService } from './EnhancedLLMService';
import { z } from 'zod';

// Enhanced schemas with Zod validation
const DataSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['api', 'file', 'database', 'stream']),
  url: z.string().url().optional(),
  credentials: z.object({
    apiKey: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    token: z.string().optional()
  }).optional(),
  refreshInterval: z.number().positive(),
  isActive: z.boolean(),
  lastSync: z.date().optional(),
  dataFormat: z.enum(['json', 'xml', 'csv', 'excel']),
  schema: z.any().optional(),
  transformations: z.array(z.any()).optional(),
  healthStatus: z.enum(['healthy', 'degraded', 'unhealthy']).default('healthy'),
  retryConfig: z.object({
    maxRetries: z.number().default(3),
    backoffMs: z.number().default(1000)
  }).default({})
});

// Data source configuration
interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'file' | 'database' | 'stream';
  url?: string;
  credentials?: {
    apiKey?: string;
    username?: string;
    password?: string;
    token?: string;
  };
  refreshInterval: number; // milliseconds
  isActive: boolean;
  lastSync?: Date;
  dataFormat: 'json' | 'xml' | 'csv' | 'excel';
  schema?: any;
  transformations?: DataTransformation[];
  healthStatus?: 'healthy' | 'degraded' | 'unhealthy';
  retryConfig?: {
    maxRetries: number;
    backoffMs: number;
  };
}

// Data transformation rules
interface DataTransformation {
  id: string;
  type: 'filter' | 'map' | 'aggregate' | 'validate' | 'enrich';
  config: any;
  order: number;
  performance?: {
    avgProcessingTime: number;
    successRate: number;
  };
}

// Data quality metrics
interface DataQualityMetrics {
  completeness: number; // 0-100
  accuracy: number; // 0-100
  consistency: number; // 0-100
  timeliness: number; // 0-100
  validity: number; // 0-100
  overall: number; // 0-100
  issues: DataQualityIssue[];
}

interface DataQualityIssue {
  type: 'missing_data' | 'invalid_format' | 'duplicate' | 'outdated' | 'inconsistent';
  field: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  resolved?: boolean;
  resolutionAction?: string;
}

// Pipeline job
interface PipelineJob {
  id: string;
  sourceId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  errors: string[];
  qualityMetrics?: DataQualityMetrics;
  retryCount?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

// Real-time data event
interface DataEvent {
  id: string;
  sourceId: string;
  type: 'regulatory_update' | 'market_data' | 'esg_data' | 'compliance_alert';
  data: any;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  processed: boolean;
}

// Circuit Breaker for data source reliability
class DataSourceCircuitBreaker {
  private failures: Map<string, number> = new Map();
  private lastFailureTime: Map<string, Date> = new Map();
  private readonly failureThreshold = 5;
  private readonly timeoutMs = 30000; // 30 seconds

  async execute<T>(sourceId: string, operation: () => Promise<T>): Promise<T> {
    if (this.isCircuitOpen(sourceId)) {
      throw new Error(`Circuit breaker open for data source: ${sourceId}`);
    }

    try {
      const result = await operation();
      this.onSuccess(sourceId);
      return result;
    } catch (error) {
      this.onFailure(sourceId);
      throw error;
    }
  }

  private isCircuitOpen(sourceId: string): boolean {
    const failures = this.failures.get(sourceId) || 0;
    const lastFailure = this.lastFailureTime.get(sourceId);
    
    if (failures >= this.failureThreshold) {
      if (lastFailure && Date.now() - lastFailure.getTime() > this.timeoutMs) {
        this.failures.set(sourceId, 0); // Reset after timeout
        return false;
      }
      return true;
    }
    return false;
  }

  private onSuccess(sourceId: string): void {
    this.failures.set(sourceId, 0);
    this.lastFailureTime.delete(sourceId);
  }

  private onFailure(sourceId: string): void {
    const currentFailures = this.failures.get(sourceId) || 0;
    this.failures.set(sourceId, currentFailures + 1);
    this.lastFailureTime.set(sourceId, new Date());
  }
}

class DataPipelineService {
  private dataSources: Map<string, DataSource> = new Map();
  private activeJobs: Map<string, PipelineJob> = new Map();
  private dataEvents: DataEvent[] = [];
  private llmService: EnhancedLLMService;
  private eventListeners: Map<string, Function[]> = new Map();
  private circuitBreaker: DataSourceCircuitBreaker;
  private cache: Map<string, { data: any; timestamp: Date; ttl: number }> = new Map();
  private batchProcessor: Map<string, any[]> = new Map();
  private readonly batchSize = 100;
  private readonly batchTimeoutMs = 5000;

  constructor() {
    this.llmService = new EnhancedLLMService();
    this.circuitBreaker = new DataSourceCircuitBreaker();
    this.initializeDefaultSources();
    this.startEventProcessor();
    this.startBatchProcessor();
  }

  // Initialize default regulatory data sources
  private initializeDefaultSources(): void {
    const defaultSources: DataSource[] = [
      {
        id: 'esma-updates',
        name: 'European Securities and Markets Authority',
        type: 'api',
        url: 'https://www.esma.europa.eu/api/regulatory-updates',
        refreshInterval: 3600000, // 1 hour
        isActive: true,
        dataFormat: 'json',
        healthStatus: 'healthy',
        retryConfig: { maxRetries: 3, backoffMs: 1000 },
        transformations: [
          {
            id: 'esma-filter',
            type: 'filter',
            config: { categories: ['SFDR', 'MiFID II', 'EMIR'] },
            order: 1
          },
          {
            id: 'esma-enrich',
            type: 'enrich',
            config: { addMetadata: true, extractEntities: true },
            order: 2
          }
        ]
      },
      {
        id: 'fca-updates',
        name: 'Financial Conduct Authority',
        type: 'api',
        url: 'https://www.fca.org.uk/api/regulatory-updates',
        refreshInterval: 3600000, // 1 hour
        isActive: true,
        dataFormat: 'json',
        healthStatus: 'healthy',
        retryConfig: { maxRetries: 5, backoffMs: 2000 },
        transformations: [
          {
            id: 'fca-filter',
            type: 'filter',
            config: { categories: ['Consumer Duty', 'ESG', 'Operational Resilience'] },
            order: 1
          }
        ]
      },
      {
        id: 'esg-data-feed',
        name: 'ESG Data Provider',
        type: 'stream',
        url: 'wss://esg-data-provider.com/stream',
        refreshInterval: 300000, // 5 minutes
        isActive: true,
        dataFormat: 'json',
        healthStatus: 'healthy',
        retryConfig: { maxRetries: 3, backoffMs: 1000 },
        transformations: [
          {
            id: 'esg-validate',
            type: 'validate',
            config: { schema: 'esg-data-schema' },
            order: 1
          },
          {
            id: 'esg-aggregate',
            type: 'aggregate',
            config: { groupBy: 'entity', metrics: ['carbon_intensity', 'water_usage'] },
            order: 2
          }
        ]
      },
      {
        id: 'market-data',
        name: 'Market Data Feed',
        type: 'api',
        url: 'https://api.marketdata.com/v1/regulatory',
        refreshInterval: 900000, // 15 minutes
        isActive: true,
        dataFormat: 'json',
        healthStatus: 'healthy',
        retryConfig: { maxRetries: 2, backoffMs: 500 },
        credentials: {
          apiKey: process.env.VITE_MARKET_DATA_API_KEY
        }
      }
    ];

    defaultSources.forEach(source => {
      try {
        const validatedSource = DataSourceSchema.parse(source);
        this.dataSources.set(source.id, validatedSource);
      } catch (error) {
        console.error(`Failed to validate data source ${source.id}:`, error);
      }
    });
  }

  // Add or update data source
  addDataSource(source: DataSource): void {
    // Encrypt sensitive credentials
    if (source.credentials) {
      const encryptedCredentials = {
        ...source.credentials,
        apiKey: source.credentials.apiKey ? securityService.encryptData(source.credentials.apiKey) : undefined,
        password: source.credentials.password ? securityService.encryptData(source.credentials.password) : undefined,
        token: source.credentials.token ? securityService.encryptData(source.credentials.token) : undefined,
      };
      source.credentials = encryptedCredentials;
    }

    this.dataSources.set(source.id, source);
    
    securityService.logAuditEvent({
      userId: 'system',
      action: 'data_source_added',
      resource: 'data_pipeline',
      riskLevel: 'medium',
      details: { sourceId: source.id, sourceName: source.name }
    });
  }

  // Start data ingestion for a source
  async startIngestion(sourceId: string): Promise<string> {
    const source = this.dataSources.get(sourceId);
    if (!source) {
      throw new Error(`Data source ${sourceId} not found`);
    }

    const jobId = this.generateJobId();
    const job: PipelineJob = {
      id: jobId,
      sourceId,
      status: 'pending',
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      errors: []
    };

    this.activeJobs.set(jobId, job);

    try {
      job.status = 'running';
      job.startTime = new Date();

      const rawData = await this.fetchData(source);
      const transformedData = await this.transformData(rawData, source.transformations || []);
      const qualityMetrics = await this.assessDataQuality(transformedData);
      
      job.qualityMetrics = qualityMetrics;
      job.recordsProcessed = Array.isArray(transformedData) ? transformedData.length : 1;
      job.recordsSuccessful = job.recordsProcessed;
      
      // Store processed data
      await this.storeData(sourceId, transformedData, qualityMetrics);
      
      // Generate data events for real-time processing
      await this.generateDataEvents(sourceId, transformedData);
      
      job.status = 'completed';
      job.endTime = new Date();
      
      // Update source last sync time
      source.lastSync = new Date();
      
      securityService.logAuditEvent({
        userId: 'system',
        action: 'data_ingestion_completed',
        resource: 'data_pipeline',
        riskLevel: 'low',
        details: { 
          sourceId, 
          jobId, 
          recordsProcessed: job.recordsProcessed,
          qualityScore: qualityMetrics.overall
        }
      });
      
    } catch (error) {
      job.status = 'failed';
      job.endTime = new Date();
      job.errors.push(error instanceof Error ? error.message : 'Unknown error');
      
      securityService.logAuditEvent({
        userId: 'system',
        action: 'data_ingestion_failed',
        resource: 'data_pipeline',
        riskLevel: 'high',
        details: { sourceId, jobId, error: job.errors[0] }
      });
    }

    return jobId;
  }

  // Fetch data from source with enhanced error handling and caching
  private async fetchData(source: DataSource): Promise<any> {
    // Check cache first
    const cacheKey = `data-${source.id}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    return await this.circuitBreaker.execute(source.id, async () => {
      try {
        let data;
        switch (source.type) {
          case 'api':
            data = await this.fetchFromAPIWithRetry(source);
            break;
          case 'file':
            data = await this.fetchFromFile(source);
            break;
          case 'database':
            data = await this.fetchFromDatabase(source);
            break;
          case 'stream':
            data = await this.fetchFromStreamEnhanced(source);
            break;
          default:
            throw new Error(`Unsupported source type: ${source.type}`);
        }

        // Validate data structure
        const validatedData = await this.validateDataStructure(data, source);
        
        // Cache the result
        this.setCache(cacheKey, validatedData, source.refreshInterval || 3600000);
        
        // Update source health status
        this.updateSourceHealth(source.id, 'healthy');
        
        return validatedData;
      } catch (error) {
        this.updateSourceHealth(source.id, 'unhealthy');
        throw error;
      }
    });
  }

  private async fetchFromAPIWithRetry(source: DataSource): Promise<any> {
    const maxRetries = source.retryConfig?.maxRetries || 3;
    const backoffMs = source.retryConfig?.backoffMs || 1000;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.fetchFromAPI(source);
      } catch (error) {
        if (attempt === maxRetries) throw error;
        await this.exponentialBackoff(attempt, backoffMs);
      }
    }
  }

  private async exponentialBackoff(attempt: number, baseMs: number): Promise<void> {
    const delay = baseMs * Math.pow(2, attempt - 1) + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = new Date();
    if (now.getTime() - cached.timestamp.getTime() > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  private setCache(key: string, data: any, ttlMs: number): void {
    this.cache.set(key, {
      data,
      timestamp: new Date(),
      ttl: ttlMs
    });
  }

  private async validateDataStructure(data: any, source: DataSource): Promise<any> {
    if (!source.schema) return data;
    
    try {
      // Use Zod schema validation if available
      if (source.schema.parse) {
        return source.schema.parse(data);
      }
      
      // Basic structure validation
      if (Array.isArray(data)) {
        return data.filter(item => item && typeof item === 'object');
      }
      
      return data;
    } catch (error) {
      throw new Error(`Data validation failed for source ${source.id}: ${error}`);
    }
  }

  private updateSourceHealth(sourceId: string, status: 'healthy' | 'degraded' | 'unhealthy'): void {
    const source = this.dataSources.get(sourceId);
    if (source) {
      source.healthStatus = status;
    }
  }

  private async fetchFromAPI(source: DataSource): Promise<any> {
    if (!source.url) throw new Error('API URL not configured');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Synapses-DataPipeline/1.0'
    };

    // Add authentication headers
    if (source.credentials?.apiKey) {
      const decryptedKey = securityService.decryptData(source.credentials.apiKey);
      headers['Authorization'] = `Bearer ${decryptedKey}`;
    }

    const response = await fetch(source.url, { headers });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  private async fetchFromFile(source: DataSource): Promise<any> {
    // Implementation for file-based data sources
    throw new Error('File data source not implemented yet');
  }

  private async fetchFromDatabase(source: DataSource): Promise<any> {
    // Implementation for database data sources
    throw new Error('Database data source not implemented yet');
  }

  private async fetchFromStreamEnhanced(source: DataSource): Promise<any> {
    // Enhanced implementation for streaming data sources
    return new Promise((resolve, reject) => {
      // Placeholder for stream implementation with WebSocket/SSE support
      const timeout = setTimeout(() => {
        resolve({ streamData: 'placeholder', timestamp: new Date(), sourceId: source.id });
      }, 1000);
      
      // In production, implement actual WebSocket/SSE connection
      // const ws = new WebSocket(source.url);
      // ws.onmessage = (event) => {
      //   clearTimeout(timeout);
      //   resolve(JSON.parse(event.data));
      // };
      // ws.onerror = (error) => {
      //   clearTimeout(timeout);
      //   reject(error);
      // };
    });
  }

  // Transform data using configured transformations
  private async transformData(data: any, transformations: DataTransformation[]): Promise<any> {
    let transformedData = data;
    
    // Sort transformations by order
    const sortedTransformations = transformations.sort((a, b) => a.order - b.order);
    
    for (const transformation of sortedTransformations) {
      transformedData = await this.applyTransformation(transformedData, transformation);
    }
    
    return transformedData;
  }

  private async applyTransformation(data: any, transformation: DataTransformation): Promise<any> {
    switch (transformation.type) {
      case 'filter':
        return this.filterData(data, transformation.config);
      case 'map':
        return this.mapData(data, transformation.config);
      case 'aggregate':
        return this.aggregateData(data, transformation.config);
      case 'validate':
        return this.validateData(data, transformation.config);
      case 'enrich':
        return await this.enrichData(data, transformation.config);
      default:
        return data;
    }
  }

  private filterData(data: any, config: any): any {
    if (!Array.isArray(data)) return data;
    
    return data.filter(item => {
      if (config.categories && item.category) {
        return config.categories.includes(item.category);
      }
      return true;
    });
  }

  private mapData(data: any, config: any): any {
    if (!Array.isArray(data)) return data;
    
    return data.map(item => {
      const mapped = { ...item };
      if (config.fieldMappings) {
        Object.entries(config.fieldMappings).forEach(([oldField, newField]) => {
          if (item[oldField] !== undefined) {
            mapped[newField as string] = item[oldField];
            delete mapped[oldField];
          }
        });
      }
      return mapped;
    });
  }

  private aggregateData(data: any, config: any): any {
    if (!Array.isArray(data)) return data;
    
    const grouped = data.reduce((acc, item) => {
      const key = config.groupBy ? item[config.groupBy] : 'all';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
    
    return Object.entries(grouped).map(([key, items]) => ({
      [config.groupBy || 'group']: key,
      count: (items as any[]).length,
      ...this.calculateMetrics(items as any[], config.metrics || [])
    }));
  }

  private calculateMetrics(items: any[], metrics: string[]): any {
    const result: any = {};
    
    metrics.forEach(metric => {
      const values = items.map(item => item[metric]).filter(v => v !== undefined && v !== null);
      if (values.length > 0) {
        result[`${metric}_avg`] = values.reduce((a, b) => a + b, 0) / values.length;
        result[`${metric}_sum`] = values.reduce((a, b) => a + b, 0);
        result[`${metric}_min`] = Math.min(...values);
        result[`${metric}_max`] = Math.max(...values);
      }
    });
    
    return result;
  }

  private validateData(data: any, config: any): any {
    // Basic validation - in production, use a proper schema validator
    if (config.schema && config.schema === 'esg-data-schema') {
      if (Array.isArray(data)) {
        return data.filter(item => 
          item.entity && 
          item.timestamp && 
          (item.carbon_intensity !== undefined || item.water_usage !== undefined)
        );
      }
    }
    return data;
  }

  private async enrichData(data: any, config: any): Promise<any> {
    if (!config.extractEntities && !config.addMetadata) return data;
    
    if (Array.isArray(data)) {
      return Promise.all(data.map(async item => {
        let enriched = { ...item };
        
        if (config.addMetadata) {
          enriched.metadata = {
            processedAt: new Date().toISOString(),
            source: 'data-pipeline',
            version: '1.0'
          };
        }
        
        if (config.extractEntities && item.description) {
          try {
            const entities = await this.extractEntities(item.description);
            enriched.extractedEntities = entities;
          } catch (error) {
            console.warn('Entity extraction failed:', error);
          }
        }
        
        return enriched;
      }));
    }
    
    return data;
  }

  private async extractEntities(text: string): Promise<any[]> {
    const prompt = `
      Extract regulatory entities, organizations, and key terms from the following text:
      "${text}"
      
      Return a JSON array of entities with type and confidence score.
    `;

    try {
      const response = await this.llmService.generateResponse({
        prompt,
        model: 'gemini-2.5-pro',
        purpose: 'entity_extraction'
      });
      
      return JSON.parse(response.content || '[]');
    } catch (error) {
      return [];
    }
  }

  // Assess data quality
  private async assessDataQuality(data: any): Promise<DataQualityMetrics> {
    const issues: DataQualityIssue[] = [];
    let completeness = 100;
    let accuracy = 100;
    let consistency = 100;
    let timeliness = 100;
    let validity = 100;

    if (Array.isArray(data)) {
      const totalRecords = data.length;
      
      // Check completeness
      const incompleteRecords = data.filter(item => 
        !item.id || !item.timestamp || Object.values(item).some(v => v === null || v === undefined)
      ).length;
      
      if (incompleteRecords > 0) {
        completeness = Math.max(0, 100 - (incompleteRecords / totalRecords) * 100);
        issues.push({
          type: 'missing_data',
          field: 'various',
          description: 'Some records have missing required fields',
          severity: incompleteRecords / totalRecords > 0.1 ? 'high' : 'medium',
          count: incompleteRecords
        });
      }
      
      // Check for duplicates
      const uniqueIds = new Set(data.map(item => item.id).filter(Boolean));
      const duplicates = totalRecords - uniqueIds.size;
      
      if (duplicates > 0) {
        consistency = Math.max(0, 100 - (duplicates / totalRecords) * 100);
        issues.push({
          type: 'duplicate',
          field: 'id',
          description: 'Duplicate records found',
          severity: duplicates / totalRecords > 0.05 ? 'high' : 'medium',
          count: duplicates
        });
      }
      
      // Check timeliness
      const now = new Date();
      const outdatedRecords = data.filter(item => {
        if (!item.timestamp) return false;
        const recordDate = new Date(item.timestamp);
        const daysDiff = (now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff > 30; // Consider records older than 30 days as outdated
      }).length;
      
      if (outdatedRecords > 0) {
        timeliness = Math.max(0, 100 - (outdatedRecords / totalRecords) * 100);
        issues.push({
          type: 'outdated',
          field: 'timestamp',
          description: 'Some records are outdated',
          severity: outdatedRecords / totalRecords > 0.2 ? 'high' : 'low',
          count: outdatedRecords
        });
      }
    }

    const overall = (completeness + accuracy + consistency + timeliness + validity) / 5;

    return {
      completeness,
      accuracy,
      consistency,
      timeliness,
      validity,
      overall,
      issues
    };
  }

  // Store processed data
  private async storeData(sourceId: string, data: any, qualityMetrics: DataQualityMetrics): Promise<void> {
    // In production, store in appropriate database/data lake
    const storageKey = `${sourceId}_${Date.now()}`;
    
    try {
      // Classify and encrypt sensitive data
      const classifiedData = securityService.classifyData(data, {
        level: 'confidential',
        retention: 365,
        encryption: true,
        accessControl: ['regulatory_team', 'compliance_officers']
      });
      
      // Store in localStorage for demo (use proper storage in production)
      localStorage.setItem(`pipeline_data_${storageKey}`, classifiedData);
      localStorage.setItem(`pipeline_quality_${storageKey}`, JSON.stringify(qualityMetrics));
      
    } catch (error) {
      throw new Error(`Failed to store data: ${error}`);
    }
  }

  // Generate real-time data events
  private async generateDataEvents(sourceId: string, data: any): Promise<void> {
    if (!Array.isArray(data)) return;
    
    for (const item of data) {
      const event: DataEvent = {
        id: this.generateEventId(),
        sourceId,
        type: this.determineEventType(item),
        data: item,
        timestamp: new Date(),
        priority: this.determinePriority(item),
        processed: false
      };
      
      this.dataEvents.push(event);
      this.notifyEventListeners(event);
    }
  }

  private determineEventType(data: any): DataEvent['type'] {
    if (data.category?.includes('regulatory') || data.type === 'regulation') {
      return 'regulatory_update';
    }
    if (data.category?.includes('esg') || data.carbon_intensity !== undefined) {
      return 'esg_data';
    }
    if (data.category?.includes('compliance') || data.alert_type) {
      return 'compliance_alert';
    }
    return 'market_data';
  }

  private determinePriority(data: any): DataEvent['priority'] {
    if (data.severity === 'critical' || data.alert_level === 'high') {
      return 'critical';
    }
    if (data.severity === 'high' || data.alert_level === 'medium') {
      return 'high';
    }
    if (data.severity === 'medium') {
      return 'medium';
    }
    return 'low';
  }

  // Event processing
  private startEventProcessor(): void {
    setInterval(() => {
      this.processEvents();
    }, 5000); // Process events every 5 seconds
  }

  private startBatchProcessor(): void {
    setInterval(() => {
      this.processBatches();
    }, this.batchTimeoutMs);
  }

  private async processBatches(): Promise<void> {
    for (const [sourceId, batch] of this.batchProcessor.entries()) {
      if (batch.length >= this.batchSize || batch.length > 0) {
        try {
          await this.processBatch(sourceId, batch);
          this.batchProcessor.set(sourceId, []);
        } catch (error) {
          console.error(`Batch processing failed for ${sourceId}:`, error);
        }
      }
    }
  }

  private async processBatch(sourceId: string, batch: any[]): Promise<void> {
    // Process batch of data items
    const qualityMetrics = await this.assessDataQuality(batch);
    await this.storeData(sourceId, batch, qualityMetrics);
    await this.generateDataEvents(sourceId, batch);
  }

  private async processEvents(): Promise<void> {
    const unprocessedEvents = this.dataEvents.filter(event => !event.processed);
    
    for (const event of unprocessedEvents) {
      try {
        await this.processEvent(event);
        event.processed = true;
      } catch (error) {
        console.error('Failed to process event:', error);
      }
    }
    
    // Clean up old processed events (keep last 1000)
    if (this.dataEvents.length > 1000) {
      this.dataEvents = this.dataEvents.slice(-1000);
    }
  }

  private async processEvent(event: DataEvent): Promise<void> {
    // Process based on event type and priority
    switch (event.type) {
      case 'regulatory_update':
        await this.processRegulatoryUpdate(event);
        break;
      case 'compliance_alert':
        await this.processComplianceAlert(event);
        break;
      case 'esg_data':
        await this.processESGData(event);
        break;
      case 'market_data':
        await this.processMarketData(event);
        break;
    }
  }

  private async processRegulatoryUpdate(event: DataEvent): Promise<void> {
    // Analyze regulatory impact using LLM
    const prompt = `
      Analyze the regulatory update:
      ${JSON.stringify(event.data, null, 2)}
      
      Determine:
      1. Impact on existing compliance requirements
      2. Required actions for affected entities
      3. Timeline for implementation
      4. Risk level for non-compliance
    `;

    try {
      const analysis = await this.llmService.generateResponse({
        prompt,
        model: 'gemini-2.5-pro',
        purpose: 'regulatory_analysis'
      });
      
      // Store analysis and trigger notifications if needed
      event.data.aiAnalysis = analysis.content;
      
      if (event.priority === 'critical' || event.priority === 'high') {
        this.notifyStakeholders(event);
      }
    } catch (error) {
      console.error('Failed to analyze regulatory update:', error);
    }
  }

  private async processComplianceAlert(event: DataEvent): Promise<void> {
    // Handle compliance alerts
    securityService.logAuditEvent({
      userId: 'system',
      action: 'compliance_alert_received',
      resource: 'regulatory_compliance',
      riskLevel: event.priority === 'critical' ? 'critical' : 'high',
      details: { eventId: event.id, alertType: event.data.alert_type }
    });
  }

  private async processESGData(event: DataEvent): Promise<void> {
    // Process ESG data updates
    // Update ESG metrics, trigger recalculations if needed
  }

  private async processMarketData(event: DataEvent): Promise<void> {
    // Process market data updates
    // Update market indicators, trigger risk assessments if needed
  }

  // Event listeners
  addEventListener(eventType: string, callback: Function): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  private notifyEventListeners(event: DataEvent): void {
    const listeners = this.eventListeners.get(event.type) || [];
    listeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Event listener error:', error);
      }
    });
  }

  private notifyStakeholders(event: DataEvent): void {
    // In production, integrate with notification systems
    console.log('STAKEHOLDER NOTIFICATION:', {
      type: event.type,
      priority: event.priority,
      summary: event.data.title || event.data.description || 'Regulatory update'
    });
  }

  // Utility methods
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public API methods
  getDataSources(): DataSource[] {
    return Array.from(this.dataSources.values());
  }

  getActiveJobs(): PipelineJob[] {
    return Array.from(this.activeJobs.values());
  }

  getRecentEvents(limit: number = 50): DataEvent[] {
    return this.dataEvents.slice(-limit);
  }

  getJobStatus(jobId: string): PipelineJob | undefined {
    return this.activeJobs.get(jobId);
  }

  async scheduleIngestion(sourceId: string, intervalMs: number): Promise<void> {
    const source = this.dataSources.get(sourceId);
    if (!source) {
      throw new Error(`Data source ${sourceId} not found`);
    }

    source.refreshInterval = intervalMs;
    
    // Start periodic ingestion
    setInterval(async () => {
      if (source.isActive) {
        try {
          await this.startIngestion(sourceId);
        } catch (error) {
          console.error(`Scheduled ingestion failed for ${sourceId}:`, error);
        }
      }
    }, intervalMs);
  }

  getPipelineMetrics(): any {
    const jobs = Array.from(this.activeJobs.values());
    const events = this.dataEvents;
    
    return {
      totalJobs: jobs.length,
      completedJobs: jobs.filter(j => j.status === 'completed').length,
      failedJobs: jobs.filter(j => j.status === 'failed').length,
      runningJobs: jobs.filter(j => j.status === 'running').length,
      totalEvents: events.length,
      unprocessedEvents: events.filter(e => !e.processed).length,
      criticalEvents: events.filter(e => e.priority === 'critical').length,
      activeSources: Array.from(this.dataSources.values()).filter(s => s.isActive).length,
      averageQualityScore: this.calculateAverageQualityScore(jobs)
    };
  }

  private calculateAverageQualityScore(jobs: PipelineJob[]): number {
    const completedJobs = jobs.filter(j => j.status === 'completed' && j.qualityMetrics);
    if (completedJobs.length === 0) return 0;
    
    const totalScore = completedJobs.reduce((sum, job) => sum + (job.qualityMetrics?.overall || 0), 0);
    return totalScore / completedJobs.length;
  }
}

export const dataPipelineService = new DataPipelineService();
export default DataPipelineService;
export type { DataSource, DataTransformation, DataQualityMetrics, PipelineJob, DataEvent };