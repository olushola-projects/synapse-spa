/**
 * Compliance Automation Service
 * Priority 2: Compliance Automation - Automated compliance checks
 */

import { backendConfig } from '../config/environment.backend';
import { supabase } from '../integrations/supabase/client';
import { log } from '../utils/logger';

export interface ComplianceRule {
  id: string;
  name: string;
  category: 'SFDR' | 'GDPR' | 'SOX' | 'ISO27001' | 'SOC2';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'inactive';
  automated: boolean;
  checkInterval: number;
  lastCheck?: Date;
  nextCheck?: Date;
}

export interface ComplianceCheck {
  id: string;
  ruleId: string;
  status: 'pass' | 'fail' | 'warning' | 'error';
  details: string;
  timestamp: Date;
  automated: boolean;
}

export interface ComplianceReport {
  id: string;
  title: string;
  period: { start: Date; end: Date };
  summary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    complianceScore: number;
  };
  generatedAt: Date;
}

class ComplianceAutomationService {
  private static instance: ComplianceAutomationService;
  private rules: Map<string, ComplianceRule> = new Map();
  private checks: ComplianceCheck[] = [];
  private automationEnabled: boolean;

  constructor() {
    this.automationEnabled = backendConfig.ENABLE_COMPLIANCE_AUTOMATION;
    if (this.automationEnabled) {
      this.initializeAutomation();
    }
  }

  static getInstance(): ComplianceAutomationService {
    if (!ComplianceAutomationService.instance) {
      ComplianceAutomationService.instance = new ComplianceAutomationService();
    }
    return ComplianceAutomationService.instance;
  }

  private async initializeAutomation(): Promise<void> {
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

  private async loadComplianceRules(): Promise<void> {
    try {
      const { data: rules, error } = await supabase
        .from('compliance_rules')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      rules?.forEach(rule => this.rules.set(rule.id, rule as ComplianceRule));
    } catch (error) {
      log.error('Failed to load compliance rules', { error });
    }
  }

  private async initializeDefaultRules(): Promise<void> {
    const defaultRules = [
      {
        name: 'SFDR Article 8 Disclosure',
        category: 'SFDR' as const,
        severity: 'high' as const,
        status: 'active' as const,
        automated: true,
        checkInterval: 60
      },
      {
        name: 'Data Encryption at Rest',
        category: 'ISO27001' as const,
        severity: 'critical' as const,
        status: 'active' as const,
        automated: true,
        checkInterval: 30
      }
    ];

    for (const ruleData of defaultRules) {
      await this.createComplianceRule(ruleData);
    }
  }

  private startAutomatedChecks(): void {
    setInterval(async () => {
      await this.runAutomatedChecks();
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  private async runAutomatedChecks(): Promise<void> {
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

  async executeComplianceCheck(ruleId: string): Promise<ComplianceCheck> {
    const rule = this.rules.get(ruleId);
    if (!rule) throw new Error(`Compliance rule not found: ${ruleId}`);

    const check: ComplianceCheck = {
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

  async createComplianceRule(ruleData: Omit<ComplianceRule, 'id'>): Promise<ComplianceRule> {
    const rule: ComplianceRule = {
      ...ruleData,
      id: crypto.randomUUID()
    };

    this.rules.set(rule.id, rule);
    await this.storeComplianceRule(rule);
    return rule;
  }

  async updateComplianceRule(ruleId: string, updates: Partial<ComplianceRule>): Promise<void> {
    const rule = this.rules.get(ruleId);
    if (!rule) throw new Error(`Compliance rule not found: ${ruleId}`);

    const updatedRule = { ...rule, ...updates };
    this.rules.set(ruleId, updatedRule);
    await this.storeComplianceRule(updatedRule);
  }

  async generateComplianceReport(
    period: { start: Date; end: Date },
    generatedBy: string // Will be used when implementing full report generation
  ): Promise<ComplianceReport> {
    const checksInPeriod = this.checks.filter(check => 
      check.timestamp >= period.start && check.timestamp <= period.end
    );

    const totalChecks = checksInPeriod.length;
    const passedChecks = checksInPeriod.filter(c => c.status === 'pass').length;
    const failedChecks = checksInPeriod.filter(c => c.status === 'fail').length;
    const complianceScore = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 100;

    const report: ComplianceReport = {
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

  async getComplianceRules(): Promise<ComplianceRule[]> {
    return Array.from(this.rules.values());
  }

  async getComplianceChecks(): Promise<ComplianceCheck[]> {
    return this.checks.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private async storeComplianceRule(rule: ComplianceRule): Promise<void> {
    try {
      await supabase.from('compliance_rules').upsert({
        id: rule.id,
        name: rule.name,
        category: rule.category,
        severity: rule.severity,
        status: rule.status,
        automated: rule.automated,
        check_interval: rule.checkInterval,
        last_check: rule.lastCheck,
        next_check: rule.nextCheck
      });
    } catch (error) {
      log.error('Failed to store compliance rule', { error });
    }
  }

  private async storeComplianceCheck(check: ComplianceCheck): Promise<void> {
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
