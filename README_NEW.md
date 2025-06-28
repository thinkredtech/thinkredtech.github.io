# ThinkRED Technologies - Company Website

## Overview

This repository contains the source code for the ThinkRED Technologies company website. The website serves as the primary digital presence for our technology consultancy, showcasing our services, portfolio, and company information.

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Markdown** for documentation rendering

### Backend
- **Google Apps Script** for serverless backend functionality
- **Google Sheets** for data storage
- **Google Drive** for file storage
- **Gmail** for email notifications

## Repository Structure

```
thinkred-monorepo/
├── frontend/             # React frontend application
│   ├── src/             # Source code
│   ├── public/          # Static assets
│   ├── docs/            # User-facing documentation
│   └── package.json     # Frontend dependencies
├── backend/             # Google Apps Script backend
│   ├── thinkREDBot.js   # Main backend logic
│   └── package.json     # Backend dependencies
├── docs/                # Developer documentation
├── build/               # Production build output
└── README.md            # This file
```

## Key Features

- **Responsive Design**: Optimized for all device sizes
- **Form Processing**: Contact forms and job applications
- **File Upload**: Resume uploads for job applications
- **Email Notifications**: Automated email handling
- **Documentation System**: Markdown-based documentation accessible via web interface
- **SEO Optimized**: Built for search engine visibility

## Quick Start

### Prerequisites
- Node.js 18+
- npm 8+
- Git

### Development Setup
```bash
# Clone the repository
git clone https://github.com/thinkredtech/thinkred-monorepo.git
cd thinkred-monorepo

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Deployment

### Frontend Deployment
- **Primary**: GitHub Pages (automatic deployment on push to main)
- **Secondary**: Hostinger (manual deployment)

### Backend Deployment
- **Platform**: Google Apps Script
- **Tool**: CLASP (Command Line Apps Script Projects)

## Documentation

### For Users
- **Website Overview**: Available at `/docs/website-overview` on the live site
- **Company Information**: Available at `/docs/company-info` on the live site
- **Brand Guidelines**: Available at `/docs/brand-guidelines` on the live site
- **FAQ**: Available at `/docs/faq` on the live site

### For Developers
- **Development Setup**: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **Architecture Overview**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **API Documentation**: [docs/API.md](docs/API.md)
- **Deployment Guide**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

## Contributing

Please read [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Project Scripts

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run deploy       # Deploy to GitHub Pages
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Backend Scripts
```bash
npm run push         # Push to Google Apps Script
npm run deploy       # Deploy to Google Apps Script
npm run logs         # View execution logs
```

## Environment Configuration

### Frontend Environment Variables
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### Backend Configuration
Configuration is managed through Google Apps Script Properties Service.

## Support

For technical issues or questions:
1. Check the [troubleshooting guide](docs/TROUBLESHOOTING.md)
2. Review existing documentation in the `/docs/` directory
3. Create an issue on GitHub with detailed information

## License

This project is proprietary to ThinkRED Technologies LLP. All rights reserved.

## Contact

**ThinkRED Technologies LLP**
- Website: [https://thinkredtech.github.io](https://thinkredtech.github.io)
- Email: Contact us through the website contact form

---

*Built with ❤️ by the ThinkRED Technologies team*
