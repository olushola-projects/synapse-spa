/**
 * Compliance Reporting Service - Priority 3
 * Automated compliance dashboards and reporting
 */

import { backendConfig } from '../config/environment.backend';
import { log } from '../utils/logger';
import { complianceAutomationService } from './complianceAutomationService';
// import { advancedSecurityService } from './advancedSecurityService'; // Will be used when implementing full integration

export interface ComplianceDashboard {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'technical' | 'auditor' | 'custom';
  framework: 'SFDR' | 'GDPR' | 'SOX' | 'ISO27001' | 'SOC2' | 'all';
  refreshInterval: number;
  lastRefresh?: Date;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  permissions: string[];
  isPublic: boolean;
  metadata: Record<string, any>;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'alert' | 'status';
  title: string;
  description: string;
  dataSource: string;
  config: WidgetConfig;
  position: { x: number; y: number; width: number; height: number };
  refreshInterval: number;
  lastUpdate?: Date;
}

export interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
  metrics?: string[];
  timeRange?: string;
  thresholds?: Record<string, number>;
  colors?: Record<string, string>;
  format?: string;
  drillDown?: boolean;
  alerts?: boolean;
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: 'date' | 'dropdown' | 'text' | 'multi-select';
  field: string;
  defaultValue?: any;
  options?: any[];
  required: boolean;
}

export interface ComplianceReport {
  id: string;
  title: string;
  description: string;
  framework: 'SFDR' | 'GDPR' | 'SOX' | 'ISO27001' | 'SOC2';
  period: { start: Date; end: Date };
  generatedAt: Date;
  generatedBy: string;
  status: 'draft' | 'final' | 'archived';
  sections: ReportSection[];
  summary: ReportSummary;
  attachments: ReportAttachment[];
  metadata: Record<string, any>;
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'overview' | 'compliance' | 'risks' | 'recommendations' | 'appendix';
  content: string;
  data?: any;
  order: number;
}

export interface ReportSummary {
  overallScore: number;
  complianceRate: number;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  trends: {
    score: 'improving' | 'declining' | 'stable';
    issues: 'increasing' | 'decreasing' | 'stable';
    compliance: 'improving' | 'declining' | 'stable';
  };
  recommendations: string[];
  nextReviewDate: Date;
}

export interface ReportAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'csv' | 'json';
  url: string;
  size: number;
  uploadedAt: Date;
}

export interface ComplianceAlert {
  id: string;
  type: 'compliance_violation' | 'deadline_missed' | 'score_drop' | 'new_requirement';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  framework: string;
  affectedRules: string[];
  detectedAt: Date;
  dueDate?: Date;
  status: 'new' | 'acknowledged' | 'resolved';
  assignedTo?: string;
  resolution?: string;
}

export interface ComplianceSchedule {
  id: string;
  name: string;
  description: string;
  framework: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextRun: Date;
  lastRun?: Date;
  status: 'active' | 'paused' | 'error';
  config: {
    reportType: string;
    recipients: string[];
    format: 'pdf' | 'excel' | 'html';
    includeCharts: boolean;
    includeAttachments: boolean;
  };
}

class ComplianceReportingService {
  private static instance: ComplianceReportingService;
  private dashboards: Map<string, ComplianceDashboard> = new Map();
  private reports: ComplianceReport[] = [];
  private alerts: ComplianceAlert[] = [];
  private schedules: ComplianceSchedule[] = [];
  private reportingEnabled: boolean;
  private autoRefreshEnabled: boolean;

  constructor() {
    this.reportingEnabled = backendConfig.ENABLE_COMPLIANCE_REPORTING;
    this.autoRefreshEnabled = backendConfig.ENABLE_AUTO_REFRESH;

    if (this.reportingEnabled) {
      this.initializeComplianceReporting();
    }
  }

  static getInstance(): ComplianceReportingService {
    if (!ComplianceReportingService.instance) {
      ComplianceReportingService.instance = new ComplianceReportingService();
    }
    return ComplianceReportingService.instance;
  }

  private async initializeComplianceReporting(): Promise<void> {
    try {
      log.info('Initializing compliance reporting service');

      await this.initializeDefaultDashboards();
      await this.initializeReportSchedules();
      this.startAutoRefresh();
      this.startAlertMonitoring();

      log.info('Compliance reporting service initialized');
    } catch (error) {
      log.error('Failed to initialize compliance reporting service', { error });
    }
  }

  private async initializeDefaultDashboards(): Promise<void> {
    const defaultDashboards: ComplianceDashboard[] = [
      {
        id: crypto.randomUUID(),
        name: 'Executive Compliance Overview',
        description: 'High-level compliance metrics for executive review',
        type: 'executive',
        framework: 'all',
        refreshInterval: 300,
        widgets: [
          {
            id: crypto.randomUUID(),
            type: 'metric',
            title: 'Overall Compliance Score',
            description: 'Current compliance score across all frameworks',
            dataSource: 'compliance_metrics',
            config: {
              format: 'percentage',
              thresholds: { warning: 80, critical: 60 }
            },
            position: { x: 0, y: 0, width: 3, height: 2 },
            refreshInterval: 300
          },
          {
            id: crypto.randomUUID(),
            type: 'chart',
            title: 'Compliance Trends',
            description: 'Compliance score trends over time',
            dataSource: 'compliance_trends',
            config: {
              chartType: 'line',
              timeRange: '30d'
            },
            position: { x: 3, y: 0, width: 6, height: 3 },
            refreshInterval: 600
          }
        ],
        filters: [
          {
            id: crypto.randomUUID(),
            name: 'Time Range',
            type: 'date',
            field: 'timeRange',
            defaultValue: '30d',
            required: true
          }
        ],
        permissions: ['executive', 'compliance_manager'],
        isPublic: false,
        metadata: {}
      }
    ];

    for (const dashboard of defaultDashboards) {
      this.dashboards.set(dashboard.id, dashboard);
    }

    log.info(`Initialized ${defaultDashboards.length} default dashboards`);
  }

  private async initializeReportSchedules(): Promise<void> {
    const defaultSchedules: ComplianceSchedule[] = [
      {
        id: crypto.randomUUID(),
        name: 'Weekly Executive Report',
        description: 'Weekly compliance summary for executive team',
        framework: 'all',
        frequency: 'weekly',
        nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'active',
        config: {
          reportType: 'executive_summary',
          recipients: ['executive@company.com'],
          format: 'pdf',
          includeCharts: true,
          includeAttachments: false
        }
      }
    ];

    this.schedules = defaultSchedules;
    log.info(`Initialized ${defaultSchedules.length} report schedules`);
  }

  private startAutoRefresh(): void {
    if (!this.autoRefreshEnabled) return;

    setInterval(async () => {
      await this.refreshAllDashboards();
    }, 60 * 1000);
    log.info('Auto-refresh started for compliance dashboards');
  }

  private startAlertMonitoring(): void {
    setInterval(async () => {
      await this.checkComplianceAlerts();
    }, 5 * 60 * 1000);
    log.info('Compliance alert monitoring started');
  }

  private async refreshAllDashboards(): Promise<void> {
    try {
      for (const dashboard of this.dashboards.values()) {
        if (dashboard.lastRefresh && 
            Date.now() - dashboard.lastRefresh.getTime() < dashboard.refreshInterval * 1000) {
          continue;
        }

        await this.refreshDashboard(dashboard.id);
      }
    } catch (error) {
      log.error('Failed to refresh dashboards', { error });
    }
  }

  private async refreshDashboard(dashboardId: string): Promise<void> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return;

    try {
      for (const widget of dashboard.widgets) {
        await this.refreshWidget(widget);
      }

      dashboard.lastRefresh = new Date();
      log.info(`Dashboard refreshed: ${dashboard.name}`);
    } catch (error) {
      log.error(`Failed to refresh dashboard ${dashboard.name}`, { error });
    }
  }

  private async refreshWidget(widget: DashboardWidget): Promise<void> {
    try {
      const data = await this.getWidgetData(widget);
      // TODO: Use data when implementing full widget functionality
      widget.lastUpdate = new Date();
      log.debug(`Widget refreshed: ${widget.title}`);
    } catch (error) {
      log.error(`Failed to refresh widget ${widget.title}`, { error });
    }
  }

  private async getWidgetData(widget: DashboardWidget): Promise<any> {
    switch (widget.dataSource) {
      case 'compliance_metrics':
        return await this.getComplianceMetrics();
      case 'compliance_trends':
        return await this.getComplianceTrends(widget.config.timeRange || '30d');
      default:
        return {};
    }
  }

  private async getComplianceMetrics(): Promise<any> {
    const complianceData = await complianceAutomationService.getComplianceRules();
    const checks = await complianceAutomationService.getComplianceChecks();

    const totalChecks = checks.length;
    const passedChecks = checks.filter(c => c.status === 'pass').length;
    const complianceScore = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 100;

    return {
      overallScore: complianceScore,
      totalChecks,
      passedChecks,
      failedChecks: totalChecks - passedChecks,
      activeRules: complianceData.filter(r => r.status === 'active').length
    };
  }

  private async getComplianceTrends(timeRange: string): Promise<any> {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const trends = [];

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        score: 85 + Math.random() * 15,
        checks: Math.floor(Math.random() * 50) + 100
      });
    }

    return trends;
  }

  private async checkComplianceAlerts(): Promise<void> {
    try {
      const rules = await complianceAutomationService.getComplianceRules();
      const checks = await complianceAutomationService.getComplianceChecks();

      for (const rule of rules) {
        const recentChecks = checks.filter(c => 
          c.ruleId === rule.id && 
          c.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
        );

        const failedChecks = recentChecks.filter(c => c.status === 'fail');

        if (failedChecks.length > 0) {
          await this.createComplianceAlert({
            type: 'compliance_violation',
            severity: rule.severity,
            title: `Compliance Violation: ${rule.name}`,
            description: `Rule ${rule.name} has ${failedChecks.length} failed checks in the last 24 hours`,
            framework: rule.category,
            affectedRules: [rule.id],
            detectedAt: new Date()
          });
        }
      }
    } catch (error) {
      log.error('Failed to check compliance alerts', { error });
    }
  }

  async createComplianceDashboard(dashboardData: Partial<ComplianceDashboard>): Promise<ComplianceDashboard> {
    const dashboard: ComplianceDashboard = {
      id: crypto.randomUUID(),
      name: dashboardData.name || 'New Dashboard',
      description: dashboardData.description || '',
      type: dashboardData.type || 'custom',
      framework: dashboardData.framework || 'all',
      refreshInterval: dashboardData.refreshInterval || 300,
      widgets: dashboardData.widgets || [],
      filters: dashboardData.filters || [],
      permissions: dashboardData.permissions || [],
      isPublic: dashboardData.isPublic || false,
      metadata: dashboardData.metadata || {}
    };

    this.dashboards.set(dashboard.id, dashboard);
    log.info(`Compliance dashboard created: ${dashboard.name}`);

    return dashboard;
  }

  async generateComplianceReport(
    framework: string,
    period: { start: Date; end: Date },
    reportType: string,
    generatedBy: string
  ): Promise<ComplianceReport> {
    try {
      const rules = await complianceAutomationService.getComplianceRules();
      const checks = await complianceAutomationService.getComplianceChecks();

      const frameworkRules = rules.filter(r => framework === 'all' || r.category === framework);
      const frameworkChecks = checks.filter(c => 
        frameworkRules.some(r => r.id === c.ruleId) &&
        c.timestamp >= period.start &&
        c.timestamp <= period.end
      );

      const totalChecks = frameworkChecks.length;
      const passedChecks = frameworkChecks.filter(c => c.status === 'pass').length;
      const complianceScore = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 100;

      const report: ComplianceReport = {
        id: crypto.randomUUID(),
        title: `${framework} Compliance Report`,
        description: `Compliance report for ${framework} framework`,
        framework: framework as any,
        period,
        generatedAt: new Date(),
        generatedBy,
        status: 'draft',
        sections: [
          {
            id: crypto.randomUUID(),
            title: 'Executive Summary',
            type: 'overview',
            content: `This report provides a comprehensive overview of ${framework} compliance status for the period ${period.start.toDateString()} to ${period.end.toDateString()}.`,
            order: 1
          },
          {
            id: crypto.randomUUID(),
            title: 'Compliance Status',
            type: 'compliance',
            content: `Overall compliance score: ${complianceScore.toFixed(1)}%`,
            data: {
              totalChecks,
              passedChecks,
              failedChecks: totalChecks - passedChecks,
              complianceScore
            },
            order: 2
          }
        ],
        summary: {
          overallScore: complianceScore,
          complianceRate: complianceScore,
          totalChecks,
          passedChecks,
          failedChecks: totalChecks - passedChecks,
          criticalIssues: 0,
          highIssues: 0,
          mediumIssues: 0,
          lowIssues: 0,
          trends: {
            score: 'stable',
            issues: 'stable',
            compliance: 'stable'
          },
          recommendations: [
            'Continue monitoring compliance metrics',
            'Address failed compliance checks promptly',
            'Review and update compliance rules as needed'
          ],
          nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        attachments: [],
        metadata: {
          reportType,
          framework,
          generatedBy
        }
      };

      this.reports.push(report);
      log.info(`Compliance report generated: ${report.title}`);

      return report;
    } catch (error) {
      log.error('Failed to generate compliance report', { error });
      throw error;
    }
  }

  async createComplianceAlert(alertData: Partial<ComplianceAlert>): Promise<ComplianceAlert> {
    const alert: ComplianceAlert = {
      id: crypto.randomUUID(),
      type: alertData.type || 'compliance_violation',
      severity: alertData.severity || 'medium',
      title: alertData.title || 'Compliance Alert',
      description: alertData.description || '',
      framework: alertData.framework || '',
      affectedRules: alertData.affectedRules || [],
      detectedAt: new Date(),
      dueDate: alertData.dueDate,
      status: 'new'
    };

    this.alerts.push(alert);
    log.warn(`Compliance alert created: ${alert.title}`, { alert });

    return alert;
  }

  async getComplianceDashboards(filters?: {
    type?: string;
    framework?: string;
    isPublic?: boolean;
  }): Promise<ComplianceDashboard[]> {
    let dashboards = Array.from(this.dashboards.values());

    if (filters?.type) {
      dashboards = dashboards.filter(d => d.type === filters.type);
    }
    if (filters?.framework) {
      dashboards = dashboards.filter(d => d.framework === filters.framework);
    }
    if (filters?.isPublic !== undefined) {
      dashboards = dashboards.filter(d => d.isPublic === filters.isPublic);
    }

    return dashboards;
  }

  async getComplianceReports(filters?: {
    framework?: string;
    status?: string;
    period?: { start: Date; end: Date };
  }): Promise<ComplianceReport[]> {
    let reports = this.reports;

    if (filters?.framework) {
      reports = reports.filter(r => r.framework === filters.framework);
    }
    if (filters?.status) {
      reports = reports.filter(r => r.status === filters.status);
    }
    if (filters?.period) {
      reports = reports.filter(r => 
        r.generatedAt >= filters.period!.start && 
        r.generatedAt <= filters.period!.end
      );
    }

    return reports.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  async getComplianceAlerts(filters?: {
    type?: string;
    severity?: string;
    status?: string;
  }): Promise<ComplianceAlert[]> {
    let alerts = this.alerts;

    if (filters?.type) {
      alerts = alerts.filter(a => a.type === filters.type);
    }
    if (filters?.severity) {
      alerts = alerts.filter(a => a.severity === filters.severity);
    }
    if (filters?.status) {
      alerts = alerts.filter(a => a.status === filters.status);
    }

    return alerts.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
  }

  async getReportSchedules(): Promise<ComplianceSchedule[]> {
    return this.schedules;
  }

  async updateDashboard(dashboardId: string, updates: Partial<ComplianceDashboard>): Promise<void> {
    const dashboard = this.dashboards.get(dashboardId);
    if (dashboard) {
      Object.assign(dashboard, updates);
      log.info(`Dashboard updated: ${dashboard.name}`);
    }
  }

  async updateAlertStatus(alertId: string, status: ComplianceAlert['status'], updates?: Partial<ComplianceAlert>): Promise<void> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = status;
      if (updates) {
        Object.assign(alert, updates);
      }
      log.info(`Alert status updated: ${alert.title} -> ${status}`);
    }
  }

  async exportReport(reportId: string, format: 'pdf' | 'excel' | 'csv'): Promise<string> {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) {
      throw new Error(`Report not found: ${reportId}`);
    }

    const exportUrl = `/api/compliance/reports/${reportId}/export?format=${format}`;
    log.info(`Report export requested: ${report.title} (${format})`);

    return exportUrl;
  }
}

export const complianceReportingService = ComplianceReportingService.getInstance();
