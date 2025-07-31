-- ============================================================================
-- SYNAPSE GRC PLATFORM - COMPREHENSIVE BACKEND SCHEMA
-- ============================================================================

-- Create custom types for enums
CREATE TYPE public.user_role AS ENUM ('admin', 'enterprise_user', 'reviewer', 'agent');
CREATE TYPE public.subscription_status AS ENUM ('trial', 'basic', 'professional', 'enterprise', 'cancelled');
CREATE TYPE public.industry_type AS ENUM ('banking', 'fintech', 'insurance', 'asset_management', 'consulting', 'other');
CREATE TYPE public.agent_type AS ENUM ('ESGAgent', 'AMLAgent', 'RiskAgent', 'ComplianceAgent', 'AuditAgent', 'RegTechAgent');
CREATE TYPE public.document_type AS ENUM ('policy', 'procedure', 'evidence', 'report', 'regulation', 'guideline', 'template');
CREATE TYPE public.processing_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'archived');
CREATE TYPE public.task_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue', 'cancelled');
CREATE TYPE public.signal_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.audit_action AS ENUM ('create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'share');

-- ============================================================================
-- ORGANIZATIONS TABLE
-- ============================================================================

CREATE TABLE public.organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    industry industry_type NOT NULL DEFAULT 'other',
    region TEXT,
    subscription_status subscription_status NOT NULL DEFAULT 'trial',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    max_users INTEGER DEFAULT 10,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Organizations
CREATE POLICY "Users can view their organization"
    ON public.organizations FOR SELECT
    USING (
        id IN (
            SELECT org_id FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage their organization"
    ON public.organizations FOR ALL
    USING (
        id IN (
            SELECT p.org_id FROM public.profiles p
            JOIN public.user_roles ur ON p.id = ur.user_id
            WHERE p.id = auth.uid() AND ur.role = 'admin'
        )
    );

-- ============================================================================
-- USER ROLES TABLE (Enhanced from existing)
-- ============================================================================

CREATE TABLE public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role user_role NOT NULL DEFAULT 'enterprise_user',
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT role FROM public.user_roles 
    WHERE user_id = user_uuid AND is_active = TRUE
    ORDER BY granted_at DESC 
    LIMIT 1;
$$;

-- RLS Policies for User Roles
CREATE POLICY "Users can view roles in their org"
    ON public.user_roles FOR SELECT
    USING (
        user_id IN (
            SELECT p1.id FROM public.profiles p1
            JOIN public.profiles p2 ON p1.org_id = p2.org_id
            WHERE p2.id = auth.uid()
        )
    );

-- ============================================================================
-- ENHANCED PROFILES TABLE
-- ============================================================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id),
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update existing profiles RLS to include org-based access
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view profiles in their org"
    ON public.profiles FOR SELECT
    USING (
        id = auth.uid() OR 
        org_id IN (
            SELECT org_id FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- ============================================================================
-- AI AGENTS TABLE
-- ============================================================================

CREATE TABLE public.agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_name TEXT NOT NULL,
    agent_type agent_type NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    configuration JSONB DEFAULT '{}',
    capabilities JSONB DEFAULT '[]',
    tasks_handled INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Agents
CREATE POLICY "Users can view agents in their org"
    ON public.agents FOR SELECT
    USING (
        org_id IN (
            SELECT org_id FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own agents"
    ON public.agents FOR ALL
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

-- ============================================================================
-- ENHANCED DOCUMENTS TABLE  
-- ============================================================================

-- Update existing documents table with new columns
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id),
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_confidential BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'organization';

-- Update documents RLS to include org-based access
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;

CREATE POLICY "Users can view org documents"
    ON public.documents FOR SELECT
    USING (
        user_id = auth.uid() OR
        (org_id IN (
            SELECT org_id FROM public.profiles 
            WHERE id = auth.uid()
        ) AND (is_confidential = FALSE OR user_id = auth.uid()))
    );

CREATE POLICY "Users can manage their own documents"
    ON public.documents FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- TASKS/ASSIGNMENTS TABLE
-- ============================================================================

CREATE TABLE public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    linked_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    status task_status DEFAULT 'pending',
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Tasks
CREATE POLICY "Users can view tasks in their org"
    ON public.tasks FOR SELECT
    USING (
        org_id IN (
            SELECT org_id FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage tasks assigned to them or created by them"
    ON public.tasks FOR ALL
    USING (
        assignee_id = auth.uid() OR 
        assigner_id = auth.uid() OR
        public.get_user_role(auth.uid()) = 'admin'
    );

-- ============================================================================
-- AGENT INTERACTIONS TABLE
-- ============================================================================

CREATE TABLE public.agent_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    query TEXT NOT NULL,
    response TEXT,
    context JSONB DEFAULT '{}',
    tokens_used INTEGER DEFAULT 0,
    response_time_ms INTEGER,
    feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.agent_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Agent Interactions
CREATE POLICY "Users can view their own interactions"
    ON public.agent_interactions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own interactions"
    ON public.agent_interactions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view org interactions"
    ON public.agent_interactions FOR SELECT
    USING (
        public.get_user_role(auth.uid()) = 'admin' AND
        org_id IN (
            SELECT org_id FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- ============================================================================
-- COMPLIANCE SIGNALS TABLE
-- ============================================================================

CREATE TABLE public.compliance_signals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    signal_type TEXT NOT NULL,
    severity signal_severity NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    linked_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    metadata JSONB DEFAULT '{}',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.compliance_signals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Compliance Signals
CREATE POLICY "Users can view signals in their org"
    ON public.compliance_signals FOR SELECT
    USING (
        org_id IN (
            SELECT org_id FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage signals they created"
    ON public.compliance_signals FOR ALL
    USING (
        created_by = auth.uid() OR
        public.get_user_role(auth.uid()) IN ('admin', 'reviewer')
    );

-- ============================================================================
-- AUDIT TRAIL TABLE
-- ============================================================================

CREATE TABLE public.audit_trail (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    action audit_action NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Audit Trail (Admin only)
CREATE POLICY "Admins can view org audit trail"
    ON public.audit_trail FOR SELECT
    USING (
        public.get_user_role(auth.uid()) = 'admin' AND
        org_id IN (
            SELECT org_id FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Create additional storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('policy-documents', 'policy-documents', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('compliance-reports', 'compliance-reports', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('evidence-files', 'evidence-files', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('user-uploads', 'user-uploads', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('exports', 'exports', false);

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Policy Documents Storage Policies
CREATE POLICY "Users can view org policy documents"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'policy-documents' AND
        (storage.foldername(name))[1]::uuid IN (
            SELECT org_id::text FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can upload policy documents to their org"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'policy-documents' AND
        (storage.foldername(name))[1]::uuid IN (
            SELECT org_id::text FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Compliance Reports Storage Policies
CREATE POLICY "Users can view org compliance reports"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'compliance-reports' AND
        (storage.foldername(name))[1]::uuid IN (
            SELECT org_id::text FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can upload compliance reports to their org"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'compliance-reports' AND
        (storage.foldername(name))[1]::uuid IN (
            SELECT org_id::text FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Evidence Files Storage Policies
CREATE POLICY "Users can view org evidence files"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'evidence-files' AND
        (storage.foldername(name))[1]::uuid IN (
            SELECT org_id::text FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can upload evidence files to their org"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'evidence-files' AND
        (storage.foldername(name))[1]::uuid IN (
            SELECT org_id::text FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- User Uploads Storage Policies  
CREATE POLICY "Users can manage their own uploads"
    ON storage.objects FOR ALL
    USING (
        bucket_id = 'user-uploads' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Exports Storage Policies
CREATE POLICY "Users can view org exports"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'exports' AND
        (storage.foldername(name))[1]::uuid IN (
            SELECT org_id::text FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Organizations indexes
CREATE INDEX idx_organizations_industry ON public.organizations(industry);
CREATE INDEX idx_organizations_subscription_status ON public.organizations(subscription_status);

-- Profiles indexes
CREATE INDEX idx_profiles_org_id ON public.profiles(org_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_is_active ON public.profiles(is_active);

-- User Roles indexes
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_user_roles_is_active ON public.user_roles(is_active);

-- Agents indexes
CREATE INDEX idx_agents_org_id ON public.agents(org_id);
CREATE INDEX idx_agents_owner_id ON public.agents(owner_id);
CREATE INDEX idx_agents_type ON public.agents(agent_type);
CREATE INDEX idx_agents_is_active ON public.agents(is_active);

-- Documents indexes
CREATE INDEX idx_documents_org_id ON public.documents(org_id);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_document_type ON public.documents(document_type);
CREATE INDEX idx_documents_processing_status ON public.documents(processing_status);
CREATE INDEX idx_documents_tags ON public.documents USING GIN(tags);

-- Tasks indexes
CREATE INDEX idx_tasks_org_id ON public.tasks(org_id);
CREATE INDEX idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_tags ON public.tasks USING GIN(tags);

-- Agent Interactions indexes
CREATE INDEX idx_agent_interactions_user_id ON public.agent_interactions(user_id);
CREATE INDEX idx_agent_interactions_agent_id ON public.agent_interactions(agent_id);
CREATE INDEX idx_agent_interactions_org_id ON public.agent_interactions(org_id);
CREATE INDEX idx_agent_interactions_session_id ON public.agent_interactions(session_id);
CREATE INDEX idx_agent_interactions_created_at ON public.agent_interactions(created_at);

-- Compliance Signals indexes
CREATE INDEX idx_compliance_signals_org_id ON public.compliance_signals(org_id);
CREATE INDEX idx_compliance_signals_severity ON public.compliance_signals(severity);
CREATE INDEX idx_compliance_signals_is_resolved ON public.compliance_signals(is_resolved);
CREATE INDEX idx_compliance_signals_created_by ON public.compliance_signals(created_by);

-- Audit Trail indexes
CREATE INDEX idx_audit_trail_user_id ON public.audit_trail(user_id);
CREATE INDEX idx_audit_trail_org_id ON public.audit_trail(org_id);
CREATE INDEX idx_audit_trail_action ON public.audit_trail(action);
CREATE INDEX idx_audit_trail_resource_type ON public.audit_trail(resource_type);
CREATE INDEX idx_audit_trail_created_at ON public.audit_trail(created_at);

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to automatically update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers to relevant tables
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON public.agents
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_signals_updated_at
    BEFORE UPDATE ON public.compliance_signals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create audit trail entries
CREATE OR REPLACE FUNCTION public.create_audit_entry()
RETURNS TRIGGER AS $$
DECLARE
    org_uuid UUID;
BEGIN
    -- Get org_id from the user's profile
    SELECT org_id INTO org_uuid 
    FROM public.profiles 
    WHERE id = auth.uid();

    -- Insert audit trail entry
    INSERT INTO public.audit_trail (
        user_id,
        org_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        metadata
    ) VALUES (
        auth.uid(),
        org_uuid,
        CASE 
            WHEN TG_OP = 'INSERT' THEN 'create'::audit_action
            WHEN TG_OP = 'UPDATE' THEN 'update'::audit_action
            WHEN TG_OP = 'DELETE' THEN 'delete'::audit_action
        END,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
        jsonb_build_object('operation', TG_OP, 'table', TG_TABLE_NAME)
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;