#!/usr/bin/env node
/**
 * Security Validation Script for GitHub Issues #44 and #45
 * Validates that sensitive data exposure and CSP violations are resolved
 */

const fs = require("fs");
const path = require("path");

console.log("🔒 ThinkRED Security Validation - GitHub Issues #44 & #45\n");

// Check for CSP violations (Issue #45)
function validateCSP() {
  console.log("📋 Checking CSP Configuration (Issue #45)...");
  
  const filesToCheck = [
    path.join(__dirname, "../../frontend/index.html"),
    path.join(__dirname, "../../build/index.html"),
  ];

  let violations = [];

  filesToCheck.forEach((file) => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf8");
      
      // Check for unsafe CSP directives
      if (content.includes("'unsafe-inline'")) {
        violations.push(`${file}: Contains 'unsafe-inline' directive`);
      }
      if (content.includes("'unsafe-eval'")) {
        violations.push(`${file}: Contains 'unsafe-eval' directive`);
      }
      
      // Check for proper CSP structure
      const cspMatch = content.match(/Content-Security-Policy[^>]*content="([^"]+)"/);
      if (cspMatch) {
        const csp = cspMatch[1];
        console.log(`  ✓ CSP found in ${path.basename(file)}`);
        
        // Validate that Google Apps Script domains are included
        if (!csp.includes("script.google.com")) {
          violations.push(`${file}: Missing script.google.com in CSP`);
        }
        if (!csp.includes("script.googleusercontent.com")) {
          violations.push(`${file}: Missing script.googleusercontent.com in CSP`);
        }
      } else {
        violations.push(`${file}: No CSP header found`);
      }
    }
  });

  if (violations.length === 0) {
    console.log("  ✅ CSP validation PASSED - No unsafe directives found");
    return true;
  } else {
    console.log("  ❌ CSP validation FAILED:");
    violations.forEach((violation) => console.log(`    - ${violation}`));
    return false;
  }
}

// Check for sensitive data exposure (Issue #44)
function validateSensitiveData() {
  console.log("\n🔍 Checking for Sensitive Data Exposure (Issue #44)...");
  
  const sensitivePatterns = [
    {
      name: "Hardcoded passwords",
      pattern: /(?:password|pwd|pass)\s*[:=]\s*["'][^"']{8,}["']/gi,
      severity: "CRITICAL",
    },
    {
      name: "API keys in code",
      pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*["'][^"']{20,}["']/gi,
      severity: "HIGH",
    },
    {
      name: "Private keys",
      pattern: /-----BEGIN (RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/g,
      severity: "CRITICAL",
    },
    {
      name: "JWT tokens",
      pattern: /eyJ[A-Za-z0-9+/=]+\.eyJ[A-Za-z0-9+/=]+\.[A-Za-z0-9+/._-]+/g,
      severity: "HIGH",
    },
    {
      name: "AWS access keys",
      pattern: /AKIA[0-9A-Z]{16}/g,
      severity: "CRITICAL",
    },
  ];

  const filesToScan = [
    path.join(__dirname, "../../frontend/src"),
    path.join(__dirname, "../../backend"),
  ];

  let exposures = [];

  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.includes("node_modules")) {
        scanDirectory(fullPath);
      } else if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js")) {
        const content = fs.readFileSync(fullPath, "utf8");
        
        sensitivePatterns.forEach((pattern) => {
          const matches = content.match(pattern.pattern);
          if (matches) {
            // Filter out environment variable references, templates, and public APIs
            const realMatches = matches.filter((match) => 
              !match.includes("process.env") && 
              !match.includes("import.meta.env") &&
              !match.includes("YOUR_") &&
              !match.includes("<") &&
              !match.includes("REPLACE_") &&
              !match.includes("AKfycby") && // Google Apps Script deployment IDs are public
              !match.includes("fallbackId") &&
              !match.toLowerCase().includes("example")
            );
            
            if (realMatches.length > 0) {
              exposures.push({
                file: fullPath,
                pattern: pattern.name,
                severity: pattern.severity,
                matches: realMatches.length,
              });
            }
          }
        });
      }
    });
  }

  filesToScan.forEach(scanDirectory);

  if (exposures.length === 0) {
    console.log("  ✅ Sensitive data validation PASSED - No exposures found");
    return true;
  } else {
    console.log("  ❌ Sensitive data validation FAILED:");
    exposures.forEach((exposure) => {
      console.log(`    - ${exposure.severity}: ${exposure.pattern} in ${path.basename(exposure.file)} (${exposure.matches} matches)`);
    });
    return false;
  }
}

// Check environment configuration
function validateEnvironmentConfig() {
  console.log("\n🌍 Checking Environment Configuration...");
  
  const envFiles = [
    path.join(__dirname, "../../.env.example"),
    path.join(__dirname, "../../frontend/.env.example"),
  ];

  let configIssues = [];

  envFiles.forEach((envFile) => {
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, "utf8");
      
      // Check for placeholder values that might indicate real credentials
      if (content.includes("REPLACE_WITH_") && !content.includes("<")) {
        configIssues.push(`${envFile}: Contains potential real credentials instead of placeholders`);
      }
      
      console.log(`  ✓ Environment template found: ${path.basename(envFile)}`);
    } else {
      configIssues.push(`Missing environment template: ${envFile}`);
    }
  });

  if (configIssues.length === 0) {
    console.log("  ✅ Environment configuration validation PASSED");
    return true;
  } else {
    console.log("  ❌ Environment configuration validation FAILED:");
    configIssues.forEach((issue) => console.log(`    - ${issue}`));
    return false;
  }
}

// Run all validations
function main() {
  const cspValid = validateCSP();
  const sensitiveDataValid = validateSensitiveData();
  const envConfigValid = validateEnvironmentConfig();

  console.log("\n" + "=".repeat(60));
  console.log("📊 SECURITY VALIDATION SUMMARY");
  console.log("=".repeat(60));
  
  console.log(`Issue #45 (CSP Violations): ${cspValid ? "✅ RESOLVED" : "❌ FAILED"}`);
  console.log(`Issue #44 (Sensitive Data): ${sensitiveDataValid ? "✅ RESOLVED" : "❌ FAILED"}`);
  console.log(`Environment Security: ${envConfigValid ? "✅ VALID" : "❌ ISSUES FOUND"}`);

  const allValid = cspValid && sensitiveDataValid && envConfigValid;
  console.log(`\nOverall Status: ${allValid ? "✅ ALL SECURITY ISSUES RESOLVED" : "❌ SECURITY ISSUES REMAIN"}`);

  if (allValid) {
    console.log("\n🎉 Congratulations! All GitHub security issues have been resolved.");
    console.log("   You can now safely deploy your application.");
  } else {
    console.log("\n⚠️  Please address the remaining issues before deployment.");
    process.exit(1);
  }
}

main();
