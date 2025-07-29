package com.synapse.indexing;

import java.util.*;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.stream.Collectors;

/**
 * Advanced code tokenizer with language-specific parsing capabilities.
 * Based on patterns from GitHub's semantic code search, Sourcegraph, and tree-sitter.
 * 
 * Features:
 * - Multi-language support (Java, JavaScript, Python, C++, etc.)
 * - Semantic token extraction (identifiers, keywords, literals)
 * - CamelCase and snake_case splitting
 * - Comment and string literal handling
 * - Symbol and operator recognition
 * 
 * @author Synapse Engineering Team
 * @version 1.0
 */
public class CodeTokenizer {
    
    // Language detection patterns
    private static final Map<String, Pattern> LANGUAGE_PATTERNS = new HashMap<>();
    
    // Token type patterns
    private static final Pattern IDENTIFIER_PATTERN = Pattern.compile("[a-zA-Z_][a-zA-Z0-9_]*");
    private static final Pattern CAMEL_CASE_PATTERN = Pattern.compile("([a-z])([A-Z])");
    private static final Pattern SNAKE_CASE_PATTERN = Pattern.compile("_+");
    private static final Pattern NUMBER_PATTERN = Pattern.compile("\\b\\d+(\\.\\d+)?([eE][+-]?\\d+)?\\b");
    private static final Pattern STRING_LITERAL_PATTERN = Pattern.compile("\"([^\"\\\\]|\\\\.)*\"|'([^'\\\\]|\\\\.)*'");
    private static final Pattern COMMENT_PATTERN = Pattern.compile("//.*?$|/\\*.*?\\*/", Pattern.MULTILINE | Pattern.DOTALL);
    
    // Language-specific keywords
    private static final Map<String, Set<String>> LANGUAGE_KEYWORDS = new HashMap<>();
    
    // Common programming symbols
    private static final Set<String> OPERATORS = Set.of(
        "+", "-", "*", "/", "%", "=", "==", "!=", "<", ">", "<=", ">=",
        "&&", "||", "!", "&", "|", "^", "<<", ">>", "++", "--",
        "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "<<=", ">>="
    );
    
    static {
        initializeLanguagePatterns();
        initializeLanguageKeywords();
    }
    
    /**
     * Initializes language detection patterns.
     */
    private static void initializeLanguagePatterns() {
        // Java patterns
        LANGUAGE_PATTERNS.put("java", Pattern.compile(
            "\\b(public|private|protected|class|interface|extends|implements)\\b"));
        
        // JavaScript patterns
        LANGUAGE_PATTERNS.put("javascript", Pattern.compile(
            "\\b(function|var|let|const|=>|require|module\\.exports)\\b"));
        
        // Python patterns
        LANGUAGE_PATTERNS.put("python", Pattern.compile(
            "\\b(def|class|import|from|if __name__|self\\.)\\b"));
        
        // C++ patterns
        LANGUAGE_PATTERNS.put("cpp", Pattern.compile(
            "\\b(#include|namespace|using|std::|template|typename)\\b"));
        
        // C# patterns
        LANGUAGE_PATTERNS.put("csharp", Pattern.compile(
            "\\b(using|namespace|public|private|class|interface|var)\\b"));
        
        // TypeScript patterns
        LANGUAGE_PATTERNS.put("typescript", Pattern.compile(
            "\\b(interface|type|export|import|declare|namespace)\\b"));
    }
    
    /**
     * Initializes language-specific keywords.
     */
    private static void initializeLanguageKeywords() {
        // Java keywords
        LANGUAGE_KEYWORDS.put("java", Set.of(
            "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
            "class", "const", "continue", "default", "do", "double", "else", "enum",
            "extends", "final", "finally", "float", "for", "goto", "if", "implements",
            "import", "instanceof", "int", "interface", "long", "native", "new", "package",
            "private", "protected", "public", "return", "short", "static", "strictfp",
            "super", "switch", "synchronized", "this", "throw", "throws", "transient",
            "try", "void", "volatile", "while"
        ));
        
        // JavaScript keywords
        LANGUAGE_KEYWORDS.put("javascript", Set.of(
            "break", "case", "catch", "class", "const", "continue", "debugger", "default",
            "delete", "do", "else", "export", "extends", "finally", "for", "function",
            "if", "import", "in", "instanceof", "let", "new", "return", "super",
            "switch", "this", "throw", "try", "typeof", "var", "void", "while", "with",
            "yield", "async", "await"
        ));
        
        // Python keywords
        LANGUAGE_KEYWORDS.put("python", Set.of(
            "False", "None", "True", "and", "as", "assert", "break", "class", "continue",
            "def", "del", "elif", "else", "except", "finally", "for", "from", "global",
            "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass",
            "raise", "return", "try", "while", "with", "yield", "async", "await"
        ));
    }
    
    /**
     * Tokenizes source code with language-specific intelligence.
     * 
     * @param content Source code content
     * @param filePath File path for language detection
     * @return Set of extracted tokens
     */
    public static Set<String> tokenize(String content, String filePath) {
        if (content == null || content.trim().isEmpty()) {
            return Collections.emptySet();
        }
        
        String language = detectLanguage(content, filePath);
        Set<String> tokens = new HashSet<>();
        
        // Remove comments and string literals for cleaner tokenization
        String cleanedContent = removeCommentsAndStrings(content);
        
        // Extract different types of tokens
        tokens.addAll(extractIdentifiers(cleanedContent, language));
        tokens.addAll(extractKeywords(cleanedContent, language));
        tokens.addAll(extractCamelCaseTokens(cleanedContent));
        tokens.addAll(extractSnakeCaseTokens(cleanedContent));
        tokens.addAll(extractOperators(cleanedContent));
        
        // Filter and normalize tokens
        return tokens.stream()
            .filter(token -> token.length() >= 2) // Minimum token length
            .filter(token -> !isNumeric(token))   // Exclude pure numbers
            .map(String::toLowerCase)             // Normalize case
            .collect(Collectors.toSet());
    }
    
    /**
     * Detects the programming language of the source code.
     * 
     * @param content Source code content
     * @param filePath File path with extension
     * @return Detected language
     */
    public static String detectLanguage(String content, String filePath) {
        // First try file extension
        String language = detectLanguageByExtension(filePath);
        if (language != null) {
            return language;
        }
        
        // Fallback to content analysis
        return detectLanguageByContent(content);
    }
    
    /**
     * Detects language by file extension.
     * 
     * @param filePath File path
     * @return Detected language or null
     */
    private static String detectLanguageByExtension(String filePath) {
        if (filePath == null) {
            return null;
        }
        
        String extension = getFileExtension(filePath).toLowerCase();
        
        switch (extension) {
            case "java":
                return "java";
            case "js":
            case "jsx":
                return "javascript";
            case "ts":
            case "tsx":
                return "typescript";
            case "py":
                return "python";
            case "cpp":
            case "cc":
            case "cxx":
            case "c++":
                return "cpp";
            case "cs":
                return "csharp";
            case "c":
                return "c";
            case "h":
            case "hpp":
                return "cpp"; // Assume C++ for headers
            default:
                return null;
        }
    }
    
    /**
     * Detects language by analyzing content patterns.
     * 
     * @param content Source code content
     * @return Detected language
     */
    private static String detectLanguageByContent(String content) {
        Map<String, Integer> languageScores = new HashMap<>();
        
        for (Map.Entry<String, Pattern> entry : LANGUAGE_PATTERNS.entrySet()) {
            String language = entry.getKey();
            Pattern pattern = entry.getValue();
            
            Matcher matcher = pattern.matcher(content);
            int matches = 0;
            while (matcher.find()) {
                matches++;
            }
            
            languageScores.put(language, matches);
        }
        
        // Return language with highest score
        return languageScores.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("unknown");
    }
    
    /**
     * Extracts identifier tokens from source code.
     * 
     * @param content Cleaned source code
     * @param language Programming language
     * @return Set of identifier tokens
     */
    private static Set<String> extractIdentifiers(String content, String language) {
        Set<String> identifiers = new HashSet<>();
        Matcher matcher = IDENTIFIER_PATTERN.matcher(content);
        
        Set<String> keywords = LANGUAGE_KEYWORDS.getOrDefault(language, Collections.emptySet());
        
        while (matcher.find()) {
            String identifier = matcher.group();
            
            // Skip keywords and common noise words
            if (!keywords.contains(identifier) && !isCommonNoiseWord(identifier)) {
                identifiers.add(identifier);
            }
        }
        
        return identifiers;
    }
    
    /**
     * Extracts language keywords from source code.
     * 
     * @param content Source code content
     * @param language Programming language
     * @return Set of keyword tokens
     */
    private static Set<String> extractKeywords(String content, String language) {
        Set<String> keywords = LANGUAGE_KEYWORDS.getOrDefault(language, Collections.emptySet());
        Set<String> foundKeywords = new HashSet<>();
        
        for (String keyword : keywords) {
            Pattern keywordPattern = Pattern.compile("\\b" + Pattern.quote(keyword) + "\\b");
            if (keywordPattern.matcher(content).find()) {
                foundKeywords.add(keyword);
            }
        }
        
        return foundKeywords;
    }
    
    /**
     * Extracts and splits CamelCase tokens.
     * 
     * @param content Source code content
     * @return Set of CamelCase-derived tokens
     */
    private static Set<String> extractCamelCaseTokens(String content) {
        Set<String> tokens = new HashSet<>();
        Matcher matcher = IDENTIFIER_PATTERN.matcher(content);
        
        while (matcher.find()) {
            String identifier = matcher.group();
            
            // Split CamelCase
            if (containsCamelCase(identifier)) {
                String[] parts = CAMEL_CASE_PATTERN.matcher(identifier)
                    .replaceAll("$1 $2")
                    .split("\\s+");
                
                for (String part : parts) {
                    if (part.length() >= 2) {
                        tokens.add(part);
                    }
                }
            }
        }
        
        return tokens;
    }
    
    /**
     * Extracts and splits snake_case tokens.
     * 
     * @param content Source code content
     * @return Set of snake_case-derived tokens
     */
    private static Set<String> extractSnakeCaseTokens(String content) {
        Set<String> tokens = new HashSet<>();
        Matcher matcher = IDENTIFIER_PATTERN.matcher(content);
        
        while (matcher.find()) {
            String identifier = matcher.group();
            
            // Split snake_case
            if (identifier.contains("_")) {
                String[] parts = SNAKE_CASE_PATTERN.split(identifier);
                
                for (String part : parts) {
                    if (part.length() >= 2) {
                        tokens.add(part);
                    }
                }
            }
        }
        
        return tokens;
    }
    
    /**
     * Extracts operator tokens from source code.
     * 
     * @param content Source code content
     * @return Set of operator tokens
     */
    private static Set<String> extractOperators(String content) {
        Set<String> foundOperators = new HashSet<>();
        
        for (String operator : OPERATORS) {
            if (content.contains(operator)) {
                foundOperators.add(operator);
            }
        }
        
        return foundOperators;
    }
    
    /**
     * Removes comments and string literals from source code.
     * 
     * @param content Original source code
     * @return Cleaned source code
     */
    private static String removeCommentsAndStrings(String content) {
        // Remove string literals
        String withoutStrings = STRING_LITERAL_PATTERN.matcher(content).replaceAll(" ");
        
        // Remove comments
        String withoutComments = COMMENT_PATTERN.matcher(withoutStrings).replaceAll(" ");
        
        return withoutComments;
    }
    
    /**
     * Checks if an identifier contains CamelCase pattern.
     * 
     * @param identifier Identifier to check
     * @return true if contains CamelCase
     */
    private static boolean containsCamelCase(String identifier) {
        return CAMEL_CASE_PATTERN.matcher(identifier).find();
    }
    
    /**
     * Checks if a token is a common noise word.
     * 
     * @param token Token to check
     * @return true if it's a noise word
     */
    private static boolean isCommonNoiseWord(String token) {
        Set<String> noiseWords = Set.of(
            "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
            "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
            "to", "was", "will", "with", "get", "set", "add", "remove", "delete",
            "create", "update", "find", "search", "list", "item", "data", "info",
            "temp", "tmp", "test", "demo", "example", "sample"
        );
        
        return noiseWords.contains(token.toLowerCase());
    }
    
    /**
     * Checks if a string is purely numeric.
     * 
     * @param str String to check
     * @return true if numeric
     */
    private static boolean isNumeric(String str) {
        return NUMBER_PATTERN.matcher(str).matches();
    }
    
    /**
     * Extracts file extension from file path.
     * 
     * @param filePath File path
     * @return File extension
     */
    private static String getFileExtension(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return "";
        }
        
        int lastDotIndex = filePath.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filePath.length() - 1) {
            return "";
        }
        
        return filePath.substring(lastDotIndex + 1);
    }
    
    /**
     * Generates trigrams from a token for fuzzy matching.
     * 
     * @param token Input token
     * @return Set of trigrams
     */
    public static Set<String> generateTrigrams(String token) {
        if (token == null || token.length() < 3) {
            return Collections.emptySet();
        }
        
        Set<String> trigrams = new HashSet<>();
        String paddedToken = "$$" + token.toLowerCase() + "$$";
        
        for (int i = 0; i <= paddedToken.length() - 3; i++) {
            trigrams.add(paddedToken.substring(i, i + 3));
        }
        
        return trigrams;
    }
    
    /**
     * Tokenizes content specifically for trigram indexing.
     * 
     * @param content Source code content
     * @param filePath File path for language detection
     * @return Set of tokens suitable for trigram indexing
     */
    public static Set<String> tokenizeForTrigrams(String content, String filePath) {
        Set<String> baseTokens = tokenize(content, filePath);
        Set<String> trigramTokens = new HashSet<>();
        
        for (String token : baseTokens) {
            // Add original token
            trigramTokens.add(token);
            
            // Add trigrams for fuzzy matching
            trigramTokens.addAll(generateTrigrams(token));
        }
        
        return trigramTokens;
    }
    
    /**
     * Extracts semantic tokens for advanced code understanding.
     * 
     * @param content Source code content
     * @param language Programming language
     * @return Map of token types to tokens
     */
    public static Map<String, Set<String>> extractSemanticTokens(String content, String language) {
        Map<String, Set<String>> semanticTokens = new HashMap<>();
        
        semanticTokens.put("identifiers", extractIdentifiers(content, language));
        semanticTokens.put("keywords", extractKeywords(content, language));
        semanticTokens.put("camelCase", extractCamelCaseTokens(content));
        semanticTokens.put("snakeCase", extractSnakeCaseTokens(content));
        semanticTokens.put("operators", extractOperators(content));
        
        return semanticTokens;
    }
}