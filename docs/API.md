# ThinkRED Backend API Documentation

## Overview

The ThinkRED backend is implemented using Google Apps Script and provides form processing capabilities for the website. The API handles contact form submissions and job applications.

## Base URL

```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

## Authentication

The API endpoints are publicly accessible for form submissions. No authentication is required for the current endpoints.

## Request Format

- **Content-Type**: `application/json` for POST requests
- **Method**: Both GET and POST are supported
- **Character Encoding**: UTF-8

## Endpoints

### Contact Form Submission

Submit contact form data to be processed and stored.

**POST /exec**

**Request Body:**

```json
{
  "action": "submitContactForm",
  "data": {
    "formType": "contact",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Example Corp",
    "projectType": "Web Development",
    "budget": "$10,000-$25,000",
    "timeline": "3-6 months",
    "message": "I need a website for my business."
  }
}
```

**GET /exec (Alternative)**

```
GET /exec?action=submitContactForm&data={"formType":"contact","name":"John Doe",...}
```

**Response:**

```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Required Fields:**

- `formType`: Must be "contact"
- `name`: Contact's full name
- `email`: Valid email address
- `message`: Contact message

**Optional Fields:**

- `phone`: Contact phone number
- `company`: Company name
- `projectType`: Type of project
- `budget`: Budget range
- `timeline`: Project timeline

### Job Application Submission

Submit job application data with optional resume upload.

**POST /exec**

**Request Body:**

```json
{
  "action": "submitJobApplication",
  "data": {
    "formType": "job-application",
    "jobId": "frontend-developer-2024",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "experience": "5 years",
    "skills": "React, TypeScript, Node.js",
    "portfolio": "https://janesmith.dev",
    "coverLetter": "I am excited to apply for this position...",
    "resumeFile": {
      "name": "resume.pdf",
      "data": "base64-encoded-file-data",
      "mimeType": "application/pdf"
    }
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Job application submitted successfully",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "resumeUrl": "https://drive.google.com/file/d/FILE_ID/view"
}
```

**Required Fields:**

- `formType`: Must be "job-application"
- `jobId`: ID of the job position
- `name`: Applicant's full name
- `email`: Valid email address

**Optional Fields:**

- `phone`: Contact phone number
- `experience`: Years of experience
- `skills`: Relevant skills
- `portfolio`: Portfolio URL
- `coverLetter`: Cover letter text
- `resumeFile`: Resume file data (base64 encoded)

## Error Responses

### Validation Errors

```json
{
  "success": false,
  "error": "Missing required field: email"
}
```

### Server Errors

```json
{
  "success": false,
  "error": "Server Error: Failed to process request"
}
```

### Common Error Codes

- **400**: Bad Request - Invalid or missing data
- **500**: Internal Server Error - Server-side processing error

## CORS Policy

The API includes CORS headers to allow requests from authorized domains:

- `thinkredtech.github.io`
- `localhost:3000`
- `localhost:5173`

## Rate Limiting

Rate limiting is handled automatically by Google Apps Script infrastructure. No specific limits are enforced at the application level.

## Data Storage

### Contact Forms

- **Storage**: Google Sheets
- **Sheet Name**: "Form Responses"
- **Fields**: Timestamp, Form Type, Name, Email, Phone, Company, Project Type, Budget, Timeline, Message

### Job Applications

- **Storage**: Google Sheets
- **Sheet Name**: "Job Applications"
- **Resume Files**: Google Drive
- **Fields**: Timestamp, Job ID, Name, Email, Phone, Experience, Skills, Portfolio, Cover Letter, Resume URL

## Email Notifications

### Contact Form Notifications

- **Recipients**: Configured email addresses
- **Subject**: "New Contact Form Submission"
- **Content**: Form data summary

### Job Application Notifications

- **Recipients**: HR team and relevant managers
- **Subject**: "New Job Application: [Position]"
- **Content**: Application summary with resume attachment

## Implementation Notes

### File Upload Handling

- Files are base64 encoded in the request
- Maximum file size: 50MB (Google Apps Script limit)
- Supported formats: PDF, DOC, DOCX for resumes
- Files are stored in Google Drive with organized folder structure

### Error Handling

- All errors are logged to Google Apps Script console
- User-friendly error messages are returned to frontend
- Detailed error information is available in execution logs

### Performance Considerations

- Execution time limit: 6 minutes (Google Apps Script)
- Memory limit: 100MB per execution
- Concurrent execution limit: 30 simultaneous executions
- Daily trigger limit: 500 total triggers per day

## Testing

### Manual Testing

1. Use the web interface to submit forms
2. Check Google Sheets for data storage
3. Verify email notifications are sent
4. Confirm file uploads are stored in Google Drive

### API Testing Tools

- Use Postman or similar tools for direct API testing
- Test both GET and POST methods
- Verify error handling with invalid data
- Test file upload functionality with large files

**Error Response:**

```json
{
  "success": false,
  "error": "Validation failed",
  "details": ["Email format is invalid", "Message is too long"]
}
```

**Status Codes:**

- `200` - Success
- `400` - Validation error
- `429` - Rate limit exceeded
- `500` - Server error

---

### **💼 Job Application Submission**

Submit job application with file uploads.

```http
POST /exec
Content-Type: application/json

{
  "action": "job-application",
  "position": "Frontend Developer",
  "name": "Luffy Monkey D.",
  "email": "luffy@strawhat.com",
  "phone": "+1-555-PIRATE",
  "experience": "5 years",
  "resumeFile": {
    "name": "luffy_resume.pdf",
    "data": "base64_encoded_file_data...",
    "mimeType": "application/pdf"
  },
  "coverLetterFile": {
    "name": "luffy_cover_letter.pdf",
    "data": "base64_encoded_file_data...",
    "mimeType": "application/pdf"
  }
}
```

**Parameters:**

| Field             | Type   | Required | Description               |
| ----------------- | ------ | -------- | ------------------------- |
| `action`          | string | ✅       | Must be "job-application" |
| `position`        | string | ✅       | Job position applying for |
| `name`            | string | ✅       | Full name                 |
| `email`           | string | ✅       | Email address             |
| `phone`           | string | ✅       | Phone number              |
| `experience`      | string | 🔶       | Years of experience       |
| `resumeFile`      | object | ✅       | Resume file (max 10MB)    |
| `coverLetterFile` | object | 🔶       | Cover letter (max 10MB)   |

**File Object Structure:**

```typescript
interface FileObject {
  name: string; // Original filename
  data: string; // Base64 encoded file data
  mimeType: string; // MIME type (e.g., "application/pdf")
}
```

**Response:**

```json
{
  "success": true,
  "message": "Application submitted successfully!",
  "application_id": "job_2024_002",
  "files": {
    "resume": {
      "id": "1ABc2dEfGhI3jKlMnOpQrStUvWxYz",
      "url": "https://drive.google.com/file/d/1ABc2dEfGhI3jKlMnOpQrStUvWxYz/view",
      "name": "luffy_resume.pdf"
    },
    "coverLetter": {
      "id": "2BCd3eFgHiJ4kLmNoQrStUvWxYzA",
      "url": "https://drive.google.com/file/d/2BCd3eFgHiJ4kLmNoQrStUvWxYzA/view",
      "name": "luffy_cover_letter.pdf"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Supported File Types:**

- **Documents**: PDF, DOC, DOCX
- **Images**: JPG, JPEG, PNG, GIF
- **Maximum Size**: 10MB per file

---

### **🔧 Admin Operations**

Access admin functionality (requires authentication).

```http
POST /exec
Content-Type: application/json

{
  "action": "admin",
  "password": "your_admin_password",
  "operation": "get-submissions",
  "filters": {
    "type": "contact",
    "status": "new",
    "limit": 50
  }
}
```

**Admin Operations:**

#### **Get Submissions**

```json
{
  "action": "admin",
  "password": "your_admin_password",
  "operation": "get-submissions",
  "filters": {
    "type": "contact|job-application|all",
    "status": "new|reviewed|responded|all",
    "limit": 50,
    "offset": 0
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "contact_2024_001",
      "type": "contact",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "name": "Naruto Uzumaki",
      "email": "naruto@konoha.com",
      "status": "new",
      "data": {
        /* submission data */
      }
    }
  ],
  "total": 150,
  "page": 1,
  "has_more": true
}
```

#### **Update Status**

```json
{
  "action": "admin",
  "password": "your_admin_password",
  "operation": "update-status",
  "submission_id": "contact_2024_001",
  "status": "reviewed",
  "notes": "Followed up via email"
}
```

#### **Export Data**

```json
{
  "action": "admin",
  "password": "your_admin_password",
  "operation": "export-data",
  "format": "csv|json",
  "type": "contact|job-application|all",
  "date_range": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  }
}
```

---

## 🔄 **Fallback Mechanism**

For large file uploads, the API supports **GET request fallback**:

```http
GET /exec?action=job-application&name=Luffy&email=luffy@strawhat.com&...
```

This method is automatically used by the frontend when POST requests fail due to size limitations.

---

## ⚡ **Rate Limiting**

To prevent abuse, the API implements rate limiting:

- **Contact Forms**: 5 submissions per hour per IP
- **Job Applications**: 3 submissions per hour per IP
- **Admin Operations**: 100 requests per hour per authenticated session

**Rate Limit Headers:**

```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1642248000
```

**Rate Limit Exceeded Response:**

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retry_after": 3600,
  "message": "Too many requests. Please try again in 1 hour."
}
```

---

## 🛡️ **Security Features**

### **Input Validation**

All inputs are validated and sanitized:

```javascript
// Example validation rules
const contactFormSchema = {
  name: {
    required: true,
    maxLength: 100,
    pattern: /^[a-zA-Z\s]+$/,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  message: {
    required: true,
    maxLength: 2000,
  },
};
```

### **File Upload Security**

- **File type validation** based on MIME type and extension
- **File size limits** (10MB maximum)
- **Virus scanning** via Google Drive's built-in protection
- **File name sanitization** to prevent path traversal

### **CORS Configuration**

The API properly handles CORS for web applications:

```javascript
function createResponse(data, statusCode = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    });
}
```

---

## 🧪 **Testing the API**

### **Using cURL**

```bash
# Health check
curl "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=health"

# Contact form submission
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "action": "contact",
    "name": "Test User",
    "email": "test@example.com",
    "subject": "API Test",
    "message": "Testing the API"
  }' \
  "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

### **Using JavaScript/Fetch**

```javascript
// Health check
const healthCheck = async () => {
  const response = await fetch(
    "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=health",
  );
  const data = await response.json();
  console.log("API Health:", data);
};

// Submit contact form
const submitContact = async (formData) => {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "contact",
          ...formData,
        }),
      },
    );

    const result = await response.json();

    if (result.success) {
      console.log("Form submitted successfully:", result);
    } else {
      console.error("Submission failed:", result.error);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};
```

### **Test Scripts**

The repository includes helpful test scripts:

```bash
# Test API connectivity and CORS
./test-cors-api.sh

# Test file upload capabilities
./test-file-sizes.sh

# Test specific endpoints
curl -s "$(grep 'API_URL=' test-cors-api.sh | cut -d'=' -f2)?action=health" | jq '.'
```

---

## 📊 **Response Codes Reference**

| Code  | Status                | Description                       |
| ----- | --------------------- | --------------------------------- |
| `200` | OK                    | Request succeeded                 |
| `400` | Bad Request           | Invalid request data              |
| `401` | Unauthorized          | Invalid or missing authentication |
| `403` | Forbidden             | Access denied                     |
| `404` | Not Found             | Endpoint or resource not found    |
| `429` | Too Many Requests     | Rate limit exceeded               |
| `500` | Internal Server Error | Server-side error                 |
| `503` | Service Unavailable   | Temporary service issue           |

---

## 🔧 **Error Handling**

### **Standard Error Response**

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message",
  "details": ["Specific error details"],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "request_id": "req_12345"
}
```

### **Common Errors**

#### **Validation Errors**

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Name is required",
    "Email format is invalid",
    "Message exceeds maximum length"
  ]
}
```

#### **File Upload Errors**

```json
{
  "success": false,
  "error": "File upload failed",
  "message": "File size exceeds 10MB limit",
  "details": {
    "file_name": "large_resume.pdf",
    "file_size": 15728640,
    "max_size": 10485760
  }
}
```

#### **Rate Limit Errors**

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Too many requests from this IP address",
  "retry_after": 3600,
  "limit": 5,
  "window": "1 hour"
}
```

---

## 🚀 **Performance Tips**

### **Frontend Optimization**

```javascript
// Use debouncing for form validation
const debouncedValidate = debounce(validateForm, 300);

// Implement retry logic with exponential backoff
const submitWithRetry = async (data, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await submitForm(data);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
};

// Cache successful responses
const cache = new Map();
const cachedApiCall = async (endpoint, data) => {
  const key = `${endpoint}_${JSON.stringify(data)}`;

  if (cache.has(key)) {
    return cache.get(key);
  }

  const response = await apiCall(endpoint, data);
  cache.set(key, response);

  return response;
};
```

### **Backend Optimization**

```javascript
// Use caching for expensive operations
const cachedResult = CacheService.getScriptCache().get("expensive_operation");
if (!cachedResult) {
  const result = expensiveOperation();
  CacheService.getScriptCache().put(
    "expensive_operation",
    JSON.stringify(result),
    3600,
  );
}

// Batch database operations
const batchWriteToSheet = (data) => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = data.map((item) => [item.name, item.email, item.message]);
  sheet.getRange(sheet.getLastRow() + 1, 1, values.length, 3).setValues(values);
};
```

---

## 📚 **SDK & Wrappers**

### **JavaScript/TypeScript SDK**

```typescript
class ThinkRedAPI {
  private baseUrl: string;

  constructor(deploymentId: string) {
    this.baseUrl = `https://script.google.com/macros/s/${deploymentId}/exec`;
  }

  async healthCheck(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}?action=health`);
    return response.json();
  }

  async submitContact(data: ContactFormData): Promise<SubmissionResponse> {
    return this.post({ action: "contact", ...data });
  }

  async submitJobApplication(
    data: JobApplicationData,
  ): Promise<SubmissionResponse> {
    return this.post({ action: "job-application", ...data });
  }

  private async post(data: any): Promise<any> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }
}

// Usage
const api = new ThinkRedAPI("YOUR_DEPLOYMENT_ID");
const result = await api.submitContact({
  name: "Goku",
  email: "goku@dragonball.com",
  subject: "Training Request",
  message: "I want to become stronger!",
});
```

---

## 🔗 **Webhook Integration**

### **Setting Up Webhooks**

```javascript
// In your Google Apps Script
function notifyWebhook(data) {
  const webhookUrl =
    PropertiesService.getScriptProperties().getProperty("WEBHOOK_URL");

  if (webhookUrl) {
    UrlFetchApp.fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      payload: JSON.stringify({
        event: "form_submission",
        timestamp: new Date().toISOString(),
        data: data,
      }),
    });
  }
}
```

### **Webhook Payload Example**

```json
{
  "event": "form_submission",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "type": "contact",
    "submission_id": "contact_2024_001",
    "form_data": {
      "name": "Vegeta",
      "email": "vegeta@saiyan.com",
      "subject": "Training Challenge",
      "message": "I challenge you to a coding battle!"
    }
  }
}
```

---

<div align="center">

### 🎉 **Master the API, Master the Universe! ⚡**

_"With great API comes great responsibility!"_

[![Back to Main](https://img.shields.io/badge/←%20Back%20to%20Main-README-blue?style=for-the-badge)](../README.md)
[![Setup Guide](https://img.shields.io/badge/Setup%20Guide-→-green?style=for-the-badge)](./SETUP.md)

</div>
