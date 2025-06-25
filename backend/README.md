# 🧠 ThinkRED Website Backend – Google Apps Script

This repository contains the backend serverless logic powering the [ThinkRED](https://thinkred.tech) website contact forms and job applications, built with **Google Apps Script**.

It handles:

* Contact form submissions (Contact Us, Request Quote, Discovery Call)
* Job application processing and resume storage
* Email notifications and Google Sheets integration

---

## 📁 Folder Structure

```
thinkred-appscript/
├── .clasp.json               # clasp project configuration
├── appsscript.json           # Apps Script project settings
├── ThinkREDBot.gs            # Main script file with logic
└── README.md                 # You’re here
```

---

## 🧹 Features

### ✅ Contact Form Integration

* Accepts POST requests from frontend forms
* Stores entries in **Google Sheets**
* Sends email notifications to team

### ✅ Job Application Handling

* Accepts base64-encoded resumes & cover letters
* Automatically organizes files into **Drive folders**
* Logs applications into a separate **Google Sheet**
* Sends email alerts to hiring team

### 🔐 Security & Maintainability

* All sensitive IDs and emails are stored as **Script Properties** (not hardcoded)
* Easily update targets (sheet IDs, folder IDs, email recipients) from Apps Script UI

---

## 🚀 Deployment

### Prerequisites

* Node.js & npm installed
* Google Apps Script CLI:

  ```bash
  npm install -g clasp
  ```

### 1. Login to Google

```bash
clasp login
```

### 2. Clone or Create Script Project

If already created:

```bash
git clone https://github.com/your-org/thinkred-appscript.git
cd thinkred-appscript
clasp pull
```

Or create a new one:

```bash
mkdir thinkred-appscript
cd thinkred-appscript
clasp create --title "ThinkRED Website Backend" --type standalone
```

### 3. Add Project Script Files

Replace `Code.js` with `ThinkREDBot.gs`
Ensure `appsscript.json` is correctly configured.

### 4. Push to Apps Script

```bash
clasp push
```

---

## ⚙️ Script Properties Setup

> Set via **Apps Script > Project Settings > Script Properties**

| Property Key               | Description                          | Example Value                                     |
| -------------------------- | ------------------------------------ | ------------------------------------------------- |
| `CONTACT_FORM_SHEET_ID`    | Sheet ID for contact form responses  | `1yLpYgw9uSo_bivc...`                             |
| `JOB_APPLICATION_SHEET_ID` | Sheet ID for job applications        | `1nDlBElBrqMemSeTx...`                            |
| `RESUME_PARENT_FOLDER_ID`  | Drive folder for storing resumes     | `1u5PoO8zj0xRtNjB...`                             |
| `EMAIL_TO`                 | Main recipient email address         | `hello@thinkred.tech`                             |
| `EMAIL_CC_CONTACT_FORM`    | Comma-separated CCs for contact form | `nils.pat@gmail.com,sayak.bugsmith@gmail.com,...` |
| `EMAIL_CC_JOB_APPLY`       | Comma-separated CCs for job alerts   | `nils.pat@gmail.com,sayak.bugsmith@gmail.com`     |

---

## 📩 API Endpoints

> Hosted at:
> `https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec`

### `POST /` with action `submitContactForm`

```json
{
  "action": "submitContactForm",
  "data": {
    "formType": "Contact Us",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "123456789",
    "company": "ThinkRED",
    "message": "I'd like to request a quote."
  }
}
```

### `POST /` with action `submitJobApplication`

```json
{
  "action": "submitJobApplication",
  "data": {
    "jobId": "JUN25-001",
    "applicationId": "APP-2025-0001",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "123456789",
    "resumeBase64": "<base64-of-resume>",
    "coverLetterBase64": "<base64-of-cover-letter>" // optional
  }
}
```

---

## 📁 Sheets & Folder Structure

### Google Sheets

#### `ThinkRED Website Queries`

\| Timestamp | Form Type | Name | Email | Phone | Company | Message |

#### `ThinkRED Job Applications`

\| Timestamp | Job ID | App ID | Name | Email | Phone | Resume Link | Cover Letter Link |

### Google Drive

```
Resumes (folder)
├── JUN25-001 (Job ID)
  └── APP-2025-0001 (App ID)
    ├── Jane_Resume.pdf
    └── Jane_CoverLetter.pdf
```

---

## 🛠️ Local Development (Optional)

You can version control this script with Git and `clasp`:

```bash
git init
git add .
git commit -m "Initial secure backend for ThinkRED forms"
```

To pull updates from the live script:

```bash
clasp pull
```

To push changes to the live script:

```bash
clasp push
```

---

## 🧠 Testing & Debugging

Use [Postman](https://www.postman.com/) or curl to POST sample payloads to the deployed script URL.
You can use `Logger.log()` and **Apps Script Logs** (via View > Executions) to debug errors.

---

## 🧠 Credits

Crafted with ❤️ by [ThinkRED](https://thinkred.tech)

---

## 📜 License

MIT License (c) 2025 ThinkRED
