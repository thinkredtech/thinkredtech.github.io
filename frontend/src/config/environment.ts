/**
 * Environment Configuration Utility
 *
 * Centralized configuration management for the ThinkRED application.
 * This file provides type-safe access to environment variables and
 * ensures consistent configuration across the entire application.
 */

/**
 * Environment configuration interface
 */
export interface AppConfig {
  // Google Apps Script Configuration
  googleAppsScript: {
    projectId: string;
    deploymentId: string;
    baseUrl: string;
    apiEndpoint: string;
  };

  // API Configuration
  api: {
    timeout: number;
    enableDebug: boolean;
  };

  // Application Configuration
  app: {
    environment: 'development' | 'staging' | 'production';
    baseUrl: string;
    buildOutputDir: string;
    adminPassword?: string;
  };

  // Feature Flags
  features: {
    jobApplications: boolean;
    contactForm: boolean;
    blog: boolean;
    portfolio: boolean;
  };

  // Security Configuration
  security: {
    enableHoneypot: boolean;
    enableRateLimiting: boolean;
    rateLimitCooldown: number;
    allowedOrigins: string[];
  };

  // Analytics Configuration
  analytics: {
    googleAnalyticsId?: string;
    enableFormAnalytics: boolean;
    enableErrorTracking: boolean;
  };

  // Development Configuration
  development: {
    enableDevLogging: boolean;
    devServerPort: number;
  };

  // Build Configuration
  build: {
    enableProdSourceMaps: boolean;
    enableBundleAnalysis: boolean;
    enableCssMinification: boolean;
    enableJsMinification: boolean;
  };
}

/**
 * Parse boolean environment variables
 */
const parseBoolean = (
  value: string | undefined,
  defaultValue: boolean = false
): boolean => {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
};

/**
 * Parse number environment variables
 */
const parseNumber = (
  value: string | undefined,
  defaultValue: number
): number => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Parse comma-separated string to array
 */
const parseArray = (
  value: string | undefined,
  defaultValue: string[] = []
): string[] => {
  if (!value) return defaultValue;
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
};

/**
 * Get environment variable with fallback
 */
const getEnvVar = (key: string, fallback?: string): string => {
  // Check Vite environment variables (VITE_ prefix)
  const viteKey = `VITE_${key}`;
  if (import.meta.env[viteKey as keyof ImportMetaEnv]) {
    return import.meta.env[viteKey as keyof ImportMetaEnv];
  }

  // Check React environment variables (REACT_APP_ prefix)
  const reactKey = `REACT_APP_${key}`;
  if (import.meta.env[reactKey as keyof ImportMetaEnv]) {
    return import.meta.env[reactKey as keyof ImportMetaEnv];
  }

  // Check direct environment variable
  if (import.meta.env[key as keyof ImportMetaEnv]) {
    return import.meta.env[key as keyof ImportMetaEnv];
  }

  // Return fallback or empty string
  return fallback || '';
};

/**
 * Get deployment ID based on environment
 * Supports multiple deployment targets for different environments
 */
const getDeploymentId = (): string => {
  // Get environment from env vars first
  const environment = getEnvVar('NODE_ENV', 'production') as
    | 'development'
    | 'staging'
    | 'production';
  
  // Try environment-specific deployment ID first
  const envSpecificId = getEnvVar(
    `GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID_${environment.toUpperCase()}`
  );
  if (envSpecificId) {
    return envSpecificId;
  }

  // Fallback to general deployment ID
  const generalId = getEnvVar('GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID');
  if (generalId) {
    return generalId;
  }

  // Final fallback to latest known production deployment ID
  return 'AKfycbyQpxAHaosv-kGuveJbboxpn3jnzl3TabvmMlTMBAtn-s4VGbEOAJKVYhndRVMYOpISYw';
};

/**
 * Application configuration
 */
export const config: AppConfig = {
  googleAppsScript: {
    projectId: getEnvVar('GOOGLE_APPS_SCRIPT_ID', ''),
    deploymentId: getDeploymentId(),
    baseUrl: getEnvVar(
      'GOOGLE_APPS_SCRIPT_BASE_URL',
      'https://script.google.com/macros/s'
    ),
    get apiEndpoint() {
      return `${this.baseUrl}/${this.deploymentId}/exec`;
    },
  },

  api: {
    timeout: parseNumber(getEnvVar('API_TIMEOUT'), 30000),
    enableDebug: parseBoolean(
      getEnvVar('ENABLE_API_DEBUG'),
      import.meta.env.DEV
    ),
  },

  app: {
    environment: getEnvVar(
      'NODE_ENV',
      'development'
    ) as AppConfig['app']['environment'],
    baseUrl: getEnvVar('FRONTEND_BASE_URL', 'https://thinkredtech.github.io'),
    buildOutputDir: getEnvVar('BUILD_OUTPUT_DIR', 'build'),
    adminPassword: getEnvVar('ADMIN_PASSWORD'),
  },

  features: {
    jobApplications: parseBoolean(getEnvVar('ENABLE_JOB_APPLICATIONS'), true),
    contactForm: parseBoolean(getEnvVar('ENABLE_CONTACT_FORM'), true),
    blog: parseBoolean(getEnvVar('ENABLE_BLOG'), true),
    portfolio: parseBoolean(getEnvVar('ENABLE_PORTFOLIO'), true),
  },

  security: {
    enableHoneypot: parseBoolean(getEnvVar('ENABLE_HONEYPOT'), true),
    enableRateLimiting: parseBoolean(getEnvVar('ENABLE_RATE_LIMITING'), true),
    rateLimitCooldown: parseNumber(getEnvVar('RATE_LIMIT_COOLDOWN'), 5000),
    allowedOrigins: parseArray(getEnvVar('ALLOWED_ORIGINS'), [
      'https://thinkredtech.github.io',
      'http://localhost:3000',
    ]),
  },

  analytics: {
    googleAnalyticsId: getEnvVar('GOOGLE_ANALYTICS_ID') || undefined,
    enableFormAnalytics: parseBoolean(getEnvVar('ENABLE_FORM_ANALYTICS'), true),
    enableErrorTracking: parseBoolean(getEnvVar('ENABLE_ERROR_TRACKING'), true),
  },

  development: {
    enableDevLogging: parseBoolean(
      getEnvVar('ENABLE_DEV_LOGGING'),
      import.meta.env.DEV
    ),
    devServerPort: parseNumber(getEnvVar('DEV_SERVER_PORT'), 3000),
  },

  build: {
    enableProdSourceMaps: parseBoolean(
      getEnvVar('ENABLE_PROD_SOURCE_MAPS'),
      false
    ),
    enableBundleAnalysis: parseBoolean(
      getEnvVar('ENABLE_BUNDLE_ANALYSIS'),
      false
    ),
    enableCssMinification: parseBoolean(
      getEnvVar('ENABLE_CSS_MINIFICATION'),
      true
    ),
    enableJsMinification: parseBoolean(
      getEnvVar('ENABLE_JS_MINIFICATION'),
      true
    ),
  },
};

/**
 * Validate required configuration
 */
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate Google Apps Script configuration
  if (!config.googleAppsScript.deploymentId) {
    errors.push('GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID is required');
  }

  // Validate in production
  if (config.app.environment === 'production') {
    if (!config.app.adminPassword) {
      errors.push('ADMIN_PASSWORD is required in production');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Development helper to log configuration
 */
export const logConfig = (): void => {
  if (config.development.enableDevLogging && import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.group('🔧 Application Configuration');
    // eslint-disable-next-line no-console
    console.log('Environment:', config.app.environment);
    // eslint-disable-next-line no-console
    console.log('API Endpoint:', config.googleAppsScript.apiEndpoint);
    // eslint-disable-next-line no-console
    console.log('Features:', config.features);
    // eslint-disable-next-line no-console
    console.log('Security:', {
      ...config.security,
      allowedOrigins: config.security.allowedOrigins.join(', '),
    });
    // eslint-disable-next-line no-console
    console.groupEnd();
  }
};

/**
 * Export individual configuration sections for convenience
 */
export const {
  googleAppsScript,
  api,
  app,
  features,
  security,
  analytics,
  development,
  build,
} = config;

// Log configuration in development
logConfig();
