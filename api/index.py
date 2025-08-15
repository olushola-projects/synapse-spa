#!/usr/bin/env python3
"""
SFDR Classification System - Enhanced API Server (Vercel Compatible)
AI-powered version with Qwen and OpenAI integration
"""

import os
import json
import logging
import time
from datetime import datetime
from typing import Dict, Any, Optional, List

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# Import enhanced AI classification engine
try:
    from enhanced_qwen_classification_engine import EnhancedQwenClassificationEngine
    AI_ENGINE_AVAILABLE = True
    logger.info("Enhanced Qwen Classification Engine imported successfully")
except ImportError as e:
    AI_ENGINE_AVAILABLE = False
    logger.warning(f"Enhanced AI engine not available, falling back to rules: {e}")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="SFDR Enhanced Classification System",
    description="Enhanced AI-powered SFDR document classification API",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ClassificationRequest(BaseModel):
    text: str = Field(..., description="Document text to classify")
    document_type: Optional[str] = Field(None, description="Type of document")

class ClassificationResponse(BaseModel):
    classification: str
    confidence: float
    processing_time: float
    reasoning: str
    sustainability_score: float
    key_indicators: List[str]
    risk_factors: List[str]
    regulatory_basis: List[str]
    benchmark_comparison: Dict[str, float]
    audit_trail: Dict[str, Any]
    explainability_score: float

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str
    uptime: float
    engine_status: str

# Enhanced SFDR Classification Logic
class EnhancedSFDRClassifier:
    """Enhanced SFDR classification with comprehensive features"""
    
    def __init__(self):
        self.sfdr_framework = {
            'article_6': {
                'keywords': ['traditional', 'conventional', 'standard'],
                'exclusions': ['sustainability', 'esg', 'green', 'impact']
            },
            'article_8': {
                'keywords': ['esg', 'environmental', 'social', 'governance', 'sustainability', 'green', 'responsible'],
                'indicators': ['screening', 'integration', 'factor', 'consideration']
            },
            'article_9': {
                'keywords': ['impact', 'sustainable objective', 'positive contribution', 'taxonomy aligned'],
                'indicators': ['investment objective', 'measurable impact', 'do no significant harm', 'additionality']
            }
        }
        
        self.benchmarks = {
            'article_6_baseline': 0.65,
            'article_8_baseline': 0.75,
            'article_9_baseline': 0.85,
            'industry_average': 0.72
        }
    
    def classify_document(self, text: str, document_type: Optional[str] = None) -> Dict[str, Any]:
        """Enhanced classification with full audit trail"""
        start_time = time.time()
        text_lower = text.lower()
        
        # Generate classification ID for audit trail
        classification_id = f"clf_{int(time.time() * 1000)}"
        
        # Score each article type
        scores = self._calculate_article_scores(text_lower)
        
        # Determine best classification
        best_article = max(scores, key=scores.get)
        raw_score = scores[best_article]
        
        # Enhanced confidence calculation
        confidence = self._calculate_enhanced_confidence(raw_score, text_lower, best_article)
        
        # Get classification details
        classification = best_article.replace('_', ' ').title()
        reasoning = self._generate_reasoning(text_lower, best_article, raw_score)
        key_indicators = self._extract_key_indicators(text_lower, best_article)
        
        # Sustainability scoring
        sustainability_score = self._calculate_sustainability_score(scores)
        
        # Risk assessment
        risk_factors = self._assess_risk_factors(confidence, text_lower, classification)
        
        # Regulatory basis
        regulatory_basis = self._get_regulatory_basis(best_article, confidence)
        
        # Benchmark comparison
        benchmark_comparison = self._compare_with_benchmarks(best_article, confidence)
        
        # Explainability score
        explainability_score = self._calculate_explainability(key_indicators, confidence)
        
        processing_time = time.time() - start_time
        
        # Complete audit trail
        audit_trail = {
            'classification_id': classification_id,
            'timestamp': datetime.now().isoformat(),
            'document_type': document_type,
            'engine_version': '2.0.0',
            'processing_time': processing_time,
            'confidence': confidence,
            'article_scores': scores,
            'method': 'enhanced_rules_v2'
        }
        
        return {
            'classification': classification,
            'confidence': confidence,
            'processing_time': processing_time,
            'reasoning': reasoning,
            'sustainability_score': sustainability_score,
            'key_indicators': key_indicators,
            'risk_factors': risk_factors,
            'regulatory_basis': regulatory_basis,
            'benchmark_comparison': benchmark_comparison,
            'audit_trail': audit_trail,
            'explainability_score': explainability_score
        }
    
    def _calculate_article_scores(self, text_lower: str) -> Dict[str, float]:
        """Calculate scores for each SFDR article"""
        scores = {'article_6': 0.1, 'article_8': 0.1, 'article_9': 0.1}  # Base scores
        
        for article, framework in self.sfdr_framework.items():
            # Keyword scoring
            for keyword in framework.get('keywords', []):
                if keyword in text_lower:
                    scores[article] += 0.15
            
            # Indicator scoring
            for indicator in framework.get('indicators', []):
                if indicator in text_lower:
                    scores[article] += 0.20
            
            # Exclusion penalties (for Article 6)
            if article == 'article_6':
                for exclusion in framework.get('exclusions', []):
                    if exclusion in text_lower:
                        scores[article] -= 0.10
        
        return scores
    
    def _calculate_enhanced_confidence(self, raw_score: float, text_lower: str, article: str) -> float:
        """Calculate enhanced confidence with multiple factors"""
        base_confidence = min(0.95, max(0.50, raw_score))
        
        # Text length factor
        text_length = len(text_lower.split())
        length_factor = min(0.05, text_length / 1000)
        
        # Specificity factor
        specificity_words = ['sfdr', 'article 8', 'article 9', 'taxonomy', 'esg disclosure']
        specificity_factor = sum(0.02 for word in specificity_words if word in text_lower)
        
        # Article-specific adjustments
        if article == 'article_9' and base_confidence < 0.8:
            base_confidence *= 0.9  # Article 9 requires higher confidence
        
        return min(0.95, base_confidence + length_factor + specificity_factor)
    
    def _generate_reasoning(self, text_lower: str, article: str, score: float) -> str:
        """Generate detailed reasoning for classification"""
        if article == 'article_9':
            return f"Document demonstrates sustainable investment objective with impact focus (score: {score:.2f}). Contains specific sustainability targets and measurable impact criteria aligned with SFDR Article 9 requirements."
        elif article == 'article_8':
            return f"Document promotes environmental and/or social characteristics through ESG integration (score: {score:.2f}). Shows systematic consideration of sustainability factors in investment process."
        else:
            return f"Document follows traditional investment approach without specific sustainability promotion (score: {score:.2f}). May include basic ESG considerations but lacks systematic integration."
    
    def _extract_key_indicators(self, text_lower: str, article: str) -> List[str]:
        """Extract key indicators found in the text"""
        indicators = []
        framework = self.sfdr_framework.get(article, {})
        
        for keyword in framework.get('keywords', []):
            if keyword in text_lower:
                indicators.append(keyword.title())
        
        for indicator in framework.get('indicators', []):
            if indicator in text_lower:
                indicators.append(indicator.title())
        
        return indicators[:5]  # Return top 5 indicators
    
    def _calculate_sustainability_score(self, scores: Dict[str, float]) -> float:
        """Calculate overall sustainability score"""
        return (scores['article_8'] * 0.5 + scores['article_9'] * 1.0) / 1.5
    
    def _assess_risk_factors(self, confidence: float, text_lower: str, classification: str) -> List[str]:
        """Assess potential risk factors"""
        risks = []
        
        if confidence < 0.7:
            risks.append("Low confidence classification")
        
        if 'greenwashing' in text_lower or 'green washing' in text_lower:
            risks.append("Potential greenwashing indicators")
        
        if classification == 'Article 9' and confidence < 0.8:
            risks.append("Article 9 classification requires high confidence")
        
        if len(text_lower.split()) < 50:
            risks.append("Limited text for comprehensive analysis")
        
        return risks if risks else ["No significant risks identified"]
    
    def _get_regulatory_basis(self, article: str, confidence: float) -> List[str]:
        """Get regulatory basis for classification"""
        basis_map = {
            'article_6': ["SFDR Article 6 - Other financial products"],
            'article_8': ["SFDR Article 8 - Products promoting E/S characteristics", "RTS Article 2 disclosure requirements"],
            'article_9': ["SFDR Article 9 - Sustainable investment objective", "RTS Article 3 disclosure requirements", "EU Taxonomy alignment requirements"]
        }
        
        basis = basis_map.get(article, ["General SFDR requirements"])
        
        if confidence < 0.7:
            basis.append("Manual review recommended due to confidence level")
        
        return basis
    
    def _compare_with_benchmarks(self, article: str, confidence: float) -> Dict[str, float]:
        """Compare with industry benchmarks"""
        baseline_key = f"{article}_baseline"
        baseline = self.benchmarks.get(baseline_key, self.benchmarks['industry_average'])
        
        return {
            'industry_baseline': baseline,
            'current_confidence': confidence,
            'performance_vs_baseline': round(confidence - baseline, 3),
            'percentile_rank': min(95, max(5, (confidence - 0.5) * 200))
        }
    
    def _calculate_explainability(self, key_indicators: List[str], confidence: float) -> float:
        """Calculate explainability score"""
        base_score = 0.6
        indicator_score = min(0.3, len(key_indicators) * 0.06)
        confidence_score = confidence * 0.1
        
        return min(1.0, base_score + indicator_score + confidence_score)

# Initialize classifier
if AI_ENGINE_AVAILABLE:
    # Configure AI engine with environment variables
    ai_config = {
        'openrouter': {
            'api_key': os.getenv('QWEN_API_KEY', ''),  # Primary OpenRouter API key
            'base_url': 'https://openrouter.ai/api/v1',
            'primary_model': 'Qwen3_235B_A22B',
            'fallback_models': [
                'Qwen3_235B_A22B (free)',
                'OpenAI: gpt-oss-20b (free)'
            ],
            'max_tokens': 4096
        },
        'openrouter_fallback': {
            'api_key': os.getenv('OPENAI_API_KEY', ''),  # Secondary OpenRouter API key
            'base_url': 'https://openrouter.ai/api/v1',
            'primary_model': 'OpenAI: gpt-oss-20b',
            'fallback_models': [
                'OpenAI: gpt-oss-20b (free)',
                'Qwen3_235B_A22B (free)'
            ],
            'max_tokens': 4096
        },
        'qwen': {
            'api_key': os.getenv('QWEN_API_KEY', ''),
            'model_name': 'Qwen3_235B_A22B',
            'max_tokens': 4096
        },
        'openai': {
            'api_key': os.getenv('OPENAI_API_KEY', ''),
            'model_name': 'gpt-oss-20b',
            'max_tokens': 4096
        }
    }
    classifier = EnhancedQwenClassificationEngine(ai_config)
    logger.info("AI-powered classification engine initialized")
else:
    # Fallback to enhanced rules-based classifier
    classifier = EnhancedSFDRClassifier()
    logger.info("Rules-based classification engine initialized")

# API endpoints
@app.get("/", include_in_schema=False)
async def root():
    return {"message": "SFDR Enhanced Classification API is running", "version": "2.0.0"}

@app.get("/health", response_model=HealthResponse)
@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    engine_status = "ai_powered" if AI_ENGINE_AVAILABLE else "rules_based"
    if AI_ENGINE_AVAILABLE:
        # Check if API keys are configured
        qwen_key = os.getenv('QWEN_API_KEY', '')
        openai_key = os.getenv('OPENAI_API_KEY', '')
        if qwen_key and openai_key:
            engine_status = "ai_fully_configured_openrouter"
        elif qwen_key or openai_key:
            engine_status = "ai_partially_configured_openrouter"
        else:
            engine_status = "ai_no_keys"
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "uptime": 0.0,
        "engine_status": engine_status
    }

@app.post("/classify", response_model=ClassificationResponse)
@app.post("/api/classify", response_model=ClassificationResponse)
async def classify_document(request: ClassificationRequest):
    try:
        if AI_ENGINE_AVAILABLE:
            # Use async AI classification
            result = await classifier.classify_document_async(request.text, request.document_type)
            # Convert dataclass to dict for response
            result_dict = {
                'classification': result.article_classification,
                'confidence': result.confidence_score,
                'processing_time': result.processing_time,
                'reasoning': result.reasoning,
                'sustainability_score': result.sustainability_score,
                'key_indicators': result.key_indicators,
                'risk_factors': result.risk_factors,
                'regulatory_basis': result.regulatory_basis,
                'benchmark_comparison': result.benchmark_comparison,
                'audit_trail': result.audit_trail,
                'explainability_score': result.explainability_score
            }
            return ClassificationResponse(**result_dict)
        else:
            # Use synchronous rules-based classification
            result = classifier.classify_document(request.text, request.document_type)
            return ClassificationResponse(**result)
    except Exception as e:
        logger.error(f"Classification failed: {e}")
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")

@app.get("/metrics")
@app.get("/api/metrics")
async def get_metrics():
    features = [
        "Enhanced confidence scoring",
        "Audit trail generation",
        "Benchmark comparison",
        "Risk assessment",
        "Regulatory compliance validation"
    ]
    
    if AI_ENGINE_AVAILABLE:
        features.extend([
            "AI-powered classification",
            "Qwen model integration",
            "OpenAI model fallback",
            "OpenRouter fallback models",
            "Multi-strategy processing"
        ])
    
    return {
        "status": "operational",
        "version": "2.0.0",
        "engine_type": "ai_powered" if AI_ENGINE_AVAILABLE else "rules_based",
        "classification_types": ["Article 6", "Article 8", "Article 9"],
        "features": features,
        "api_keys_configured": {
            "qwen": bool(os.getenv('QWEN_API_KEY')),
            "openai": bool(os.getenv('OPENAI_API_KEY')),
            "openrouter": bool(os.getenv('OPENROUTER_API_KEY'))
        }
    }

# For Vercel serverless function - export the FastAPI app
# Vercel will automatically detect and use the 'app' variable
