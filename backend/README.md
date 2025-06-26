# 🧠 ThinkRED Website Backend – Google Apps Script

This repository contains the backend serverless logic powering the [ThinkRED](https://thinkred.tech) website  
contact forms and job applications, built with **Google Apps Script**.

It handles:

* Contact form submissions (Contact Us, Request Quote, Discovery Call)
* Job application processing and resume storage
* Email notifications and Google Sheets integration
* CORS handling for cross-origin requests

---

## 🧹 Features

* Email notifications and Google Sheets integration
* CORS handling for cross-origin requests

---

## 🚀 Quick Start & Deployment

### Prerequisites

1. **Install Google Apps Script CLI tool**:
   ```bash
   npm install -g @google/clasp
   ```

2. **Google Account Access**:
   * Must have access to the Google Apps Script project
   * Script ID: `1lxhn-Siz6ThM7rWHveiEVE1HlyA7fimu4LMifyFLXbaXRmEbT5lVL78J`

### Local Development Deployment

#### Step 1: Initial Setup

1. **Login to Google Account**:
   ```bash
   clasp login
   ```

2. **Setup Environment**:
   ```bash
   cd backend
   npm run setup
   # Edit .env file with your Google Apps Script ID
   ```

3. **Configure .env file**:
   ```env
   CLASP_SCRIPT_ID=1lxhn-Siz6ThM7rWHveiEVE1HlyA7fimu4LMifyFLXbaXRmEbT5lVL78J
   DEPLOYMENT_DESCRIPTION=Local development deployment
   DEPLOYMENT_VERSION_DESCRIPTION=Contact form and job application backend
   ```

#### Step 2: Deploy

Choose one of the following deployment methods:

**Recommended (Node.js)**:
```bash
npm run deploy
```

**Alternative Methods**:
* **Bash script** (Unix/macOS): `npm run deploy:bash`
* **Simple deployment**: `npm run deploy:simple`

### GitHub Actions Deployment

#### Setup GitHub Secrets

1. **Get clasp credentials**:
   ```bash
   cat ~/.clasprc.json
   ```

2. **Add these secrets to your GitHub repository**:
   * `CLASP_SCRIPT_ID`: Your Google Apps Script ID
   * `CLASPRC_JSON`: Contents of your `.clasprc.json` file

#### Automatic Deployment

The backend will automatically deploy when:
* Code is pushed to `main` or `master` branch
* Changes are made to the `backend/` directory

#### Manual Deployment

1. Go to Actions tab in GitHub
2. Select "Deploy Backend to Google Apps Script"
3. Click "Run workflow"
4. Optionally add deployment description

### Verification & Testing

After deployment, verify the changes:

1. **Open Google Apps Script**:
   ```bash
   clasp open
   ```

2. **Test the contact form** on your website

3. **Check logs** for any runtime errors:
   ```bash
   npm run logs
   ```

4. **Verify setup** anytime:
   ```bash
   npm run verify
   ```

---

## 📁 Folder Structure

```
backend/
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── .clasp.json             # clasp project configuration (auto-generated)
├── appsscript.json         # Apps Script project settings
├── deploy.js               # Node.js deployment script
├── deploy.sh               # Bash deployment script
├── package.json            # NPM configuration
├── thinkREDBot.js          # Main script file with logic
└── README.md               # Documentation
```e Backend – Google Apps Script

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

## 🔧 Troubleshooting

### Common Issues

1. **"Not logged in to clasp"**:
   ```bash
   clasp login
   ```

2. **"Script not found"**:
   * Verify `CLASP_SCRIPT_ID` in `.env`
   * Ensure you have access to the Google Apps Script

3. **"Permission denied"**:
   * Make sure your Google account has edit access to the script
   * Re-run `clasp login` if needed

4. **"File not found" errors**:
   * Ensure you're in the `backend/` directory
   * Run `npm run setup` to create `.env` file

### Post-Deployment Testing

1. **Contact Form**: Test at `/contact` page
2. **Job Applications**: Test job application submissions
3. **Error Handling**: Verify CORS fallback mechanism works
4. **Email Notifications**: Check that emails are sent properly

---

## 🛡️ Security Considerations

### Local Development

* ✅ `.env` file is git-ignored
* ✅ Script ID stored in environment variables
* ✅ No hardcoded credentials in code
* ✅ `.clasprc.json` contains sensitive OAuth tokens

### GitHub Actions

* ✅ Credentials stored as GitHub Secrets
* ✅ Automatic cleanup of temporary files
* ✅ No credentials exposed in logs
* ✅ Environment validation before deployment

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run setup` | Create .env from template |
| `npm run verify` | Verify setup is complete |
| `npm run deploy` | Deploy using Node.js script (recommended) |
| `npm run deploy:bash` | Deploy using Bash script |
| `npm run deploy:simple` | Direct clasp deployment |
| `npm run push` | Push code without deployment |
| `npm run open` | Open Google Apps Script in browser |
| `npm run logs` | View runtime logs |

---

## 🧠 Credits

Crafted with ❤️ by [ThinkRED](https://thinkred.tech)

---

## 📜 License

MIT License (c) 2025 ThinkRED
