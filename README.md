<div align="center">

# 🏗️ ThinkRED Monorepo

<img src="frontend/public/assets/logos/thinkRED-np.svg" alt="ThinkRED Logo" width="280" height="120" style="margin: 20px 0;" />

**Unified Development & Deployment Platform**

[![Monorepo Health](https://img.shields.io/badge/Monorepo%20Health-100%25-brightgreen)](https://github.com/thinkredtech/thinkred-monorepo)
[![Frontend Status](https://img.shields.io/badge/Frontend-Active-brightgreen)](./frontend/)
[![Backend Status](https://img.shields.io/badge/Backend-Active-brightgreen)](./backend/)
[![Deployment](https://img.shields.io/badge/Deployment-Automated-blue)](./scripts/)

[![Build Status](https://img.shields.io/badge/Build-passed-brightgreen)](https://github.com/thinkredtech/thinkredtech.github.io/actions)
[![Code Quality](https://img.shields.io/badge/Code%20Quality-passed-brightgreen)](https://github.com/thinkredtech/thinkredtech.github.io/actions)
[![Security](https://img.shields.io/badge/Security-passed-brightgreen)](https://github.com/thinkredtech/thinkredtech.github.io/actions)

</div>

---

## 🌟 About This Monorepo

This **unified repository** contains both frontend and backend components of the **ThinkRED website**  
with separate versioning and deployment capabilities. Built for scalability, maintainability, and  
streamlined development workflows.

### 🎯 Key Benefits

> **"One Repository, Multiple Components, Unified Experience"**

- **🔄 Independent Versioning**: Each component maintains its own semantic versioning
- **🚀 Automated Deployments**: Streamlined deployment process for all components
- **📦 Centralized Management**: Single repository for easier project management
- **🛠️ Unified Tooling**: Consistent development and build processes

---

## 📁 Repository Structure

<div align="center">

<table>
<tr>
<td width="50%" align="center">

### 🎨 **Frontend Component**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3+-646CFF?style=flat&logo=vite)

**React 19 + Vite application**
- Modern web interface
- GitHub Pages & Hostinger deployment
- Independent semantic versioning

</td>
<td width="50%" align="center">

### ⚙️ **Backend Component**

![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=flat&logo=google)
![CLASP](https://img.shields.io/badge/CLASP-Enabled-green?style=flat)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js)

**Google Apps Script backend**
- Form processing & automation
- Google CLASP deployment
- Independent semantic versioning

</td>
</tr>
</table>

</div>

```text
thinkred-monorepo/
├── 🎨 frontend/          # React 19 + Vite frontend application
├── ⚙️ backend/           # Google Apps Script backend
├── 🛠️ scripts/           # Deployment and versioning utilities
└── 📦 package.json       # Root package with unified commands
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** package manager
- **Git** for version control
- **Google CLASP** for backend deployment (optional)

### ⚡ Installation & Setup

```bash
# 1️⃣ Clone the monorepo
git clone https://github.com/thinkredtech/thinkred-monorepo.git
cd thinkred-monorepo

# 2️⃣ Install all dependencies
npm run install:all

# 3️⃣ Start development server
npm run dev

# 4️⃣ Build for production
npm run build

# 5️⃣ Deploy all components
npm run deploy:all
```

### 🎯 Development Workflow

<div align="center">

| **Step** | **Command** | **Description** |
|:---------|:------------|:----------------|
| **🏗️ Setup** | `npm run install:all` | Install all dependencies |
| **💻 Develop** | `npm run dev` | Start development server |
| **🧪 Test** | `npm run test` | Run all tests |
| **🔨 Build** | `npm run build` | Build for production |
| **🚀 Deploy** | `npm run deploy:all` | Deploy all components |

</div>

---

## 📦 Component Management

### 🎨 **Frontend Component** (@thinkred/frontend)

React 19 application with Vite, deployed to GitHub Pages and Hostinger with independent versioning.

**Key Features:**
- ⚡ Lightning-fast Vite development server
- 🎯 Modern React 19 with TypeScript
- 📱 Responsive design for all devices
- 🔒 Security-first implementation

### ⚙️ **Backend Component** (@thinkred/backend)

Google Apps Script for form handling, deployed via Google CLASP with independent versioning.

**Key Features:**
- 📝 Form processing automation
- 📊 Google Sheets integration
- 📧 Email notification system
- ☁️ Cloud-based deployment

---

## 🏷️ Version Management

Each component maintains its own **semantic versioning** for independent development and deployment cycles.

### 📊 **Current Versions**

<div align="center">

| **Component** | **Version** | **Status** | **Check Command** |
|:--------------|:-----------:|:----------:|:------------------|
| **🎨 Frontend** | ![Frontend](https://img.shields.io/badge/v1.0.4-stable-brightgreen) | ✅ Active | `npm run version:frontend` |
| **⚙️ Backend** | ![Backend](https://img.shields.io/badge/v1.0.0-stable-brightgreen) | ✅ Active | `npm run version:backend` |

</div>

### 🔄 **Version Updates**

```bash
# 🩹 Patch versions (1.0.0 → 1.0.1) - Bug fixes
npm run version:patch:frontend
npm run version:patch:backend

# ✨ Minor versions (1.0.0 → 1.1.0) - New features
npm run version:minor:frontend
npm run version:minor:backend

# 💥 Major versions (1.0.0 → 2.0.0) - Breaking changes
npm run version:major:frontend
npm run version:major:backend
```

---

## 🚀 Deployment & Release Management

### 🎯 **Individual Component Deployment**

<div align="center">

| **Component** | **Command** | **Target** | **Status** |
|:--------------|:------------|:-----------|:----------:|
| **🎨 Frontend** | `npm run deploy:frontend` | GitHub Pages + Hostinger | ![Deploy](https://img.shields.io/badge/Auto-Deploy-brightgreen) |
| **⚙️ Backend** | `npm run deploy:backend` | Google Apps Script | ![Deploy](https://img.shields.io/badge/CLASP-Deploy-blue) |

</div>

### 🌟 **Complete Release Workflow**

```bash
# 🚀 Deploy all components simultaneously
npm run deploy:all

# 🏷️ Complete release process (version + deploy + tag)
npm run release:frontend      # Patch release
npm run release:backend       # Patch release

# 🔄 Minor releases with new features
npm run release:minor:frontend
npm run release:minor:backend

# 💥 Major releases with breaking changes
npm run release:major:frontend
npm run release:major:backend
```

---

## 🏷️ Git Tag Management

The system automatically creates and manages **Git tags** with separate versioning for enhanced traceability.

### 📋 **Tag Format**

<div align="center">

| **Component** | **Tag Format** | **Example** | **Purpose** |
|:--------------|:---------------|:------------|:------------|
| **🎨 Frontend** | `frontend-v{version}` | `frontend-v1.0.4` | Frontend releases |
| **⚙️ Backend** | `backend-v{version}` | `backend-v1.0.0` | Backend releases |

</div>

### 🔍 **Tag Operations**

```bash
# 📊 View tag history for components
npm run tag:frontend list
npm run tag:backend list

# 🏷️ Create and push tags (automatic during release)
npm run tag:frontend
npm run tag:backend
```

---

## ✅ Verification & Testing

### 🔍 **Check Git History**

```bash
git log --oneline -10                    # Shows all commits
git log --follow frontend/src/App.tsx    # Shows file history for moved files
```

### 🧪 **Test Setup**

```bash
npm run version:frontend                 # Shows current frontend version
npm run version:backend                  # Shows current backend version
npm run dev                              # Start development server
```

---

## 💻 Development Commands

### 🎨 **Frontend Development**

<div align="center">

| **Command** | **Description** | **Usage** |
|:------------|:----------------|:----------|
| `cd frontend && npm run dev` | 🚀 Start development server | Local development |
| `cd frontend && npm run build` | 🔨 Build for production | Production build |
| `cd frontend && npm run lint` | 🧹 Run ESLint | Code quality |
| `cd frontend && npm run type-check` | 🔍 TypeScript checking | Type safety |

</div>

### ⚙️ **Backend Development**

<div align="center">

| **Command** | **Description** | **Usage** |
|:------------|:----------------|:----------|
| `cd backend && npm run push` | ⬆️ Push to Google Apps Script | Development deployment |
| `cd backend && npm run deploy` | 🚀 Deploy new version | Production deployment |
| `cd backend && npm run logs` | 📋 View execution logs | Debugging |

</div>

---

## ⚙️ Configuration

### 🎨 **Frontend Configuration**

Standard React + Vite setup configured for GitHub Pages and Hostinger deployment.

### ⚙️ **Backend Configuration**

1. **Install Google CLASP globally:**
   ```bash
   npm install -g @google/clasp
   ```

2. **Login to Google:**
   ```bash
   clasp login
   ```

3. **Copy the configuration template:**
   ```bash
   cd backend
   cp .clasp.json.template .clasp.json
   # Edit .clasp.json with your actual Google Apps Script ID
   ```

4. **Configure script properties in Google Apps Script console**

### 🔑 **Required Script Properties** (Google Apps Script)

```javascript
CONTACT_FORM_SHEET_ID=your_contact_sheet_id
JOB_APPLICATION_SHEET_ID=your_job_sheet_id
RESUME_PARENT_FOLDER_ID=your_drive_folder_id
EMAIL_TO=your_notification_email
EMAIL_CC_CONTACT_FORM=cc_email_for_contact
EMAIL_CC_JOB_APPLY=cc_email_for_jobs
```

---

## 📜 Available Scripts

### 🏗️ **Root Level Commands**

<div align="center">

| **Script** | **Command** | **Description** |
|:-----------|:------------|:----------------|
| **📦 Install** | `npm run install:all` | Install all dependencies |
| **💻 Develop** | `npm run dev` | Start frontend development |
| **🔨 Build** | `npm run build` | Build frontend |
| **🚀 Deploy** | `npm run deploy` | Deploy all components |
| **🏷️ Release** | `npm run release:frontend` | Complete frontend release |
| **🏷️ Release** | `npm run release:backend` | Complete backend release |

</div>

### 🔢 **Version Management**

```bash
# Frontend versioning
npm run version:patch:frontend     # Increment frontend patch version
npm run version:minor:frontend     # Increment frontend minor version
npm run version:major:frontend     # Increment frontend major version

# Backend versioning
npm run version:patch:backend      # Increment backend patch version
npm run version:minor:backend      # Increment backend minor version
npm run version:major:backend      # Increment backend major version
```

### 🏷️ **Tag Management**

```bash
npm run tag:frontend              # Create and push frontend tag
npm run tag:backend               # Create and push backend tag
```

---

## 📊 Monitoring & Observability

### 🎨 **Frontend Monitoring**

GitHub Pages deployment status, build logs via GitHub Actions, and Hostinger deployment logs.

### ⚙️ **Backend Monitoring**

Google Apps Script execution logs via `cd backend && npm run logs` and Google Cloud Console for advanced monitoring.

---

## 🤝 Contributing

### 🚀 **Getting Started**

1. **Fork this repository**
2. **Run setup:**
   ```bash
   npm run install:all
   ```
3. **Make your changes** in the appropriate component
4. **Test your changes**
5. **Use the appropriate release command**

### 📝 **Development Guidelines**

- Follow existing code conventions
- Write clear commit messages
- Test all changes thoroughly
- Update documentation as needed
- Use semantic versioning for releases

---

## 📄 License

**MIT License** - see individual component licenses for details.

For licensing inquiries, please contact [legal@thinkred.tech](mailto:legal@thinkred.tech).

---

<div align="center">

**Made with ❤️ by ThinkRED Technologies**

*Simplify Technology & Experience*

[![ThinkRED](https://img.shields.io/badge/Powered%20by-ThinkRED-E4093E?style=flat&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)](https://thinkred.tech)

### 📞 **Support & Contact**

 **🌐 Website**: [https://thinkred.tech](https://thinkred.tech)

**📧 Email**: [contact@thinkred.tech](mailto:contact@thinkred.tech)

 **🔗 GitHub**: [https://github.com/thinkredtech](https://github.com/thinkredtech)

</div>
