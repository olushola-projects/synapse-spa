/**
 * React Hook for Supabase Edge Functions
 * Provides a consistent interface for calling Edge Functions with loading states
 */

import { useState, useCallback } from 'react';
import { apiClient, type ApiResponse } from '@/services/supabaseApiClient';

export interface UseSupabaseApiState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useSupabaseApi<T = any>() {
  const [state, setState] = useState<UseSupabaseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(
    async (
      functionName: string,
      payload?: any,
      options?: { requireAuth?: boolean }
    ): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response: ApiResponse<T> = await apiClient.callFunction(
          functionName,
          payload,
          options
        );

        if (response.error) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: response.error!
          }));
          return null;
        }

        setState(prev => ({
          ...prev,
          loading: false,
          data: response.data!
        }));

        return response.data!;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }));
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}

// Specialized hooks for specific Edge Functions
export function useHealthCheck() {
  const api = useSupabaseApi();

  const checkHealth = useCallback(async () => {
    return api.execute('nexus-health');
  }, [api]);

  return {
    ...api,
    checkHealth
  };
}

export function useSFDRClassify() {
  const api = useSupabaseApi();

  const classify = useCallback(
    async (productData: any) => {
      return api.execute('nexus-classify', productData, { requireAuth: true });
    },
    [api]
  );

  return {
    ...api,
    classify
  };
}

export function useComplianceCheck() {
  const api = useSupabaseApi();

  const checkCompliance = useCallback(
    async (data: any) => {
      return api.execute('check-compliance', data, { requireAuth: true });
    },
    [api]
  );

  return {
    ...api,
    checkCompliance
  };
}

export function useAnalytics() {
  const api = useSupabaseApi();

  const getAnalytics = useCallback(async () => {
    return api.execute('nexus-analytics', {}, { requireAuth: true });
  }, [api]);

  return {
    ...api,
    getAnalytics
  };
}
