#!/usr/bin/env node

/**
 * Test script to verify the React regex fix
 * Tests that the malformed regex pattern has been correctly fixed
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing React regex fix...\n');

// Read the fixed React core file
const reactCoreFile = path.join(__dirname, 'dist/assets/react-core-Ch7uNxnz.js');

if (!fs.existsSync(reactCoreFile)) {
    console.error('❌ React core file not found:', reactCoreFile);
    process.exit(1);
}

const content = fs.readFileSync(reactCoreFile, 'utf8');

// Test 1: Check that the old malformed pattern is gone
const malformedPattern = /var t=n\.stack\.trim\(\)\.match\(\/\\n\(\*\(at\)\?\)\/\)/;
const hasMalformed = malformedPattern.test(content);

// Test 2: Check that the fixed pattern is present
const fixedPattern = /var t=n\.stack\.trim\(\)\.match\(\/\\n\(\.\*\(at\)\?\)\/\)/;
const hasFixed = fixedPattern.test(content);

// Test 3: Try to create the regex patterns to validate they're syntactically correct
let malformedRegexError = null;
let fixedRegexWorks = false;

try {
    // This should throw an error - note: we put this in a try-catch to handle the error
    eval('new RegExp("\\\\n(*(at)?)")'); 
} catch (error) {
    malformedRegexError = error.message;
}

try {
    // This should work fine
    new RegExp('\\n(.*(at)?)');
    fixedRegexWorks = true;
} catch (error) {
    console.error('❌ Fixed regex pattern failed:', error.message);
}

// Test 4: Test the actual regex functionality
let regexTestPassed = false;
try {
    const testRegex = new RegExp('\\n(.*(at)?)');
    const testString = '\n    at someFunction (file.js:123:45)';
    const match = testString.match(testRegex);
    regexTestPassed = match !== null;
} catch (error) {
    console.error('❌ Regex functionality test failed:', error.message);
}

console.log('📋 Test Results:');
console.log('================');

if (hasMalformed) {
    console.log('❌ FAIL: Malformed pattern still present in file');
} else {
    console.log('✅ PASS: Malformed pattern removed from file');
}

if (hasFixed) {
    console.log('✅ PASS: Fixed pattern found in file');
} else {
    console.log('❌ FAIL: Fixed pattern not found in file');
}

if (malformedRegexError) {
    console.log('✅ PASS: Malformed regex throws error as expected:', malformedRegexError);
} else {
    console.log('❌ FAIL: Malformed regex should throw an error');
}

if (fixedRegexWorks) {
    console.log('✅ PASS: Fixed regex pattern is syntactically valid');
} else {
    console.log('❌ FAIL: Fixed regex pattern has syntax errors');
}

if (regexTestPassed) {
    console.log('✅ PASS: Fixed regex matches test strings correctly');
} else {
    console.log('❌ FAIL: Fixed regex does not match test strings');
}

console.log('\n🎯 Summary:');
console.log('============');

const totalTests = 5;
const passedTests = [
    !hasMalformed,
    hasFixed,
    !!malformedRegexError,
    fixedRegexWorks,
    regexTestPassed
].filter(Boolean).length;

console.log(`✅ ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The React regex fix is working correctly.');
    console.log('\n📄 What was fixed:');
    console.log('  Original: /\\n(*(at)?)/  - Invalid: * without preceding character');
    console.log('  Fixed:    /\\n(.*(at)?)/  - Valid: .* matches any characters');
    console.log('\n🚀 The application should now load without fatal regex errors.');
    process.exit(0);
} else {
    console.log('❌ Some tests failed. The fix may not be complete.');
    process.exit(1);
}
