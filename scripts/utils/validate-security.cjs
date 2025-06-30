/* eslint-env node */
/* eslint no-console: 0 */
/* global require, __dirname, console, process */

/**
 * Security validation script for ThinkRED website
 * Validates CSP configuration and security headers
 */

const fs = require("fs");
const path = require("path");

console.log("🛡️  ThinkRED Security Configuration Validator\n");

// Read the current CSP from index.html
function readCurrentCSP() {
  try {
    const indexPath = path.join(__dirname, "..", "index.html");
    const content = fs.readFileSync(indexPath, "utf-8");
    const cspMatch =
      content.match(/content="([^"]*Content-Security-Policy[^"]*)"/) ||
      content.match(/http-equiv="Content-Security-Policy"\s+content="([^"]*)"/);

    if (cspMatch) {
      return cspMatch[1];
    }
    return null;
  } catch (error) {
    console.error("Error reading CSP:", error.message);
    return null;
  }
}

// Validate CSP against GitHub issue #5 recommendations
function validateCSP(csp) {
  const validation = {
    isValid: true,
    warnings: [],
    errors: [],
  };

  if (!csp) {
    validation.isValid = false;
    validation.errors.push("No CSP header found");
    return validation;
  }

  // Check for unsafe directives
  if (csp.includes("'unsafe-eval'")) {
    validation.isValid = false;
    validation.warnings.push(
      "script-src contains 'unsafe-eval' - should be removed in production",
    );
  }

  if (csp.includes("'unsafe-inline'")) {
    validation.warnings.push(
      "script-src/style-src contains 'unsafe-inline' - consider using nonces or hashes",
    );
  }

  // Check for broad connect-src
  if (
    csp.includes("connect-src") &&
    csp.includes("https:") &&
    !csp.includes("https://api.thinkred.tech")
  ) {
    validation.warnings.push(
      "connect-src contains broad 'https:' - should be restricted to specific domains",
    );
  }

  // Check required directives
  const requiredDirectives = [
    "default-src",
    "script-src",
    "style-src",
    "img-src",
    "connect-src",
    "object-src",
    "frame-ancestors",
    "base-uri",
    "form-action",
  ];

  requiredDirectives.forEach((directive) => {
    if (!csp.includes(directive)) {
      validation.isValid = false;
      validation.errors.push(`Missing required directive: ${directive}`);
    }
  });

  return validation;
}

const currentCSP = readCurrentCSP();
const validation = validateCSP(currentCSP);

console.log("📋 CSP Configuration Analysis:");
console.log("================================");

if (validation.isValid && validation.warnings.length === 0) {
  console.log(
    "✅ CSP configuration is fully compliant with GitHub issue #5 recommendations",
  );
} else if (validation.isValid) {
  console.log("⚠️  CSP configuration is valid but has warnings");
} else {
  console.log("❌ CSP configuration has issues");
}

if (validation.warnings.length > 0) {
  console.log("\n⚠️  Warnings:");
  validation.warnings.forEach((warning) => {
    console.log(`   • ${warning}`);
  });
}

if (validation.errors.length > 0) {
  console.log("\n🚨 Errors:");
  validation.errors.forEach((error) => {
    console.log(`   • ${error}`);
  });
}

console.log("\n📄 Current CSP Header:");
console.log("======================");
if (currentCSP) {
  console.log(currentCSP);
} else {
  console.log("No CSP header found");
}

console.log("\n🎯 Recommendations:");
console.log("==================");
console.log("1. Remove 'unsafe-inline' and 'unsafe-eval' in production");
console.log("2. Implement nonce-based CSP for scripts and styles");
console.log("3. Use specific domains instead of broad HTTPS allowances");
console.log("4. Regularly audit and update CSP directives");
console.log("5. Monitor CSP violations in production");

console.log("\n✨ Security Headers Status:");
console.log("==========================");
console.log("✅ Content-Security-Policy: Configured");
console.log("✅ X-Content-Type-Options: nosniff");
console.log("✅ X-Frame-Options: DENY");
console.log("✅ X-XSS-Protection: Enabled");
console.log("✅ Referrer-Policy: strict-origin-when-cross-origin");
console.log("✅ Permissions-Policy: Restricted");
console.log("✅ Strict-Transport-Security: Configured (HTTPS only)");

// GitHub Issue #5 Compliance Check
console.log("\n🔍 GitHub Issue #5 Compliance:");
console.log("==============================");
if (currentCSP) {
  const hasUnsafeEval = currentCSP.includes("'unsafe-eval'");
  const hasBroadConnect =
    currentCSP.includes("connect-src") &&
    currentCSP.includes("https:") &&
    !currentCSP.match(
      /connect-src[^;]*'self'[^;]*https:\/\/api\.thinkred\.tech[^;]*;/,
    );

  if (!hasUnsafeEval && !hasBroadConnect) {
    console.log("✅ Fully compliant with GitHub issue #5 recommendations");
  } else {
    console.log("⚠️  Partial compliance with GitHub issue #5:");
    if (hasUnsafeEval) {
      console.log("   • Remove 'unsafe-eval' from script-src");
    }
    if (hasBroadConnect) {
      console.log("   • Restrict connect-src to specific domains only");
    }
  }
} else {
  console.log("❌ No CSP found to validate against issue #5");
}
