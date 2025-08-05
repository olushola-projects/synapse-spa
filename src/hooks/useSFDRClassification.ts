import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type {
  NexusClassificationRequest,
  NexusClassificationResponse
} from '@/services/nexusAgentClient';
import { NexusAgentClient } from '@/services/nexusAgentClient';
import { useAuth } from '@/contexts/AuthContext';

interface SFDRClassificationHookResult {
  classify: (productData: NexusClassificationRequest) => Promise<NexusClassificationResponse>;
  loading: boolean;
  result: NexusClassificationResponse | null;
  error: string | null;
  clearResult: () => void;
}

export const useSFDRClassification = (): SFDRClassificationHookResult => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NexusClassificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const saveClassificationToSupabase = async (
    productData: NexusClassificationRequest,
    classification: NexusClassificationResponse
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to save classifications');
    }

    try {
      // Save to compliance_assessments table
      const assessmentData = {
        user_id: user.id,
        entity_id: `product_${Date.now()}`,
        fund_name: productData.productName,
        target_article: productData.targetArticle || classification.classification,
        assessment_data: JSON.parse(
          JSON.stringify({
            productData,
            classification,
            timestamp: new Date().toISOString()
          })
        ),
        validation_results: JSON.parse(JSON.stringify(classification.validation || {})),
        compliance_score: Math.round(classification.complianceScore),
        status: 'completed'
      };

      const { data: assessment, error: assessmentError } = await supabase
        .from('compliance_assessments')
        .insert(assessmentData)
        .select()
        .single();

      if (assessmentError) {
        console.error('Error saving assessment:', assessmentError);
        throw assessmentError;
      }

      // Save detailed report to compliance_reports table
      const reportData = {
        user_id: user.id,
        assessment_id: assessment.id,
        report_type: 'SFDR_CLASSIFICATION',
        report_data: JSON.parse(
          JSON.stringify({
            classification,
            productData,
            generatedAt: new Date().toISOString(),
            riskLevel: classification.riskLevel,
            recommendations: classification.recommendations
          })
        )
      };

      const { error: reportError } = await supabase.from('compliance_reports').insert(reportData);

      if (reportError) {
        console.error('Error saving report:', reportError);
        // Don't throw here as assessment was saved successfully
      }

      return assessment;
    } catch (err) {
      console.error('Error saving to Supabase:', err);
      throw err;
    }
  };

  const classify = async (
    productData: NexusClassificationRequest
  ): Promise<NexusClassificationResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Use Supabase Edge Function directly - no API key needed in frontend
      const client = new NexusAgentClient();
      const classification = await client.classifyProduct(productData);
      setResult(classification);

      // Save to Supabase for chat history and compliance tracking
      await saveClassificationToSupabase(productData, classification);

      return classification;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Classification failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return {
    classify,
    loading,
    result,
    error,
    clearResult
  };
};
