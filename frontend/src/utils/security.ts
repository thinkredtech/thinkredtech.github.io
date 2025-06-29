/**
 * Security utilities for input validation, sanitization, and protection against common vulnerabilities
 */

// HTML entity encoding for XSS prevention
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

// Email validation with comprehensive regex and length check
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email) && email.length <= 254 && email.length >= 5;
};

// Phone number validation (international format)
export const validatePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;

  // Remove all non-digit characters except + for international format
  const cleanPhone = phone.replace(/[^\d+]/g, '');

  // Must be between 7 and 15 digits (E.164 standard)
  const phoneRegex = /^[+]?[1-9]\d{6,14}$/;

  return phoneRegex.test(cleanPhone);
};

// URL validation with protocol check
export const validateURL = (url: string): boolean => {
  if (!url || typeof url !== 'string') return true; // Optional field

  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol) && url.length <= 2048;
  } catch {
    return false;
  }
};

// Text length validation with SQL injection basic protection
export const validateTextLength = (text: string, maxLength: number, minLength: number = 0): boolean => {
  if (typeof text !== 'string') return false;

  const trimmedText = text.trim();

  // Basic SQL injection pattern detection
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|EXECUTE)\b)/i,
    /(--|\/\*|\*\/|;|'|")/,
    /(\bOR\b.*=.*\bOR\b|\bAND\b.*=.*\bAND\b)/i,
  ];

  const hasSQLInjection = sqlInjectionPatterns.some(pattern => pattern.test(text));

  return !hasSQLInjection && trimmedText.length >= minLength && trimmedText.length <= maxLength;
};

// File validation for uploads
export const validateFile = (
  file: File,
  allowedTypes: string[],
  maxSizeBytes: number
): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  // Size validation
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size exceeds ${Math.round(maxSizeBytes / (1024 * 1024))}MB limit`,
    };
  }

  if (file.size < 1024) {
    return { isValid: false, error: 'File appears to be empty or corrupted' };
  }

  // Type validation (both MIME type and extension)
  const allowedExtensions = allowedTypes
    .map(type => {
      switch (type) {
        case 'application/pdf':
          return '.pdf';
        case 'application/msword':
          return '.doc';
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return '.docx';
        case 'image/jpeg':
          return '.jpg';
        case 'image/png':
          return '.png';
        default:
          return '';
      }
    })
    .filter(Boolean);

  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  const hasValidMimeType = allowedTypes.includes(file.type);

  if (!hasValidMimeType || !hasValidExtension) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed: ${allowedExtensions.join(', ')}`,
    };
  }

  // Filename security validation
  const dangerousChars = /[<>:"/\\|?*]/;
  if (dangerousChars.test(file.name)) {
    return { isValid: false, error: 'Filename contains invalid characters' };
  }

  // Check for double extensions (e.g., file.pdf.exe)
  const extensionCount = (file.name.match(/\./g) || []).length;
  if (extensionCount > 1) {
    return { isValid: false, error: 'Multiple file extensions not allowed' };
  }

  return { isValid: true };
};

// Array input sanitization and validation
export const sanitizeAndValidateArrayInput = (
  items: string[],
  maxItems: number = 20,
  maxItemLength: number = 200
): string[] => {
  if (!Array.isArray(items)) return [];

  return items
    .map(item => sanitizeInput(String(item)))
    .filter(item => item.length > 0 && validateTextLength(item, maxItemLength))
    .slice(0, maxItems);
};

// Rate limiting helper (for client-side basic protection)
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (identifier: string): boolean => {
    const now = Date.now();
    const record = attempts.get(identifier);

    if (!record || now > record.resetTime) {
      attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  };
};

// Content Security Policy nonce generator (for dynamic content)
export const generateCSPNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Password strength validation
export const validatePasswordStrength = (password: string): { isValid: boolean; score: number; feedback: string[] } => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;
  else feedback.push('Password should be at least 8 characters long');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Include numbers');

  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 2;
  else feedback.push('Include special characters');

  // Check for common patterns
  const commonPatterns = [
    /123456|password|qwerty|abc123|admin/i,
    /(.)\1{2,}/, // Repeated characters
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    score -= 2;
    feedback.push('Avoid common patterns and repeated characters');
  }

  return {
    isValid: score >= 5 && feedback.length === 0,
    score: Math.max(0, Math.min(10, score)),
    feedback,
  };
};

// Secure session storage helper
export const secureStorage = {
  set: (key: string, value: unknown, expirationMinutes: number = 60): void => {
    const item = {
      value,
      expiry: Date.now() + expirationMinutes * 60 * 1000,
      checksum: btoa(JSON.stringify(value)).slice(0, 10), // Simple integrity check
    };
    sessionStorage.setItem(key, JSON.stringify(item));
  },

  get: (key: string): unknown => {
    const itemStr = sessionStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);

      // Check expiration
      if (Date.now() > item.expiry) {
        sessionStorage.removeItem(key);
        return null;
      }

      // Basic integrity check
      const expectedChecksum = btoa(JSON.stringify(item.value)).slice(0, 10);
      if (item.checksum !== expectedChecksum) {
        sessionStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch {
      sessionStorage.removeItem(key);
      return null;
    }
  },

  remove: (key: string): void => {
    sessionStorage.removeItem(key);
  },
};

// ========================
// Content Security Policy
// ========================

export interface CSPDirectives {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'font-src': string[];
  'connect-src': string[];
  'media-src': string[];
  'object-src': string[];
  'child-src': string[];
  'frame-src': string[];
  'worker-src': string[];
  'manifest-src': string[];
  'frame-ancestors': string[];
  'base-uri': string[];
  'form-action': string[];
  'upgrade-insecure-requests': boolean;
  'block-all-mixed-content': boolean;
}

export const DEFAULT_CSP_DIRECTIVES: CSPDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    // Note: In production, these should be replaced with nonces or removed
    "'unsafe-inline'", // Required for Vite dev server and some React features
    "'unsafe-eval'", // Required for Vite dev server
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-components and CSS-in-JS
    'https://fonts.googleapis.com',
  ],
  'img-src': [
    "'self'",
    'data:', // For inline SVGs and base64 images
    'https:', // Allow HTTPS images from any domain
  ],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': [
    "'self'",
    'https://api.thinkred.tech', // Your API domain
    'https:', // Allow HTTPS connections (for development flexibility)
  ],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'child-src': ["'none'"],
  'frame-src': ["'none'"],
  'worker-src': ["'self'"],
  'manifest-src': ["'self'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': true,
  'block-all-mixed-content': true,
};

/**
 * Generate CSP header string from directives
 */
export function generateCSPHeader(directives: Partial<CSPDirectives> = {}): string {
  const mergedDirectives = { ...DEFAULT_CSP_DIRECTIVES, ...directives };

  const cspParts: string[] = [];

  // Add directive-based rules
  Object.entries(mergedDirectives).forEach(([directive, values]) => {
    if (directive === 'upgrade-insecure-requests' || directive === 'block-all-mixed-content') {
      if (values) {
        cspParts.push(directive.replace(/([A-Z])/g, '-$1').toLowerCase());
      }
    } else if (Array.isArray(values) && values.length > 0) {
      cspParts.push(`${directive} ${values.join(' ')}`);
    }
  });

  return cspParts.join('; ');
}

/**
 * Generate a cryptographically secure nonce
 */
export function generateNonce(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)));
  }

  // Fallback for environments without crypto.getRandomValues
  return btoa(Math.random().toString(36).substring(2) + Date.now().toString(36));
}

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS = {
  'Content-Security-Policy': generateCSPHeader(),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), fullscreen=(self), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
} as const;

/**
 * Get production-ready CSP (stricter than development)
 */
export function getProductionCSP(): string {
  const productionDirectives: Partial<CSPDirectives> = {
    'script-src': [
      "'self'",
      // Remove unsafe-inline and unsafe-eval for production
      // Add specific script hashes or nonces here if needed
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // May still be needed for CSS-in-JS libraries
      'https://fonts.googleapis.com',
    ],
    'connect-src': [
      "'self'",
      'https://api.thinkred.tech',
      // Remove broad https: allowance for production
    ],
  };

  return generateCSPHeader(productionDirectives);
}

/**
 * Validate CSP configuration
 */
export function validateCSPConfig(): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check for unsafe directives
  if (DEFAULT_CSP_DIRECTIVES['script-src'].includes("'unsafe-inline'")) {
    warnings.push("script-src contains 'unsafe-inline' - consider using nonces or hashes");
  }

  if (DEFAULT_CSP_DIRECTIVES['script-src'].includes("'unsafe-eval'")) {
    warnings.push("script-src contains 'unsafe-eval' - remove in production");
  }

  // Check for overly permissive directives
  if (DEFAULT_CSP_DIRECTIVES['img-src'].includes('http:')) {
    errors.push('img-src allows HTTP resources - security risk');
  }

  if (DEFAULT_CSP_DIRECTIVES['connect-src'].includes('*')) {
    errors.push('connect-src allows all domains - security risk');
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}
