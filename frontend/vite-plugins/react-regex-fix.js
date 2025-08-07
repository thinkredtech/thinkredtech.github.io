/**
 * React 19.1.1 Regex Fix Plugin for Vite
 * 
 * This plugin automatically fixes a critical bug in React 19.1.1 where
 * a malformed regex pattern causes fatal runtime crashes.
 * 
 * Bug: ( *(at  - Invalid: * without preceding character
 * Fix: ( .*(at  - Valid: .* matches any characters
 * 
 * This ensures the fix is applied on every build, even after fresh installs.
 */

export function reactRegexFixPlugin() {
  return {
    name: 'react-regex-fix',
    generateBundle(options, bundle) {
      // Process all JavaScript chunks in the bundle
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && fileName.includes('react-core')) {
          const originalCode = chunk.code;
          let fixedCode = originalCode;
          
          // Fix the naked asterisk pattern found in React 19.1.1
          if (originalCode.includes('( *(at')) {
            fixedCode = originalCode.replace('( *(at', '( .*(at');
          }
          
          if (originalCode !== fixedCode) {
            chunk.code = fixedCode;
            if (typeof console !== 'undefined') {
              console.log(`✅ React 19.1.1 regex pattern fixed in ${fileName}`);
            }
          }
        }
      }
    }
  };
}
