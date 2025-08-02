/**
 * Production CSP Configuration
 * Secure CSP without unsafe-inline or unsafe-eval directives
 * Addresses GitHub Issue #45 - Content Security Policy Violations
 */

// Production CSP - Secure CSP that works with React/Vite builds
export const PRODUCTION_CSP = `
default-src 'self';
script-src 'self' 'unsafe-inline' https://script.google.com https://script.googleusercontent.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
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

// Development CSP - Permissive CSP for development with necessary allowances
export const DEVELOPMENT_CSP = `
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://script.google.com https://script.googleusercontent.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
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
 * @param isDevelopment - Whether this is for development mode
 */
export function getCSPWithNonces(
  scriptNonce?: string,
  styleNonce?: string,
  isDevelopment = false,
): string {
  const scriptSrc = scriptNonce
    ? `'self' 'nonce-${scriptNonce}' 'unsafe-inline' ${isDevelopment ? "'unsafe-eval' 'unsafe-hashes'" : ""} https://script.google.com https://script.googleusercontent.com`
    : `'self' 'unsafe-inline' ${isDevelopment ? "'unsafe-eval' 'unsafe-hashes'" : ""} https://script.google.com https://script.googleusercontent.com`;

  const styleSrc = styleNonce
    ? `'self' 'nonce-${styleNonce}' 'unsafe-inline' https://fonts.googleapis.com`
    : `'self' 'unsafe-inline' https://fonts.googleapis.com`;

  // Remove directives that don't work in meta tags
  const metaCSP = `
default-src 'self';
script-src ${scriptSrc};
style-src ${styleSrc};
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://api.thinkred.tech https://script.google.com https://script.googleusercontent.com ${isDevelopment ? "https: ws: wss:" : ""};
object-src 'none';
media-src 'self';
child-src 'none';
frame-src 'none';
worker-src 'self';
manifest-src 'self';
base-uri 'self';
form-action 'self' https://script.google.com https://script.googleusercontent.com;
`;

  return metaCSP.replace(/\s+/g, " ").trim();
}

export default {
  PRODUCTION_CSP,
  DEVELOPMENT_CSP,
  getCSPWithNonces,
};
