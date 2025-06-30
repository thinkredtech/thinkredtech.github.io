/**
 * Production CSP Configuration
 * Use this for deploying to production environments
 */

// Production CSP - Balanced security policy allowing necessary inline elements
export const PRODUCTION_CSP = `
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://api.thinkred.tech;
object-src 'none';
media-src 'self';
child-src 'none';
frame-src 'none';
worker-src 'self';
manifest-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
block-all-mixed-content;
`
  .replace(/\s+/g, " ")
  .trim();

// Development CSP - More permissive for Vite dev server
export const DEVELOPMENT_CSP = `
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://api.thinkred.tech https:;
object-src 'none';
media-src 'self';
child-src 'none';
frame-src 'none';
worker-src 'self';
manifest-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
block-all-mixed-content;
`
  .replace(/\s+/g, " ")
  .trim();

/**
 * CSP with nonces for dynamic content
 * @param scriptNonce - Nonce for inline scripts
 * @param styleNonce - Nonce for inline styles
 */
export function getCSPWithNonces(
  scriptNonce?: string,
  styleNonce?: string,
): string {
  const scriptSrc = scriptNonce ? `'self' 'nonce-${scriptNonce}'` : `'self'`;
  const styleSrc = styleNonce
    ? `'self' 'nonce-${styleNonce}' https://fonts.googleapis.com`
    : `'self' https://fonts.googleapis.com`;

  return `
default-src 'self';
script-src ${scriptSrc};
style-src ${styleSrc};
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://api.thinkred.tech;
object-src 'none';
media-src 'self';
child-src 'none';
frame-src 'none';
worker-src 'self';
manifest-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
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
