# ThinkRED Technologies Website

A modern, responsive website for ThinkRED Technologies LLP built with React, TypeScript, and TailwindCSS.

## Features

- Responsive design for all device sizes
- Interactive 3D avatar assistant
- Modern UI with animations and transitions
- SEO optimized structure
- Fast loading and performance optimized

## Pages

- Home - Featuring scroll-based storytelling and service highlights
- About - With narrative-driven timeline and company philosophy
- Services - Showcasing all service categories with comparison tables
- Portfolio - With technology-based filtering for case studies
- Contact - Including the "Talk to Us" form with requirements field
- Blog - For technology articles and thought leadership

## Tech Stack

- React 19
- TypeScript
- TailwindCSS
- Vite
- Three.js (for 3D avatar)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/thinkredtech/thinkred.github.io.git
   cd thinkred-website
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment

### GitHub Pages Deployment

1. Update the `homepage` field in `package.json`:

   ```json
   "homepage": "https://thinkredtech.github.io"
   ```

2. Install GitHub Pages package:

   ```bash
   npm install --save-dev gh-pages
   ```

3. Add deployment scripts to `package.json`:

   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build",
     ...
   }
   ```

4. Deploy the website:

   ```bash
   npm run deploy
   ```

### Hostinger Deployment

1. Build the project:

   ```bash
   npm run build
   ```

2. Upload the contents of the `build` folder to your Hostinger hosting:
   - Log in to your Hostinger account
   - Navigate to File Manager or use FTP (FileZilla, etc.)
   - Upload all files from the `build` directory to the public_html folder of your hosting

3. Configure redirects:
   - Create a `.htaccess` file in the root directory with the following content:

   ```sh
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteCond %{REQUEST_FILENAME} !-l
     RewriteRule . /index.html [L]
   </IfModule>
   ```

## Project Structure

```sh
thinkred-website/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   └── fonts/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   ├── Home/
│   │   └── AvatarAssistant.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── PortfolioPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── BlogPage.tsx
│   ├── styles/
│   ├── App.tsx
│   ├── index.tsx
│   └── types.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Customization

### Colors

The color scheme can be modified in the `tailwind.config.js` file:

```js
theme: {
  extend: {
    colors: {
      primary: '#E4093E',
      accent1: '#518CEA',
      accent2: '#AE6CFC',
      dark: '#2A2A2A',
      secondary: '#4B5563',
      background: '#FFFFFF',
      backgroundAlt: '#F9FAFB',
    }
  }
}
```

### Typography

The website uses Comfortaa and Montserrat fonts as per ThinkRED's branding. These are imported in the `index.css` file.

## Browser Support

The website is compatible with:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary and owned by ThinkRED Technologies LLP.

## Contact

For any questions or support, please contact:

- Email: <hello@thinkred.tech>
- Website: <https://thinkred.tech>
