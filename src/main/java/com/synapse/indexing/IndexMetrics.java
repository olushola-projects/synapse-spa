package com.synapse.indexing;

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.time.Instant;
import java.time.Duration;

/**
 * Comprehensive metrics and monitoring system for code indexing operations.
 * Based on patterns from Elasticsearch monitoring, Prometheus metrics, and enterprise observability.
 * 
 * Features:
 * - Real-time performance metrics
 * - Index health monitoring
 * - Query performance analytics
 * - Storage tier utilization
 * - Compliance and audit metrics
 * 
 * @author Synapse Engineering Team
 * @version 1.0
 */
public class IndexMetrics {
    
    // Core metrics counters
    private final AtomicLong totalDocumentsIndexed = new AtomicLong(0);
    private final AtomicLong totalQueriesExecuted = new AtomicLong(0);
    private final AtomicLong totalIndexingErrors = new AtomicLong(0);
    private final AtomicLong totalQueryErrors = new AtomicLong(0);
    
    // Performance metrics
    private final AtomicLong totalIndexingTimeMs = new AtomicLong(0);
    private final AtomicLong totalQueryTimeMs = new AtomicLong(0);
    private final AtomicDouble averageIndexingTimeMs = new AtomicDouble(0.0);
    private final AtomicDouble averageQueryTimeMs = new AtomicDouble(0.0);
    
    // Storage metrics
    private final Map<CodeIndexEngine.StorageTier, AtomicLong> documentsPerTier = new ConcurrentHashMap<>();
    private final Map<CodeIndexEngine.StorageTier, AtomicLong> storageSizePerTier = new ConcurrentHashMap<>();
    private final AtomicLong totalTrigramCount = new AtomicLong(0);
    private final AtomicLong totalTokenCount = new AtomicLong(0);
    
    // Query analytics
    private final ConcurrentHashMap<String, QueryMetric> queryPatterns = new ConcurrentHashMap<>();
    private final Queue<QueryExecution> recentQueries = new ConcurrentLinkedQueue<>();
    private final AtomicLong cacheHits = new AtomicLong(0);
    private final AtomicLong cacheMisses = new AtomicLong(0);
    
    // Health metrics
    private final AtomicReference<IndexHealth> currentHealth = new AtomicReference<>(IndexHealth.GREEN);
    private final Map<String, AtomicLong> healthChecks = new ConcurrentHashMap<>();
    private final AtomicLong lastHealthCheckTime = new AtomicLong(System.currentTimeMillis());
    
    // Compliance metrics
    private final AtomicLong complianceDocumentsIndexed = new AtomicLong(0);
    private final AtomicLong complianceQueriesExecuted = new AtomicLong(0);
    private final Map<String, AtomicLong> complianceTagCounts = new ConcurrentHashMap<>();
    
    // Configuration
    private static final int MAX_RECENT_QUERIES = 1000;
    private static final long HEALTH_CHECK_INTERVAL_MS = 60000; // 1 minute
    
    /**
     * Index health status enumeration.
     */
    public enum IndexHealth {
        GREEN,   // All systems operational
        YELLOW,  // Some issues but functional
        RED      // Critical issues
    }
    
    /**
     * Initializes the metrics system with default values.
     */
    public IndexMetrics() {
        // Initialize tier counters
        for (CodeIndexEngine.StorageTier tier : CodeIndexEngine.StorageTier.values()) {
            documentsPerTier.put(tier, new AtomicLong(0));
            storageSizePerTier.put(tier, new AtomicLong(0));
        }
        
        // Initialize health check counters
        healthChecks.put("indexing_operations", new AtomicLong(0));
        healthChecks.put("query_operations", new AtomicLong(0));
        healthChecks.put("error_rate", new AtomicLong(0));
        healthChecks.put("memory_usage", new AtomicLong(0));
    }
    
    /**
     * Records a document indexing operation.
     * 
     * @param tier Storage tier
     * @param processingTimeMs Time taken to index
     * @param documentSize Size of the document
     * @param isCompliance Whether document is compliance-related
     */
    public void recordIndexing(CodeIndexEngine.StorageTier tier, long processingTimeMs, 
                              long documentSize, boolean isCompliance) {
        // Update core counters
        totalDocumentsIndexed.incrementAndGet();
        totalIndexingTimeMs.addAndGet(processingTimeMs);
        
        // Update tier-specific metrics
        documentsPerTier.get(tier).incrementAndGet();
        storageSizePerTier.get(tier).addAndGet(documentSize);
        
        // Update compliance metrics
        if (isCompliance) {
            complianceDocumentsIndexed.incrementAndGet();
        }
        
        // Update average indexing time
        updateAverageIndexingTime();
        
        // Update health metrics
        healthChecks.get("indexing_operations").incrementAndGet();
    }
    
    /**
     * Records a query execution.
     * 
     * @param query Search query
     * @param executionTimeMs Query execution time
     * @param resultCount Number of results returned
     * @param cacheHit Whether result was served from cache
     * @param isCompliance Whether query is compliance-related
     */
    public void recordQuery(String query, long executionTimeMs, int resultCount, 
                           boolean cacheHit, boolean isCompliance) {
        // Update core counters
        totalQueriesExecuted.incrementAndGet();
        totalQueryTimeMs.addAndGet(executionTimeMs);
        
        // Update cache metrics
        if (cacheHit) {
            cacheHits.incrementAndGet();
        } else {
            cacheMisses.incrementAndGet();
        }
        
        // Update compliance metrics
        if (isCompliance) {
            complianceQueriesExecuted.incrementAndGet();
        }
        
        // Record query pattern
        recordQueryPattern(query, executionTimeMs, resultCount);
        
        // Add to recent queries
        addRecentQuery(query, executionTimeMs, resultCount, cacheHit);
        
        // Update average query time
        updateAverageQueryTime();
        
        // Update health metrics
        healthChecks.get("query_operations").incrementAndGet();
    }
    
    /**
     * Records an indexing error.
     * 
     * @param errorType Type of error
     * @param errorMessage Error message
     */
    public void recordIndexingError(String errorType, String errorMessage) {
        totalIndexingErrors.incrementAndGet();
        healthChecks.get("error_rate").incrementAndGet();
        updateHealthStatus();
    }
    
    /**
     * Records a query error.
     * 
     * @param errorType Type of error
     * @param errorMessage Error message
     */
    public void recordQueryError(String errorType, String errorMessage) {
        totalQueryErrors.incrementAndGet();
        healthChecks.get("error_rate").incrementAndGet();
        updateHealthStatus();
    }
    
    /**
     * Records trigram index statistics.
     * 
     * @param trigramCount Number of trigrams
     * @param tokenCount Number of tokens
     */
    public void recordTrigramStats(long trigramCount, long tokenCount) {
        totalTrigramCount.set(trigramCount);
        totalTokenCount.set(tokenCount);
    }
    
    /**
     * Records compliance tag usage.
     * 
     * @param tag Compliance tag
     */
    public void recordComplianceTag(String tag) {
        complianceTagCounts.computeIfAbsent(tag, k -> new AtomicLong(0)).incrementAndGet();
    }
    
    /**
     * Gets comprehensive metrics summary.
     * 
     * @return Metrics summary map
     */
    public Map<String, Object> getMetricsSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        // Core metrics
        summary.put("total_documents_indexed", totalDocumentsIndexed.get());
        summary.put("total_queries_executed", totalQueriesExecuted.get());
        summary.put("total_indexing_errors", totalIndexingErrors.get());
        summary.put("total_query_errors", totalQueryErrors.get());
        
        // Performance metrics
        summary.put("average_indexing_time_ms", averageIndexingTimeMs.get());
        summary.put("average_query_time_ms", averageQueryTimeMs.get());
        summary.put("total_indexing_time_ms", totalIndexingTimeMs.get());
        summary.put("total_query_time_ms", totalQueryTimeMs.get());
        
        // Storage metrics
        Map<String, Long> tierDocuments = new HashMap<>();
        Map<String, Long> tierSizes = new HashMap<>();
        for (CodeIndexEngine.StorageTier tier : CodeIndexEngine.StorageTier.values()) {
            tierDocuments.put(tier.name(), documentsPerTier.get(tier).get());
            tierSizes.put(tier.name(), storageSizePerTier.get(tier).get());
        }
        summary.put("documents_per_tier", tierDocuments);
        summary.put("storage_size_per_tier", tierSizes);
        summary.put("total_trigram_count", totalTrigramCount.get());
        summary.put("total_token_count", totalTokenCount.get());
        
        // Cache metrics
        long totalCacheRequests = cacheHits.get() + cacheMisses.get();
        double cacheHitRate = totalCacheRequests > 0 ? 
            (double) cacheHits.get() / totalCacheRequests : 0.0;
        summary.put("cache_hit_rate", cacheHitRate);
        summary.put("cache_hits", cacheHits.get());
        summary.put("cache_misses", cacheMisses.get());
        
        // Health metrics
        summary.put("index_health", currentHealth.get().name());
        summary.put("last_health_check", lastHealthCheckTime.get());
        
        // Compliance metrics
        summary.put("compliance_documents_indexed", complianceDocumentsIndexed.get());
        summary.put("compliance_queries_executed", complianceQueriesExecuted.get());
        summary.put("compliance_tag_counts", new HashMap<>(complianceTagCounts));
        
        // Error rates
        long totalOperations = totalDocumentsIndexed.get() + totalQueriesExecuted.get();
        long totalErrors = totalIndexingErrors.get() + totalQueryErrors.get();
        double errorRate = totalOperations > 0 ? (double) totalErrors / totalOperations : 0.0;
        summary.put("error_rate", errorRate);
        
        return summary;
    }
    
    /**
     * Gets performance metrics for monitoring dashboards.
     * 
     * @return Performance metrics map
     */
    public Map<String, Object> getPerformanceMetrics() {
        Map<String, Object> performance = new HashMap<>();
        
        // Throughput metrics
        performance.put("indexing_throughput_docs_per_second", calculateIndexingThroughput());
        performance.put("query_throughput_queries_per_second", calculateQueryThroughput());
        
        // Latency metrics
        performance.put("average_indexing_latency_ms", averageIndexingTimeMs.get());
        performance.put("average_query_latency_ms", averageQueryTimeMs.get());
        performance.put("p95_query_latency_ms", calculateP95QueryLatency());
        performance.put("p99_query_latency_ms", calculateP99QueryLatency());
        
        // Resource utilization
        performance.put("memory_usage_mb", getCurrentMemoryUsage());
        performance.put("index_size_mb", getTotalIndexSize());
        
        return performance;
    }
    
    /**
     * Gets top query patterns for optimization.
     * 
     * @param limit Maximum number of patterns to return
     * @return List of top query patterns
     */
    public List<Map<String, Object>> getTopQueryPatterns(int limit) {
        return queryPatterns.entrySet().stream()
            .sorted((e1, e2) -> Long.compare(e2.getValue().getExecutionCount(), e1.getValue().getExecutionCount()))
            .limit(limit)
            .map(entry -> {
                Map<String, Object> pattern = new HashMap<>();
                pattern.put("query_pattern", entry.getKey());
                pattern.put("execution_count", entry.getValue().getExecutionCount());
                pattern.put("average_time_ms", entry.getValue().getAverageExecutionTime());
                pattern.put("average_results", entry.getValue().getAverageResultCount());
                return pattern;
            })
            .collect(ArrayList::new, (list, item) -> list.add(item), ArrayList::addAll);
    }
    
    /**
     * Performs health check and updates status.
     */
    public void performHealthCheck() {
        long currentTime = System.currentTimeMillis();
        
        // Skip if too recent
        if (currentTime - lastHealthCheckTime.get() < HEALTH_CHECK_INTERVAL_MS) {
            return;
        }
        
        IndexHealth newHealth = calculateHealthStatus();
        currentHealth.set(newHealth);
        lastHealthCheckTime.set(currentTime);
        
        // Update memory usage
        healthChecks.get("memory_usage").set(getCurrentMemoryUsage());
    }
    
    /**
     * Resets all metrics (useful for testing).
     */
    public void reset() {
        totalDocumentsIndexed.set(0);
        totalQueriesExecuted.set(0);
        totalIndexingErrors.set(0);
        totalQueryErrors.set(0);
        totalIndexingTimeMs.set(0);
        totalQueryTimeMs.set(0);
        averageIndexingTimeMs.set(0.0);
        averageQueryTimeMs.set(0.0);
        
        for (AtomicLong counter : documentsPerTier.values()) {
            counter.set(0);
        }
        for (AtomicLong counter : storageSizePerTier.values()) {
            counter.set(0);
        }
        
        totalTrigramCount.set(0);
        totalTokenCount.set(0);
        cacheHits.set(0);
        cacheMisses.set(0);
        
        queryPatterns.clear();
        recentQueries.clear();
        complianceDocumentsIndexed.set(0);
        complianceQueriesExecuted.set(0);
        complianceTagCounts.clear();
        
        currentHealth.set(IndexHealth.GREEN);
        for (AtomicLong counter : healthChecks.values()) {
            counter.set(0);
        }
    }
    
    /**
     * Updates average indexing time.
     */
    private void updateAverageIndexingTime() {
        long totalDocs = totalDocumentsIndexed.get();
        if (totalDocs > 0) {
            double average = (double) totalIndexingTimeMs.get() / totalDocs;
            averageIndexingTimeMs.set(average);
        }
    }
    
    /**
     * Updates average query time.
     */
    private void updateAverageQueryTime() {
        long totalQueries = totalQueriesExecuted.get();
        if (totalQueries > 0) {
            double average = (double) totalQueryTimeMs.get() / totalQueries;
            averageQueryTimeMs.set(average);
        }
    }
    
    /**
     * Records a query pattern for analytics.
     * 
     * @param query Search query
     * @param executionTime Execution time
     * @param resultCount Result count
     */
    private void recordQueryPattern(String query, long executionTime, int resultCount) {
        String pattern = normalizeQueryPattern(query);
        QueryMetric metric = queryPatterns.computeIfAbsent(pattern, k -> new QueryMetric());
        metric.addExecution(executionTime, resultCount);
    }
    
    /**
     * Normalizes query for pattern analysis.
     * 
     * @param query Original query
     * @return Normalized pattern
     */
    private String normalizeQueryPattern(String query) {
        if (query == null || query.trim().isEmpty()) {
            return "[empty]";
        }
        
        // Replace specific values with placeholders
        return query.toLowerCase()
            .replaceAll("\\d+", "[number]")
            .replaceAll("\"[^\"]*\"", "[quoted]")
            .replaceAll("\\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\\b", "[uuid]")
            .trim();
    }
    
    /**
     * Adds query to recent queries list.
     * 
     * @param query Search query
     * @param executionTime Execution time
     * @param resultCount Result count
     * @param cacheHit Cache hit status
     */
    private void addRecentQuery(String query, long executionTime, int resultCount, boolean cacheHit) {
        QueryExecution execution = new QueryExecution(query, executionTime, resultCount, cacheHit);
        recentQueries.offer(execution);
        
        // Maintain size limit
        while (recentQueries.size() > MAX_RECENT_QUERIES) {
            recentQueries.poll();
        }
    }
    
    /**
     * Calculates current health status.
     * 
     * @return Health status
     */
    private IndexHealth calculateHealthStatus() {
        // Calculate error rate
        long totalOps = totalDocumentsIndexed.get() + totalQueriesExecuted.get();
        long totalErrors = totalIndexingErrors.get() + totalQueryErrors.get();
        double errorRate = totalOps > 0 ? (double) totalErrors / totalOps : 0.0;
        
        // Check memory usage
        long memoryUsage = getCurrentMemoryUsage();
        long maxMemory = Runtime.getRuntime().maxMemory() / (1024 * 1024); // MB
        double memoryUtilization = (double) memoryUsage / maxMemory;
        
        // Determine health status
        if (errorRate > 0.1 || memoryUtilization > 0.9) {
            return IndexHealth.RED;
        } else if (errorRate > 0.05 || memoryUtilization > 0.8) {
            return IndexHealth.YELLOW;
        } else {
            return IndexHealth.GREEN;
        }
    }
    
    /**
     * Updates health status based on current conditions.
     */
    private void updateHealthStatus() {
        IndexHealth newHealth = calculateHealthStatus();
        currentHealth.set(newHealth);
    }
    
    /**
     * Calculates indexing throughput.
     * 
     * @return Documents per second
     */
    private double calculateIndexingThroughput() {
        long totalTime = totalIndexingTimeMs.get();
        if (totalTime > 0) {
            return (double) totalDocumentsIndexed.get() * 1000 / totalTime;
        }
        return 0.0;
    }
    
    /**
     * Calculates query throughput.
     * 
     * @return Queries per second
     */
    private double calculateQueryThroughput() {
        long totalTime = totalQueryTimeMs.get();
        if (totalTime > 0) {
            return (double) totalQueriesExecuted.get() * 1000 / totalTime;
        }
        return 0.0;
    }
    
    /**
     * Calculates 95th percentile query latency.
     * 
     * @return P95 latency in milliseconds
     */
    private double calculateP95QueryLatency() {
        List<QueryExecution> queries = new ArrayList<>(recentQueries);
        if (queries.isEmpty()) {
            return 0.0;
        }
        
        queries.sort(Comparator.comparingLong(QueryExecution::getExecutionTime));
        int p95Index = (int) Math.ceil(queries.size() * 0.95) - 1;
        return queries.get(Math.max(0, p95Index)).getExecutionTime();
    }
    
    /**
     * Calculates 99th percentile query latency.
     * 
     * @return P99 latency in milliseconds
     */
    private double calculateP99QueryLatency() {
        List<QueryExecution> queries = new ArrayList<>(recentQueries);
        if (queries.isEmpty()) {
            return 0.0;
        }
        
        queries.sort(Comparator.comparingLong(QueryExecution::getExecutionTime));
        int p99Index = (int) Math.ceil(queries.size() * 0.99) - 1;
        return queries.get(Math.max(0, p99Index)).getExecutionTime();
    }
    
    /**
     * Gets current memory usage in MB.
     * 
     * @return Memory usage in megabytes
     */
    private long getCurrentMemoryUsage() {
        Runtime runtime = Runtime.getRuntime();
        return (runtime.totalMemory() - runtime.freeMemory()) / (1024 * 1024);
    }
    
    /**
     * Gets total index size in MB.
     * 
     * @return Index size in megabytes
     */
    private long getTotalIndexSize() {
        return storageSizePerTier.values().stream()
            .mapToLong(AtomicLong::get)
            .sum() / (1024 * 1024);
    }
    
    /**
     * Query metric for pattern analysis.
     */
    private static class QueryMetric {
        private final AtomicLong executionCount = new AtomicLong(0);
        private final AtomicLong totalExecutionTime = new AtomicLong(0);
        private final AtomicLong totalResultCount = new AtomicLong(0);
        
        /**
         * Adds a query execution to the metric.
         * 
         * @param executionTime Execution time
         * @param resultCount Result count
         */
        public void addExecution(long executionTime, int resultCount) {
            executionCount.incrementAndGet();
            totalExecutionTime.addAndGet(executionTime);
            totalResultCount.addAndGet(resultCount);
        }
        
        public long getExecutionCount() {
            return executionCount.get();
        }
        
        public double getAverageExecutionTime() {
            long count = executionCount.get();
            return count > 0 ? (double) totalExecutionTime.get() / count : 0.0;
        }
        
        public double getAverageResultCount() {
            long count = executionCount.get();
            return count > 0 ? (double) totalResultCount.get() / count : 0.0;
        }
    }
    
    /**
     * Query execution record for recent queries tracking.
     */
    private static class QueryExecution {
        private final String query;
        private final long executionTime;
        private final int resultCount;
        private final boolean cacheHit;
        private final long timestamp;
        
        public QueryExecution(String query, long executionTime, int resultCount, boolean cacheHit) {
            this.query = query;
            this.executionTime = executionTime;
            this.resultCount = resultCount;
            this.cacheHit = cacheHit;
            this.timestamp = System.currentTimeMillis();
        }
        
        public String getQuery() { return query; }
        public long getExecutionTime() { return executionTime; }
        public int getResultCount() { return resultCount; }
        public boolean isCacheHit() { return cacheHit; }
        public long getTimestamp() { return timestamp; }
    }
}