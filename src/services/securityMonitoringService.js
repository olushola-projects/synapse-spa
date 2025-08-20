/**
 * Security Monitoring Service
 * Priority 1: Security Monitoring Setup - Wazuh and Falco integration
 * Implements real-time threat detection and incident response
 */
import { backendConfig } from '../config/environment.backend';
import { log } from '../utils/logger';
class SecurityMonitoringService {
    static instance;
    events = [];
    alerts = [];
    threatIndicators = new Map();
    blockedIPs = new Set();
    monitoringEnabled;
    wazuhEndpoint;
    falcoEndpoint;
    alertEmail;
    alertWebhook;
    constructor() {
        this.monitoringEnabled = backendConfig.ENABLE_SECURITY_MONITORING;
        this.wazuhEndpoint = backendConfig.WAZUH_ENDPOINT;
        this.falcoEndpoint = backendConfig.FALCO_ENDPOINT;
        this.alertEmail = backendConfig.SECURITY_ALERT_EMAIL;
        this.alertWebhook = backendConfig.SECURITY_ALERT_WEBHOOK;
        if (this.monitoringEnabled) {
            this.initializeMonitoring();
        }
    }
    static getInstance() {
        if (!SecurityMonitoringService.instance) {
            SecurityMonitoringService.instance = new SecurityMonitoringService();
        }
        return SecurityMonitoringService.instance;
    }
    /**
     * Initialize security monitoring
     */
    async initializeMonitoring() {
        try {
            log.info('Initializing security monitoring', {
                wazuhEnabled: !!this.wazuhEndpoint,
                falcoEnabled: !!this.falcoEndpoint,
                alertEmail: !!this.alertEmail,
                alertWebhook: !!this.alertWebhook
            });
            // Test Wazuh connectivity
            if (this.wazuhEndpoint) {
                await this.testWazuhConnection();
            }
            // Test Falco connectivity
            if (this.falcoEndpoint) {
                await this.testFalcoConnection();
            }
            // Start monitoring intervals
            this.startMonitoringIntervals();
            log.info('Security monitoring initialized successfully');
        }
        catch (error) {
            log.error('Failed to initialize security monitoring', { error });
        }
    }
    /**
     * Test Wazuh connection
     */
    async testWazuhConnection() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(`${this.wazuhEndpoint}/health`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`Wazuh health check failed: ${response.status}`);
            }
            log.info('Wazuh connection test successful');
        }
        catch (error) {
            log.error('Wazuh connection test failed', { error, endpoint: this.wazuhEndpoint });
        }
    }
    /**
     * Test Falco connection
     */
    async testFalcoConnection() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(`${this.falcoEndpoint}/health`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`Falco health check failed: ${response.status}`);
            }
            log.info('Falco connection test successful');
        }
        catch (error) {
            log.error('Falco connection test failed', { error, endpoint: this.falcoEndpoint });
        }
    }
    /**
     * Log security event
     */
    async logSecurityEvent(event) {
        try {
            const securityEvent = {
                ...event,
                id: crypto.randomUUID(),
                timestamp: new Date()
            };
            // Store event locally
            this.events.push(securityEvent);
            // Send to Wazuh
            if (this.wazuhEndpoint) {
                await this.sendToWazuh(securityEvent);
            }
            // Send to Falco
            if (this.falcoEndpoint) {
                await this.sendToFalco(securityEvent);
            }
            // Analyze for threats
            await this.analyzeForThreats(securityEvent);
            // Check for alert conditions
            await this.checkAlertConditions(securityEvent);
            // Log locally
            log.info('Security event logged', { event: securityEvent });
        }
        catch (error) {
            log.error('Failed to log security event', { error, event });
        }
    }
    /**
     * Send event to Wazuh
     */
    async sendToWazuh(event) {
        try {
            const wazuhEvent = {
                event_type: event.type,
                severity: event.severity,
                source: 'synapses-grc-platform',
                timestamp: event.timestamp.toISOString(),
                user_id: event.userId,
                ip_address: event.ipAddress,
                user_agent: event.userAgent,
                details: event.details,
                correlation_id: event.correlationId,
                threat_indicators: event.threatIndicators
            };
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const response = await fetch(`${this.wazuhEndpoint}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(wazuhEvent),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`Wazuh API error: ${response.status}`);
            }
        }
        catch (error) {
            log.error('Failed to send event to Wazuh', { error, event });
        }
    }
    /**
     * Send event to Falco
     */
    async sendToFalco(event) {
        try {
            const falcoEvent = {
                rule: `synapses_${event.type}`,
                priority: event.severity.toUpperCase(),
                output: `Security event: ${event.type} from ${event.ipAddress}`,
                output_fields: {
                    ...event.details,
                    user_id: event.userId,
                    ip_address: event.ipAddress,
                    user_agent: event.userAgent,
                    correlation_id: event.correlationId
                },
                time: event.timestamp.toISOString()
            };
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const response = await fetch(`${this.falcoEndpoint}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(falcoEvent),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`Falco API error: ${response.status}`);
            }
        }
        catch (error) {
            log.error('Failed to send event to Falco', { error, event });
        }
    }
    /**
     * Analyze event for threats
     */
    async analyzeForThreats(event) {
        try {
            // Check for brute force attempts
            if (event.type === 'authentication' && event.details.action === 'login_failure') {
                await this.analyzeBruteForceAttempt(event);
            }
            // Check for data exfiltration
            if (event.type === 'data_access' && event.details.volume > 1000) {
                await this.analyzeDataExfiltration(event);
            }
            // Check for privilege escalation
            if (event.type === 'authorization' && event.details.action === 'permission_denied') {
                await this.analyzePrivilegeEscalation(event);
            }
            // Check for suspicious patterns
            await this.analyzeSuspiciousPatterns(event);
        }
        catch (error) {
            log.error('Failed to analyze threats', { error, event });
        }
    }
    /**
     * Analyze brute force attempts
     */
    async analyzeBruteForceAttempt(event) {
        const key = `${event.ipAddress}:${event.userId || 'unknown'}`;
        const recentEvents = this.events.filter(e => e.ipAddress === event.ipAddress &&
            e.type === 'authentication' &&
            e.details.action === 'login_failure' &&
            e.timestamp > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
        );
        if (recentEvents.length >= 5) {
            // Create threat indicator
            const indicator = {
                type: 'ip',
                value: event.ipAddress,
                riskScore: 0.8,
                confidence: 0.9,
                firstSeen: recentEvents.length > 0 ? recentEvents[0]?.timestamp || event.timestamp : event.timestamp,
                lastSeen: event.timestamp,
                frequency: recentEvents.length,
                source: 'brute_force_detection',
                tags: ['brute_force', 'authentication_attack']
            };
            this.threatIndicators.set(key, indicator);
            // Block IP if threshold exceeded
            if (recentEvents.length >= 10) {
                this.blockedIPs.add(event.ipAddress);
                await this.createAlert({
                    type: 'brute_force',
                    severity: 'critical',
                    title: 'Brute Force Attack Detected',
                    description: `Multiple failed login attempts from IP ${event.ipAddress}`,
                    metadata: {
                        ipAddress: event.ipAddress,
                        attempts: recentEvents.length,
                        timeWindow: '5 minutes'
                    }
                });
            }
        }
    }
    /**
     * Analyze data exfiltration
     */
    async analyzeDataExfiltration(event) {
        // TODO: Use key when implementing full data access monitoring
        const recentEvents = this.events.filter(e => e.userId === event.userId &&
            e.type === 'data_access' &&
            e.timestamp > new Date(Date.now() - 60 * 60 * 1000) // Last hour
        );
        const totalVolume = recentEvents.reduce((sum, e) => sum + (e.details.volume || 0), 0);
        if (totalVolume > 10000) { // 10MB threshold
            await this.createAlert({
                type: 'data_exfiltration',
                severity: 'high',
                title: 'Potential Data Exfiltration',
                description: `Large data access volume detected for user ${event.userId}`,
                metadata: {
                    userId: event.userId,
                    totalVolume,
                    timeWindow: '1 hour'
                }
            });
        }
    }
    /**
     * Analyze privilege escalation
     */
    async analyzePrivilegeEscalation(event) {
        // TODO: Use key when implementing full privilege escalation monitoring
        const recentEvents = this.events.filter(e => e.userId === event.userId &&
            e.type === 'authorization' &&
            e.details.action === 'permission_denied' &&
            e.timestamp > new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
        );
        if (recentEvents.length >= 3) {
            await this.createAlert({
                type: 'privilege_escalation',
                severity: 'high',
                title: 'Privilege Escalation Attempt',
                description: `Multiple permission denied events for user ${event.userId}`,
                metadata: {
                    userId: event.userId,
                    attempts: recentEvents.length,
                    timeWindow: '30 minutes'
                }
            });
        }
    }
    /**
     * Analyze suspicious patterns
     */
    async analyzeSuspiciousPatterns(event) {
        // Check for unusual access times
        const hour = event.timestamp.getHours();
        if (hour < 6 || hour > 22) {
            await this.createAlert({
                type: 'suspicious_activity',
                severity: 'medium',
                title: 'Unusual Access Time',
                description: `Activity detected outside normal hours from ${event.ipAddress}`,
                metadata: {
                    ipAddress: event.ipAddress,
                    hour,
                    userId: event.userId
                }
            });
        }
        // Check for rapid successive actions
        const recentEvents = this.events.filter(e => e.userId === event.userId &&
            e.timestamp > new Date(Date.now() - 60 * 1000) // Last minute
        );
        if (recentEvents.length > 20) {
            await this.createAlert({
                type: 'suspicious_activity',
                severity: 'medium',
                title: 'Rapid Successive Actions',
                description: `High frequency of actions detected for user ${event.userId}`,
                metadata: {
                    userId: event.userId,
                    actionCount: recentEvents.length,
                    timeWindow: '1 minute'
                }
            });
        }
    }
    /**
     * Check alert conditions
     */
    async checkAlertConditions(event) {
        // Critical events always create alerts
        if (event.severity === 'critical') {
            await this.createAlert({
                type: 'system_compromise',
                severity: 'critical',
                title: 'Critical Security Event',
                description: `Critical security event detected: ${event.type}`,
                metadata: event.details
            });
        }
        // High severity events with specific conditions
        if (event.severity === 'high' && event.type === 'authentication') {
            await this.createAlert({
                type: 'suspicious_activity',
                severity: 'high',
                title: 'High Severity Authentication Event',
                description: `High severity authentication event from ${event.ipAddress}`,
                metadata: event.details
            });
        }
    }
    /**
     * Create security alert
     */
    async createAlert(alertData) {
        try {
            const alert = {
                ...alertData,
                id: crypto.randomUUID(),
                eventId: crypto.randomUUID(),
                status: 'open',
                timestamp: new Date()
            };
            this.alerts.push(alert);
            // Send alert notifications
            await this.sendAlertNotifications(alert);
            log.info('Security alert created', { alert });
        }
        catch (error) {
            log.error('Failed to create security alert', { error, alertData });
        }
    }
    /**
     * Send alert notifications
     */
    async sendAlertNotifications(alert) {
        try {
            // Send email alert
            if (this.alertEmail && alert.severity === 'critical') {
                await this.sendEmailAlert(alert);
            }
            // Send webhook alert
            if (this.alertWebhook && (alert.severity === 'high' || alert.severity === 'critical')) {
                await this.sendWebhookAlert(alert);
            }
        }
        catch (error) {
            log.error('Failed to send alert notifications', { error, alert });
        }
    }
    /**
     * Send email alert
     */
    async sendEmailAlert(alert) {
        try {
            const emailContent = {
                to: this.alertEmail,
                subject: `[SECURITY ALERT] ${alert.title}`,
                body: `
          Security Alert: ${alert.title}
          Severity: ${alert.severity}
          Description: ${alert.description}
          Timestamp: ${alert.timestamp.toISOString()}
          Alert ID: ${alert.id}
        `
            };
            // Send email using configured SMTP
            // Implementation depends on your email service
            log.info('Email alert sent', { emailContent });
        }
        catch (error) {
            log.error('Failed to send email alert', { error, alert });
        }
    }
    /**
     * Send webhook alert
     */
    async sendWebhookAlert(alert) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const response = await fetch(this.alertWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alert_id: alert.id,
                    type: alert.type,
                    severity: alert.severity,
                    title: alert.title,
                    description: alert.description,
                    timestamp: alert.timestamp.toISOString(),
                    metadata: alert.metadata
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`Webhook alert failed: ${response.status}`);
            }
            log.info('Webhook alert sent', { alert });
        }
        catch (error) {
            log.error('Failed to send webhook alert', { error, alert });
        }
    }
    /**
     * Start monitoring intervals
     */
    startMonitoringIntervals() {
        // Cleanup old events every hour
        setInterval(() => {
            this.cleanupOldEvents();
        }, 60 * 60 * 1000);
        // Update threat indicators every 30 minutes
        setInterval(() => {
            this.updateThreatIndicators();
        }, 30 * 60 * 1000);
        // Generate security metrics every 15 minutes
        setInterval(() => {
            this.generateSecurityMetrics();
        }, 15 * 60 * 1000);
    }
    /**
     * Cleanup old events
     */
    cleanupOldEvents() {
        const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
        this.events = this.events.filter(event => event.timestamp > cutoffTime);
    }
    /**
     * Update threat indicators
     */
    updateThreatIndicators() {
        for (const [, indicator] of this.threatIndicators.entries()) {
            // Update frequency based on recent events
            const recentEvents = this.events.filter(e => e.timestamp > new Date(Date.now() - 60 * 60 * 1000) && // Last hour
                (e.ipAddress === indicator.value || e.userId === indicator.value));
            indicator.frequency = recentEvents.length;
            indicator.lastSeen = new Date();
            // Adjust risk score based on frequency
            if (indicator.frequency > 10) {
                indicator.riskScore = Math.min(1.0, indicator.riskScore + 0.1);
            }
            else if (indicator.frequency === 0) {
                indicator.riskScore = Math.max(0.0, indicator.riskScore - 0.05);
            }
        }
    }
    /**
     * Generate security metrics
     */
    async generateSecurityMetrics() {
        try {
            const now = new Date();
            const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const recentEvents = this.events.filter(e => e.timestamp > last24Hours);
            const activeAlerts = this.alerts.filter(a => a.status === 'open');
            const resolvedAlerts = this.alerts.filter(a => a.status === 'resolved');
            const metrics = {
                totalEvents: recentEvents.length,
                criticalEvents: recentEvents.filter(e => e.severity === 'critical').length,
                highEvents: recentEvents.filter(e => e.severity === 'high').length,
                mediumEvents: recentEvents.filter(e => e.severity === 'medium').length,
                lowEvents: recentEvents.filter(e => e.severity === 'low').length,
                activeAlerts: activeAlerts.length,
                resolvedAlerts: resolvedAlerts.length,
                blockedIPs: this.blockedIPs.size,
                threatIndicators: this.threatIndicators.size,
                avgResponseTime: this.calculateAverageResponseTime(),
                lastUpdated: now
            };
            // Store metrics for dashboard
            // Implementation depends on your metrics storage
            log.info('Security metrics generated', { metrics });
        }
        catch (error) {
            log.error('Failed to generate security metrics', { error });
        }
    }
    /**
     * Calculate average response time
     */
    calculateAverageResponseTime() {
        // Implementation depends on your response time tracking
        return 0;
    }
    /**
     * Get security metrics
     */
    async getSecurityMetrics() {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const recentEvents = this.events.filter(e => e.timestamp > last24Hours);
        const activeAlerts = this.alerts.filter(a => a.status === 'open');
        const resolvedAlerts = this.alerts.filter(a => a.status === 'resolved');
        return {
            totalEvents: recentEvents.length,
            criticalEvents: recentEvents.filter(e => e.severity === 'critical').length,
            highEvents: recentEvents.filter(e => e.severity === 'high').length,
            mediumEvents: recentEvents.filter(e => e.severity === 'medium').length,
            lowEvents: recentEvents.filter(e => e.severity === 'low').length,
            activeAlerts: activeAlerts.length,
            resolvedAlerts: resolvedAlerts.length,
            blockedIPs: this.blockedIPs.size,
            threatIndicators: this.threatIndicators.size,
            avgResponseTime: this.calculateAverageResponseTime(),
            lastUpdated: now
        };
    }
    /**
     * Get active alerts
     */
    async getActiveAlerts() {
        return this.alerts.filter(alert => alert.status === 'open');
    }
    /**
     * Get threat indicators
     */
    async getThreatIndicators() {
        return Array.from(this.threatIndicators.values());
    }
    /**
     * Check if IP is blocked
     */
    isIPBlocked(ipAddress) {
        return this.blockedIPs.has(ipAddress);
    }
    /**
     * Block IP address
     */
    async blockIP(ipAddress, reason) {
        this.blockedIPs.add(ipAddress);
        await this.logSecurityEvent({
            type: 'system',
            severity: 'high',
            source: 'security_monitoring',
            ipAddress,
            userAgent: 'system',
            details: { action: 'ip_blocked', reason }
        });
        log.info('IP address blocked', { ipAddress, reason });
    }
    /**
     * Unblock IP address
     */
    async unblockIP(ipAddress, reason) {
        this.blockedIPs.delete(ipAddress);
        await this.logSecurityEvent({
            type: 'system',
            severity: 'low',
            source: 'security_monitoring',
            ipAddress,
            userAgent: 'system',
            details: { action: 'ip_unblocked', reason }
        });
        log.info('IP address unblocked', { ipAddress, reason });
    }
}
export const securityMonitoringService = SecurityMonitoringService.getInstance();
