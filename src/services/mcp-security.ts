/**
 * MCP-Enhanced Security Testing Service
 * Prioritizes Model Context Protocol for advanced security validation
 */

import { logger } from '@/utils/logger';

interface SecurityTestResult {
  testId: string;
  testType: 'vulnerability' | 'compliance' | 'penetration' | 'code-analysis';
  status: 'passed' | 'failed' | 'warning' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  mcpEnhanced: boolean;
  confidence: number;
  details: {
    description: string;
    vulnerability?: string;
    recommendation?: string;
    cveId?: string;
    complianceFramework?: string;
    mcpInsights?: string[];
  };
  metadata: {
    timestamp: string;
    scanner: string;
    version: string;
  };
}

export class MCPSecurityService {
  private isConnected: boolean = false;
  private capabilities = {
    vulnerabilityScanning: false,
    complianceValidation: false,
    penetrationTesting: false,
    codeAnalysis: false,
    realTimeMonitoring: false
  };

  constructor() {
    this.initializeMCP();
  }

  private async initializeMCP(): Promise<void> {
    try {
      const mcpAvailable = await this.checkMCPAvailability();
      if (mcpAvailable) {
        await this.connectToMCP();
        await this.discoverCapabilities();
        this.isConnected = true;
        logger.info('✅ MCP Security Service initialized');
      } else {
        logger.warn('⚠️ MCP not available, using traditional security testing');
      }
    } catch (error) {
      logger.error('❌ MCP Security initialization failed', error);
    }
  }

  private async checkMCPAvailability(): Promise<boolean> {
    try {
      const response = await fetch('/api/mcp/health', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async connectToMCP(): Promise<void> {
    const response = await fetch('/api/mcp/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client: 'synapses-security',
        version: '1.0.0'
      })
    });

    if (!response.ok) {
      throw new Error('MCP connection failed');
    }
  }

  private async discoverCapabilities(): Promise<void> {
    try {
      const response = await fetch('/api/mcp/capabilities');
      if (response.ok) {
        const mcpCapabilities = await response.json();
        this.capabilities = {
          vulnerabilityScanning: mcpCapabilities.vulnerabilityScanning || false,
          complianceValidation: mcpCapabilities.complianceValidation || false,
          penetrationTesting: mcpCapabilities.penetrationTesting || false,
          codeAnalysis: mcpCapabilities.codeAnalysis || false,
          realTimeMonitoring: mcpCapabilities.realTimeMonitoring || false
        };
      }
    } catch (error) {
      logger.error('Failed to discover MCP security capabilities', error);
    }
  }

  async runVulnerabilityScan(target: string): Promise<SecurityTestResult[]> {
    if (this.isConnected && this.capabilities.vulnerabilityScanning) {
      return this.runMCPVulnerabilityScan(target);
    } else {
      return this.runTraditionalVulnerabilityScan(target);
    }
  }

  private async runMCPVulnerabilityScan(target: string): Promise<SecurityTestResult[]> {
    try {
      const response = await fetch('/api/mcp/security/vulnerability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target,
          scanType: 'comprehensive',
          includeCVE: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.vulnerabilities.map((vuln: any) => ({
          ...vuln,
          mcpEnhanced: true,
          testType: 'vulnerability'
        }));
      }
    } catch (error) {
      logger.error('MCP vulnerability scan failed', error);
    }

    return this.runTraditionalVulnerabilityScan(target);
  }

  private async runTraditionalVulnerabilityScan(target: string): Promise<SecurityTestResult[]> {
    return [{
      testId: `vuln-scan-${Date.now()}`,
      testType: 'vulnerability',
      status: 'skipped',
      severity: 'low',
      mcpEnhanced: false,
      confidence: 0.5,
      details: {
        description: `Vulnerability scan for ${target}`,
        recommendation: 'Configure vulnerability scanning tool'
      },
      metadata: {
        timestamp: new Date().toISOString(),
        scanner: 'traditional',
        version: '1.0.0'
      }
    }];
  }

  async runComplianceValidation(framework: string, requirements: string[]): Promise<SecurityTestResult[]> {
    if (this.isConnected && this.capabilities.complianceValidation) {
      return this.runMCPComplianceValidation(framework, requirements);
    } else {
      return this.runTraditionalComplianceValidation(framework, requirements);
    }
  }

  private async runMCPComplianceValidation(framework: string, requirements: string[]): Promise<SecurityTestResult[]> {
    try {
      const response = await fetch('/api/mcp/security/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          framework,
          requirements,
          validationType: 'automated'
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.compliance.map((comp: any) => ({
          ...comp,
          mcpEnhanced: true,
          testType: 'compliance'
        }));
      }
    } catch (error) {
      logger.error('MCP compliance validation failed', error);
    }

    return this.runTraditionalComplianceValidation(framework, requirements);
  }

  private async runTraditionalComplianceValidation(framework: string, requirements: string[]): Promise<SecurityTestResult[]> {
    return requirements.map((req, index) => ({
      testId: `compliance-${framework}-${index + 1}`,
      testType: 'compliance',
      status: 'skipped',
      severity: 'medium',
      mcpEnhanced: false,
      confidence: 0.6,
      details: {
        description: `Compliance validation for ${req}`,
        complianceFramework: framework,
        recommendation: 'Implement compliance validation tool'
      },
      metadata: {
        timestamp: new Date().toISOString(),
        scanner: 'traditional',
        version: '1.0.0'
      }
    }));
  }

  async runPenetrationTest(target: string, scope: string[]): Promise<SecurityTestResult[]> {
    if (this.isConnected && this.capabilities.penetrationTesting) {
      return this.runMCPPenetrationTest(target, scope);
    } else {
      return this.runTraditionalPenetrationTest(target, scope);
    }
  }

  private async runMCPPenetrationTest(target: string, scope: string[]): Promise<SecurityTestResult[]> {
    try {
      const response = await fetch('/api/mcp/security/penetration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target,
          scope,
          testType: 'automated'
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.findings.map((finding: any) => ({
          ...finding,
          mcpEnhanced: true,
          testType: 'penetration'
        }));
      }
    } catch (error) {
      logger.error('MCP penetration test failed', error);
    }

    return this.runTraditionalPenetrationTest(target, scope);
  }

  private async runTraditionalPenetrationTest(target: string, scope: string[]): Promise<SecurityTestResult[]> {
    return [{
      testId: `pentest-${Date.now()}`,
      testType: 'penetration',
      status: 'skipped',
      severity: 'high',
      mcpEnhanced: false,
      confidence: 0.4,
      details: {
        description: `Penetration test for ${target}`,
        recommendation: 'Configure penetration testing tool'
      },
      metadata: {
        timestamp: new Date().toISOString(),
        scanner: 'traditional',
        version: '1.0.0'
      }
    }];
  }

  async runCodeAnalysis(codebase: string): Promise<SecurityTestResult[]> {
    if (this.isConnected && this.capabilities.codeAnalysis) {
      return this.runMCPCodeAnalysis(codebase);
    } else {
      return this.runTraditionalCodeAnalysis(codebase);
    }
  }

  private async runMCPCodeAnalysis(codebase: string): Promise<SecurityTestResult[]> {
    try {
      const response = await fetch('/api/mcp/security/code-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codebase,
          analysisType: 'security'
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.issues.map((issue: any) => ({
          ...issue,
          mcpEnhanced: true,
          testType: 'code-analysis'
        }));
      }
    } catch (error) {
      logger.error('MCP code analysis failed', error);
    }

    return this.runTraditionalCodeAnalysis(codebase);
  }

  private async runTraditionalCodeAnalysis(codebase: string): Promise<SecurityTestResult[]> {
    return [{
      testId: `code-analysis-${Date.now()}`,
      testType: 'code-analysis',
      status: 'skipped',
      severity: 'medium',
      mcpEnhanced: false,
      confidence: 0.5,
      details: {
        description: `Code analysis for ${codebase}`,
        recommendation: 'Configure static code analysis tool'
      },
      metadata: {
        timestamp: new Date().toISOString(),
        scanner: 'traditional',
        version: '1.0.0'
      }
    }];
  }

  getStatus() {
    return {
      connected: this.isConnected,
      capabilities: this.capabilities,
      priority: 'mcp-first'
    };
  }
}

export const mcpSecurityService = new MCPSecurityService();
