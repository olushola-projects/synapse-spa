#!/usr/bin/env node

/**
 * Automated Conflict Resolution Tool
 * Detects and provides guidance for resolving common merge conflicts
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const CONFLICT_PATTERNS = {
  MERGE_MARKERS: /^(<{7}|={7}|>{7})/gm,
  TYPESCRIPT_CONFLICTS: /^(<{7}.*typescript|={7}.*typescript|>{7}.*typescript)/gim,
  COMPONENT_CONFLICTS: /^(<{7}.*component|={7}.*component|>{7}.*component)/gim,
  IMPORT_CONFLICTS: /^(<{7}.*import|={7}.*import|>{7}.*import)/gim
};

async function detectAndResolveConflicts() {
  console.log('🔍 Scanning for merge conflicts...\n');

  const files = await glob('src/**/*.{ts,tsx,js,jsx}');
  const conflictFiles = [];

  for (const file of files) {
    const content = readFileSync(file, 'utf8');

    if (CONFLICT_PATTERNS.MERGE_MARKERS.test(content)) {
      conflictFiles.push({
        file,
        content,
        type: categorizeConflict(content)
      });
    }
  }

  if (conflictFiles.length === 0) {
    console.log('✅ No merge conflicts detected.');
    return;
  }

  console.log(`❌ Found ${conflictFiles.length} files with conflicts:\n`);

  for (const conflict of conflictFiles) {
    console.log(`📁 ${conflict.file}`);
    console.log(`   Type: ${conflict.type}`);
    console.log(`   Resolution: ${getResolutionStrategy(conflict.type)}\n`);

    // Attempt auto-resolution for simple cases
    if (conflict.type === 'import' || conflict.type === 'simple') {
      const resolved = attemptAutoResolution(conflict.content, conflict.type);
      if (resolved) {
        writeFileSync(conflict.file, resolved);
        console.log(`   ✅ Auto-resolved ${conflict.file}\n`);
      }
    }
  }

  // Generate conflict report
  generateConflictReport(conflictFiles);
}

function categorizeConflict(content) {
  if (CONFLICT_PATTERNS.TYPESCRIPT_CONFLICTS.test(content)) return 'typescript';
  if (CONFLICT_PATTERNS.COMPONENT_CONFLICTS.test(content)) return 'component';
  if (CONFLICT_PATTERNS.IMPORT_CONFLICTS.test(content)) return 'import';

  const lines = content.split('\n');
  const conflictSize = lines.filter(
    line => line.startsWith('<<<<<<<') || line.startsWith('=======') || line.startsWith('>>>>>>>')
  ).length;

  return conflictSize <= 6 ? 'simple' : 'complex';
}

function getResolutionStrategy(type) {
  const strategies = {
    typescript: 'Review type definitions and merge compatible types',
    component: 'Check component structure and merge UI changes carefully',
    import: 'Merge import statements and remove duplicates',
    simple: 'Can be auto-resolved',
    complex: 'Manual review required - check business logic'
  };

  return strategies[type] || 'Manual review required';
}

function attemptAutoResolution(content, type) {
  if (type === 'import') {
    return resolveImportConflicts(content);
  }

  if (type === 'simple') {
    return resolveSimpleConflicts(content);
  }

  return null;
}

function resolveImportConflicts(content) {
  const lines = content.split('\n');
  const resolved = [];
  let inConflict = false;
  let headImports = [];
  let incomingImports = [];
  let isHeadSection = false;

  for (const line of lines) {
    if (line.startsWith('<<<<<<<')) {
      inConflict = true;
      isHeadSection = true;
      continue;
    }

    if (line.startsWith('=======')) {
      isHeadSection = false;
      continue;
    }

    if (line.startsWith('>>>>>>>')) {
      inConflict = false;

      // Merge imports
      const allImports = [...headImports, ...incomingImports];
      const uniqueImports = [...new Set(allImports)];
      resolved.push(...uniqueImports.sort());

      headImports = [];
      incomingImports = [];
      continue;
    }

    if (inConflict) {
      if (line.trim().startsWith('import')) {
        if (isHeadSection) {
          headImports.push(line);
        } else {
          incomingImports.push(line);
        }
      }
    } else {
      resolved.push(line);
    }
  }

  return resolved.join('\n');
}

function resolveSimpleConflicts(content) {
  // For very simple conflicts, prefer the incoming changes
  return content.replace(/^<{7}.*\n([\s\S]*?)\n={7}.*\n([\s\S]*?)\n>{7}.*$/gm, '$2');
}

function generateConflictReport(conflicts) {
  const report = {
    timestamp: new Date().toISOString(),
    totalConflicts: conflicts.length,
    byType: {},
    files: conflicts.map(c => ({
      file: c.file,
      type: c.type,
      size: c.content.split('\n').length
    }))
  };

  conflicts.forEach(c => {
    report.byType[c.type] = (report.byType[c.type] || 0) + 1;
  });

  writeFileSync('conflict-report.json', JSON.stringify(report, null, 2));
  console.log('📊 Conflict report generated: conflict-report.json');
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  detectAndResolveConflicts().catch(console.error);
}

export { detectAndResolveConflicts };
