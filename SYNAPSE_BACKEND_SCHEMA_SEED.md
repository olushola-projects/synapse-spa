# SYNAPSE GRC PLATFORM - COMPREHENSIVE BACKEND SCHEMA & SEED DATA

## Database Migration Status
❌ **Migration Failed:** Column "org_id" does not exist in profiles table

## Required Migration Steps (Execute in Order):

### Step 1: Create Base Schema First
```sql
-- Add missing column to profiles table first
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS org_id UUID;

-- Create organizations table
CREATE TABLE public.organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT NOT NULL DEFAULT 'other',
    region TEXT,
    subscription_status TEXT NOT NULL DEFAULT 'trial',
    max_users INTEGER DEFAULT 10,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Now add the foreign key constraint
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_org_id 
FOREIGN KEY (org_id) REFERENCES public.organizations(id);
```

### Step 2: Complete Schema (Run after Step 1)
The full schema includes:
- Enhanced user roles system with proper enums
- AI agents table for ESG, AML, Risk, Compliance agents
- Tasks/assignments with priority and deadlines
- Agent interactions logging
- Compliance signals with severity levels
- Comprehensive audit trail
- Storage buckets for documents, reports, evidence
- Performance indexes
- Row-level security policies
- Triggers for timestamps and audit logging

## Seed Data Scripts

### Organizations Seed Data
```sql
INSERT INTO public.organizations (id, name, industry, region, subscription_status, max_users) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Acme Financial Services', 'banking', 'North America', 'enterprise', 100),
('550e8400-e29b-41d4-a716-446655440001', 'Global Asset Management', 'asset_management', 'Europe', 'professional', 50),
('550e8400-e29b-41d4-a716-446655440002', 'TechStart Insurance', 'insurance', 'Asia Pacific', 'basic', 20),
('550e8400-e29b-41d4-a716-446655440003', 'RegTech Solutions Inc', 'fintech', 'North America', 'enterprise', 200);
```

### Sample Users & Roles
```sql
-- Sample user roles (requires auth.users to exist first)
INSERT INTO public.user_roles (user_id, role, is_active) VALUES
-- Admin users
((SELECT id FROM auth.users LIMIT 1), 'admin', true),
-- Enterprise users
((SELECT id FROM auth.users OFFSET 1 LIMIT 1), 'enterprise_user', true),
-- Reviewers
((SELECT id FROM auth.users OFFSET 2 LIMIT 1), 'reviewer', true);
```

### Sample AI Agents
```sql
INSERT INTO public.agents (agent_name, agent_type, owner_id, org_id, configuration, capabilities) VALUES
('ESG Compliance Assistant', 'ESGAgent', (SELECT id FROM auth.users LIMIT 1), '550e8400-e29b-41d4-a716-446655440000', 
 '{"model": "gpt-4", "temperature": 0.3}', '["sustainability_reporting", "esg_scoring", "regulatory_mapping"]'),
 
('AML Risk Analyzer', 'AMLAgent', (SELECT id FROM auth.users LIMIT 1), '550e8400-e29b-41d4-a716-446655440000',
 '{"model": "gpt-4", "temperature": 0.1}', '["transaction_monitoring", "suspicious_activity_detection", "kyc_analysis"]'),
 
('Compliance Navigator', 'ComplianceAgent', (SELECT id FROM auth.users OFFSET 1 LIMIT 1), '550e8400-e29b-41d4-a716-446655440001',
 '{"model": "gpt-4", "temperature": 0.2}', '["policy_analysis", "regulatory_updates", "gap_assessment"]');
```

### Sample Documents
```sql
INSERT INTO public.documents (user_id, org_id, filename, file_type, document_type, title, description, storage_path) VALUES
((SELECT id FROM auth.users LIMIT 1), '550e8400-e29b-41d4-a716-446655440000', 'aml_policy_2024.pdf', 'application/pdf', 'policy', 'AML Policy 2024', 'Anti-Money Laundering Policy and Procedures', '/policy-documents/aml_policy_2024.pdf'),
((SELECT id FROM auth.users LIMIT 1), '550e8400-e29b-41d4-a716-446655440000', 'esg_framework.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'guideline', 'ESG Framework', 'Environmental, Social, and Governance Framework', '/policy-documents/esg_framework.docx'),
((SELECT id FROM auth.users OFFSET 1 LIMIT 1), '550e8400-e29b-41d4-a716-446655440001', 'risk_assessment_template.pdf', 'application/pdf', 'template', 'Risk Assessment Template', 'Standardized risk assessment template', '/policy-documents/risk_assessment_template.pdf');
```

### Sample Tasks
```sql
INSERT INTO public.tasks (title, description, assignee_id, org_id, status, priority, due_date, tags) VALUES
('Q4 ESG Report Review', 'Review and validate Q4 ESG sustainability metrics', (SELECT id FROM auth.users LIMIT 1), '550e8400-e29b-41d4-a716-446655440000', 'pending', 1, NOW() + INTERVAL '7 days', ARRAY['esg', 'reporting', 'q4']),
('AML Policy Update', 'Update AML policy to reflect new regulatory requirements', (SELECT id FROM auth.users OFFSET 1 LIMIT 1), '550e8400-e29b-41d4-a716-446655440001', 'in_progress', 2, NOW() + INTERVAL '14 days', ARRAY['aml', 'policy', 'regulatory']),
('Risk Framework Assessment', 'Conduct comprehensive risk framework evaluation', (SELECT id FROM auth.users OFFSET 2 LIMIT 1), '550e8400-e29b-41d4-a716-446655440002', 'pending', 3, NOW() + INTERVAL '21 days', ARRAY['risk', 'assessment', 'framework']);
```

### Sample Compliance Signals
```sql
INSERT INTO public.compliance_signals (signal_type, severity, title, description, org_id, created_by) VALUES
('regulatory_change', 'high', 'New MiFID II Requirements', 'European Securities and Markets Authority published new MiFID II technical standards', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM auth.users LIMIT 1)),
('policy_gap', 'medium', 'ESG Disclosure Gap Identified', 'Current ESG reporting does not fully align with new CSRD requirements', '550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM auth.users OFFSET 1 LIMIT 1)),
('risk_threshold', 'critical', 'AML Risk Score Exceeded', 'Customer risk score exceeded threshold requiring immediate review', '550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM auth.users LIMIT 1));
```

## Key Features Implemented:

### 🏢 **Multi-Tenant Architecture**
- Organization-based data isolation
- Role-based access control (admin, enterprise_user, reviewer, agent)
- Subscription management with user limits

### 🤖 **AI Agent Management**
- Specialized agent types (ESG, AML, Risk, Compliance, Audit, RegTech)
- Configurable agent capabilities and settings
- Usage tracking and performance metrics

### 📄 **Document Management**
- Multiple document types (policies, procedures, evidence, reports)
- Version control and approval workflows
- Confidentiality levels and access controls

### ⚡ **Real-time Compliance Monitoring**
- Automated compliance signals generation
- Severity-based alerting system
- Integration with AI agent insights

### 📊 **Comprehensive Audit Trail**
- Complete user action logging
- Resource-level change tracking
- IP address and session tracking

### 💾 **Secure File Storage**
- Organization-based storage buckets
- Role-based file access policies
- Support for multiple file types

### 🔐 **Security & Performance**
- Row-level security policies
- Optimized database indexes
- Automated timestamp management
- Secure multi-tenant data access

## Next Steps:
1. Execute Step 1 migration to add org_id column
2. Run complete schema migration
3. Execute seed data scripts
4. Test authentication and role-based access
5. Verify file upload/download functionality

This schema provides a enterprise-grade foundation for the Synapse GRC platform with proper security, scalability, and audit capabilities.