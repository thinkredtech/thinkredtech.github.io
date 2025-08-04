<div align="center">

<picture>
  <img src="frontend/public/assets/logos/thinkRED-np.svg" alt="ThinkRED Technologies Logo" width="400" />
</picture>

# 🚀 ThinkRED Technologies Monorepo

**Simplify Technology & Experience**

[![Repository Health](https://img.shields.io/badge/Repository%20Health-100%25-brightgreen)](https://github.com/thinkredtech/thinkred-monorepo/actions)
[![Build Status](https://img.shields.io/badge/Build-passed-brightgreen)](https://github.com/thinkredtech/thinkredtech.github.io/actions)
[![Code Quality](https://img.shields.io/badge/Code%20Quality-passed-brightgreen)](https://github.com/thinkredtech/thinkredtech.github.io/actions)
[![Security](https://img.shields.io/badge/Security-passed-brightgreen)](https://github.com/thinkredtech/thinkredtech.github.io/actions)

_Complete monorepo for ThinkRED Technologies company website and infrastructure_

</div>

---

## 🌟 Overview

This monorepo contains the complete source code and infrastructure for the **ThinkRED Technologies**
company website. Built with modern technologies and best practices, it serves as the primary digital

presence for our engineering-focused technology consultancy.

**ThinkRED Technologies LLP** transforms complex technological challenges into elegant solutions,

founded by engineers from **Mozilla**, **Fedora**, and **Red Hat**.

---

## ⚡ Technology Stack

<div align="center">

<table>
<tr>
<td width="50%" align="center">

### 🎨 **Frontend Stack**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3+-646CFF?style=flat&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)

**Modern Frontend Development**

- React 19 with TypeScript
- Vite for lightning-fast builds
- Tailwind CSS for styling
- React Router for navigation
- React Markdown for documentation

</td>
<td width="50%" align="center">

### 🔧 **Backend Stack**

![Google Apps Script](https://img.shields.io/badge/Google-Apps%20Script-4285F4?style=flat&logo=google)
![Google Sheets](https://img.shields.io/badge/Google-Sheets-34A853?style=flat&logo=google-sheets)
![Gmail](https://img.shields.io/badge/Gmail-API-EA4335?style=flat&logo=gmail)

**Serverless Backend**

- Google Apps Script runtime
- Google Sheets for data storage
- Google Drive for file storage
- Gmail for email notifications

</td>
</tr>
</table>

</div>

---

## 📁 Repository Structure

```
thinkred-monorepo/
├── 🎨 frontend/             # React frontend application
│   ├── 📂 src/             # Source code
│   ├── 📂 public/          # Static assets
│   ├── 📚 docs/            # User-facing documentation
│   └── 📦 package.json     # Frontend dependencies
├── 🧠 backend/             # Google Apps Script backend
│   ├── 🤖 thinkREDBot.js   # Main backend logic
│   └── 📦 package.json     # Backend dependencies
├── 📖 docs/                # Developer documentation
├── 🏗️ build/               # Production build output
├── 📊 reports/             # Health and operational reports
├── 🔧 scripts/             # Automation scripts
└── 📋 README.md            # This file
```

---

## ✨ Key Features

<div align="center">

| Feature                  | Description                    | Status    |
| ------------------------ | ------------------------------ | --------- |
| 📱 **Responsive Design** | Optimized for all device sizes | ✅ Active |

| 📝 **Form Processing** | Contact forms and job applications | ✅ Active |

| 📎 **File Upload** | Resume uploads for job applications | ✅ Active |

| 📧 **Email Notifications** | Automated email handling | ✅ Active |

| 📚 **Documentation System** | Markdown-based docs via web interface | ✅ Active |

| 🔍 **SEO Optimized** | Built for search engine visibility | ✅ Active |

</div>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ (LTS recommended)

- **npm** 8+ or **yarn** package manager

- **Git** for version control

### Development Setup

```bash
## 1️⃣ Clone the repository
git clone https://github.com/thinkredtech/thinkredtech.github.io.git
cd thinkredtech.github.io

## 2️⃣ Install all dependencies
npm run install:all

## 3️⃣ Start development
npm run dev
```

🌐 **The application will be available at** `http://localhost:3000`

---

## 🎛️ Unified Task Management

This monorepo features a **unified task management system** that simplifies development workflows:

```bash
## 📋 Show all available commands
npm run help

## 🚀 Development commands
npm run dev              # Start frontend development
npm run dev:all          # Start all development servers
npm run build            # Build frontend
npm run build:all        # Build everything

## 🔍 Code quality
npm run lint             # Lint all workspaces
npm run format           # Format all code
npm run type-check       # TypeScript checking
npm run lint:md          # Check markdown formatting
npm run docs:quality     # Full documentation quality check
npm run docs:dashboard   # Generate documentation health dashboard

## 🚢 Deployment
npm run deploy           # Deploy to production
npm run deploy:frontend  # Deploy frontend only
npm run deploy:backend   # Deploy backend only

## 📊 Monitoring
npm run status           # Show workspace status
npm run backend:logs     # View backend logs
```

### 🎯 Key Benefits

- **🎯 Single Entry Point**: All tasks run from root directory
- **⚡ Parallel Execution**: Multiple tasks run simultaneously when safe
- **🧠 Context Aware**: Automatically runs tasks in correct workspace
- **🔍 Clear Visibility**: See exactly what's running where

📖 **Complete Guide**: [docs/TASK_MANAGEMENT.md](docs/TASK_MANAGEMENT.md) | 📋 **Quick Ref**:
[TASKS.md](TASKS.md)

---

## 🚀 Deployment

<div align="center">

<table>
<tr>
<td width="50%" align="center">

### 🌐 **Frontend Deployment**

![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-181717?style=flat&logo=github)
![Hostinger](https://img.shields.io/badge/Hostinger-Zero%20Downtime-FF6C37?style=flat)

**Primary**: GitHub Pages (automatic)  
**Secondary**: Hostinger (zero-downtime deployment)

📖 **Zero-Downtime Guide**: [docs/ZERO_DOWNTIME_DEPLOYMENT.md](docs/ZERO_DOWNTIME_DEPLOYMENT.md)

</td>
<td width="50%" align="center">

### ⚡ **Backend Deployment**

![Google Apps Script](https://img.shields.io/badge/Google-Apps%20Script-4285F4?style=flat&logo=google)
![CLASP](https://img.shields.io/badge/CLASP-CLI-34A853?style=flat)

**Platform**: Google Apps Script  
**Tool**: CLASP CLI

</td>
</tr>
</table>

</div>

---

## 📚 Documentation

<div align="center">

### 🎯 **For Users**

| Documentation           | Description                        | Access                   |
| ----------------------- | ---------------------------------- | ------------------------ |
| 🌐 **Website Overview** | Platform introduction and features | `/docs/website-overview` |

| 🏢 **Company Information** | About ThinkRED Technologies | `/docs/company-info` |

| 🎨 **Brand Guidelines** | Visual identity and style guide | `/docs/brand-guidelines` |

| ❓ **FAQ** | Frequently asked questions | `/docs/faq` |

### 🛠️ **For Developers**

| Documentation            | Description                   | Link                                  |
| ------------------------ | ----------------------------- | ------------------------------------- |
| 🔧 **Development Setup** | Local development environment | [Development Guide](docs/developer/guides/development.md) |
| 🏗️ **Architecture Overview** | System design and technical details | [System Overview](docs/developer/architecture/system-overview.md) |
| 📡 **API Documentation** | Backend API reference | [Backend APIs](docs/developer/apis/backend-apis.md) |
| 🚀 **Deployment Guide** | CI/CD and deployment procedures | [Production Deployment](docs/developer/deployment/production.md) |
| 🔄 **Zero-Downtime Deploy** | Professional maintenance & zero-downtime | [ZERO_DOWNTIME_DEPLOYMENT.md](docs/ZERO_DOWNTIME_DEPLOYMENT.md) |
| 📊 **Health Reports** | Monitoring and status dashboard management | [Health Checks](docs/operations/monitoring/health-checks.md) |
| 🎛️ **Task Management** | Unified task runner and development workflows | [TASK_MANAGEMENT.md](docs/TASK_MANAGEMENT.md) |
| 🔍 **Troubleshooting** | Common issues and solutions | [Troubleshooting Guide](docs/developer/setup/troubleshooting.md) |

</div>

---

## 🤝 Contributing

We welcome contributions! Please read our guidelines:

- 📋 **Contributing Guidelines**: [Contributing Guide](docs/developer/guides/contributing.md) - Code standards,
  workflow, and PR process
- 🤝 **Code of Conduct**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Community standards and
  expectations
- � **License**: [LICENSE](LICENSE) - Usage terms and attribution requirements

---

## 🛠️ Project Scripts

### 🎨 **Frontend Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 Start development server |
| `npm run build` | 🏗️ Build for production |
| `npm run preview` | 👀 Preview production build |
| `npm run deploy` | 🌐 Deploy to GitHub Pages |
| `npm run deploy:github` | 🚀 Deploy to GitHub Pages |
| `npm run deploy:ssh` | 🔒 Deploy to Hostinger via SSH |
| `npm run lint` | 🔍 Run ESLint |
| `npm run type-check` | ✅ TypeScript compiler check |

### 🧠 **Backend Scripts**

| Command | Description |
|---------|-------------|
| `npm run push` | 📤 Push to Google Apps Script |
| `npm run deploy` | 🚀 Deploy to Google Apps Script |
| `npm run logs` | 📊 View execution logs |

---

## ⚙️ Environment Configuration

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### Backend Configuration

Configuration is managed through Google Apps Script Properties Service.

---

## 🆘 Support

For technical issues or questions:

1. 📖 **Check Documentation**: Review the relevant docs first
2. 🔍 **Troubleshooting Guide**: Check our [troubleshooting guide](docs/developer/setup/troubleshooting.md)
3. 🐛 **Create Issue**: Open a detailed GitHub issue if problems persist

---

## 📄 License

This project is licensed under a custom license that requires attribution to **ThinkRED Technologies
LLP**.

**Key Requirements:**

- ✅ Attribution required for any use or derivative work
- ✅ Credit must be given to ThinkRED Technologies LLP
- ✅ Original license must be preserved

See the [LICENSE](LICENSE) file for complete terms and conditions.

---

## 📞 Contact

<div align="center">

**🚀 ThinkRED Technologies LLP**

[![Website](https://img.shields.io/badge/Website-thinkred.tech-blue?style=flat&logo=globe)](https://thinkredtech.github.io)
[![Email](https://img.shields.io/badge/Email-Contact%20Form-red?style=flat&logo=gmail)](https://thinkredtech.github.io/contact)

_Contact us through our website contact form_

---

<div align="center">

_Built with ❤️ by the ThinkRED Technologies team_

**"Simplify Technology & Experience"**

</div>

</div>
