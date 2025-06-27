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

export const submitContactForm = async (
  formData: ContactFormData
): Promise<void> => {
  try {
    // Use GET method as primary approach for Google Apps Script to avoid CORS preflight issues
    await submitContactFormFallback(formData);
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error submitting contact form:', error);
    }

    // Log failed submission
    logFormSubmission(
      'contactForm',
      false,
      error instanceof Error ? error.message : String(error)
    );

    throw error;
  }
};

/**
 * Fallback submission method using GET request with URL parameters
 * This works around CORS preflight issues with Google Apps Script
 */
const submitContactFormFallback = async (
  formData: ContactFormData
): Promise<void> => {
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
    logFormSubmission(
      'contactForm',
      false,
      error instanceof Error ? error.message : String(error)
    );

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

export const submitJobApplication = async (
  applicationData: JobApplicationData
): Promise<void> => {
  try {
    // Use GET method as primary approach for Google Apps Script to avoid CORS preflight issues
    await submitJobApplicationFallback(applicationData);
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error submitting job application:', error);
    }

    // Log failed submission
    logFormSubmission(
      'jobApplication',
      false,
      error instanceof Error ? error.message : String(error)
    );

    throw error;
  }
};

/**
 * Fallback submission method for job applications using GET request
 * This works around CORS preflight issues with Google Apps Script
 */
const submitJobApplicationFallback = async (
  applicationData: JobApplicationData
): Promise<void> => {
  try {
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
      console.error('Error submitting job application (fallback):', error);
    }

    // Log failed submission
    logFormSubmission(
      'jobApplication',
      false,
      error instanceof Error ? error.message : String(error)
    );

    throw error;
  }
};

/**
 * Log form submission analytics (for monitoring and improvement)
 */
export const logFormSubmission = (
  formType: string,
  success: boolean,
  error?: string
): void => {
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

export const checkRateLimit = (
  identifier: string,
  cooldownMs: number = 5000
): boolean => {
  const now = Date.now();
  const lastSubmission = submissionTimestamps.get(identifier);

  if (lastSubmission && now - lastSubmission < cooldownMs) {
    return false;
  }

  submissionTimestamps.set(identifier, now);
  return true;
};
