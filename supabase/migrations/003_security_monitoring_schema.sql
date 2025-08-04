-- Security Monitoring and Threat Detection Schema
-- Part of Phase 2: Security Infrastructure (Week 4)
-- Creates tables for security events, incidents, threat indicators, and monitoring

-- Security Events Table
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    source TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    details JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved', 'false_positive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Security Incidents Table
CREATE TABLE IF NOT EXISTS security_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    event_id UUID REFERENCES security_events(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    details JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Threat Indicators Table
CREATE TABLE IF NOT EXISTS threat_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('ip', 'user_agent', 'behavior_pattern', 'geolocation')),
    value TEXT NOT NULL,
    risk_score DECIMAL(3,2) NOT NULL DEFAULT 0.0 CHECK (risk_score >= 0.0 AND risk_score <= 1.0),
    frequency INTEGER NOT NULL DEFAULT 1,
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT NOT NULL DEFAULT 'automated',
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(type, value)
);

-- IP Blocklist Table
CREATE TABLE IF NOT EXISTS ip_blocklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address INET NOT NULL UNIQUE,
    reason TEXT NOT NULL,
    blocked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    blocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enhanced Monitoring Table
CREATE TABLE IF NOT EXISTS enhanced_monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address INET,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL DEFAULT 'Anomaly detected',
    enhanced_until TIMESTAMPTZ NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (ip_address IS NOT NULL OR user_id IS NOT NULL)
);

-- Security Metrics Summary Table (for dashboard performance)
CREATE TABLE IF NOT EXISTS security_metrics_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    total_events INTEGER NOT NULL DEFAULT 0,
    critical_events INTEGER NOT NULL DEFAULT 0,
    high_events INTEGER NOT NULL DEFAULT 0,
    medium_events INTEGER NOT NULL DEFAULT 0,
    low_events INTEGER NOT NULL DEFAULT 0,
    incidents_created INTEGER NOT NULL DEFAULT 0,
    incidents_resolved INTEGER NOT NULL DEFAULT 0,
    unique_ips INTEGER NOT NULL DEFAULT 0,
    blocked_ips INTEGER NOT NULL DEFAULT 0,
    avg_response_time_minutes DECIMAL(8,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Security Alert Rules Table
CREATE TABLE IF NOT EXISTS security_alert_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    event_type TEXT NOT NULL,
    severity_threshold TEXT NOT NULL CHECK (severity_threshold IN ('low', 'medium', 'high', 'critical')),
    conditions JSONB NOT NULL DEFAULT '{}',
    actions JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Security Audit Log Table
CREATE TABLE IF NOT EXISTS security_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    details JSONB NOT NULL DEFAULT '{}',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON security_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_ip_address ON security_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_events_source ON security_events(source);
CREATE INDEX IF NOT EXISTS idx_security_events_status ON security_events(status);

CREATE INDEX IF NOT EXISTS idx_security_incidents_status ON security_incidents(status);
CREATE INDEX IF NOT EXISTS idx_security_incidents_severity ON security_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_security_incidents_created_at ON security_incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_incidents_assigned_to ON security_incidents(assigned_to);

CREATE INDEX IF NOT EXISTS idx_threat_indicators_type ON threat_indicators(type);
CREATE INDEX IF NOT EXISTS idx_threat_indicators_value ON threat_indicators(value);
CREATE INDEX IF NOT EXISTS idx_threat_indicators_risk_score ON threat_indicators(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_threat_indicators_last_seen ON threat_indicators(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_threat_indicators_active ON threat_indicators(is_active);

CREATE INDEX IF NOT EXISTS idx_ip_blocklist_ip_address ON ip_blocklist(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_blocklist_active ON ip_blocklist(is_active);
CREATE INDEX IF NOT EXISTS idx_ip_blocklist_expires_at ON ip_blocklist(expires_at);

CREATE INDEX IF NOT EXISTS idx_enhanced_monitoring_ip ON enhanced_monitoring(ip_address);
CREATE INDEX IF NOT EXISTS idx_enhanced_monitoring_user ON enhanced_monitoring(user_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_monitoring_until ON enhanced_monitoring(enhanced_until);

CREATE INDEX IF NOT EXISTS idx_security_audit_log_timestamp ON security_audit_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_action ON security_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_resource ON security_audit_log(resource_type, resource_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_security_events_updated_at
    BEFORE UPDATE ON security_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_incidents_updated_at
    BEFORE UPDATE ON security_incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_threat_indicators_updated_at
    BEFORE UPDATE ON threat_indicators
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ip_blocklist_updated_at
    BEFORE UPDATE ON ip_blocklist
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_metrics_summary_updated_at
    BEFORE UPDATE ON security_metrics_summary
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_alert_rules_updated_at
    BEFORE UPDATE ON security_alert_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Security monitoring functions

-- Function to get security events by time range
CREATE OR REPLACE FUNCTION get_security_events_by_timerange(
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    event_types TEXT[] DEFAULT NULL,
    severity_levels TEXT[] DEFAULT NULL,
    limit_count INTEGER DEFAULT 100
)
RETURNS TABLE (
    id UUID,
    type TEXT,
    severity TEXT,
    source TEXT,
    user_id UUID,
    ip_address INET,
    timestamp TIMESTAMPTZ,
    details JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        se.id,
        se.type,
        se.severity,
        se.source,
        se.user_id,
        se.ip_address,
        se.timestamp,
        se.details
    FROM security_events se
    WHERE se.timestamp BETWEEN start_time AND end_time
        AND (event_types IS NULL OR se.type = ANY(event_types))
        AND (severity_levels IS NULL OR se.severity = ANY(severity_levels))
    ORDER BY se.timestamp DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate security metrics for a date
CREATE OR REPLACE FUNCTION calculate_daily_security_metrics(target_date DATE)
RETURNS VOID AS $$
DECLARE
    start_time TIMESTAMPTZ;
    end_time TIMESTAMPTZ;
    metrics_record RECORD;
BEGIN
    start_time := target_date::TIMESTAMPTZ;
    end_time := (target_date + INTERVAL '1 day')::TIMESTAMPTZ;
    
    -- Calculate metrics
    SELECT 
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE severity = 'critical') as critical_events,
        COUNT(*) FILTER (WHERE severity = 'high') as high_events,
        COUNT(*) FILTER (WHERE severity = 'medium') as medium_events,
        COUNT(*) FILTER (WHERE severity = 'low') as low_events,
        COUNT(DISTINCT ip_address) as unique_ips
    INTO metrics_record
    FROM security_events
    WHERE timestamp BETWEEN start_time AND end_time;
    
    -- Insert or update metrics summary
    INSERT INTO security_metrics_summary (
        date,
        total_events,
        critical_events,
        high_events,
        medium_events,
        low_events,
        unique_ips
    ) VALUES (
        target_date,
        metrics_record.total_events,
        metrics_record.critical_events,
        metrics_record.high_events,
        metrics_record.medium_events,
        metrics_record.low_events,
        metrics_record.unique_ips
    )
    ON CONFLICT (date) DO UPDATE SET
        total_events = EXCLUDED.total_events,
        critical_events = EXCLUDED.critical_events,
        high_events = EXCLUDED.high_events,
        medium_events = EXCLUDED.medium_events,
        low_events = EXCLUDED.low_events,
        unique_ips = EXCLUDED.unique_ips,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if IP is blocked
CREATE OR REPLACE FUNCTION is_ip_blocked(check_ip INET)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM ip_blocklist
        WHERE ip_address = check_ip
            AND is_active = TRUE
            AND (expires_at IS NULL OR expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get threat indicators by risk score
CREATE OR REPLACE FUNCTION get_top_threat_indicators(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    type TEXT,
    value TEXT,
    risk_score DECIMAL,
    frequency INTEGER,
    last_seen TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ti.type,
        ti.value,
        ti.risk_score,
        ti.frequency,
        ti.last_seen
    FROM threat_indicators ti
    WHERE ti.is_active = TRUE
    ORDER BY ti.risk_score DESC, ti.frequency DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old security events
CREATE OR REPLACE FUNCTION cleanup_old_security_events(retention_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM security_events
    WHERE timestamp < NOW() - (retention_days || ' days')::INTERVAL
        AND severity IN ('low', 'medium');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log cleanup action
    INSERT INTO security_audit_log (action, resource_type, details)
    VALUES (
        'cleanup_old_events',
        'security_events',
        jsonb_build_object('deleted_count', deleted_count, 'retention_days', retention_days)
    );
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update threat indicator risk score
CREATE OR REPLACE FUNCTION update_threat_indicator_risk(
    indicator_type TEXT,
    indicator_value TEXT,
    risk_adjustment DECIMAL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO threat_indicators (type, value, risk_score, frequency)
    VALUES (indicator_type, indicator_value, LEAST(risk_adjustment, 1.0), 1)
    ON CONFLICT (type, value) DO UPDATE SET
        risk_score = LEAST(threat_indicators.risk_score + risk_adjustment, 1.0),
        frequency = threat_indicators.frequency + 1,
        last_seen = NOW(),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create security incident from event
CREATE OR REPLACE FUNCTION create_security_incident(
    event_id UUID,
    incident_title TEXT,
    incident_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    incident_id UUID;
    event_severity TEXT;
BEGIN
    -- Get event severity
    SELECT severity INTO event_severity
    FROM security_events
    WHERE id = event_id;
    
    -- Create incident
    INSERT INTO security_incidents (
        title,
        description,
        severity,
        event_id,
        details
    ) VALUES (
        incident_title,
        COALESCE(incident_description, 'Automatically created from security event'),
        event_severity,
        event_id,
        jsonb_build_object('auto_created', true, 'created_from_event', event_id)
    )
    RETURNING id INTO incident_id;
    
    -- Log incident creation
    INSERT INTO security_audit_log (action, resource_type, resource_id, details)
    VALUES (
        'create_incident',
        'security_incidents',
        incident_id::TEXT,
        jsonb_build_object('event_id', event_id, 'auto_created', true)
    );
    
    RETURN incident_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_blocklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhanced_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_metrics_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Security Events: Admin and Security roles can view all, users can view their own
CREATE POLICY "security_events_admin_access" ON security_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid()
                AND up.role IN ('super_admin', 'admin', 'security_admin')
        )
    );

CREATE POLICY "security_events_user_access" ON security_events
    FOR SELECT USING (user_id = auth.uid());

-- Security Incidents: Admin and Security roles only
CREATE POLICY "security_incidents_admin_access" ON security_incidents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid()
                AND up.role IN ('super_admin', 'admin', 'security_admin')
        )
    );

-- Threat Indicators: Admin and Security roles only
CREATE POLICY "threat_indicators_admin_access" ON threat_indicators
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid()
                AND up.role IN ('super_admin', 'admin', 'security_admin')
        )
    );

-- IP Blocklist: Admin and Security roles only
CREATE POLICY "ip_blocklist_admin_access" ON ip_blocklist
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid()
                AND up.role IN ('super_admin', 'admin', 'security_admin')
        )
    );

-- Enhanced Monitoring: Admin and Security roles only
CREATE POLICY "enhanced_monitoring_admin_access" ON enhanced_monitoring
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid()
                AND up.role IN ('super_admin', 'admin', 'security_admin')
        )
    );

-- Security Metrics Summary: Admin and Security roles can view
CREATE POLICY "security_metrics_admin_access" ON security_metrics_summary
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid()
                AND up.role IN ('super_admin', 'admin', 'security_admin', 'compliance_manager')
        )
    );

-- Security Alert Rules: Admin and Security roles only
CREATE POLICY "security_alert_rules_admin_access" ON security_alert_rules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid()
                AND up.role IN ('super_admin', 'admin', 'security_admin')
        )
    );

-- Security Audit Log: Admin and Security roles can view
CREATE POLICY "security_audit_log_admin_access" ON security_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid()
                AND up.role IN ('super_admin', 'admin', 'security_admin', 'compliance_manager', 'auditor')
        )
    );

-- Insert default security alert rules
INSERT INTO security_alert_rules (name, description, event_type, severity_threshold, conditions, actions) VALUES
('Critical Security Events', 'Alert on all critical security events', 'all', 'critical', 
 '{"immediate_alert": true}', '{"email": true, "slack": true, "create_incident": true}'),

('Brute Force Detection', 'Alert on brute force attack attempts', 'brute_force_attack', 'high',
 '{"threshold": 5, "time_window": "5m"}', '{"email": true, "block_ip": true}'),

('Data Exfiltration Alert', 'Alert on potential data exfiltration', 'data_exfiltration', 'high',
 '{"immediate_alert": true}', '{"email": true, "slack": true, "create_incident": true, "enhance_monitoring": true}'),

('Privilege Escalation Alert', 'Alert on privilege escalation attempts', 'privilege_escalation', 'high',
 '{"immediate_alert": true}', '{"email": true, "create_incident": true}'),

('Suspicious Login Activity', 'Alert on suspicious login patterns', 'suspicious_activity', 'medium',
 '{"geolocation_check": true, "time_check": true}', '{"email": true, "enhance_monitoring": true}');

-- Create a scheduled job to calculate daily metrics (requires pg_cron extension)
-- This would typically be set up separately in production
-- SELECT cron.schedule('daily-security-metrics', '0 1 * * *', 'SELECT calculate_daily_security_metrics(CURRENT_DATE - 1);');

-- Comments for documentation
COMMENT ON TABLE security_events IS 'Stores all security-related events for monitoring and analysis';
COMMENT ON TABLE security_incidents IS 'Tracks security incidents created from events or manual reporting';
COMMENT ON TABLE threat_indicators IS 'Maintains threat intelligence indicators for pattern matching';
COMMENT ON TABLE ip_blocklist IS 'Manages blocked IP addresses with expiration support';
COMMENT ON TABLE enhanced_monitoring IS 'Tracks entities under enhanced security monitoring';
COMMENT ON TABLE security_metrics_summary IS 'Daily aggregated security metrics for dashboard performance';
COMMENT ON TABLE security_alert_rules IS 'Configurable rules for automated security alerting';
COMMENT ON TABLE security_audit_log IS 'Comprehensive audit trail for security-related actions';

COMMENT ON FUNCTION get_security_events_by_timerange IS 'Retrieves security events within a specified time range with optional filtering';
COMMENT ON FUNCTION calculate_daily_security_metrics IS 'Calculates and stores daily security metrics for dashboard reporting';
COMMENT ON FUNCTION is_ip_blocked IS 'Checks if an IP address is currently blocked';
COMMENT ON FUNCTION get_top_threat_indicators IS 'Returns the highest risk threat indicators';
COMMENT ON FUNCTION cleanup_old_security_events IS 'Removes old low/medium severity events based on retention policy';
COMMENT ON FUNCTION update_threat_indicator_risk IS 'Updates or creates threat indicator with adjusted risk score';
COMMENT ON FUNCTION create_security_incident IS 'Creates a security incident from a security event';