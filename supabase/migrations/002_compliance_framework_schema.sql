-- Compliance Framework Schema
-- Migration: 002_compliance_framework_schema.sql
-- Created: 2024
-- Description: Core compliance framework, controls, assessments, and audit management

-- Compliance framework types
CREATE TYPE compliance_framework_type AS ENUM (
  'SOC2',
  'ISO27001',
  'GDPR',
  'HIPAA',
  'PCI_DSS',
  'NIST',
  'CCPA',
  'SOX',
  'CUSTOM'
);

-- Control status
CREATE TYPE control_status AS ENUM (
  'not_implemented',
  'in_progress',
  'implemented',
  'needs_review',
  'non_compliant',
  'compliant'
);

-- Assessment status
CREATE TYPE assessment_status AS ENUM (
  'draft',
  'in_progress',
  'under_review',
  'completed',
  'approved',
  'rejected'
);

-- Risk level
CREATE TYPE risk_level AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- Evidence type
CREATE TYPE evidence_type AS ENUM (
  'document',
  'screenshot',
  'policy',
  'procedure',
  'log_file',
  'certificate',
  'report',
  'other'
);

-- Compliance frameworks table
CREATE TABLE compliance_frameworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type compliance_framework_type NOT NULL,
  version VARCHAR(50),
  description TEXT,
  requirements JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compliance controls table
CREATE TABLE compliance_controls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  framework_id UUID NOT NULL REFERENCES compliance_frameworks(id) ON DELETE CASCADE,
  control_id VARCHAR(100) NOT NULL, -- e.g., "CC6.1", "A.5.1.1"
  title VARCHAR(500) NOT NULL,
  description TEXT,
  objective TEXT,
  control_type VARCHAR(100), -- preventive, detective, corrective
  category VARCHAR(100),
  subcategory VARCHAR(100),
  status control_status NOT NULL DEFAULT 'not_implemented',
  risk_level risk_level DEFAULT 'medium',
  owner_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  implementation_date DATE,
  review_date DATE,
  next_review_date DATE,
  testing_frequency VARCHAR(50), -- annual, quarterly, monthly
  automated BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(framework_id, control_id)
);

-- Control requirements/criteria
CREATE TABLE control_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  control_id UUID NOT NULL REFERENCES compliance_controls(id) ON DELETE CASCADE,
  requirement_text TEXT NOT NULL,
  is_mandatory BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Control evidence
CREATE TABLE control_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  control_id UUID NOT NULL REFERENCES compliance_controls(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  evidence_type evidence_type NOT NULL,
  file_path TEXT,
  file_name VARCHAR(255),
  file_size BIGINT,
  mime_type VARCHAR(100),
  url TEXT,
  collected_date DATE,
  expiry_date DATE,
  is_sensitive BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compliance assessments
CREATE TABLE compliance_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  framework_id UUID NOT NULL REFERENCES compliance_frameworks(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  assessment_type VARCHAR(100), -- internal, external, self-assessment
  status assessment_status NOT NULL DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  due_date DATE,
  scope TEXT,
  methodology TEXT,
  assessor_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  reviewer_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  overall_score DECIMAL(5,2),
  findings_summary TEXT,
  recommendations TEXT,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assessment control evaluations
CREATE TABLE assessment_control_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES compliance_assessments(id) ON DELETE CASCADE,
  control_id UUID NOT NULL REFERENCES compliance_controls(id) ON DELETE CASCADE,
  status control_status NOT NULL,
  score DECIMAL(5,2),
  findings TEXT,
  recommendations TEXT,
  evidence_reviewed TEXT[],
  testing_performed TEXT,
  evaluator_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  evaluation_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(assessment_id, control_id)
);

-- Audit trails for compliance activities
CREATE TABLE compliance_audit_trail (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(100) NOT NULL, -- framework, control, assessment, etc.
  entity_id UUID NOT NULL,
  action VARCHAR(100) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compliance issues/findings
CREATE TABLE compliance_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  control_id UUID REFERENCES compliance_controls(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES compliance_assessments(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  severity risk_level NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'open', -- open, in_progress, resolved, closed
  root_cause TEXT,
  remediation_plan TEXT,
  assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  due_date DATE,
  resolved_date DATE,
  resolution_notes TEXT,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Remediation actions
CREATE TABLE remediation_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES compliance_issues(id) ON DELETE CASCADE,
  action_description TEXT NOT NULL,
  assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  due_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  completion_date DATE,
  notes TEXT,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compliance reports
CREATE TABLE compliance_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  framework_id UUID REFERENCES compliance_frameworks(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES compliance_assessments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  report_type VARCHAR(100), -- summary, detailed, executive, gap_analysis
  format VARCHAR(50), -- pdf, html, json
  content JSONB,
  file_path TEXT,
  generated_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  parameters JSONB DEFAULT '{}'
);

-- Control mappings (for cross-framework mapping)
CREATE TABLE control_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_control_id UUID NOT NULL REFERENCES compliance_controls(id) ON DELETE CASCADE,
  target_control_id UUID NOT NULL REFERENCES compliance_controls(id) ON DELETE CASCADE,
  mapping_type VARCHAR(50) NOT NULL, -- equivalent, related, partial
  confidence_level DECIMAL(3,2), -- 0.0 to 1.0
  notes TEXT,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(source_control_id, target_control_id)
);

-- Indexes for performance
CREATE INDEX idx_compliance_frameworks_type ON compliance_frameworks(type);
CREATE INDEX idx_compliance_frameworks_org_id ON compliance_frameworks(organization_id);
CREATE INDEX idx_compliance_frameworks_is_active ON compliance_frameworks(is_active);

CREATE INDEX idx_compliance_controls_framework_id ON compliance_controls(framework_id);
CREATE INDEX idx_compliance_controls_status ON compliance_controls(status);
CREATE INDEX idx_compliance_controls_owner_id ON compliance_controls(owner_id);
CREATE INDEX idx_compliance_controls_risk_level ON compliance_controls(risk_level);
CREATE INDEX idx_compliance_controls_next_review_date ON compliance_controls(next_review_date);

CREATE INDEX idx_control_evidence_control_id ON control_evidence(control_id);
CREATE INDEX idx_control_evidence_type ON control_evidence(evidence_type);
CREATE INDEX idx_control_evidence_expiry_date ON control_evidence(expiry_date);

CREATE INDEX idx_compliance_assessments_framework_id ON compliance_assessments(framework_id);
CREATE INDEX idx_compliance_assessments_status ON compliance_assessments(status);
CREATE INDEX idx_compliance_assessments_org_id ON compliance_assessments(organization_id);
CREATE INDEX idx_compliance_assessments_due_date ON compliance_assessments(due_date);

CREATE INDEX idx_assessment_evaluations_assessment_id ON assessment_control_evaluations(assessment_id);
CREATE INDEX idx_assessment_evaluations_control_id ON assessment_control_evaluations(control_id);
CREATE INDEX idx_assessment_evaluations_status ON assessment_control_evaluations(status);

CREATE INDEX idx_compliance_audit_trail_entity ON compliance_audit_trail(entity_type, entity_id);
CREATE INDEX idx_compliance_audit_trail_user_id ON compliance_audit_trail(user_id);
CREATE INDEX idx_compliance_audit_trail_created_at ON compliance_audit_trail(created_at);

CREATE INDEX idx_compliance_issues_control_id ON compliance_issues(control_id);
CREATE INDEX idx_compliance_issues_assessment_id ON compliance_issues(assessment_id);
CREATE INDEX idx_compliance_issues_status ON compliance_issues(status);
CREATE INDEX idx_compliance_issues_severity ON compliance_issues(severity);
CREATE INDEX idx_compliance_issues_assigned_to ON compliance_issues(assigned_to);
CREATE INDEX idx_compliance_issues_due_date ON compliance_issues(due_date);

CREATE INDEX idx_remediation_actions_issue_id ON remediation_actions(issue_id);
CREATE INDEX idx_remediation_actions_assigned_to ON remediation_actions(assigned_to);
CREATE INDEX idx_remediation_actions_status ON remediation_actions(status);
CREATE INDEX idx_remediation_actions_due_date ON remediation_actions(due_date);

-- Triggers for updated_at timestamps
CREATE TRIGGER update_compliance_frameworks_updated_at
  BEFORE UPDATE ON compliance_frameworks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_controls_updated_at
  BEFORE UPDATE ON compliance_controls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_control_evidence_updated_at
  BEFORE UPDATE ON control_evidence
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_assessments_updated_at
  BEFORE UPDATE ON compliance_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_evaluations_updated_at
  BEFORE UPDATE ON assessment_control_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_issues_updated_at
  BEFORE UPDATE ON compliance_issues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_remediation_actions_updated_at
  BEFORE UPDATE ON remediation_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate compliance score
CREATE OR REPLACE FUNCTION calculate_compliance_score(
  p_framework_id UUID
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  total_controls INTEGER;
  compliant_controls INTEGER;
  score DECIMAL(5,2);
BEGIN
  -- Count total controls
  SELECT COUNT(*) INTO total_controls
  FROM compliance_controls
  WHERE framework_id = p_framework_id;
  
  -- Count compliant controls
  SELECT COUNT(*) INTO compliant_controls
  FROM compliance_controls
  WHERE framework_id = p_framework_id
  AND status = 'compliant';
  
  -- Calculate score
  IF total_controls > 0 THEN
    score := (compliant_controls::DECIMAL / total_controls::DECIMAL) * 100;
  ELSE
    score := 0;
  END IF;
  
  RETURN score;
END;
$$ language 'plpgsql';

-- Function to get controls due for review
CREATE OR REPLACE FUNCTION get_controls_due_for_review(
  p_days_ahead INTEGER DEFAULT 30
)
RETURNS TABLE (
  control_id UUID,
  framework_name VARCHAR(255),
  control_title VARCHAR(500),
  next_review_date DATE,
  days_until_due INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    f.name,
    c.title,
    c.next_review_date,
    (c.next_review_date - CURRENT_DATE)::INTEGER
  FROM compliance_controls c
  JOIN compliance_frameworks f ON c.framework_id = f.id
  WHERE c.next_review_date IS NOT NULL
  AND c.next_review_date <= CURRENT_DATE + INTERVAL '%s days' % p_days_ahead
  AND c.status != 'not_implemented'
  ORDER BY c.next_review_date ASC;
END;
$$ language 'plpgsql';

-- Function to create compliance audit trail entry
CREATE OR REPLACE FUNCTION log_compliance_action(
  p_entity_type VARCHAR(100),
  p_entity_id UUID,
  p_action VARCHAR(100),
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO compliance_audit_trail (
    entity_type,
    entity_id,
    action,
    old_values,
    new_values,
    user_id,
    ip_address,
    user_agent
  ) VALUES (
    p_entity_type,
    p_entity_id,
    p_action,
    p_old_values,
    p_new_values,
    p_user_id,
    p_ip_address,
    p_user_agent
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ language 'plpgsql';

-- Function to get framework compliance summary
CREATE OR REPLACE FUNCTION get_framework_compliance_summary(
  p_framework_id UUID
)
RETURNS TABLE (
  total_controls INTEGER,
  implemented_controls INTEGER,
  compliant_controls INTEGER,
  non_compliant_controls INTEGER,
  in_progress_controls INTEGER,
  not_implemented_controls INTEGER,
  compliance_percentage DECIMAL(5,2),
  open_issues INTEGER,
  high_risk_issues INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_controls,
    COUNT(CASE WHEN c.status IN ('implemented', 'compliant') THEN 1 END)::INTEGER as implemented_controls,
    COUNT(CASE WHEN c.status = 'compliant' THEN 1 END)::INTEGER as compliant_controls,
    COUNT(CASE WHEN c.status = 'non_compliant' THEN 1 END)::INTEGER as non_compliant_controls,
    COUNT(CASE WHEN c.status = 'in_progress' THEN 1 END)::INTEGER as in_progress_controls,
    COUNT(CASE WHEN c.status = 'not_implemented' THEN 1 END)::INTEGER as not_implemented_controls,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        (COUNT(CASE WHEN c.status = 'compliant' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100
      ELSE 0
    END as compliance_percentage,
    (
      SELECT COUNT(*)::INTEGER
      FROM compliance_issues ci
      WHERE ci.control_id IN (
        SELECT id FROM compliance_controls WHERE framework_id = p_framework_id
      )
      AND ci.status IN ('open', 'in_progress')
    ) as open_issues,
    (
      SELECT COUNT(*)::INTEGER
      FROM compliance_issues ci
      WHERE ci.control_id IN (
        SELECT id FROM compliance_controls WHERE framework_id = p_framework_id
      )
      AND ci.status IN ('open', 'in_progress')
      AND ci.severity IN ('high', 'critical')
    ) as high_risk_issues
  FROM compliance_controls c
  WHERE c.framework_id = p_framework_id;
END;
$$ language 'plpgsql';

-- Row Level Security (RLS) policies
ALTER TABLE compliance_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE control_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE control_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_control_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE remediation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE control_mappings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for compliance_frameworks
CREATE POLICY "Users can view frameworks in their organization" ON compliance_frameworks
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_organization_memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Compliance managers can manage frameworks" ON compliance_frameworks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'compliance_manager')
    )
  );

-- RLS Policies for compliance_controls
CREATE POLICY "Users can view controls in accessible frameworks" ON compliance_controls
  FOR SELECT USING (
    framework_id IN (
      SELECT id FROM compliance_frameworks
      WHERE organization_id IN (
        SELECT organization_id FROM user_organization_memberships
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Control owners and managers can update controls" ON compliance_controls
  FOR UPDATE USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'compliance_manager')
    )
  );

-- Comments for documentation
COMMENT ON TABLE compliance_frameworks IS 'Compliance frameworks (SOC2, ISO27001, GDPR, etc.)';
COMMENT ON TABLE compliance_controls IS 'Individual controls within compliance frameworks';
COMMENT ON TABLE control_requirements IS 'Specific requirements for each control';
COMMENT ON TABLE control_evidence IS 'Evidence supporting control implementation';
COMMENT ON TABLE compliance_assessments IS 'Compliance assessments and audits';
COMMENT ON TABLE assessment_control_evaluations IS 'Control evaluations within assessments';
COMMENT ON TABLE compliance_audit_trail IS 'Audit trail for compliance-related activities';
COMMENT ON TABLE compliance_issues IS 'Compliance issues and findings';
COMMENT ON TABLE remediation_actions IS 'Actions to remediate compliance issues';
COMMENT ON TABLE compliance_reports IS 'Generated compliance reports';
COMMENT ON TABLE control_mappings IS 'Mappings between controls across frameworks';

COMMENT ON FUNCTION calculate_compliance_score(UUID) IS 'Calculate compliance score for a framework';
COMMENT ON FUNCTION get_controls_due_for_review(INTEGER) IS 'Get controls due for review within specified days';
COMMENT ON FUNCTION log_compliance_action(VARCHAR, UUID, VARCHAR, JSONB, JSONB, UUID, INET, TEXT) IS 'Log compliance-related actions for audit trail';
COMMENT ON FUNCTION get_framework_compliance_summary(UUID) IS 'Get comprehensive compliance summary for a framework';