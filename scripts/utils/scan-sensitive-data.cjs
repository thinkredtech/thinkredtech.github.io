/* eslint-env node */
/* eslint no-console: 0 */
/* global require, __dirname, console, process */

/**
 * Sensitive Data Scanner for ThinkRED website
 * Scans for potential secrets, API keys, and sensitive information
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔍 ThinkRED Sensitive Data Scanner\n');

// Sensitive data patterns
const SENSITIVE_PATTERNS = [
  {
    name: 'AWS Access Key',
    pattern: /AKIA[0-9A-Z]{16}/g,
    severity: 'CRITICAL'
  },
  {
    name: 'GitHub Token (new format)',
    pattern: /ghp_[a-zA-Z0-9]{36}/g,
    severity: 'CRITICAL'
  },
  {
    name: 'GitHub Token (old format)',
    pattern: /gh[pousr]_[A-Za-z0-9_]{36,255}/g,
    severity: 'CRITICAL'
  },
  {
    name: 'OpenAI API Key',
    pattern: /sk-[a-zA-Z0-9]{48}/g,
    severity: 'CRITICAL'
  },
  {
    name: 'Stripe API Key',
    pattern: /sk_(test|live)_[0-9a-zA-Z]{24}/g,
    severity: 'CRITICAL'
  },
  {
    name: 'Private Key',
    pattern: /-----BEGIN (RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/g,
    severity: 'CRITICAL'
  },
  {
    name: 'Potential Password in Code',
    pattern: /(?:password|pwd|pass)\s*[:=]\s*["'][^"']{8,}["']/gi,
    severity: 'HIGH'
  },
  {
    name: 'Hardcoded API Key Pattern',
    pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*["'][^"']{20,}["']/gi,
    severity: 'HIGH'
  },
  {
    name: 'JWT Token',
    pattern: /eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g,
    severity: 'MEDIUM'
  },
  {
    name: 'Base64 Encoded Secrets (suspicious length)',
    pattern: /(?:secret|token|key)\s*[:=]\s*["'][A-Za-z0-9+/]{40,}={0,2}["']/gi,
    severity: 'MEDIUM'
  }
];

// Files and directories to exclude
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /build/,
  /dist/,
  /coverage/,
  /\.map$/,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /\.jpg$/,
  /\.png$/,
  /\.svg$/,
  /\.ico$/
];

// Files that are allowed to contain example secrets (but we still flag them)
const EXAMPLE_FILES = [
  '.env.example',
  'README.md'
];

function shouldExcludeFile(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

function isExampleFile(filePath) {
  return EXAMPLE_FILES.some(file => filePath.includes(file));
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const findings = [];

    SENSITIVE_PATTERNS.forEach(({ name, pattern, severity }) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Get line number
          const lines = content.split('\n');
          let lineNumber = 1;
          let position = 0;
          
          for (let i = 0; i < lines.length; i++) {
            if (position + lines[i].length >= content.indexOf(match)) {
              lineNumber = i + 1;
              break;
            }
            position += lines[i].length + 1; // +1 for newline
          }

          findings.push({
            file: filePath,
            line: lineNumber,
            type: name,
            severity,
            match: match.substring(0, 50) + (match.length > 50 ? '...' : ''),
            isExample: isExampleFile(filePath)
          });
        });
      }
    });

    return findings;
  } catch (error) {
    console.warn(`Warning: Could not scan ${filePath}: ${error.message}`);
    return [];
  }
}

function scanDirectory(dirPath, allFindings = []) {
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!shouldExcludeFile(fullPath)) {
          scanDirectory(fullPath, allFindings);
        }
      } else if (stat.isFile()) {
        if (!shouldExcludeFile(fullPath)) {
          const findings = scanFile(fullPath);
          allFindings.push(...findings);
        }
      }
    });
    
    return allFindings;
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
    return allFindings;
  }
}

// Main scanning function
function performScan() {
  const projectRoot = path.join(__dirname, '..');
  console.log(`📂 Scanning project: ${projectRoot}\n`);
  
  const findings = scanDirectory(projectRoot);
  
  // Group findings by severity
  const grouped = {
    CRITICAL: findings.filter(f => f.severity === 'CRITICAL'),
    HIGH: findings.filter(f => f.severity === 'HIGH'),
    MEDIUM: findings.filter(f => f.severity === 'MEDIUM')
  };

  // Report results
  let hasIssues = false;

  Object.entries(grouped).forEach(([severity, items]) => {
    if (items.length > 0) {
      hasIssues = true;
      const icon = severity === 'CRITICAL' ? '🚨' : severity === 'HIGH' ? '⚠️' : 'ℹ️';
      console.log(`${icon} ${severity} Issues Found: ${items.length}`);
      console.log(''.padEnd(50, '='));
      
      items.forEach(finding => {
        const exampleNote = finding.isExample ? ' (Example File)' : '';
        console.log(`📄 File: ${finding.file.replace(projectRoot, '.')}:${finding.line}${exampleNote}`);
        console.log(`🔍 Type: ${finding.type}`);
        console.log(`📝 Match: ${finding.match}`);
        console.log('');
      });
    }
  });

  if (!hasIssues) {
    console.log('✅ No sensitive data detected in the codebase!');
  } else {
    console.log('\n🛡️ Remediation Steps:');
    console.log('===================');
    console.log('1. Review all findings above');
    console.log('2. Remove any real secrets from the codebase');
    console.log('3. Use environment variables for sensitive data');
    console.log('4. Update .gitignore to exclude sensitive files');
    console.log('5. Rotate any exposed credentials');
    console.log('6. Consider using git-secrets or similar tools');
  }

  console.log('\n📊 Scan Summary:');
  console.log('================');
  console.log(`Total files scanned: ${findings.length > 0 ? 'Multiple' : 'All accessible files'}`);
  console.log(`Critical issues: ${grouped.CRITICAL.length}`);
  console.log(`High severity: ${grouped.HIGH.length}`);
  console.log(`Medium severity: ${grouped.MEDIUM.length}`);
  
  // Return exit code based on critical issues
  if (grouped.CRITICAL.filter(f => !f.isExample).length > 0) {
    console.log('\n❌ CRITICAL: Real secrets detected! Immediate action required.');
    process.exit(1);
  } else if (grouped.CRITICAL.length > 0) {
    console.log('\n⚠️ WARNING: Potential secrets in example files. Verify they are not real.');
  } else {
    console.log('\n✅ PASSED: No critical security issues detected.');
  }
}

// Run the scan
performScan();
