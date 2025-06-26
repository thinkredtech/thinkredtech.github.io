/**
 * API utilities for form submissions and external service integrations
 */

const API_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbxiPo1PZW85C8Pfj7bEKT6yk3es9uRZUo4JAXyGWnvJgYLTmuKQPv7WTYvFCx1O2aAlUg/exec';

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
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        action: 'submitContactForm',
        data: formData,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error submitting contact form:', error);
    }

    // Provide a more user-friendly error message
    if (
      error instanceof TypeError &&
      error.message.includes('Failed to fetch')
    ) {
      throw new Error(
        'Unable to submit form. Please check your internet connection or try again later.'
      );
    }

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
    // Convert files to base64
    const resumeBase64 = await fileToBase64(applicationData.resumeFile);

    let coverLetterBase64: string | undefined;
    if (applicationData.coverLetterFile) {
      coverLetterBase64 = await fileToBase64(applicationData.coverLetterFile);
    }

    const payload = {
      action: 'submitJobApplication',
      data: {
        jobId: applicationData.jobId,
        applicationId: applicationData.applicationId,
        name: applicationData.name,
        email: applicationData.email,
        phone: applicationData.phone,
        resumeBase64,
        coverLetterBase64,
      },
    };

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error submitting job application:', error);
    }
    throw error;
  }
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
