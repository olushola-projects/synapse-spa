import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ClassificationRequest {
  productName: string;
  productType: string;
  sustainabilityObjectives?: string[];
  investmentStrategy?: string;
  riskProfile?: string;
  targetArticle?: string;
  paiIndicators?: Record<string, any>;
}

interface ClassificationResponse {
  classification: string;
  complianceScore: number;
  riskLevel: string;
  recommendations: string[];
  timestamp: string;
  confidence: number;
  reasoning: string;
  validation: {
    isValid: boolean;
    issues: string[];
  };
}

export function useSFDRClassification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResponse | null>(null);

  const classify = async (data: ClassificationRequest) => {
    setLoading(true);
    setError(null);

    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'nexus-classify',
        {
          body: JSON.stringify(data)
        }
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      setResult(functionData);
      return functionData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Classification failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    classify,
    loading,
    error,
    result
  };
}