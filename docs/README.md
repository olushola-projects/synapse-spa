# Documentation Guide

## Directory Structure

```
docs/
├── architecture/          # System architecture documentation
│   ├── diagrams/         # Architecture diagrams
│   ├── decisions/        # Architecture Decision Records (ADRs)
│   └── overview.md       # High-level architecture overview
├── api/                  # API documentation (auto-generated)
├── development/          # Development guides
│   ├── setup.md         # Development environment setup
│   ├── workflow.md      # Development workflow
│   └── standards.md     # Coding standards
├── deployment/          # Deployment documentation
│   ├── environments.md  # Environment configurations
│   └── procedures.md    # Deployment procedures
├── security/            # Security documentation
│   ├── policies.md      # Security policies
│   └── procedures.md    # Security procedures
├── compliance/          # Compliance documentation
│   ├── gdpr.md         # GDPR compliance
│   ├── sfdr.md         # SFDR compliance
│   └── soc2.md         # SOC 2 compliance
└── operations/          # Operations documentation
    ├── monitoring.md    # Monitoring procedures
    └── runbooks.md      # Operation runbooks
```

## Documentation Standards

### 1. Document Types

- **Architecture Documentation**: System design, components, and technical decisions
- **API Documentation**: Auto-generated API reference and usage guides
- **Development Guides**: Setup instructions, workflows, and standards
- **Deployment Documentation**: Environment configurations and procedures
- **Security Documentation**: Security policies and procedures
- **Compliance Documentation**: Regulatory compliance requirements
- **Operations Documentation**: Monitoring procedures and runbooks

### 2. Document Format

- Use Markdown for all documentation
- Include a table of contents for documents longer than 2 screens
- Use proper heading hierarchy (H1 > H2 > H3)
- Include metadata (last updated, owner, status)
- Add links to related documents

### 3. Writing Style

- Write in clear, concise language
- Use active voice
- Include examples where applicable
- Keep paragraphs short and focused
- Use bullet points and numbered lists for clarity

### 4. Code Examples

- Use syntax highlighting
- Include comments explaining complex logic
- Provide working examples
- Show both correct and incorrect usage

### 5. Diagrams

- Use Mermaid for diagrams when possible
- Include alt text for accessibility
- Keep diagrams simple and focused
- Use consistent styling

### 6. Version Control

- Document significant changes in CHANGELOG.md
- Include rationale for major changes
- Reference related issues or pull requests
- Keep documentation in sync with code

### 7. Review Process

- Technical review by subject matter experts
- Editorial review for clarity and consistency
- Regular updates (at least quarterly)
- Validation of code examples and procedures

## Contributing

1. Follow the directory structure
2. Use the provided templates
3. Test all procedures and examples
4. Update related documentation
5. Submit for review before merging

## Templates

Find document templates in the `templates/` directory:

- Architecture Decision Record (ADR)
- API Documentation
- Technical Specification
- User Guide
- Runbook
- Security Policy

## Maintenance

- Documentation is reviewed quarterly
- Outdated content is archived or updated
- Broken links are fixed promptly
- New features require documentation

## Contact

For questions about documentation standards or contributions, contact:
- Technical Documentation: tech-docs@synapses.ai
- Compliance Documentation: compliance-docs@synapses.ai
