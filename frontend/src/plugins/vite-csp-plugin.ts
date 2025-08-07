/**
 * Vite plugin to inject Content Security Policy (CSP) headers and nonces
 */

import type { Plugin } from "vite";
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
        // For production builds, ensure clean CSP without conflicts
        if (!isDev) {
          // Generate fresh nonce for this build
          const scriptNonce = generateCSPNonce();

          // Replace placeholder nonces with actual values
          html = html.replace(/__CSP_NONCE__/g, scriptNonce);

          // Ensure only one CSP meta tag exists
          const cspRegex =
            /<meta\s+http-equiv=["']Content-Security-Policy["'][^>]*>/gi;
          const cspMatches = html.match(cspRegex);

          if (cspMatches && cspMatches.length > 1) {
            // Remove duplicate CSP headers, keep only the first one
            html = html.replace(cspRegex, (match, offset) => {
              const firstMatch = html.indexOf(match);
              return offset === firstMatch ? match : "";
            });
          }
        }

        return html;
      },
    },
  };
}

// Default export for convenience
export default createCSPPlugin;
