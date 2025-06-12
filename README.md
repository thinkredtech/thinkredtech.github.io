# ThinkRED Technologies Website

![ThinkRED Logo](public/assets/images/thinkRED-np.svg)

> **Simplify Technology & Experience!**

A modern, high-performance website for ThinkRED Technologies LLP built with React 19, TypeScript, and TailwindCSS. This website showcases our technology services, company vision, and engineering expertise to international clients.

## 🌟 Features

- **Responsive Design** - Optimized for all device sizes and screen resolutions
- **Interactive AI Avatar Assistant** - Smart sleep/wake behavior and contextual navigation
- **Interactive Technology Stack** - Tabbed interface showcasing comprehensive tech capabilities
- **Modern UI/UX** - Smooth animations, transitions, and micro-interactions
- **SEO Optimized** - Meta tags, structured data, and performance optimization
- **Fast Performance** - Code splitting, lazy loading, and optimized assets
- **Accessibility** - WCAG compliant with keyboard navigation and screen reader support
- **Smart Navigation** - Avatar assistant prevents cyclic navigation based on current page

## 🎯 Website Goals

- Attract and onboard international clients for custom development services
- Showcase ThinkRED's engineering expertise and innovation-led approach
- Tell our company story and vision through compelling content
- Encourage user engagement through strategic CTAs and conversational UX

## 📱 Pages Overview

| Page | Purpose | Key Features |
|------|---------|--------------|
| **Home** | Brand introduction & service overview | Hero section, scroll-based storytelling, service highlights |
| **About** | Company story & team | Timeline narrative, company philosophy, team showcase |
| **Services** | Service offerings & capabilities | Service categories, comparison tables, technology stack |
| **Portfolio** | Case studies & projects | Technology-based filtering, project showcases |
| **Contact** | Lead generation & inquiries | "Talk to Us" form, requirements field, contact info |
| **Blog** | Thought leadership | Technology articles, insights, company updates |

## 🛠 Tech Stack

### Core Technologies

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework

### Frontend & UI

- **React Router** - Client-side routing
- **React Markdown** - Blog content rendering
- **Headless UI** - Accessible UI components
- **Three.js** - 3D avatar and graphics

### Build & Development

- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/thinkredtech/thinkredtech.github.io.git
   cd thinkred-website-react19-vite
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |

## 🏗 Project Structure

```markdown
thinkred-website-react19-vite/
├── public/                     # Static assets
│   ├── assets/
│   │   ├── images/            # Images and logos
│   │   └── icons/             # Icon files
│   ├── 404.html               # GitHub Pages SPA fallback
│   ├── index.html             # HTML template
│   ├── manifest.json          # PWA manifest
│   └── robots.txt             # SEO robots file
├── src/
│   ├── components/            # Reusable React components
│   │   ├── Layout/           # Header, Footer, Layout
│   │   ├── Home/             # Homepage components
│   │   ├── AvatarAssistant.tsx
│   │   └── ContactForms.tsx
│   ├── pages/                # Page components
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── PortfolioPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── BlogPage.tsx
│   ├── data/                 # Static data and content
│   ├── styles/               # CSS and styling
│   ├── types.ts              # TypeScript type definitions
│   ├── App.tsx               # Main App component
│   └── index.tsx             # Application entry point
├── docs/                     # Development documentation
├── build/                    # Production build output
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # TailwindCSS configuration
├── tsconfig.json             # TypeScript configuration
└── eslint.config.js          # ESLint configuration
```

## 🎨 Design System

### Color Palette

- **Primary**: `#E4093E` (ThinkRED signature red)
- **Accent 1**: `#518CEA` (Blue)
- **Accent 2**: `#AE6CFC` (Purple)  
- **Dark**: `#2A2A2A` (Charcoal)
- **Background**: `#FFFFFF` (White)

### Typography

- **Display**: Comfortaa (brand font)
- **Headings**: Montserrat (sans-serif)
- **Body**: Montserrat (readable text)

### Design Principles

- **8px Grid System** - Consistent spacing throughout
- **8px Border Radius** - Subtle rounded corners
- **Subtle Shadows** - Depth and hierarchy
- **Responsive First** - Mobile-optimized design

## 🤖 AI Avatar Assistant

### Smart Behavior Features

- **Intelligent Sleep/Wake** - Goes to sleep after 1000px scroll, wakes up when scrolling back
- **Contextual Navigation** - Prevents cyclic navigation by filtering out current page options
- **Page-Aware Responses** - Provides relevant navigation options based on current location
- **Interactive Animations** - Enhanced animations with attention-seeking behavior
- **User Control** - Manual sleep/wake functionality with click interactions

### Technical Implementation

- **React Router Integration** - Uses `useLocation` hook for page awareness
- **Smart Filtering** - Filters navigation options to prevent redundant links
- **Scroll-Based State Management** - Automatic behavior based on scroll position
- **Enhanced UX** - Smooth transitions between sleep and wake states

## 🚀 Deployment

### GitHub Pages (Automatic)

The website is configured for automatic deployment to GitHub Pages:

1. **Push to main branch**

   ```bash
   git push origin main
   ```

2. **GitHub Actions will automatically:**
   - Build the production version
   - Deploy to `gh-pages` branch
   - Update <https://thinkredtech.github.io>

3. **Manual deployment (if needed):**

   ```bash
   npm run deploy:github
   ```

### Hostinger Deployment

For alternative hosting on Hostinger:

1. **Run deployment script:**

   ```bash
   npm run deploy:hostinger
   ```

2. **Upload to hosting:**
   - Upload `thinkred-website.zip` to file manager
   - Extract in `public_html` directory
   - Ensure `.htaccess` file is present

3. **Files created:**
   - Optimized production build
   - `.htaccess` for React Router support
   - `robots.txt` for SEO
   - Compressed assets

## ⚙️ Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
VITE_API_URL=https://your-api-domain.com
VITE_APP_ENVIRONMENT=development
```

### Vite Configuration

Key configuration in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/', // GitHub Pages base path
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendors': ['react', 'react-dom', 'react-router-dom'],
          'three-vendors': ['three', '@react-three/fiber', '@react-three/drei']
        }
      }
    }
  }
});
```

### TailwindCSS Customization

Customize colors and spacing in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#E4093E',
        accent1: '#518CEA',
        accent2: '#AE6CFC',
        dark: '#2A2A2A'
      },
      fontFamily: {
        comfortaa: ['Comfortaa', 'cursive'],
        montserrat: ['Montserrat', 'sans-serif']
      }
    }
  }
};
```

## 🌐 Browser Compatibility

### Supported Browsers

- **Chrome** (latest) ✅
- **Firefox** (latest) ✅  
- **Safari** (latest) ✅
- **Edge** (latest) ✅
- **Mobile browsers** ✅

### Theme Color Support

This website uses `meta[name="theme-color"]` for browser theming:

**✅ Supported (70%+ users):**

- Chrome (Desktop & Mobile)
- Edge (Desktop & Mobile)  
- Safari (iOS)
- Android browsers

**❌ Limited Support:**

- Firefox (Desktop & Mobile)
- Opera (Desktop & Mobile)

**Note:** Theme color tags gracefully degrade and provide no negative impact in unsupported browsers.

## 📈 Performance Optimization

### Build Optimizations

- **Code Splitting** - Vendor chunks for better caching
- **Tree Shaking** - Remove unused code
- **Asset Optimization** - Compressed images and fonts
- **Source Maps** - Development debugging support

### Runtime Performance

- **Lazy Loading** - Components loaded on demand
- **Image Optimization** - WebP format where supported
- **Caching Strategy** - Long-term caching for static assets
- **Bundle Analysis** - Monitor chunk sizes

## 🧪 Testing & Quality

### Code Quality Tools

- **TypeScript** - Static type checking
- **ESLint** - Code linting and consistency
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality gates

### Testing Commands

```bash
npm run type-check    # TypeScript type checking
npm run lint          # ESLint code analysis
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
```

## 📚 Documentation

### Development Docs

- [Design System](docs/design-system.md) - Complete design guidelines
- [Brand Guidelines](docs/brand-guidelines.md) - Logo and brand usage
- [Company Info](docs/company-info.md) - Business information
- [Website Overview](docs/website-overview.md) - Project specifications

### Page Specifications

- [Landing Page](docs/page-specs/landing_page.md) - Homepage specifications
- [About Page](docs/page-specs/about_page.md) - About page details
- [Services Page](docs/page-specs/services_page.md) - Services specifications
- [Portfolio Page](docs/page-specs/portfolio_page.md) - Portfolio guidelines
- [Contact Page](docs/page-specs/contact_page.md) - Contact form specs
- [Blog Page](docs/page-specs/blog_page.md) - Blog functionality

### Development Checklists

- [Development Progress](docs/dev-checklists/dev-progress.md) - Feature tracking
- [Testing Plan](docs/dev-checklists/testing-plan.md) - QA guidelines
- [Bug Fixes & Enhancements](docs/dev-checklists/bugfix-and-enhancements.md) - Issue tracking

## 🏢 Company Information

### ThinkRED Technologies LLP

**Mission:** Deliver value through simplified technology and experience

**Services:**

- Product, Platform & Application Development
- Infrastructure Configuration & Management  
- Application Platform as a Service (APaaS)
- Technology Consultation
- Data and AI Services
- Design and Branding

**Core Technologies:**

- **Frontend:** React, TypeScript, TailwindCSS, Next.js
- **Backend:** Node.js, Python, Java, Spring Boot
- **Mobile:** React Native, Flutter
- **Cloud:** AWS, Google Cloud, Kubernetes, OpenShift
- **Design:** Figma, Adobe XD, Blender 3D
- **DevOps:** Docker, Kubernetes, GitHub Actions

## 🔧 Troubleshooting

### Common Issues

**Build Errors:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Type check issues
npm run type-check
```

**Development Server Issues:**

```bash
# Check port availability
lsof -ti:3000
kill -9 <PID>

# Restart dev server
npm run dev
```

**Deployment Issues:**

```bash
# Test build locally
npm run build
npm run preview

# Check GitHub Actions logs
# Visit: https://github.com/thinkredtech/thinkredtech.github.io/actions
```

## 📄 License

This project is proprietary and owned by **ThinkRED Technologies LLP**.

All rights reserved. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

## 📞 Contact & Support

### Get in Touch

- **Website:** <https://thinkred.tech>
- **Email:** <hello@thinkred.tech>
- **GitHub:** <https://github.com/thinkredtech>

### Support
For technical issues or questions about this project:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review the [documentation](#-documentation)  
3. Contact our development team via email

---

### Built with ❤️ by ThinkRED Technologies
