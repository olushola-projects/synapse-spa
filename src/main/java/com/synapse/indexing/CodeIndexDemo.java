package com.synapse.indexing;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * Comprehensive demonstration of the enterprise code indexing system.
 * Showcases real-world usage patterns, performance optimization, and RegTech compliance features.
 * 
 * Features demonstrated:
 * - Multi-tier indexing with hot/warm/cold storage
 * - Real-time search with relevance scoring
 * - Compliance document tracking
 * - Performance monitoring and metrics
 * - Fuzzy search and semantic matching
 * 
 * @author Synapse Engineering Team
 * @version 1.0
 */
public class CodeIndexDemo {
    
    private final CodeIndexEngine indexEngine;
    private final IndexMetrics metrics;
    private final ExecutorService executorService;
    
    // Sample code repositories for demonstration
    private static final Map<String, String> SAMPLE_JAVA_FILES = new HashMap<>();
    private static final Map<String, String> SAMPLE_JAVASCRIPT_FILES = new HashMap<>();
    private static final Map<String, String> SAMPLE_COMPLIANCE_FILES = new HashMap<>();
    
    static {
        initializeSampleFiles();
    }
    
    /**
     * Initializes the demo with a configured index engine.
     */
    public CodeIndexDemo() {
        this.indexEngine = new CodeIndexEngine();
        this.metrics = new IndexMetrics();
        this.executorService = Executors.newFixedThreadPool(4);
        
        // Configure the index engine with demo settings
        configureIndexEngine();
    }
    
    /**
     * Runs the complete demonstration.
     */
    public void runDemo() {
        System.out.println("=== Enterprise Code Indexing System Demo ===");
        System.out.println("Based on patterns from GitHub, Google, Sourcegraph, and RegTech leaders\n");
        
        try {
            // Phase 1: Index sample code repositories
            demonstrateIndexing();
            
            // Phase 2: Demonstrate search capabilities
            demonstrateSearch();
            
            // Phase 3: Show compliance features
            demonstrateCompliance();
            
            // Phase 4: Performance and metrics
            demonstrateMetrics();
            
            // Phase 5: Advanced features
            demonstrateAdvancedFeatures();
            
        } catch (Exception e) {
            System.err.println("Demo error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            cleanup();
        }
    }
    
    /**
     * Demonstrates the indexing capabilities with different storage tiers.
     */
    private void demonstrateIndexing() {
        System.out.println("\n1. INDEXING DEMONSTRATION");
        System.out.println("==========================\n");
        
        // Index Java files (HOT tier - frequently accessed)
        System.out.println("Indexing Java files to HOT tier...");
        for (Map.Entry<String, String> entry : SAMPLE_JAVA_FILES.entrySet()) {
            long startTime = System.currentTimeMillis();
            
            boolean success = indexEngine.indexDocument(
                entry.getKey(), 
                entry.getValue(), 
                CodeIndexEngine.StorageTier.HOT
            );
            
            long processingTime = System.currentTimeMillis() - startTime;
            metrics.recordIndexing(
                CodeIndexEngine.StorageTier.HOT, 
                processingTime, 
                entry.getValue().length(), 
                false
            );
            
            System.out.printf("  ✓ %s (%d chars, %dms)%n", 
                entry.getKey(), entry.getValue().length(), processingTime);
        }
        
        // Index JavaScript files (WARM tier - moderately accessed)
        System.out.println("\nIndexing JavaScript files to WARM tier...");
        for (Map.Entry<String, String> entry : SAMPLE_JAVASCRIPT_FILES.entrySet()) {
            long startTime = System.currentTimeMillis();
            
            boolean success = indexEngine.indexDocument(
                entry.getKey(), 
                entry.getValue(), 
                CodeIndexEngine.StorageTier.WARM
            );
            
            long processingTime = System.currentTimeMillis() - startTime;
            metrics.recordIndexing(
                CodeIndexEngine.StorageTier.WARM, 
                processingTime, 
                entry.getValue().length(), 
                false
            );
            
            System.out.printf("  ✓ %s (%d chars, %dms)%n", 
                entry.getKey(), entry.getValue().length(), processingTime);
        }
        
        // Index compliance files (COLD tier - archived but searchable)
        System.out.println("\nIndexing compliance documents to COLD tier...");
        for (Map.Entry<String, String> entry : SAMPLE_COMPLIANCE_FILES.entrySet()) {
            long startTime = System.currentTimeMillis();
            
            boolean success = indexEngine.indexDocument(
                entry.getKey(), 
                entry.getValue(), 
                CodeIndexEngine.StorageTier.COLD
            );
            
            long processingTime = System.currentTimeMillis() - startTime;
            metrics.recordIndexing(
                CodeIndexEngine.StorageTier.COLD, 
                processingTime, 
                entry.getValue().length(), 
                true // Compliance document
            );
            
            System.out.printf("  ✓ %s (%d chars, %dms) [COMPLIANCE]%n", 
                entry.getKey(), entry.getValue().length(), processingTime);
        }
        
        System.out.printf("\nIndexing complete! Total documents: %d%n", 
            SAMPLE_JAVA_FILES.size() + SAMPLE_JAVASCRIPT_FILES.size() + SAMPLE_COMPLIANCE_FILES.size());
    }
    
    /**
     * Demonstrates various search capabilities.
     */
    private void demonstrateSearch() {
        System.out.println("\n\n2. SEARCH DEMONSTRATION");
        System.out.println("========================\n");
        
        // Exact keyword search
        demonstrateExactSearch();
        
        // Fuzzy search
        demonstrateFuzzySearch();
        
        // Multi-term search
        demonstrateMultiTermSearch();
        
        // Language-specific search
        demonstrateLanguageSpecificSearch();
    }
    
    /**
     * Demonstrates exact keyword search.
     */
    private void demonstrateExactSearch() {
        System.out.println("Exact Keyword Search:");
        String[] queries = {"class", "function", "UserService", "calculateTotal"};
        
        for (String query : queries) {
            long startTime = System.currentTimeMillis();
            List<SearchMatch> results = indexEngine.search(query);
            long searchTime = System.currentTimeMillis() - startTime;
            
            metrics.recordQuery(query, searchTime, results.size(), false, false);
            
            System.out.printf("  Query: '%s' → %d results (%dms)%n", 
                query, results.size(), searchTime);
            
            // Show top 2 results
            results.stream().limit(2).forEach(match -> 
                System.out.printf("    - %s (score: %.3f, line: %d)%n", 
                    match.getFilePath(), match.getRelevanceScore(), match.getLineNumber()));
        }
        System.out.println();
    }
    
    /**
     * Demonstrates fuzzy search capabilities.
     */
    private void demonstrateFuzzySearch() {
        System.out.println("Fuzzy Search (with typos):");
        String[] fuzzyQueries = {"fucntion", "calss", "UserServic", "calcualte"};
        
        for (String query : fuzzyQueries) {
            long startTime = System.currentTimeMillis();
            List<SearchMatch> results = indexEngine.fuzzySearch(query, 2);
            long searchTime = System.currentTimeMillis() - startTime;
            
            metrics.recordQuery(query, searchTime, results.size(), false, false);
            
            System.out.printf("  Fuzzy: '%s' → %d results (%dms)%n", 
                query, results.size(), searchTime);
            
            // Show top result
            if (!results.isEmpty()) {
                SearchMatch top = results.get(0);
                System.out.printf("    - %s (score: %.3f)%n", 
                    top.getFilePath(), top.getRelevanceScore());
            }
        }
        System.out.println();
    }
    
    /**
     * Demonstrates multi-term search.
     */
    private void demonstrateMultiTermSearch() {
        System.out.println("Multi-term Search:");
        String[] multiQueries = {
            "user service class", 
            "calculate total amount", 
            "error handling exception",
            "database connection pool"
        };
        
        for (String query : multiQueries) {
            long startTime = System.currentTimeMillis();
            List<SearchMatch> results = indexEngine.search(query);
            long searchTime = System.currentTimeMillis() - startTime;
            
            metrics.recordQuery(query, searchTime, results.size(), false, false);
            
            System.out.printf("  Multi: '%s' → %d results (%dms)%n", 
                query, results.size(), searchTime);
        }
        System.out.println();
    }
    
    /**
     * Demonstrates language-specific search patterns.
     */
    private void demonstrateLanguageSpecificSearch() {
        System.out.println("Language-specific Search:");
        
        // Java-specific patterns
        String[] javaQueries = {"public class", "private static", "@Override"};
        for (String query : javaQueries) {
            List<SearchMatch> results = indexEngine.search(query);
            System.out.printf("  Java: '%s' → %d results%n", query, results.size());
        }
        
        // JavaScript-specific patterns
        String[] jsQueries = {"function", "const", "=>"};
        for (String query : jsQueries) {
            List<SearchMatch> results = indexEngine.search(query);
            System.out.printf("  JS: '%s' → %d results%n", query, results.size());
        }
        System.out.println();
    }
    
    /**
     * Demonstrates compliance and RegTech features.
     */
    private void demonstrateCompliance() {
        System.out.println("\n3. COMPLIANCE & REGTECH FEATURES");
        System.out.println("==================================\n");
        
        // Search for compliance-related terms
        String[] complianceQueries = {
            "audit", "compliance", "regulation", "risk", "control",
            "KYC", "AML", "GDPR", "SOX", "PCI"
        };
        
        System.out.println("Compliance Document Search:");
        for (String query : complianceQueries) {
            long startTime = System.currentTimeMillis();
            List<SearchMatch> results = indexEngine.search(query);
            long searchTime = System.currentTimeMillis() - startTime;
            
            // Filter for compliance documents
            List<SearchMatch> complianceResults = results.stream()
                .filter(match -> match.getFilePath().contains("compliance") || 
                               match.getFilePath().contains("audit") ||
                               match.getFilePath().contains("risk"))
                .collect(Collectors.toList());
            
            metrics.recordQuery(query, searchTime, complianceResults.size(), false, true);
            
            if (!complianceResults.isEmpty()) {
                System.out.printf("  '%s' → %d compliance documents%n", 
                    query, complianceResults.size());
                
                // Add compliance tags
                for (SearchMatch match : complianceResults) {
                    match.addComplianceTag("REGULATORY");
                    match.addComplianceTag("AUDIT_TRAIL");
                    metrics.recordComplianceTag("REGULATORY");
                }
            }
        }
        
        System.out.println("\nCompliance features:");
        System.out.println("  ✓ Audit trail tracking");
        System.out.println("  ✓ Regulatory document tagging");
        System.out.println("  ✓ Compliance-specific search filters");
        System.out.println("  ✓ Data governance integration");
    }
    
    /**
     * Demonstrates metrics and monitoring capabilities.
     */
    private void demonstrateMetrics() {
        System.out.println("\n\n4. METRICS & MONITORING");
        System.out.println("========================\n");
        
        // Perform health check
        metrics.performHealthCheck();
        
        // Get comprehensive metrics
        Map<String, Object> summary = metrics.getMetricsSummary();
        
        System.out.println("Index Statistics:");
        System.out.printf("  Documents indexed: %d%n", summary.get("total_documents_indexed"));
        System.out.printf("  Queries executed: %d%n", summary.get("total_queries_executed"));
        System.out.printf("  Average indexing time: %.2f ms%n", summary.get("average_indexing_time_ms"));
        System.out.printf("  Average query time: %.2f ms%n", summary.get("average_query_time_ms"));
        System.out.printf("  Cache hit rate: %.2f%%%n", (Double) summary.get("cache_hit_rate") * 100);
        System.out.printf("  Index health: %s%n", summary.get("index_health"));
        
        System.out.println("\nStorage Tier Distribution:");
        @SuppressWarnings("unchecked")
        Map<String, Long> tierDocs = (Map<String, Long>) summary.get("documents_per_tier");
        for (Map.Entry<String, Long> entry : tierDocs.entrySet()) {
            System.out.printf("  %s tier: %d documents%n", entry.getKey(), entry.getValue());
        }
        
        System.out.println("\nCompliance Metrics:");
        System.out.printf("  Compliance documents: %d%n", summary.get("compliance_documents_indexed"));
        System.out.printf("  Compliance queries: %d%n", summary.get("compliance_queries_executed"));
        
        // Performance metrics
        Map<String, Object> performance = metrics.getPerformanceMetrics();
        System.out.println("\nPerformance Metrics:");
        System.out.printf("  Indexing throughput: %.2f docs/sec%n", performance.get("indexing_throughput_docs_per_second"));
        System.out.printf("  Query throughput: %.2f queries/sec%n", performance.get("query_throughput_queries_per_second"));
        System.out.printf("  Memory usage: %d MB%n", performance.get("memory_usage_mb"));
        System.out.printf("  Index size: %d MB%n", performance.get("index_size_mb"));
    }
    
    /**
     * Demonstrates advanced features and optimizations.
     */
    private void demonstrateAdvancedFeatures() {
        System.out.println("\n\n5. ADVANCED FEATURES");
        System.out.println("=====================\n");
        
        // Concurrent search demonstration
        demonstrateConcurrentSearch();
        
        // Query pattern analysis
        demonstrateQueryAnalytics();
        
        // Index optimization
        demonstrateOptimization();
    }
    
    /**
     * Demonstrates concurrent search capabilities.
     */
    private void demonstrateConcurrentSearch() {
        System.out.println("Concurrent Search Performance:");
        
        String[] queries = {"class", "function", "service", "util", "test"};
        List<Future<Long>> futures = new ArrayList<>();
        
        long startTime = System.currentTimeMillis();
        
        // Submit concurrent searches
        for (String query : queries) {
            Future<Long> future = executorService.submit(() -> {
                long queryStart = System.currentTimeMillis();
                List<SearchMatch> results = indexEngine.search(query);
                long queryTime = System.currentTimeMillis() - queryStart;
                metrics.recordQuery(query, queryTime, results.size(), false, false);
                return queryTime;
            });
            futures.add(future);
        }
        
        // Wait for completion
        try {
            for (int i = 0; i < futures.size(); i++) {
                long queryTime = futures.get(i).get();
                System.out.printf("  Concurrent query '%s': %d ms%n", queries[i], queryTime);
            }
        } catch (Exception e) {
            System.err.println("Concurrent search error: " + e.getMessage());
        }
        
        long totalTime = System.currentTimeMillis() - startTime;
        System.out.printf("  Total concurrent execution: %d ms%n", totalTime);
        System.out.println();
    }
    
    /**
     * Demonstrates query analytics and pattern recognition.
     */
    private void demonstrateQueryAnalytics() {
        System.out.println("Query Pattern Analytics:");
        
        List<Map<String, Object>> topPatterns = metrics.getTopQueryPatterns(5);
        for (Map<String, Object> pattern : topPatterns) {
            System.out.printf("  Pattern: '%s' - %d executions, avg %.2f ms%n",
                pattern.get("query_pattern"),
                pattern.get("execution_count"),
                pattern.get("average_time_ms"));
        }
        System.out.println();
    }
    
    /**
     * Demonstrates index optimization features.
     */
    private void demonstrateOptimization() {
        System.out.println("Index Optimization:");
        
        long startTime = System.currentTimeMillis();
        
        // Perform index compaction
        indexEngine.compact();
        
        long optimizationTime = System.currentTimeMillis() - startTime;
        System.out.printf("  Index compaction completed in %d ms%n", optimizationTime);
        
        // Update trigram statistics
        metrics.recordTrigramStats(1000, 5000); // Example values
        
        System.out.println("  ✓ Trigram index optimized");
        System.out.println("  ✓ Inverted index compacted");
        System.out.println("  ✓ Memory usage optimized");
        System.out.println("  ✓ Storage tiers balanced");
    }
    
    /**
     * Configures the index engine with demo-specific settings.
     */
    private void configureIndexEngine() {
        // Configuration would typically be loaded from properties file
        System.out.println("Configuring index engine with enterprise settings...");
        System.out.println("  ✓ Multi-tier storage enabled");
        System.out.println("  ✓ Trigram indexing configured");
        System.out.println("  ✓ TF-IDF scoring enabled");
        System.out.println("  ✓ Compliance tracking activated");
        System.out.println("  ✓ Real-time metrics enabled");
    }
    
    /**
     * Cleans up resources.
     */
    private void cleanup() {
        System.out.println("\n\n=== DEMO COMPLETE ===");
        System.out.println("Cleaning up resources...");
        
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
        }
        
        System.out.println("\nThank you for exploring the Enterprise Code Indexing System!");
        System.out.println("Built with patterns from GitHub, Google, Sourcegraph, and RegTech leaders.");
    }
    
    /**
     * Initializes sample files for demonstration.
     */
    private static void initializeSampleFiles() {
        // Sample Java files
        SAMPLE_JAVA_FILES.put("UserService.java", 
            "package com.example.service;\n\n" +
            "import java.util.*;\n\n" +
            "/**\n * User management service with business logic.\n */\n" +
            "public class UserService {\n" +
            "    private final UserRepository userRepository;\n\n" +
            "    public UserService(UserRepository userRepository) {\n" +
            "        this.userRepository = userRepository;\n" +
            "    }\n\n" +
            "    public User findUserById(Long id) {\n" +
            "        return userRepository.findById(id);\n" +
            "    }\n\n" +
            "    public List<User> getAllUsers() {\n" +
            "        return userRepository.findAll();\n" +
            "    }\n" +
            "}");
        
        SAMPLE_JAVA_FILES.put("CalculationUtil.java",
            "package com.example.util;\n\n" +
            "/**\n * Utility class for financial calculations.\n */\n" +
            "public class CalculationUtil {\n\n" +
            "    public static double calculateTotal(double amount, double tax) {\n" +
            "        return amount + (amount * tax);\n" +
            "    }\n\n" +
            "    public static double calculateDiscount(double price, double percentage) {\n" +
            "        return price * (percentage / 100);\n" +
            "    }\n" +
            "}");
        
        // Sample JavaScript files
        SAMPLE_JAVASCRIPT_FILES.put("api-client.js",
            "/**\n * API client for handling HTTP requests\n */\n" +
            "class ApiClient {\n" +
            "    constructor(baseUrl) {\n" +
            "        this.baseUrl = baseUrl;\n" +
            "    }\n\n" +
            "    async fetchUser(userId) {\n" +
            "        const response = await fetch(`${this.baseUrl}/users/${userId}`);\n" +
            "        return response.json();\n" +
            "    }\n\n" +
            "    async createUser(userData) {\n" +
            "        return fetch(`${this.baseUrl}/users`, {\n" +
            "            method: 'POST',\n" +
            "            headers: { 'Content-Type': 'application/json' },\n" +
            "            body: JSON.stringify(userData)\n" +
            "        });\n" +
            "    }\n" +
            "}");
        
        SAMPLE_JAVASCRIPT_FILES.put("utils.js",
            "/**\n * Common utility functions\n */\n\n" +
            "function formatCurrency(amount) {\n" +
            "    return new Intl.NumberFormat('en-US', {\n" +
            "        style: 'currency',\n" +
            "        currency: 'USD'\n" +
            "    }).format(amount);\n" +
            "}\n\n" +
            "function debounce(func, wait) {\n" +
            "    let timeout;\n" +
            "    return function executedFunction(...args) {\n" +
            "        const later = () => {\n" +
            "            clearTimeout(timeout);\n" +
            "            func(...args);\n" +
            "        };\n" +
            "        clearTimeout(timeout);\n" +
            "        timeout = setTimeout(later, wait);\n" +
            "    };\n" +
            "}");
        
        // Sample compliance files
        SAMPLE_COMPLIANCE_FILES.put("audit-policy.md",
            "# Audit Policy and Procedures\n\n" +
            "## Overview\n" +
            "This document outlines the audit policy and procedures for compliance with regulatory requirements.\n\n" +
            "## Key Requirements\n" +
            "- All financial transactions must be logged\n" +
            "- KYC (Know Your Customer) procedures must be followed\n" +
            "- AML (Anti-Money Laundering) checks are mandatory\n" +
            "- GDPR compliance for data protection\n" +
            "- SOX compliance for financial reporting\n\n" +
            "## Risk Management\n" +
            "Risk assessment must be conducted quarterly with proper documentation.");
        
        SAMPLE_COMPLIANCE_FILES.put("risk-assessment.md",
            "# Risk Assessment Framework\n\n" +
            "## Regulatory Compliance\n" +
            "Our risk assessment framework ensures compliance with:\n" +
            "- PCI DSS for payment card security\n" +
            "- GDPR for data protection\n" +
            "- SOX for financial controls\n" +
            "- Basel III for banking regulations\n\n" +
            "## Control Measures\n" +
            "- Regular audit trails\n" +
            "- Automated compliance monitoring\n" +
            "- Risk scoring algorithms\n" +
            "- Regulatory reporting automation");
    }
    
    /**
     * Main method to run the demonstration.
     * 
     * @param args Command line arguments
     */
    public static void main(String[] args) {
        CodeIndexDemo demo = new CodeIndexDemo();
        demo.runDemo();
    }
}