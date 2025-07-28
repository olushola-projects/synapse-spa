# Development Setup Guide

## Overview

This guide implements the corrective actions from our Root Cause Analysis to establish consistent development standards and prevent code quality issues.

## Prerequisites

- Node.js 18+ installed
- Git configured
- VS Code (recommended) or preferred IDE

## Initial Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd synapse-landing-nexus
npm install
```

### 2. Install Development Tools

```bash
# Install Prettier and ESLint extensions for VS Code
# Or configure your preferred IDE with these tools

# Install pre-commit hooks (recommended)
npm install --save-dev husky lint-staged
npx husky install
```

### 3. Configure Git Hooks

```bash
# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# Add commit-msg hook for conventional commits
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

## Code Quality Standards

### Formatting Rules

- **Prettier**: Automatic code formatting on save
- **No trailing spaces**: Enforced by linting
- **Consistent indentation**: 2 spaces, no tabs
- **Line endings**: LF (Unix-style)
- **End of file**: Always include newline

### Linting Rules

- **ESLint**: Enforces code quality and consistency
- **No magic numbers**: Use named constants from `src/utils/constants.ts`
- **Trailing commas**: Not required (configured in Prettier)
- **Import organization**: Automatic sorting and grouping

### File Organization

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── utils/              # Utility functions and constants
│   ├── constants.ts    # Application constants
│   ├── validation.ts   # Form validation schemas
│   └── security.ts     # Security utilities
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── styles/             # Global styles and themes
```

## Development Workflow

### 1. Before Starting Work

```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Install any new dependencies
npm install
```

### 2. During Development

```bash
# Run development server
npm run dev

# Run tests in watch mode
npm run test

# Check code quality
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### 3. Before Committing

```bash
# Format code
npx prettier --write .

# Run full test suite
npm test

# Check for linting errors
npm run lint

# Build to ensure no build errors
npm run build
```

### 4. Commit Guidelines

```bash
# Use conventional commit format
git commit -m "feat: add user authentication"
git commit -m "fix: resolve validation error handling"
git commit -m "docs: update setup instructions"
git commit -m "refactor: extract validation constants"
```

## IDE Configuration

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Recommended Extensions

- ESLint
- Prettier - Code formatter
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

## Code Review Checklist

### Before Submitting PR

- [ ] All tests pass
- [ ] No linting errors
- [ ] Code is properly formatted
- [ ] No magic numbers (use constants)
- [ ] Proper error handling
- [ ] TypeScript types are correct
- [ ] Documentation updated if needed

### Reviewer Checklist

- [ ] Code follows established patterns
- [ ] Logic is clear and well-commented
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Mobile responsiveness maintained

## Troubleshooting

### Common Issues

#### Linting Errors

```bash
# Fix automatically fixable issues
npm run lint -- --fix

# Check specific file
npx eslint src/path/to/file.ts
```

#### Formatting Issues

```bash
# Format specific file
npx prettier --write src/path/to/file.ts

# Check if file would be formatted
npx prettier --check src/path/to/file.ts
```

#### Pre-commit Hook Issues

```bash
# Reinstall hooks
npx husky install

# Test hook manually
npx lint-staged
```

#### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit
```

## Performance Monitoring

### Code Quality Metrics

- **Linting Errors**: Target < 10 errors
- **Test Coverage**: Target > 80%
- **Build Time**: Monitor and optimize
- **Bundle Size**: Track and minimize

### Regular Maintenance

- **Weekly**: Review and update dependencies
- **Monthly**: Analyze code quality metrics
- **Quarterly**: Review and update linting rules
- **Annually**: Major tooling updates

## Getting Help

### Resources

- [ESLint Documentation](https://eslint.org/docs/)
- [Prettier Documentation](https://prettier.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

### Team Communication

- Ask questions in team chat
- Create issues for bugs or improvements
- Share knowledge in team meetings
- Document solutions for common problems

This setup ensures consistent code quality and prevents the issues identified in our RCA report.
