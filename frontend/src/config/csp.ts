/**
 * Production CSP Configuration
 * Secure CSP without unsafe-inline or unsafe-eval directives
 * Addresses GitHub Issue #45 - Content Security Policy Violations
 */

// Production CSP - Strict security policy with specific allowed sources
export const PRODUCTION_CSP = `
default-src 'self';
script-src 'self' https://script.google.com https://script.googleusercontent.com;
style-src 'self' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://api.thinkred.tech https://script.google.com https://script.googleusercontent.com;
object-src 'none';
media-src 'self';
child-src 'none';
frame-src 'none';
worker-src 'self';
manifest-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self' https://script.google.com https://script.googleusercontent.com;
upgrade-insecure-requests;
block-all-mixed-content;
`
  .replace(/\s+/g, " ")
  .trim();

// Development CSP - Secure development CSP with nonce support instead of unsafe directives
export const DEVELOPMENT_CSP = `
default-src 'self';
script-src 'self' https://script.google.com https://script.googleusercontent.com;
style-src 'self' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://api.thinkred.tech https://script.google.com https://script.googleusercontent.com https: ws: wss:;
object-src 'none';
media-src 'self';
child-src 'none';
frame-src 'none';
worker-src 'self';
manifest-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self' https://script.google.com https://script.googleusercontent.com;
upgrade-insecure-requests;
block-all-mixed-content;
`
  .replace(/\s+/g, " ")
  .trim();

/**
 * CSP with nonces for dynamic content
 * Secure approach for inline scripts and styles using nonces
 * @param scriptNonce - Nonce for inline scripts
 * @param styleNonce - Nonce for inline styles
 */
export function getCSPWithNonces(
  scriptNonce?: string,
  styleNonce?: string,
): string {
  const scriptSrc = scriptNonce
    ? `'self' 'nonce-${scriptNonce}' https://script.google.com https://script.googleusercontent.com`
    : `'self' https://script.google.com https://script.googleusercontent.com`;
  const styleSrc = styleNonce
    ? `'self' 'nonce-${styleNonce}' https://fonts.googleapis.com`
    : `'self' https://fonts.googleapis.com`;

  return `
default-src 'self';
script-src ${scriptSrc};
style-src ${styleSrc};
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://api.thinkred.tech https://script.google.com https://script.googleusercontent.com;
object-src 'none';
media-src 'self';
child-src 'none';
frame-src 'none';
worker-src 'self';
manifest-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self' https://script.google.com https://script.googleusercontent.com;
upgrade-insecure-requests;
block-all-mixed-content;
report-uri /csp-violation-report-endpoint/;
`
    .replace(/\s+/g, " ")
    .trim();
}

export default {
  PRODUCTION_CSP,
  DEVELOPMENT_CSP,
  getCSPWithNonces,
};
