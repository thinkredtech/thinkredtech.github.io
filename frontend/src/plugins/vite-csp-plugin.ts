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

  if (!enabled) {
    return {
      name: "vite-csp-plugin",
    };
  }

  return {
    name: "vite-csp-plugin",
    enforce: "post",
    configResolved() {
      // Plugin configuration resolved
    },
    transformIndexHtml: {
      order: "post",
      handler(html: string) {
        if (!development) {
          // Generate nonces for production builds
          const scriptNonce = generateCSPNonce();
          const styleNonce = generateCSPNonce();

          // Get CSP header with nonces
          const cspHeader = getCSPWithNonces(scriptNonce, styleNonce);

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
