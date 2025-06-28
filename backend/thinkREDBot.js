// === CONFIG ===
const SCRIPT_PROPS = PropertiesService.getScriptProperties();

const CONTACT_FORM_SHEET_ID = SCRIPT_PROPS.getProperty('CONTACT_FORM_SHEET_ID');
const JOB_APPLICATION_SHEET_ID = SCRIPT_PROPS.getProperty('JOB_APPLICATION_SHEET_ID');
const RESUME_PARENT_FOLDER_ID = SCRIPT_PROPS.getProperty('RESUME_PARENT_FOLDER_ID');

const EMAIL_TO = SCRIPT_PROPS.getProperty('EMAIL_TO');
const EMAIL_CC_CONTACT_FORM = SCRIPT_PROPS.getProperty('EMAIL_CC_CONTACT_FORM');
const EMAIL_CC_JOB_APPLY = SCRIPT_PROPS.getProperty('EMAIL_CC_JOB_APPLY');

// === ENTRY POINT ===
function doGet(e) {
  try {
    // Handle CORS preflight requests
    if (!e.parameter || !e.parameter.action) {
      return createCorsResponse({ success: true, message: 'CORS preflight OK' });
    }

    // Handle actual GET requests with parameters
    const action = e.parameter.action;
    
    if (action === 'submitContactForm' && e.parameter.data) {
      const data = JSON.parse(e.parameter.data);
      return handleContactForm(data);
    }
    
    if (action === 'submitJobApplication' && e.parameter.data) {
      const data = JSON.parse(e.parameter.data);
      return handleJobApplication(data);
    }

    return createErrorResponse('Invalid action or missing data in GET request');
  } catch (error) {
    return createErrorResponse(`Server Error in GET: ${error.message}`);
  }
}

// Handle OPTIONS requests for CORS preflight
function doOptions(e) {
  // Google Apps Script doesn't support custom headers for OPTIONS
  // but we can return a proper response structure
  return createCorsResponse({ 
    success: true, 
    message: 'CORS preflight handled by Google Apps Script' 
  });
}

function doPost(e) {
  try {
    // Handle larger payloads for file uploads
    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createErrorResponse('Invalid JSON payload');
    }
    
    // Validate payload structure
    if (!payload.action) {
      return createErrorResponse('Missing action in payload');
    }
    
    switch (payload.action) {
      case 'submitContactForm':
        return handleContactForm(payload.data);
      case 'submitJobApplication':
        return handleJobApplication(payload.data);
      default:
        return createErrorResponse('Invalid action provided');
    }
  } catch (error) {
    console.error('doPost error:', error);
    return createErrorResponse(`Server Error: ${error.message}`);
  }
}

// === CONTACT FORM HANDLER ===
function handleContactForm(data) {
  const sheet = SpreadsheetApp.openById(CONTACT_FORM_SHEET_ID).getSheetByName('Form Responses');
  if (!sheet) return createErrorResponse('Sheet "Form Responses" not found');

  const requiredFields = ['formType', 'name', 'email', 'message'];
  for (let field of requiredFields) {
    if (!data[field]) return createErrorResponse(`Missing field: ${field}`);
  }

  const timestamp = new Date();
  sheet.appendRow([
    timestamp,
    data.formType,
    data.name,
    data.email,
    data.phone || '',
    data.company || '',
    data.projectType || '',
    data.budget || '',
    data.timeline || '',
    data.message
  ]);

  const subject = `[ThinkRED] Contact Form Submission from ${data.name} – ${data.formType}`;

  const plainBody = `
New contact form submission received

Submitted on: ${timestamp}
Form Type: ${data.formType}

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || '-'}
Company: ${data.company || '-'}
Project Type: ${data.projectType || '-'}
Budget: ${data.budget || '-'}
Timeline: ${data.timeline || '-'}
Message:
${data.message}

View the full record in the spreadsheet:
https://docs.google.com/spreadsheets/d/${CONTACT_FORM_SHEET_ID}
`;

  const htmlBody = `
<h3>New contact form submission received</h3>
<ul>
  <li><strong>Submitted on:</strong> ${timestamp}</li>
  <li><strong>Form Type:</strong> ${data.formType}</li>
  <li><strong>Name:</strong> ${data.name}</li>
  <li><strong>Email:</strong> ${data.email}</li>
  <li><strong>Phone:</strong> ${data.phone || '-'}</li>
  <li><strong>Company:</strong> ${data.company || '-'}</li>
  <li><strong>Project Type:</strong> ${data.projectType || '-'}</li>
  <li><strong>Budget:</strong> ${data.budget || '-'}</li>
  <li><strong>Timeline:</strong> ${data.timeline || '-'}</li>
</ul>
<p><strong>Message:</strong><br>${data.message}</p>
<p><a href="https://docs.google.com/spreadsheets/d/${CONTACT_FORM_SHEET_ID}">View Spreadsheet</a></p>
`;

  GmailApp.sendEmail(EMAIL_TO, subject, plainBody, {
    cc: EMAIL_CC_CONTACT_FORM,
    htmlBody: htmlBody
  });

  return createCorsResponse({ success: true });
}

// === JOB APPLICATION HANDLER ===
function handleJobApplication(data) {
  try {
    const {
      jobId, applicationId, name, email, phone,
      resumeBase64, coverLetterBase64
    } = data;

    // Validate required fields
    if (!(jobId && applicationId && name && email && resumeBase64)) {
      return createErrorResponse('Missing required fields in job application');
    }

    // Validate base64 data to prevent corruption
    if (!isValidBase64(resumeBase64)) {
      return createErrorResponse('Invalid resume file format');
    }

    if (coverLetterBase64 && !isValidBase64(coverLetterBase64)) {
      return createErrorResponse('Invalid cover letter file format');
    }

    // Get or create folder structure
    const resumeParentFolder = DriveApp.getFolderById(RESUME_PARENT_FOLDER_ID);
    const jobFolder = getOrCreateSubFolder(resumeParentFolder, jobId);
    const applicationFolder = jobFolder.createFolder(applicationId);

    // Create resume file with better error handling
    let resumeFile;
    try {
      const resumeBlob = Utilities.newBlob(
        Utilities.base64Decode(resumeBase64), 
        'application/pdf', 
        `${sanitizeFileName(name)}_Resume.pdf`
      );
      resumeFile = applicationFolder.createFile(resumeBlob);
    } catch (error) {
      console.error('Error creating resume file:', error);
      return createErrorResponse('Failed to save resume file');
    }

    // Create cover letter file if provided
    let coverLetterFile = null;
    if (coverLetterBase64) {
      try {
        const coverLetterBlob = Utilities.newBlob(
          Utilities.base64Decode(coverLetterBase64), 
          'application/pdf', 
          `${sanitizeFileName(name)}_CoverLetter.pdf`
        );
        coverLetterFile = applicationFolder.createFile(coverLetterBlob);
      } catch (error) {
        console.error('Error creating cover letter file:', error);
        // Don't fail the entire submission for cover letter issues
        console.warn('Cover letter file creation failed, continuing without it');
      }
    }

    // Save to spreadsheet
    const sheet = SpreadsheetApp.openById(JOB_APPLICATION_SHEET_ID).getSheetByName('Applications');
    if (!sheet) return createErrorResponse('Sheet "Applications" not found');

    sheet.appendRow([
      new Date(),
      jobId,
      applicationId,
      name,
      email,
      phone || '',
      resumeFile.getUrl(),
      coverLetterFile ? coverLetterFile.getUrl() : ''
    ]);

    // Send notification email
    const subject = `[ThinkRED] New Job Application – ${name} (${jobId})`;

    const plainBody = `
A new job application has been received.

Job ID: ${jobId}
Application ID: ${applicationId}
Name: ${name}
Email: ${email}
Phone: ${phone || '-'}

Resume: ${resumeFile.getUrl()}
Cover Letter: ${coverLetterFile ? coverLetterFile.getUrl() : 'Not Provided'}

View the full record in the spreadsheet:
https://docs.google.com/spreadsheets/d/${JOB_APPLICATION_SHEET_ID}
`;

    const htmlBody = `
<h3>New job application received</h3>
<ul>
  <li><strong>Job ID:</strong> ${jobId}</li>
  <li><strong>Application ID:</strong> ${applicationId}</li>
  <li><strong>Name:</strong> ${name}</li>
  <li><strong>Email:</strong> ${email}</li>
  <li><strong>Phone:</strong> ${phone || '-'}</li>
  <li><strong>Resume:</strong> <a href="${resumeFile.getUrl()}">View Resume</a></li>
  <li><strong>Cover Letter:</strong> ${coverLetterFile ? `<a href="${coverLetterFile.getUrl()}">View Cover Letter</a>` : 'Not Provided'}</li>
</ul>
<p><a href="https://docs.google.com/spreadsheets/d/${JOB_APPLICATION_SHEET_ID}">View Spreadsheet</a></p>
`;

    GmailApp.sendEmail(EMAIL_TO, subject, plainBody, {
      cc: EMAIL_CC_JOB_APPLY,
      htmlBody: htmlBody
    });

    return createCorsResponse({ success: true });
    
  } catch (error) {
    console.error('Job application handling error:', error);
    return createErrorResponse(`Failed to process job application: ${error.message}`);
  }
}

// === UTILITY FUNCTIONS ===
function getOrCreateSubFolder(parent, name) {
  const folders = parent.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : parent.createFolder(name);
}

/**
 * Validate base64 string format
 */
function isValidBase64(str) {
  try {
    if (!str || typeof str !== 'string') return false;
    // Basic base64 validation - should be divisible by 4 and contain valid characters
    const base64Regex = /^[A-Za-z0-9+\/]*={0,2}$/;
    return str.length % 4 === 0 && base64Regex.test(str);
  } catch (error) {
    return false;
  }
}

/**
 * Sanitize file names to prevent issues with Google Drive
 */
function sanitizeFileName(name) {
  // Remove special characters and replace spaces with underscores
  return name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50);
}