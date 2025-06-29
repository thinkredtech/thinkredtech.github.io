/**
 * API utilities for form submissions and external service integrations
 */

import { config } from '../config/environment';

// Use centralized configuration for API endpoint
const API_ENDPOINT = config.googleAppsScript.apiEndpoint;

/**
 * Convert File object to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Submit contact form data to the backend
 */
export interface ContactFormData {
  formType: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export const submitContactForm = async (formData: ContactFormData): Promise<void> => {
  try {
    // Try POST first (proper RESTful approach)
    try {
      await submitContactFormPost(formData);
    } catch (postError) {
      // If POST fails due to Google Apps Script limitations, fall back to GET
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('POST request failed, falling back to GET:', postError);
      }

      await submitContactFormGet(formData);
    }
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error submitting contact form:', error);
    }

    // Log failed submission
    logFormSubmission('contactForm', false, error instanceof Error ? error.message : String(error));

    throw error;
  }
};

/**
 * Fallback submission method using GET request with URL parameters
 * This works around CORS preflight issues with Google Apps Script
 */
const submitContactFormGet = async (formData: ContactFormData): Promise<void> => {
  try {
    const params = new URLSearchParams({
      action: 'submitContactForm',
      data: JSON.stringify(formData),
    });

    const response = await fetch(`${API_ENDPOINT}?${params.toString()}`, {
      method: 'GET',
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      logFormSubmission('contactForm', false, result.error);
      throw new Error(result.error);
    }

    // Log successful submission
    logFormSubmission('contactForm', true);
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error submitting contact form (fallback):', error);
    }

    // Log failed submission
    logFormSubmission('contactForm', false, error instanceof Error ? error.message : String(error));

    throw error;
  }
};

/**
 * Submit job application data to the backend
 */
export interface JobApplicationData {
  jobId: string;
  applicationId: string;
  name: string;
  email: string;
  phone: string;
  resumeFile: File;
  coverLetterFile?: File;
}

export const submitJobApplication = async (applicationData: JobApplicationData): Promise<void> => {
  try {
    // Increased file size limits - 10MB per file for better user experience
    if (!validateFileSize(applicationData.resumeFile, 10)) {
      throw new Error(
        `Resume file is too large (${getFileSizeString(
          applicationData.resumeFile.size
        )}). Maximum size allowed is 10MB.`
      );
    }

    if (applicationData.coverLetterFile && !validateFileSize(applicationData.coverLetterFile, 10)) {
      throw new Error(
        `Cover letter file is too large (${getFileSizeString(
          applicationData.coverLetterFile.size
        )}). Maximum size allowed is 10MB.`
      );
    }

    // Convert files to base64
    const resumeBase64 = await fileToBase64(applicationData.resumeFile);
    let coverLetterBase64: string | undefined;
    if (applicationData.coverLetterFile) {
      coverLetterBase64 = await fileToBase64(applicationData.coverLetterFile);
    }

    const payload = {
      jobId: applicationData.jobId,
      applicationId: applicationData.applicationId,
      name: applicationData.name,
      email: applicationData.email,
      phone: applicationData.phone,
      resumeBase64,
      coverLetterBase64,
    };

    // Try POST first for larger files, fall back to GET for smaller ones
    try {
      await submitJobApplicationPost(payload);
    } catch (postError) {
      // If POST fails and payload is small enough for GET, try GET method
      if (!isPayloadTooLargeForGet(payload)) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn('POST failed, trying GET method for smaller payload:', postError);
        }
        await submitJobApplicationGet(payload);
      } else {
        throw new Error(
          'File submission failed. Your files may be too large or there may be a connection issue. Please try with smaller files or contact support.'
        );
      }
    }
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error submitting job application:', error);
    }

    // Log failed submission
    logFormSubmission('jobApplication', false, error instanceof Error ? error.message : String(error));

    throw error;
  }
};

/**
 * Submit job application using GET method (works best with Google Apps Script)
 */
const submitJobApplicationGet = async (payload: {
  jobId: string;
  applicationId: string;
  name: string;
  email: string;
  phone: string;
  resumeBase64: string;
  coverLetterBase64?: string;
}): Promise<void> => {
  try {
    const params = new URLSearchParams({
      action: 'submitJobApplication',
      data: JSON.stringify(payload),
    });

    const response = await fetch(`${API_ENDPOINT}?${params.toString()}`, {
      method: 'GET',
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      logFormSubmission('jobApplication', false, result.error);
      throw new Error(result.error);
    }

    // Log successful submission
    logFormSubmission('jobApplication', true);
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error submitting job application (GET):', error);
    }

    throw error;
  }
};

/**
 * Submit job application using POST method (better for larger files)
 */
const submitJobApplicationPost = async (payload: {
  jobId: string;
  applicationId: string;
  name: string;
  email: string;
  phone: string;
  resumeBase64: string;
  coverLetterBase64?: string;
}): Promise<void> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'submitJobApplication',
        data: payload,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    // Log successful submission
    logFormSubmission('jobApplication', true);
  } catch (error) {
    // Log failed submission
    logFormSubmission('jobApplication', false, error instanceof Error ? error.message : String(error));
    throw error;
  }
};

/**
 * Log form submission analytics (for monitoring and improvement)
 */
export const logFormSubmission = (formType: string, success: boolean, error?: string): void => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`[Form Analytics] ${formType}:`, {
      success,
      timestamp: new Date().toISOString(),
      error,
    });
  }

  // In production, you could send this to an analytics service
  // Example: analytics.track('Form Submission', { formType, success, error });
};

/**
 * Basic honeypot field validation for spam prevention
 */
export const validateHoneypot = (honeypotValue: string): boolean => {
  return honeypotValue === '';
};

/**
 * Rate limiting utility - prevents rapid successive submissions
 */
const submissionTimestamps = new Map<string, number>();

export const checkRateLimit = (identifier: string, cooldownMs: number = 5000): boolean => {
  const now = Date.now();
  const lastSubmission = submissionTimestamps.get(identifier);

  if (lastSubmission && now - lastSubmission < cooldownMs) {
    return false;
  }

  submissionTimestamps.set(identifier, now);
  return true;
};

/**
 * Check if the payload is too large for GET request
 * URL length limit is typically around 2048 characters for some browsers
 * We'll use a more conservative limit for better compatibility
 */
const isPayloadTooLargeForGet = (payload: object): boolean => {
  const dataString = JSON.stringify(payload);
  const urlParams = new URLSearchParams({
    action: 'submitJobApplication',
    data: dataString,
  });
  const fullUrl = `${API_ENDPOINT}?${urlParams.toString()}`;

  // Conservative limit: 32KB for the entire URL (increased from 8KB)
  // This allows for larger files while maintaining compatibility
  return fullUrl.length > 32768;
};

/**
 * Validate file size before submission
 * Helps prevent issues with large payloads
 */
export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  return file.size <= maxSizeBytes;
};

/**
 * Get human-readable file size
 */
export const getFileSizeString = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Submit contact form using POST method (proper RESTful approach)
 */
const submitContactFormPost = async (formData: ContactFormData): Promise<void> => {
  const requestBody = {
    action: 'submitContactForm',
    data: formData,
  };

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    mode: 'cors',
    redirect: 'follow',
  });

  // Check if we got an HTML response (indicates redirect issue)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    throw new Error('POST request redirected to HTML page - falling back to GET');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.error) {
    logFormSubmission('contactForm', false, result.error);
    throw new Error(result.error);
  }

  // Log successful submission
  logFormSubmission('contactForm', true);
};
