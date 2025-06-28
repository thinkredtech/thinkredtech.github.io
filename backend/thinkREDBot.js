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
    const payload = JSON.parse(e.postData.contents);
    switch (payload.action) {
      case 'submitContactForm':
        return handleContactForm(payload.data);
      case 'submitJobApplication':
        return handleJobApplication(payload.data);
      default:
        return createErrorResponse('Invalid action provided');
    }
  } catch (error) {
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
  const {
    jobId, applicationId, name, email, phone,
    resumeBase64, coverLetterBase64
  } = data;

  if (!(jobId && applicationId && name && email && resumeBase64)) {
    return createErrorResponse('Missing required fields in job application');
  }

  const resumeParentFolder = DriveApp.getFolderById(RESUME_PARENT_FOLDER_ID);
  const jobFolder = getOrCreateSubFolder(resumeParentFolder, jobId);
  const applicationFolder = jobFolder.createFolder(applicationId);

  const resumeFile = applicationFolder.createFile(
    Utilities.newBlob(Utilities.base64Decode(resumeBase64), 'application/pdf', `${name}_Resume.pdf`)
  );

  let coverLetterFile = null;
  if (coverLetterBase64) {
    coverLetterFile = applicationFolder.createFile(
      Utilities.newBlob(Utilities.base64Decode(coverLetterBase64), 'application/pdf', `${name}_CoverLetter.pdf`)
    );
  }

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
}

// === UTILITY FUNCTIONS ===
function getOrCreateSubFolder(parent, name) {
  const folders = parent.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : parent.createFolder(name);
}

function createErrorResponse(message) {
  return createCorsResponse({ success: false, error: message });
}

function createCorsResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Google Apps Script does not support custom headers for CORS
  // CORS is automatically handled when the web app is deployed with:
  // - Execute as: Me (or User accessing the web app)  
  // - Who has access: Anyone
  // The deployment settings handle CORS automatically
  
  return output;
}