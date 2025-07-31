import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ComplianceAssessment {
  id: string;
  fund_name: string;
  target_article: string;
  compliance_score: number | null;
  status: string;
  created_at: string;
  assessment_data: any;
}

interface ComplianceHistory {
  assessments: ComplianceAssessment[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useComplianceHistory = (): ComplianceHistory => {
  const [assessments, setAssessments] = useState<ComplianceAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAssessments = async () => {
    if (!user) {
      setAssessments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('compliance_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setAssessments(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assessments';
      setError(errorMessage);
      console.error('Error fetching compliance history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [user]);

  const refresh = () => {
    fetchAssessments();
  };

  return {
    assessments,
    loading,
    error,
    refresh
  };
};