/**
 * Vite CSP Plugin
 * Generates secure Content Security Policy with nonces for inline scripts and styles
 * Addresses GitHub Issue #45 - Content Security Policy Violations
 */
import { Plugin } from "vite";
import { generateCSPNonce } from "../utils/security";
import { PRODUCTION_CSP, getCSPWithNonces } from "../config/csp";

export interface CSPPluginOptions {
  enabled?: boolean;
  useNonces?: boolean;
  reportOnly?: boolean;
  reportUri?: string;
}

export function cspPlugin(options: CSPPluginOptions = {}): Plugin {
  const {
    enabled = true,
    useNonces = true,
    reportOnly = false,
    reportUri = "/csp-violation-report-endpoint/",
  } = options;

  let scriptNonce: string;
  let styleNonce: string;

  return {
    name: "vite-csp-plugin",
    configResolved(_config) {
      if (!enabled) return;

      // Generate nonces for this build
      if (useNonces) {
        scriptNonce = generateCSPNonce();
        styleNonce = generateCSPNonce();
      }
    },
    transformIndexHtml: {
      enforce: "post",
      transform(html, context) {
        if (!enabled) return html;

        let cspHeader: string;

        if (useNonces && context.bundle) {
          // Use nonce-based CSP for production builds
          cspHeader = getCSPWithNonces(scriptNonce, styleNonce);

          // Add nonces to inline scripts and styles
          html = html.replace(
            /<script(?![^>]*\ssrc=)([^>]*)>/g,
            `<script nonce="${scriptNonce}"$1>`,
          );
          html = html.replace(
            /<style([^>]*)>/g,
            `<style nonce="${styleNonce}"$1>`,
          );
        } else {
          // Use production CSP without unsafe directives
          cspHeader = PRODUCTION_CSP;
        }

        // Add report-uri if specified
        if (reportUri) {
          cspHeader += ` report-uri ${reportUri};`;
        }

        // Replace existing CSP meta tag or add new one
        const cspMetaTag = `<meta http-equiv="Content-Security-Policy${
          reportOnly ? "-Report-Only" : ""
        }" content="${cspHeader}" />`;

        if (html.includes('http-equiv="Content-Security-Policy"')) {
          // Replace existing CSP
          html = html.replace(
            /<meta\s+http-equiv="Content-Security-Policy"[^>]*>/,
            cspMetaTag,
          );
        } else {
          // Add CSP meta tag after charset
          html = html.replace(
            /<meta\s+charset="[^"]*"\s*\/?>/,
            `$&\n    ${cspMetaTag}`,
          );
        }

        return html;
      },
    },
  };
}

export default cspPlugin;
