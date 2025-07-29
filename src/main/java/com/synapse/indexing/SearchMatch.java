package com.synapse.indexing;

import java.util.*;

/**
 * Represents a search match result with relevance scoring and metadata.
 * Based on patterns from Elasticsearch, Sourcegraph, and enterprise search systems.
 * 
 * Features:
 * - Relevance scoring with TF-IDF
 * - Multi-tier storage support
 * - Rich metadata for result ranking
 * - Snippet extraction capabilities
 * - Compliance and audit trail support
 * 
 * @author Synapse Engineering Team
 * @version 1.0
 */
public class SearchMatch implements Comparable<SearchMatch> {
    
    // Core match information
    private String filePath;
    private String content;
    private int lineNumber;
    private int columnNumber;
    
    // Relevance and scoring
    private double relevanceScore;
    private double trigramScore;
    private double invertedIndexScore;
    private double pageRankScore;
    
    // Metadata and context
    private CodeIndexEngine.StorageTier tier;
    private long lastModified;
    private long fileSize;
    private String fileType;
    private String language;
    
    // Search context
    private String matchedQuery;
    private List<String> matchedTokens;
    private Map<String, Object> highlights;
    private String snippet;
    
    // Compliance and audit
    private boolean complianceRelevant;
    private Set<String> complianceTags;
    private String auditTrail;
    
    /**
     * Default constructor for SearchMatch.
     */
    public SearchMatch() {
        this.matchedTokens = new ArrayList<>();
        this.highlights = new HashMap<>();
        this.complianceTags = new HashSet<>();
        this.relevanceScore = 0.0;
        this.trigramScore = 0.0;
        this.invertedIndexScore = 0.0;
        this.pageRankScore = 0.0;
    }
    
    /**
     * Constructor with basic match information.
     * 
     * @param filePath Path to the matched file
     * @param content Matched content
     * @param lineNumber Line number of the match
     * @param relevanceScore Calculated relevance score
     */
    public SearchMatch(String filePath, String content, int lineNumber, double relevanceScore) {
        this();
        this.filePath = filePath;
        this.content = content;
        this.lineNumber = lineNumber;
        this.relevanceScore = relevanceScore;
    }
    
    /**
     * Calculates the final relevance score using multiple factors.
     * Implements Google's PageRank-inspired algorithm for code search.
     * 
     * @return Combined relevance score
     */
    public double calculateFinalScore() {
        // Base score from text matching
        double textScore = (trigramScore * 0.3) + (invertedIndexScore * 0.4);
        
        // PageRank-style authority score
        double authorityScore = pageRankScore * 0.2;
        
        // Tier-based boost (hot tier gets higher priority)
        double tierBoost = getTierBoost();
        
        // Recency boost (newer files get slight preference)
        double recencyBoost = calculateRecencyBoost();
        
        // Compliance boost for RegTech scenarios
        double complianceBoost = complianceRelevant ? 1.1 : 1.0;
        
        return (textScore + authorityScore) * tierBoost * recencyBoost * complianceBoost;
    }
    
    /**
     * Gets the tier-based boost factor.
     * Hot tier files get higher priority for performance.
     * 
     * @return Tier boost multiplier
     */
    private double getTierBoost() {
        if (tier == null) {
            return 1.0;
        }
        
        switch (tier) {
            case HOT:
                return 1.2;
            case WARM:
                return 1.0;
            case COLD:
                return 0.8;
            default:
                return 1.0;
        }
    }
    
    /**
     * Calculates recency boost based on file modification time.
     * More recently modified files get slight preference.
     * 
     * @return Recency boost multiplier
     */
    private double calculateRecencyBoost() {
        if (lastModified <= 0) {
            return 1.0;
        }
        
        long currentTime = System.currentTimeMillis();
        long ageInDays = (currentTime - lastModified) / (24 * 60 * 60 * 1000);
        
        // Files modified within last 30 days get boost
        if (ageInDays <= 30) {
            return 1.05;
        } else if (ageInDays <= 90) {
            return 1.02;
        } else {
            return 1.0;
        }
    }
    
    /**
     * Adds a matched token to the search result.
     * 
     * @param token Matched token
     */
    public void addMatchedToken(String token) {
        if (token != null && !token.trim().isEmpty()) {
            this.matchedTokens.add(token.trim());
        }
    }
    
    /**
     * Adds a highlight for the search result.
     * 
     * @param field Field name
     * @param highlight Highlight information
     */
    public void addHighlight(String field, Object highlight) {
        this.highlights.put(field, highlight);
    }
    
    /**
     * Adds a compliance tag to the search result.
     * 
     * @param tag Compliance tag
     */
    public void addComplianceTag(String tag) {
        if (tag != null && !tag.trim().isEmpty()) {
            this.complianceTags.add(tag.trim());
            this.complianceRelevant = true;
        }
    }
    
    /**
     * Generates a snippet from the matched content.
     * Extracts relevant context around the match.
     * 
     * @param maxLength Maximum snippet length
     * @return Generated snippet
     */
    public String generateSnippet(int maxLength) {
        if (content == null || content.isEmpty()) {
            return "";
        }
        
        String[] lines = content.split("\n");
        StringBuilder snippetBuilder = new StringBuilder();
        
        // Find the line with the match
        int targetLine = Math.max(0, lineNumber - 1);
        int startLine = Math.max(0, targetLine - 2);
        int endLine = Math.min(lines.length - 1, targetLine + 2);
        
        for (int i = startLine; i <= endLine; i++) {
            if (snippetBuilder.length() > 0) {
                snippetBuilder.append("\n");
            }
            
            String line = lines[i];
            if (snippetBuilder.length() + line.length() > maxLength) {
                int remainingLength = maxLength - snippetBuilder.length() - 3;
                if (remainingLength > 0) {
                    snippetBuilder.append(line.substring(0, remainingLength)).append("...");
                }
                break;
            }
            
            snippetBuilder.append(line);
        }
        
        this.snippet = snippetBuilder.toString();
        return this.snippet;
    }
    
    /**
     * Compares search matches by relevance score (descending order).
     * 
     * @param other Other search match
     * @return Comparison result
     */
    @Override
    public int compareTo(SearchMatch other) {
        if (other == null) {
            return 1;
        }
        
        // Primary sort by final relevance score
        double thisScore = this.calculateFinalScore();
        double otherScore = other.calculateFinalScore();
        
        int scoreComparison = Double.compare(otherScore, thisScore); // Descending
        if (scoreComparison != 0) {
            return scoreComparison;
        }
        
        // Secondary sort by tier (HOT > WARM > COLD)
        if (this.tier != other.tier) {
            if (this.tier == null) return 1;
            if (other.tier == null) return -1;
            return this.tier.compareTo(other.tier);
        }
        
        // Tertiary sort by recency
        return Long.compare(other.lastModified, this.lastModified);
    }
    
    /**
     * Checks if this match is equal to another match.
     * 
     * @param obj Other object
     * @return true if equal
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        
        SearchMatch that = (SearchMatch) obj;
        return lineNumber == that.lineNumber &&
               columnNumber == that.columnNumber &&
               Objects.equals(filePath, that.filePath) &&
               Objects.equals(content, that.content);
    }
    
    /**
     * Generates hash code for the search match.
     * 
     * @return Hash code
     */
    @Override
    public int hashCode() {
        return Objects.hash(filePath, content, lineNumber, columnNumber);
    }
    
    /**
     * Returns string representation of the search match.
     * 
     * @return String representation
     */
    @Override
    public String toString() {
        return String.format("SearchMatch{filePath='%s', line=%d, score=%.3f, tier=%s}",
                           filePath, lineNumber, calculateFinalScore(), tier);
    }
    
    // Getters and Setters
    
    public String getFilePath() {
        return filePath;
    }
    
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public int getLineNumber() {
        return lineNumber;
    }
    
    public void setLineNumber(int lineNumber) {
        this.lineNumber = lineNumber;
    }
    
    public int getColumnNumber() {
        return columnNumber;
    }
    
    public void setColumnNumber(int columnNumber) {
        this.columnNumber = columnNumber;
    }
    
    public double getRelevanceScore() {
        return relevanceScore;
    }
    
    public void setRelevanceScore(double relevanceScore) {
        this.relevanceScore = relevanceScore;
    }
    
    public double getTrigramScore() {
        return trigramScore;
    }
    
    public void setTrigramScore(double trigramScore) {
        this.trigramScore = trigramScore;
    }
    
    public double getInvertedIndexScore() {
        return invertedIndexScore;
    }
    
    public void setInvertedIndexScore(double invertedIndexScore) {
        this.invertedIndexScore = invertedIndexScore;
    }
    
    public double getPageRankScore() {
        return pageRankScore;
    }
    
    public void setPageRankScore(double pageRankScore) {
        this.pageRankScore = pageRankScore;
    }
    
    public CodeIndexEngine.StorageTier getTier() {
        return tier;
    }
    
    public void setTier(CodeIndexEngine.StorageTier tier) {
        this.tier = tier;
    }
    
    public long getLastModified() {
        return lastModified;
    }
    
    public void setLastModified(long lastModified) {
        this.lastModified = lastModified;
    }
    
    public long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }
    
    public String getFileType() {
        return fileType;
    }
    
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
    
    public String getLanguage() {
        return language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }
    
    public String getMatchedQuery() {
        return matchedQuery;
    }
    
    public void setMatchedQuery(String matchedQuery) {
        this.matchedQuery = matchedQuery;
    }
    
    public List<String> getMatchedTokens() {
        return new ArrayList<>(matchedTokens);
    }
    
    public void setMatchedTokens(List<String> matchedTokens) {
        this.matchedTokens = new ArrayList<>(matchedTokens != null ? matchedTokens : Collections.emptyList());
    }
    
    public Map<String, Object> getHighlights() {
        return new HashMap<>(highlights);
    }
    
    public void setHighlights(Map<String, Object> highlights) {
        this.highlights = new HashMap<>(highlights != null ? highlights : Collections.emptyMap());
    }
    
    public String getSnippet() {
        return snippet;
    }
    
    public void setSnippet(String snippet) {
        this.snippet = snippet;
    }
    
    public boolean isComplianceRelevant() {
        return complianceRelevant;
    }
    
    public void setComplianceRelevant(boolean complianceRelevant) {
        this.complianceRelevant = complianceRelevant;
    }
    
    public Set<String> getComplianceTags() {
        return new HashSet<>(complianceTags);
    }
    
    public void setComplianceTags(Set<String> complianceTags) {
        this.complianceTags = new HashSet<>(complianceTags != null ? complianceTags : Collections.emptySet());
    }
    
    public String getAuditTrail() {
        return auditTrail;
    }
    
    public void setAuditTrail(String auditTrail) {
        this.auditTrail = auditTrail;
    }
}