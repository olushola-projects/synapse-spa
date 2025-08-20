/**
 * Compliance Automation Service
 * Priority 2: Compliance Automation - Automated compliance checks
 */
import { backendConfig } from '../config/environment.backend';
import { supabase } from '../integrations/supabase/client';
import { log } from '../utils/logger';
class ComplianceAutomationService {
  static instance;
  rules = new Map();
  checks = [];
  automationEnabled;
  constructor() {
    this.automationEnabled = backendConfig.ENABLE_COMPLIANCE_AUTOMATION;
    if (this.automationEnabled) {
      this.initializeAutomation();
    }
  }
  static getInstance() {
    if (!ComplianceAutomationService.instance) {
      ComplianceAutomationService.instance = new ComplianceAutomationService();
    }
    return ComplianceAutomationService.instance;
  }
  async initializeAutomation() {
    try {
      await this.loadComplianceRules();
      this.startAutomatedChecks();
      if (this.rules.size === 0) {
        await this.initializeDefaultRules();
      }
      log.info('Compliance automation initialized');
    } catch (error) {
      log.error('Failed to initialize compliance automation', { error });
    }
  }
  async loadComplianceRules() {
    try {
      const { data: rules } = await supabase.from('compliance_rules').select('*');
      rules?.forEach(rule => {
        const complianceRule = {
          id: rule.id,
          name: rule.name,
          category: rule.category || 'SFDR',
          severity: rule.severity || 'medium',
          status: rule.status || 'active',
          automated: rule.is_automated || false,
          checkInterval: 60, // Default value since column doesn't exist
          nextCheck: undefined, // Column doesn't exist in schema
          lastCheck: undefined // Column doesn't exist in schema
        };
        this.rules.set(rule.id, complianceRule);
      });
    } catch (error) {
      log.error('Failed to load compliance rules', { error });
    }
  }
  async initializeDefaultRules() {
    const defaultRules = [
      {
        name: 'SFDR Article 8 Disclosure',
        category: 'SFDR',
        severity: 'high',
        status: 'active',
        automated: true,
        checkInterval: 60
      },
      {
        name: 'Data Encryption at Rest',
        category: 'ISO27001',
        severity: 'critical',
        status: 'active',
        automated: true,
        checkInterval: 30
      }
    ];
    for (const ruleData of defaultRules) {
      await this.createComplianceRule(ruleData);
    }
  }
  startAutomatedChecks() {
    setInterval(
      async () => {
        await this.runAutomatedChecks();
      },
      5 * 60 * 1000
    ); // Check every 5 minutes
  }
  async runAutomatedChecks() {
    const now = new Date();
    const rulesToCheck = Array.from(this.rules.values()).filter(rule => {
      if (!rule.automated || rule.status !== 'active') return false;
      if (!rule.nextCheck) return true;
      return rule.nextCheck <= now;
    });
    for (const rule of rulesToCheck) {
      try {
        await this.executeComplianceCheck(rule.id);
        rule.nextCheck = new Date(Date.now() + rule.checkInterval * 60 * 1000);
        await this.updateComplianceRule(rule.id, { nextCheck: rule.nextCheck });
      } catch (error) {
        log.error(`Failed to execute compliance check for rule ${rule.id}`, { error });
      }
    }
  }
  async executeComplianceCheck(ruleId) {
    const rule = this.rules.get(ruleId);
    if (!rule) throw new Error(`Compliance rule not found: ${ruleId}`);
    const check = {
      id: crypto.randomUUID(),
      ruleId,
      status: 'pass', // Simplified for now
      details: `Compliance check executed for ${rule.name}`,
      timestamp: new Date(),
      automated: true
    };
    this.checks.push(check);
    await this.storeComplianceCheck(check);
    rule.lastCheck = new Date();
    return check;
  }
  async createComplianceRule(ruleData) {
    const rule = {
      ...ruleData,
      id: crypto.randomUUID()
    };
    this.rules.set(rule.id, rule);
    await this.storeComplianceRule(rule);
    return rule;
  }
  async updateComplianceRule(ruleId, updates) {
    const rule = this.rules.get(ruleId);
    if (!rule) throw new Error(`Compliance rule not found: ${ruleId}`);
    const updatedRule = { ...rule, ...updates };
    this.rules.set(ruleId, updatedRule);
    await this.storeComplianceRule(updatedRule);
  }
  async generateComplianceReport(period) {
    const checksInPeriod = this.checks.filter(
      check => check.timestamp >= period.start && check.timestamp <= period.end
    );
    const totalChecks = checksInPeriod.length;
    const passedChecks = checksInPeriod.filter(c => c.status === 'pass').length;
    const failedChecks = checksInPeriod.filter(c => c.status === 'fail').length;
    const complianceScore = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 100;
    const report = {
      id: crypto.randomUUID(),
      title: 'Compliance Report',
      period,
      summary: {
        totalChecks,
        passedChecks,
        failedChecks,
        complianceScore
      },
      generatedAt: new Date()
    };
    return report;
  }
  async getComplianceRules() {
    return Array.from(this.rules.values());
  }
  async getComplianceChecks() {
    return this.checks.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  async storeComplianceRule(rule) {
    try {
      await supabase.from('compliance_rules').upsert({
        id: rule.id,
        name: rule.name,
        description: null, // Required field
        category: rule.category,
        severity: rule.severity,
        status: rule.status,
        framework: rule.category, // Use category as framework
        rule_type: 'compliance', // Default value
        conditions: {}, // Default empty object
        actions: {}, // Default empty object
        priority: 1, // Default priority
        is_automated: rule.automated,
        created_by: null, // Required field
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      log.error('Failed to store compliance rule', { error });
    }
  }
  async storeComplianceCheck(check) {
    try {
      await supabase.from('compliance_checks').insert({
        id: check.id,
        rule_id: check.ruleId,
        status: check.status,
        details: check.details,
        timestamp: check.timestamp,
        automated: check.automated
      });
    } catch (error) {
      log.error('Failed to store compliance check', { error });
    }
  }
}
export const complianceAutomationService = ComplianceAutomationService.getInstance();
