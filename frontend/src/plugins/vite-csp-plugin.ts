/**
 * Vite plugin to inject Content Security Policy (CSP) headers and nonces
 */

import type { Plugin } from "vite";
import { getCSPWithNonces } from "../config/csp";
import { generateCSPNonce } from "../utils/security";

export interface CSPPluginOptions {
  enabled?: boolean;
  development?: boolean;
}

export function createCSPPlugin(options: CSPPluginOptions = {}): Plugin {
  const { enabled = true, development = false } = options;
  let isDev = development;

  if (!enabled) {
    return {
      name: "vite-csp-plugin",
    };
  }

  return {
    name: "vite-csp-plugin",
    enforce: "post",
    configResolved(config) {
      // Auto-detect development mode from Vite config
      isDev =
        development ||
        config.command === "serve" ||
        config.mode === "development";
    },
    transformIndexHtml: {
      order: "post",
      handler(html: string) {
        // In development, use a more permissive CSP or disable entirely
        if (isDev) {
          // For development, use a basic CSP that allows most operations
          const devCSP = `
default-src 'self' 'unsafe-inline' 'unsafe-eval';
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
base-uri 'self';
form-action 'self' https://script.google.com https://script.googleusercontent.com;
`
            .replace(/\s+/g, " ")
            .trim();

          html = html.replace(
            "<head>",
            `<head>
    <meta http-equiv="Content-Security-Policy" content="${devCSP}">`,
          );
        } else {
          // Production: Use strict CSP with nonces
          const scriptNonce = generateCSPNonce();
          const styleNonce = generateCSPNonce();

          // Get CSP header with nonces
          const cspHeader = getCSPWithNonces(scriptNonce, styleNonce, false);

          // Add CSP meta tag
          html = html.replace(
            "<head>",
            `<head>
    <meta http-equiv="Content-Security-Policy" content="${cspHeader}">`,
          );

          // Add nonces to script tags
          html = html.replace(
            /<script(\s[^>]*)?>/g,
            `<script nonce="${scriptNonce}"$1>`,
          );

          // Add nonces to style tags
          html = html.replace(
            /<style(\s[^>]*)?>/g,
            `<style nonce="${styleNonce}"$1>`,
          );
        }

        return html;
      },
    },
  };
}

// Default export for convenience
export default createCSPPlugin;
