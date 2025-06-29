# ThinkRED Technologies Website - Developer Documentation

This directory contains technical documentation for developers working on the ThinkRED Technologies website.

## Overview

The ThinkRED website is a modern React-based company website with a Google Apps Script backend. This documentation covers the technical aspects of development, deployment, and maintenance.

## Quick Start

1. **Project Setup**: See [DEVELOPMENT.md](./DEVELOPMENT.md) for local development setup
2. **Architecture**: Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
3. **API Documentation**: Check [API.md](./API.md) for backend integration details
4. **Deployment**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment procedures

## Documentation Structure

### Core Development Guides

| Document | Purpose | Audience |
|----------|---------|----------|
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Local development setup and workflow | Developers |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture overview | Developers, Technical leads |
| [API.md](./API.md) | Backend API documentation | Frontend developers |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment processes and CI/CD | DevOps, Developers |

### Configuration and Environment

| Document | Purpose | Audience |
|----------|---------|----------|
| [ENVIRONMENT.md](./ENVIRONMENT.md) | Environment configuration | Developers, DevOps |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Common issues and solutions | Developers |
| [GIT_BUILD_PREVENTION.md](./GIT_BUILD_PREVENTION.md) | Git build artifacts prevention | Developers, DevOps |

### Process and Guidelines

| Document | Purpose | Audience |
|----------|---------|----------|
| [WORKFLOW.md](./WORKFLOW.md) | Development workflow and Git practices | Developers |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines | Contributors |
| [STYLE_GUIDE.md](./STYLE_GUIDE.md) | Code style and conventions | Developers |

## Getting Started

For new developers, we recommend starting with:

1. **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Complete setup instructions
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Understanding the system
3. **[API.md](./API.md)** - Backend integration details

## Project Architecture

The ThinkRED website consists of:

- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Google Apps Script + Google Sheets + Google Drive
- **Deployment**: GitHub Pages (primary), Hostinger (secondary)
- **Documentation**: Markdown files served via web interface

## Development Workflow

1. **Local Development**: Use `npm run dev` in the frontend directory
2. **Testing**: Manual testing and validation
3. **Building**: `npm run build` creates production-ready files
4. **Deployment**: Automatic via GitHub Actions or manual deployment

## Documentation Maintenance

### Repository Documentation (`/docs/`)

This directory contains developer-focused documentation:
- Technical architecture and implementation details
- Development setup and deployment procedures
- API documentation and troubleshooting guides
- Contribution guidelines and workflows

### Frontend Documentation (`/frontend/docs/`)

This directory contains user-facing documentation that is publicly accessible via the website:
- Company information and brand guidelines
- Service descriptions and FAQ
- Privacy policy and terms of service
- Public-facing technical documentation

### Documentation Updates

When updating documentation:
1. Ensure content is factually accurate
2. Maintain professional tone and clarity
3. Test all links and references
4. Update both internal and external references as needed

## Support

For technical questions or issues:
1. Check the relevant documentation first
2. Review the troubleshooting guide
3. Create a detailed issue if the problem persists

## Contribution Guidelines

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed information about:
- Code standards and conventions
- Development workflow
- Pull request process
- Issue reporting guidelines

Production deployment and maintenance:

| 📖 **Guide** | ⏱️ **Time** | 🎯 **Best For** |
|-------------|-------------|-----------------|
| [🚢 Deployment Guide](./DEPLOYMENT.md) | 10 min | Production deployment |
| [🔧 Troubleshooting](./TROUBLESHOOTING.md) | 5 min | Fixing issues quickly |

---

## 🎭 **By Role & Experience Level**

### **👶 Complete Beginner**

New to web development? Start here:

1. **[🏠 README](../README.md)** - Understand what ThinkRED is
2. **[❓ FAQ](./FAQ.md)** - Get answers to common questions
3. **[🚀 Setup Guide](./SETUP.md)** - Follow the lightning setup
4. **[🔧 Troubleshooting](./TROUBLESHOOTING.md)** - When things go wrong

### **💻 Frontend Developer**

Focusing on UI/UX development:

1. **[🚀 Setup Guide](./SETUP.md)** - Frontend-only setup
2. **[🏗️ Architecture](./ARCHITECTURE.md)** - Frontend architecture section
3. **[📝 Style Guide](./STYLE_GUIDE.md)** - React & TypeScript conventions
4. **[🎯 Workflow](./WORKFLOW.md)** - Development process

### **⚙️ Backend Developer**

Working on APIs and automation:

1. **[📡 API Reference](./API.md)** - Complete API documentation
2. **[🌍 Environment Management](./ENVIRONMENT.md)** - Backend configuration
3. **[🚢 Deployment Guide](./DEPLOYMENT.md)** - Backend deployment
4. **[📝 Style Guide](./STYLE_GUIDE.md)** - Google Apps Script conventions

### **🚀 DevOps Engineer**

Managing deployment and infrastructure:

1. **[🚢 Deployment Guide](./DEPLOYMENT.md)** - Full deployment process
2. **[🌍 Environment Management](./ENVIRONMENT.md)** - Configuration management
3. **[🔧 Troubleshooting](./TROUBLESHOOTING.md)** - Production issues
4. **[🏗️ Architecture](./ARCHITECTURE.md)** - System architecture

### **🎯 Project Manager**

Understanding capabilities and planning:

1. **[🏠 README](../README.md)** - Project overview & capabilities
2. **[🏗️ Architecture](./ARCHITECTURE.md)** - System design & roadmap
3. **[🎯 Workflow](./WORKFLOW.md)** - Development process
4. **[❓ FAQ](./FAQ.md)** - Common project questions

---

## 🎨 **By Task Type**

### **🔧 Installation & Setup**

- **[🚀 Setup Guide](./SETUP.md)** - Complete setup instructions
- **[🌍 Environment Management](./ENVIRONMENT.md)** - Configuration details
- **[❓ FAQ](./FAQ.md)** - Setup troubleshooting

### **💻 Development**

- **[🎯 Workflow](./WORKFLOW.md)** - Development process
- **[📝 Style Guide](./STYLE_GUIDE.md)** - Coding standards
- **[🏗️ Architecture](./ARCHITECTURE.md)** - System understanding

### **🐛 Debugging & Troubleshooting**

- **[🔧 Troubleshooting](./TROUBLESHOOTING.md)** - Issue resolution
- **[❓ FAQ](./FAQ.md)** - Common problems
- **[📡 API Reference](./API.md)** - API debugging

### **🚢 Deployment**

- **[🚢 Deployment Guide](./DEPLOYMENT.md)** - Production deployment
- **[🌍 Environment Management](./ENVIRONMENT.md)** - Environment setup
- **[🔧 Troubleshooting](./TROUBLESHOOTING.md)** - Deployment issues

### **🤝 Contributing**

- **[🤝 Contributing](../CONTRIBUTING.md)** - Contribution process
- **[📝 Style Guide](./STYLE_GUIDE.md)** - Code standards
- **[🎯 Workflow](./WORKFLOW.md)** - Development workflow

---

## 📊 **Documentation Stats**

### **📝 Content Coverage**

- **📖 Total Pages**: 10 comprehensive guides
- **📝 Total Words**: ~50,000 words of content
- **🎯 Topics Covered**: 100+ development topics
- **🔗 Cross-References**: Fully interlinked documentation

### **🎭 Style & Quality**

- **🎨 Visual Elements**: Rich formatting with emojis and badges
- **📱 Mobile-Friendly**: Readable on all devices
- **🔗 Accessibility**: Clear structure and navigation
- **🌍 International**: Clear English for global developers

---

## 🔄 **Documentation Maintenance**

### **📅 Update Schedule**

- **🔄 Regular Updates**: Documentation updated with every release
- **🐛 Bug Reports**: Issues tracked in GitHub Issues
- **💡 Improvements**: Suggestions welcome via GitHub Discussions
- **📊 Analytics**: Usage tracked to improve content

### **🤝 Contributing to Docs**

Found an issue or want to improve the documentation?

1. **🍴 Fork** the repository
2. **📝 Edit** the relevant markdown file
3. **✅ Test** your changes locally
4. **🚀 Submit** a pull request

---

## 🎯 **Need Help?**

### **💬 Community Support**

- **🐛 [GitHub Issues](https://github.com/thinkredtech/thinkredtech.github.io/issues)** - Bug reports
- **💡 [GitHub Discussions](https://github.com/orgs/thinkredtech/discussions)** - Questions & ideas
- **📧 [Email Support](mailto:hello@thinkred.tech)** - Direct assistance

### **🚀 Quick Links**

- **[🏠 Main Repository](https://github.com/thinkredtech/thinkredtech.github.io)** - Source code
- **[🌐 Live Demo](https://thinkred.netlify.app)** - See it in action
- **[📊 Project Board](https://github.com/thinkredtech/thinkredtech.github.io/projects)** - Development progress

---

<div align="center">

**📚 Ready to Explore the ThinkRED Universe?**

[![Start Reading](https://img.shields.io/badge/Start%20Reading-Right%20Now-blue?style=for-the-badge&logo=book)](../README.md)

---

*Maintained with ❤️ by the ThinkRED community*

**Think Different. Think RED. Think Documentation.** ✨

</div>
