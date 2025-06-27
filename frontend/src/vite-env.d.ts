/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_APPS_SCRIPT_ID: string;
  readonly VITE_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID: string;
  readonly VITE_GOOGLE_APPS_SCRIPT_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_ENABLE_API_DEBUG: string;
  readonly VITE_NODE_ENV: string;
  readonly VITE_REACT_APP_ADMIN_PASSWORD: string;
  readonly VITE_FRONTEND_BASE_URL: string;
  readonly VITE_BUILD_OUTPUT_DIR: string;
  readonly VITE_ENABLE_JOB_APPLICATIONS: string;
  readonly VITE_ENABLE_CONTACT_FORM: string;
  readonly VITE_ENABLE_BLOG: string;
  readonly VITE_ENABLE_PORTFOLIO: string;
  readonly VITE_ENABLE_HONEYPOT: string;
  readonly VITE_ENABLE_RATE_LIMITING: string;
  readonly VITE_RATE_LIMIT_COOLDOWN: string;
  readonly VITE_ALLOWED_ORIGINS: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_ENABLE_FORM_ANALYTICS: string;
  readonly VITE_ENABLE_ERROR_TRACKING: string;
  readonly VITE_ENABLE_DEV_LOGGING: string;
  readonly VITE_DEV_SERVER_PORT: string;
  readonly VITE_ENABLE_PROD_SOURCE_MAPS: string;
  readonly VITE_ENABLE_BUNDLE_ANALYSIS: string;
  readonly VITE_ENABLE_CSS_MINIFICATION: string;
  readonly VITE_ENABLE_JS_MINIFICATION: string;
  
  // Legacy React environment variables (for backward compatibility)
  readonly REACT_APP_ADMIN_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
