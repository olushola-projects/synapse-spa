-- Enterprise Security Hardening & RegTech Compliance Remediation (Fixed)
-- Based on Big 4 audit standards and SFDR regulatory requirements

-- 1. Fix Badge Privacy Issue - Restrict badge visibility to owner only
DROP POLICY IF EXISTS "Authenticated users can view badges" ON public.badges;
CREATE POLICY "Users can view their own badges only" 
ON public.badges 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Enhance Waitlist Security with Rate Limiting and Validation
DROP POLICY IF EXISTS "Authenticated users can insert waitlist entries" ON public.waitlist;
CREATE POLICY "Rate limited waitlist insertion" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND
  -- Prevent duplicate emails within 24 hours
  NOT EXISTS (
    SELECT 1 FROM public.waitlist 
    WHERE email = waitlist.email 
    AND created_at > NOW() - INTERVAL '24 hours'
  ) AND
  -- Basic email validation
  waitlist.email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- 3. Add Audit Trail for Critical Operations
CREATE OR REPLACE FUNCTION public.audit_classification_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    new_values,
    timestamp,
    ip_address
  ) VALUES (
    auth.uid(),
    TG_OP,
    'llm_classification_audit',
    COALESCE(NEW.id::text, OLD.id::text),
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
    NOW(),
    COALESCE(
      (current_setting('request.headers', true)::json->>'x-forwarded-for'),
      '127.0.0.1'
    )::inet
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for classification audit
DROP TRIGGER IF EXISTS classification_audit_trigger ON public.llm_classification_audit;
CREATE TRIGGER classification_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.llm_classification_audit
  FOR EACH ROW EXECUTE FUNCTION public.audit_classification_access();

-- 4. SFDR Regulatory Compliance Table (Enterprise Grade)
CREATE TABLE IF NOT EXISTS public.sfdr_regulatory_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES public.compliance_assessments(id) ON DELETE CASCADE,
  regulatory_framework TEXT NOT NULL DEFAULT 'SFDR_2024',
  compliance_status TEXT NOT NULL CHECK (compliance_status IN ('COMPLIANT', 'NON_COMPLIANT', 'PENDING_REVIEW', 'REMEDIATION_REQUIRED')),
  last_validated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  validation_method TEXT NOT NULL CHECK (validation_method IN ('AUTOMATED', 'MANUAL', 'HYBRID')),
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on regulatory compliance table
ALTER TABLE public.sfdr_regulatory_compliance ENABLE ROW LEVEL SECURITY;

-- RLS policies for regulatory compliance
CREATE POLICY "Users can view their compliance status" 
ON public.sfdr_regulatory_compliance 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.compliance_assessments ca 
    WHERE ca.id = assessment_id AND ca.user_id = auth.uid()
  )
);

CREATE POLICY "System can insert compliance records" 
ON public.sfdr_regulatory_compliance 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.compliance_assessments ca 
    WHERE ca.id = assessment_id AND ca.user_id = auth.uid()
  )
);

-- 5. Performance Monitoring Table for SLA Tracking
CREATE TABLE IF NOT EXISTS public.api_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_name TEXT NOT NULL,
  response_time_ms INTEGER NOT NULL,
  status_code INTEGER NOT NULL,
  user_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  success_rate NUMERIC(5,2),
  error_details JSONB,
  load_level TEXT CHECK (load_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

-- Enable RLS
ALTER TABLE public.api_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Admin-only access for performance metrics
CREATE POLICY "Admins can view performance metrics" 
ON public.api_performance_metrics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "System can insert performance metrics" 
ON public.api_performance_metrics 
FOR INSERT 
WITH CHECK (true);

-- 6. Update timestamp trigger for regulatory compliance
CREATE OR REPLACE FUNCTION public.update_compliance_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_sfdr_compliance_timestamp
  BEFORE UPDATE ON public.sfdr_regulatory_compliance
  FOR EACH ROW EXECUTE FUNCTION public.update_compliance_timestamp();