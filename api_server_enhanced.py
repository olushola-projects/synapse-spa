#!/usr/bin/env python3
"""
SFDR Classification System - Enhanced API Server
Deploys the advanced Qwen classification engine
"""

import os
import json
import logging
import time
from datetime import datetime
from typing import Dict, Any, Optional, List
from pathlib import Path

from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# Import the enhanced classification engine
try:
    from enhanced_qwen_classification_engine import EnhancedQwenClassificationEngine, ClassificationResult
    ENHANCED_ENGINE_AVAILABLE = True
except ImportError:
    ENHANCED_ENGINE_AVAILABLE = False
    print("Enhanced engine not available, using fallback")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="SFDR Enhanced Classification System",
    description="Advanced AI-powered SFDR document classification API with Qwen models",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize enhanced classification engine
config = {
    'qwen': {
        'api_key': os.getenv('QWEN_API_KEY', ''),
        'model_name': 'qwen-turbo',
        'max_tokens': 2048
    },
    'processing': {
        'batch_size': 10,
        'timeout': 30,
        'retry_attempts': 3
    }
}

classification_engine = None
if ENHANCED_ENGINE_AVAILABLE:
    try:
        classification_engine = EnhancedQwenClassificationEngine(config)
        logger.info("Enhanced classification engine initialized successfully")
    except Exception as e:
        logger.warning(f"Could not initialize enhanced engine: {e}")
        classification_engine = None
else:
    logger.info("Using basic classification engine")

# Pydantic models
class ClassificationRequest(BaseModel):
    text: str = Field(..., description="Document text to classify")
    document_type: Optional[str] = Field(None, description="Type of document")

class ClassificationResponse(BaseModel):
    classification: str
    confidence: float
    processing_time: float
    reasoning: Optional[str] = None
    sustainability_score: Optional[float] = None
    key_indicators: Optional[List[str]] = None
    risk_factors: Optional[List[str]] = None

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str
    uptime: float
    engine_status: str

# API endpoints
@app.get("/", include_in_schema=False)
async def root():
    return {"message": "SFDR Enhanced Classification API is running"}

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    start_time = time.time()
    
    engine_status = "enhanced" if classification_engine else "basic"
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "uptime": time.time() - start_time,
        "engine_status": engine_status
    }

@app.post("/api/classify", response_model=ClassificationResponse)
async def classify_document(request: ClassificationRequest):
    start_time = time.time()
    
    if classification_engine:
        # Use enhanced classification engine
        try:
            result = await classification_engine.classify_document_async(
                request.text,
                document_type=request.document_type
            )
            
            processing_time = time.time() - start_time
            
            return {
                "classification": result.article_classification,
                "confidence": result.confidence_score,
                "processing_time": processing_time,
                "reasoning": result.reasoning,
                "sustainability_score": result.sustainability_score,
                "key_indicators": result.key_indicators,
                "risk_factors": result.risk_factors
            }
        except Exception as e:
            logger.error(f"Enhanced classification failed: {e}")
            # Fall back to basic classification
    
    # Basic classification fallback
    processing_time = time.time() - start_time
    
    # Simple rule-based classification
    text_lower = request.text.lower()
    if any(word in text_lower for word in ['esg', 'sustainable', 'green', 'environmental']):
        classification = "Article 8"
        confidence = 0.85
    elif any(word in text_lower for word in ['impact', 'positive', 'social', 'governance']):
        classification = "Article 9"
        confidence = 0.90
    else:
        classification = "Article 6"
        confidence = 0.75
    
    return {
        "classification": classification,
        "confidence": confidence,
        "processing_time": processing_time,
        "reasoning": "Basic rule-based classification",
        "sustainability_score": confidence,
        "key_indicators": ["Basic analysis"],
        "risk_factors": ["Limited analysis"]
    }

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    max_size = 10 * 1024 * 1024  # 10MB
    file_size = 0
    content = b""
    
    chunk_size = 1024 * 1024  # 1MB chunks
    while True:
        chunk = await file.read(chunk_size)
        if not chunk:
            break
        content += chunk
        file_size += len(chunk)
        if file_size > max_size:
            raise HTTPException(status_code=413, detail="File too large (max 10MB)")
    
    text_content = content.decode("utf-8")
    
    # Classify the uploaded document
    classification_result = await classify_document(ClassificationRequest(
        text=text_content,
        document_type="uploaded_document"
    ))
    
    return {
        "filename": file.filename,
        "size": file_size,
        "classification": classification_result.classification,
        "confidence": classification_result.confidence,
        "status": "processed"
    }

# For local development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_server_enhanced:app", host="0.0.0.0", port=8000, reload=True)
