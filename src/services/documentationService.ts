/**
 * Documentation Service - Priority 3
 * Complete security and compliance documentation
 */

import { backendConfig } from '../config/environment.backend';
import { log } from '../utils/logger';

export interface DocumentationItem {
  id: string;
  title: string;
  description: string;
  type: 'policy' | 'procedure' | 'guide' | 'template' | 'checklist' | 'report';
  category: 'security' | 'compliance' | 'operational' | 'technical' | 'user';
  framework: 'SFDR' | 'GDPR' | 'SOX' | 'ISO27001' | 'SOC2' | 'general';
  version: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  content: string;
  tags: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  nextReviewDate?: Date;
  metadata: Record<string, any>;
}

export interface DocumentationTemplate {
  id: string;
  name: string;
  description: string;
  type: DocumentationItem['type'];
  category: DocumentationItem['category'];
  framework: DocumentationItem['framework'];
  template: string;
  variables: TemplateVariable[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select';
  description: string;
  required: boolean;
  defaultValue?: any;
  options?: any[];
  validation?: string;
}

export interface DocumentationWorkflow {
  id: string;
  name: string;
  description: string;
  type: 'review' | 'approval' | 'publish';
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'review' | 'approve' | 'notify';
  assignee: string;
  order: number;
  required: boolean;
  timeLimit?: number;
  actions: string[];
}

export interface DocumentationSearch {
  query: string;
  filters: {
    type?: string[];
    category?: string[];
    framework?: string[];
    status?: string[];
    author?: string;
    dateRange?: { start: Date; end: Date };
  };
  sortBy: 'relevance' | 'date' | 'title' | 'author';
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface DocumentationMetrics {
  id: string;
  timestamp: Date;
  metrics: {
    totalDocuments: number;
    activeDocuments: number;
    documentsInReview: number;
    documentsPendingApproval: number;
    averageReviewTime: number;
    complianceCoverage: number;
    lastUpdatedDocument: Date;
  };
  trends: {
    documentGrowth: 'increasing' | 'decreasing' | 'stable';
    reviewEfficiency: 'improving' | 'declining' | 'stable';
    complianceStatus: 'improving' | 'declining' | 'stable';
  };
}

export interface DocumentationExport {
  id: string;
  type: 'pdf' | 'html' | 'markdown' | 'json';
  filters: DocumentationSearch['filters'];
  generatedAt: Date;
  generatedBy: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  fileSize?: number;
  metadata: Record<string, any>;
}

class DocumentationService {
  private static instance: DocumentationService;
  private documents: Map<string, DocumentationItem> = new Map();
  private templates: Map<string, DocumentationTemplate> = new Map();
  private workflows: Map<string, DocumentationWorkflow> = new Map();
  private exports: DocumentationExport[] = [];
  private documentationEnabled: boolean;
  private autoReviewEnabled: boolean;

  constructor() {
    this.documentationEnabled = backendConfig.ENABLE_DOCUMENTATION;
    this.autoReviewEnabled = backendConfig.ENABLE_AUTO_REVIEW;

    if (this.documentationEnabled) {
      this.initializeDocumentationService();
    }
  }

  static getInstance(): DocumentationService {
    if (!DocumentationService.instance) {
      DocumentationService.instance = new DocumentationService();
    }
    return DocumentationService.instance;
  }

  private async initializeDocumentationService(): Promise<void> {
    try {
      log.info('Initializing documentation service');

      await this.initializeDefaultTemplates();
      await this.initializeDefaultWorkflows();
      await this.initializeDefaultDocuments();
      this.startAutoReview();

      log.info('Documentation service initialized');
    } catch (error) {
      log.error('Failed to initialize documentation service', { error });
    }
  }

  private async initializeDefaultTemplates(): Promise<void> {
    const defaultTemplates: DocumentationTemplate[] = [
      {
        id: crypto.randomUUID(),
        name: 'Security Policy Template',
        description: 'Template for creating security policies',
        type: 'policy',
        category: 'security',
        framework: 'general',
        template: `# {policyName}

## Overview
{policyDescription}

## Scope
This policy applies to {scope}.

## Policy Statement
{policyStatement}

## Responsibilities
- **{role1}**: {responsibility1}
- **{role2}**: {responsibility2}

## Compliance Requirements
{complianceRequirements}

## Review Schedule
This policy will be reviewed {reviewFrequency}.

## Contact Information
For questions about this policy, contact {contactPerson}.

**Version**: {version}
**Last Updated**: {lastUpdated}
**Next Review**: {nextReview}`,
        variables: [
          {
            name: 'policyName',
            type: 'string',
            description: 'Name of the policy',
            required: true
          },
          {
            name: 'policyDescription',
            type: 'string',
            description: 'Brief description of the policy',
            required: true
          },
          {
            name: 'scope',
            type: 'string',
            description: 'Scope of the policy',
            required: true
          },
          {
            name: 'policyStatement',
            type: 'string',
            description: 'Main policy statement',
            required: true
          },
          {
            name: 'role1',
            type: 'string',
            description: 'First role',
            required: true
          },
          {
            name: 'responsibility1',
            type: 'string',
            description: 'First responsibility',
            required: true
          },
          {
            name: 'role2',
            type: 'string',
            description: 'Second role',
            required: false
          },
          {
            name: 'responsibility2',
            type: 'string',
            description: 'Second responsibility',
            required: false
          },
          {
            name: 'complianceRequirements',
            type: 'string',
            description: 'Compliance requirements',
            required: false
          },
          {
            name: 'reviewFrequency',
            type: 'string',
            description: 'Review frequency',
            required: true,
            defaultValue: 'annually'
          },
          {
            name: 'contactPerson',
            type: 'string',
            description: 'Contact person',
            required: true
          },
          {
            name: 'version',
            type: 'string',
            description: 'Version number',
            required: true,
            defaultValue: '1.0'
          },
          {
            name: 'lastUpdated',
            type: 'date',
            description: 'Last updated date',
            required: true
          },
          {
            name: 'nextReview',
            type: 'date',
            description: 'Next review date',
            required: true
          }
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: 'Compliance Checklist Template',
        description: 'Template for creating compliance checklists',
        type: 'checklist',
        category: 'compliance',
        framework: 'general',
        template: `# {checklistName}

## Purpose
{checklistPurpose}

## Framework
{framework}

## Checklist Items

### {section1}
- [ ] {item1}
- [ ] {item2}
- [ ] {item3}

### {section2}
- [ ] {item4}
- [ ] {item5}
- [ ] {item6}

## Review Information
- **Reviewed By**: {reviewedBy}
- **Review Date**: {reviewDate}
- **Next Review**: {nextReview}
- **Status**: {status}`,
        variables: [
          {
            name: 'checklistName',
            type: 'string',
            description: 'Name of the checklist',
            required: true
          },
          {
            name: 'checklistPurpose',
            type: 'string',
            description: 'Purpose of the checklist',
            required: true
          },
          {
            name: 'framework',
            type: 'select',
            description: 'Compliance framework',
            required: true,
            options: ['SFDR', 'GDPR', 'SOX', 'ISO27001', 'SOC2', 'General']
          },
          {
            name: 'section1',
            type: 'string',
            description: 'First section title',
            required: true
          },
          {
            name: 'item1',
            type: 'string',
            description: 'First checklist item',
            required: true
          },
          {
            name: 'item2',
            type: 'string',
            description: 'Second checklist item',
            required: false
          },
          {
            name: 'item3',
            type: 'string',
            description: 'Third checklist item',
            required: false
          },
          {
            name: 'section2',
            type: 'string',
            description: 'Second section title',
            required: false
          },
          {
            name: 'item4',
            type: 'string',
            description: 'Fourth checklist item',
            required: false
          },
          {
            name: 'item5',
            type: 'string',
            description: 'Fifth checklist item',
            required: false
          },
          {
            name: 'item6',
            type: 'string',
            description: 'Sixth checklist item',
            required: false
          },
          {
            name: 'reviewedBy',
            type: 'string',
            description: 'Person who reviewed',
            required: true
          },
          {
            name: 'reviewDate',
            type: 'date',
            description: 'Review date',
            required: true
          },
          {
            name: 'nextReview',
            type: 'date',
            description: 'Next review date',
            required: true
          },
          {
            name: 'status',
            type: 'select',
            description: 'Checklist status',
            required: true,
            options: ['Draft', 'In Review', 'Approved', 'Archived']
          }
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const template of defaultTemplates) {
      this.templates.set(template.id, template);
    }

    log.info(`Initialized ${defaultTemplates.length} documentation templates`);
  }

  private async initializeDefaultWorkflows(): Promise<void> {
    const defaultWorkflows: DocumentationWorkflow[] = [
      {
        id: crypto.randomUUID(),
        name: 'Standard Review Workflow',
        description: 'Standard workflow for document review and approval',
        type: 'review',
        steps: [
          {
            id: crypto.randomUUID(),
            name: 'Technical Review',
            type: 'review',
            assignee: 'technical_team',
            order: 1,
            required: true,
            timeLimit: 7 * 24 * 60 * 60 * 1000,
            actions: ['approve', 'reject', 'request_changes']
          },
          {
            id: crypto.randomUUID(),
            name: 'Compliance Review',
            type: 'review',
            assignee: 'compliance_team',
            order: 2,
            required: true,
            timeLimit: 7 * 24 * 60 * 60 * 1000,
            actions: ['approve', 'reject', 'request_changes']
          },
          {
            id: crypto.randomUUID(),
            name: 'Final Approval',
            type: 'approve',
            assignee: 'document_owner',
            order: 3,
            required: true,
            timeLimit: 3 * 24 * 60 * 60 * 1000,
            actions: ['approve', 'reject']
          }
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const workflow of defaultWorkflows) {
      this.workflows.set(workflow.id, workflow);
    }

    log.info(`Initialized ${defaultWorkflows.length} documentation workflows`);
  }

  private async initializeDefaultDocuments(): Promise<void> {
    const defaultDocuments: DocumentationItem[] = [
      {
        id: crypto.randomUUID(),
        title: 'Information Security Policy',
        description: 'Comprehensive information security policy for the organization',
        type: 'policy',
        category: 'security',
        framework: 'ISO27001',
        version: '1.0',
        status: 'approved',
        content: `# Information Security Policy

## Overview
This policy establishes the framework for information security management within our organization.

## Scope
This policy applies to all employees, contractors, and third-party vendors who access organizational information systems.

## Policy Statement
The organization is committed to protecting the confidentiality, integrity, and availability of all information assets.

## Key Principles
- Confidentiality: Information is accessible only to authorized individuals
- Integrity: Information is accurate and complete
- Availability: Information is accessible when needed

## Responsibilities
- **All Employees**: Follow security procedures and report incidents
- **IT Team**: Implement and maintain security controls
- **Management**: Provide resources and oversight

## Review Schedule
This policy is reviewed annually and updated as needed.

**Version**: 1.0
**Last Updated**: ${new Date().toISOString().split('T')[0]}
**Next Review**: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
        tags: ['security', 'policy', 'ISO27001', 'information-security'],
        author: 'security_team',
        createdAt: new Date(),
        updatedAt: new Date(),
        reviewedAt: new Date(),
        approvedBy: 'document_owner',
        approvedAt: new Date(),
        nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        metadata: {}
      },
      {
        id: crypto.randomUUID(),
        title: 'Data Protection Checklist',
        description: 'Checklist for ensuring data protection compliance',
        type: 'checklist',
        category: 'compliance',
        framework: 'GDPR',
        version: '1.0',
        status: 'approved',
        content: `# Data Protection Checklist

## Purpose
This checklist ensures compliance with data protection regulations.

## Framework
GDPR

## Checklist Items

### Data Inventory
- [ ] Personal data inventory is maintained
- [ ] Data processing activities are documented
- [ ] Legal basis for processing is identified

### Data Subject Rights
- [ ] Right to access is implemented
- [ ] Right to rectification is implemented
- [ ] Right to erasure is implemented
- [ ] Right to portability is implemented

### Security Measures
- [ ] Encryption is implemented for data at rest
- [ ] Encryption is implemented for data in transit
- [ ] Access controls are in place
- [ ] Regular security assessments are conducted

## Review Information
- **Reviewed By**: compliance_team
- **Review Date**: ${new Date().toISOString().split('T')[0]}
- **Next Review**: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
- **Status**: Approved`,
        tags: ['compliance', 'checklist', 'GDPR', 'data-protection'],
        author: 'compliance_team',
        createdAt: new Date(),
        updatedAt: new Date(),
        reviewedAt: new Date(),
        approvedBy: 'compliance_manager',
        approvedAt: new Date(),
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        metadata: {}
      }
    ];

    for (const document of defaultDocuments) {
      this.documents.set(document.id, document);
    }

    log.info(`Initialized ${defaultDocuments.length} default documents`);
  }

  private startAutoReview(): void {
    if (!this.autoReviewEnabled) return;

    setInterval(async () => {
      await this.checkDocumentReviews();
    }, 24 * 60 * 60 * 1000); // Daily check
    log.info('Auto-review started for documentation');
  }

  private async checkDocumentReviews(): Promise<void> {
    try {
      const now = new Date();
      const documentsNeedingReview = Array.from(this.documents.values()).filter(doc => 
        doc.nextReviewDate && doc.nextReviewDate <= now
      );

      for (const document of documentsNeedingReview) {
        await this.createReviewNotification(document);
      }

      if (documentsNeedingReview.length > 0) {
        log.info(`${documentsNeedingReview.length} documents need review`);
      }
    } catch (error) {
      log.error('Failed to check document reviews', { error });
    }
  }

  private async createReviewNotification(document: DocumentationItem): Promise<void> {
    log.warn(`Document needs review: ${document.title}`, {
      documentId: document.id,
      nextReviewDate: document.nextReviewDate,
      author: document.author
    });
  }

  async createDocument(documentData: Partial<DocumentationItem>): Promise<DocumentationItem> {
    const document: DocumentationItem = {
      id: crypto.randomUUID(),
      title: documentData.title || 'New Document',
      description: documentData.description || '',
      type: documentData.type || 'policy',
      category: documentData.category || 'technical',
      framework: documentData.framework || 'general',
      version: documentData.version || '1.0',
      status: 'draft',
      content: documentData.content || '',
      tags: documentData.tags || [],
      author: documentData.author || 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: documentData.metadata || {}
    };

    this.documents.set(document.id, document);
    log.info(`Document created: ${document.title}`, { document });

    return document;
  }

  async createDocumentFromTemplate(
    templateId: string,
    variables: Record<string, any>,
    author: string
  ): Promise<DocumentationItem> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    let content = template.template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      content = content.replace(new RegExp(placeholder, 'g'), value);
    }

    const document = await this.createDocument({
      title: variables.policyName || variables.checklistName || 'Document from Template',
      description: variables.policyDescription || variables.checklistPurpose || '',
      type: template.type,
      category: template.category,
      framework: template.framework,
      content,
      author,
      tags: ['template-generated']
    });

    return document;
  }

  async updateDocument(documentId: string, updates: Partial<DocumentationItem>): Promise<void> {
    const document = this.documents.get(documentId);
    if (document) {
      Object.assign(document, updates);
      document.updatedAt = new Date();
      log.info(`Document updated: ${document.title}`);
    }
  }

  async searchDocuments(search: DocumentationSearch): Promise<{
    documents: DocumentationItem[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    let documents = Array.from(this.documents.values());

    // Apply filters
    if (search.filters.type?.length) {
      documents = documents.filter(d => search.filters.type!.includes(d.type));
    }
    if (search.filters.category?.length) {
      documents = documents.filter(d => search.filters.category!.includes(d.category));
    }
    if (search.filters.framework?.length) {
      documents = documents.filter(d => search.filters.framework!.includes(d.framework));
    }
    if (search.filters.status?.length) {
      documents = documents.filter(d => search.filters.status!.includes(d.status));
    }
    if (search.filters.author) {
      documents = documents.filter(d => d.author.includes(search.filters.author!));
    }
    if (search.filters.dateRange) {
      documents = documents.filter(d => 
        d.updatedAt >= search.filters.dateRange!.start && 
        d.updatedAt <= search.filters.dateRange!.end
      );
    }

    // Apply search query
    if (search.query) {
      const query = search.query.toLowerCase();
      documents = documents.filter(d => 
        d.title.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.content.toLowerCase().includes(query) ||
        d.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    documents.sort((a, b) => {
      let comparison = 0;
      switch (search.sortBy) {
        case 'date':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        default:
          comparison = 0;
      }
      return search.sortOrder === 'desc' ? -comparison : comparison;
    });

    const total = documents.length;
    const start = (search.page - 1) * search.pageSize;
    const end = start + search.pageSize;
    const paginatedDocuments = documents.slice(start, end);

    return {
      documents: paginatedDocuments,
      total,
      page: search.page,
      pageSize: search.pageSize
    };
  }

  async getDocumentationMetrics(): Promise<DocumentationMetrics> {
    const now = new Date();
    const documents = Array.from(this.documents.values());

    const totalDocuments = documents.length;
    const activeDocuments = documents.filter(d => d.status === 'approved').length;
    const documentsInReview = documents.filter(d => d.status === 'review').length;
    const documentsPendingApproval = documents.filter(d => d.status === 'draft').length;

    const metrics: DocumentationMetrics = {
      id: crypto.randomUUID(),
      timestamp: now,
      metrics: {
        totalDocuments,
        activeDocuments,
        documentsInReview,
        documentsPendingApproval,
        averageReviewTime: 7, // days
        complianceCoverage: 85,
        lastUpdatedDocument: documents.length > 0 ? 
          new Date(Math.max(...documents.map(d => d.updatedAt.getTime()))) : now
      },
      trends: {
        documentGrowth: 'increasing',
        reviewEfficiency: 'stable',
        complianceStatus: 'improving'
      }
    };

    return metrics;
  }

  async exportDocumentation(
    type: DocumentationExport['type'],
    filters: DocumentationSearch['filters'],
    generatedBy: string
  ): Promise<DocumentationExport> {
    const exportItem: DocumentationExport = {
      id: crypto.randomUUID(),
      type,
      filters,
      generatedAt: new Date(),
      generatedBy,
      status: 'pending',
      metadata: {}
    };

    this.exports.push(exportItem);

    // Simulate export processing
    setTimeout(() => {
      exportItem.status = 'completed';
      exportItem.downloadUrl = `/api/documentation/exports/${exportItem.id}/download`;
      exportItem.fileSize = 1024 * 1024; // 1MB
      log.info(`Documentation export completed: ${exportItem.id}`);
    }, 5000);

    log.info(`Documentation export requested: ${type}`, { exportItem });

    return exportItem;
  }

  async getDocumentationTemplates(filters?: {
    type?: string;
    category?: string;
    framework?: string;
    isActive?: boolean;
  }): Promise<DocumentationTemplate[]> {
    let templates = Array.from(this.templates.values());

    if (filters?.type) {
      templates = templates.filter(t => t.type === filters.type);
    }
    if (filters?.category) {
      templates = templates.filter(t => t.category === filters.category);
    }
    if (filters?.framework) {
      templates = templates.filter(t => t.framework === filters.framework);
    }
    if (filters?.isActive !== undefined) {
      templates = templates.filter(t => t.isActive === filters.isActive);
    }

    return templates;
  }

  async getDocumentationWorkflows(): Promise<DocumentationWorkflow[]> {
    return Array.from(this.workflows.values());
  }

  async getDocumentationExports(): Promise<DocumentationExport[]> {
    return this.exports.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  async approveDocument(documentId: string, approvedBy: string): Promise<void> {
    const document = this.documents.get(documentId);
    if (document) {
      document.status = 'approved';
      document.approvedBy = approvedBy;
      document.approvedAt = new Date();
      document.updatedAt = new Date();
      log.info(`Document approved: ${document.title} by ${approvedBy}`);
    }
  }

  async archiveDocument(documentId: string): Promise<void> {
    const document = this.documents.get(documentId);
    if (document) {
      document.status = 'archived';
      document.updatedAt = new Date();
      log.info(`Document archived: ${document.title}`);
    }
  }
}

export const documentationService = DocumentationService.getInstance();
