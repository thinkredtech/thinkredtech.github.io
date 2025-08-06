#!/usr/bin/env node

/**
 * Advanced Post-build optimization script
 * Comprehensive optimization for near-perfect PageSpeed Insights scores
 */

/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');
const { getOrCreateNonce } = require('./nonce-generator.cjs');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const assetsDir = path.join(distDir, 'assets');

console.log('🚀 Starting Advanced Performance Optimization...');

try {
  // Use shared nonce generator
  const nonce = getOrCreateNonce();
  
  // Read the index.html file
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // 1. CRITICAL CSS OPTIMIZATION
  const criticalCSS = `
    <!-- Critical above-the-fold CSS with enhanced performance -->
    <style nonce="${nonce}">
      /* Critical CSS for above-the-fold content */
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html{line-height:1.15;-webkit-text-size-adjust:100%;scroll-behavior:smooth}
      body{
        font-family:'Montserrat','Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
        background-color:#ffffff;
        color:#1f2937;
        line-height:1.6;
        font-display:swap;
        -webkit-font-smoothing:antialiased;
        -moz-osx-font-smoothing:grayscale;
        text-rendering:optimizeLegibility;
      }
      
      /* Prevent layout shift during font loading */
      .font-comfortaa{font-family:'Comfortaa',system-ui,sans-serif;font-display:swap}
      .font-montserrat{font-family:'Montserrat',system-ui,sans-serif;font-display:swap}
      
      /* Enhanced contrast colors for accessibility - Meeting WCAG AAA standards */
      .text-gray-600{color:#374151!important} /* Improved from #4b5563 */
      .text-gray-700{color:#1f2937!important} /* Improved from #374151 */
      .text-gray-800{color:#111827!important} /* Already compliant */
      .text-gray-900{color:#000000!important} /* Maximum contrast */
      
      /* Header and navigation - optimized for performance */
      header{
        background-color:rgba(255,255,255,0.95);
        -webkit-backdrop-filter:blur(10px);
        backdrop-filter:blur(10px);
        position:sticky;
        top:0;
        z-index:50;
        will-change:transform;
        transition:background-color 0.2s ease,box-shadow 0.2s ease;
        contain:layout style paint;
      }
      
      /* Header border when scrolled */
      header.bg-white{
        border-bottom:1px solid #e5e7eb;
        box-shadow:0 1px 3px rgba(0,0,0,0.1);
      }
      
      nav{
        max-width:1280px;
        margin:0 auto;
        padding:1rem 1.5rem;
        display:flex;
        align-items:center;
        justify-content:space-between;
        contain:layout;
      }
      
      /* Logo optimization */
      .logo{
        height:2.5rem;
        width:auto;
        object-fit:contain;
        contain:layout;
      }
      
      /* Navigation links */
      .nav-link{
        color:#374151;
        text-decoration:none;
        font-weight:500;
        transition:color 0.2s ease;
        position:relative;
      }
      
      .nav-link:hover,.nav-link:focus{
        color:#dc2626;
        outline:none;
      }
      
      /* Mobile menu optimizations */
      .mobile-menu{
        position:fixed;
        top:0;
        right:-100%;
        width:280px;
        height:100vh;
        background-color:#ffffff;
        box-shadow:-4px 0 20px rgba(0,0,0,0.1);
        transition:right 0.3s ease;
        z-index:60;
        contain:layout style paint;
      }
      
      .mobile-menu.open{
        right:0;
      }
      
      /* Skeleton loading for smooth experience */
      .skeleton{
        background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);
        background-size:200% 100%;
        animation:loading 1.5s infinite;
      }
      
      @keyframes loading{
        0%{background-position:200% 0}
        100%{background-position:-200% 0}
      }
      
      /* Button optimizations */
      .btn{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:0.75rem 1.5rem;
        border:none;
        border-radius:0.5rem;
        font-weight:600;
        text-decoration:none;
        transition:all 0.2s ease;
        cursor:pointer;
        contain:layout;
      }
      
      .btn-primary{
        background-color:#dc2626;
        color:#ffffff;
      }
      
      .btn-primary:hover,.btn-primary:focus{
        background-color:#b91c1c;
        transform:translateY(-1px);
        box-shadow:0 4px 12px rgba(220,38,38,0.3);
      }
      
      /* Accessibility improvements */
      .sr-only{
        position:absolute;
        width:1px;
        height:1px;
        padding:0;
        margin:-1px;
        overflow:hidden;
        clip:rect(0,0,0,0);
        white-space:nowrap;
        border:0;
      }
      
      /* Focus management */
      *:focus{
        outline:2px solid #dc2626;
        outline-offset:2px;
      }
      
      /* Performance optimizations */
      img{
        max-width:100%;
        height:auto;
        contain:layout;
      }
      
      /* Reduce motion for accessibility */
      @media(prefers-reduced-motion:reduce){
        *{
          animation-duration:0.01ms!important;
          animation-iteration-count:1!important;
          transition-duration:0.01ms!important;
        }
      }
      
      /* Dark mode support */
      @media(prefers-color-scheme:dark){
        :root{
          color-scheme:dark;
        }
      }
    </style>`;

  // 2. ENHANCED PRELOAD STRATEGY
  // Find critical assets and create optimized preload strategy
  const assetFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.js') || file.endsWith('.css'));
  const criticalAssets = [];
  const nonCriticalAssets = [];
  
  // Classify assets by importance
  assetFiles.forEach(file => {
    if (file.includes('main-') || file.includes('react-core') || file.includes('vendors') || file.endsWith('.css')) {
      criticalAssets.push(file);
    } else {
      nonCriticalAssets.push(file);
    }
  });
  
  // 3. ADVANCED RESOURCE HINTS
  let resourceHints = `
    <!-- Enhanced DNS and connection optimization -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://script.google.com">
    <link rel="dns-prefetch" href="https://script.googleusercontent.com">
    
    <!-- Critical resource preloads -->`;
    
  // Add critical asset preloads
  criticalAssets.forEach(asset => {
    if (asset.endsWith('.js')) {
      if (asset.includes('main-')) {
        resourceHints += `\n    <link rel="preload" href="/assets/${asset}" as="script" crossorigin fetchpriority="high">`;
      } else {
        resourceHints += `\n    <link rel="preload" href="/assets/${asset}" as="script" crossorigin>`;
      }
    } else if (asset.endsWith('.css')) {
      resourceHints += `\n    <link rel="preload" href="/assets/${asset}" as="style" crossorigin>`;
    }
  });
  
  // Add critical image preloads
  resourceHints += `
    <link rel="preload" href="/assets/logos/thinkRED-np.svg" as="image" fetchpriority="high">
    <link rel="preload" href="/assets/avatars/assistant-red.webp" as="image">`;

  // 4. ENHANCED CSP WITH NONCE - Replace existing CSP if present
  const cspMeta = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'nonce-${nonce}' https://script.google.com https://script.googleusercontent.com; style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://script.google.com https://script.googleusercontent.com; frame-src 'self' https://script.google.com; object-src 'none'; base-uri 'self'; form-action 'self';">`;

  // Remove any existing CSP headers to prevent conflicts - more comprehensive patterns
  html = html.replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '');
  html = html.replace(/<meta[^>]*content=["'][^"']*Content-Security-Policy[^"']*["'][^>]*>/gi, '');

  // 5. ADDITIONAL SECURITY AND PERFORMANCE HEADERS
  const securityMeta = `
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
    <meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=(), fullscreen=(self)">
  `;

  // 6. SERVICE WORKER REGISTRATION
  const serviceWorkerScript = `
    <script nonce="${nonce}">
      if('serviceWorker' in navigator){
        window.addEventListener('load',function(){
          navigator.serviceWorker.register('/sw.js').then(function(registration){
            console.log('SW registered: ',registration);
          }).catch(function(registrationError){
            console.log('SW registration failed: ',registrationError);
          });
        });
      }
    </script>`;

  // 7. REPLACE AND OPTIMIZE HTML
  // Remove existing critical CSS and replace with optimized version
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');
  
  // Replace nonce placeholders with actual nonce
  html = html.replace(/__CSP_NONCE__/g, nonce);
  
  // Find the head tag and insert optimized content
  const headEndIndex = html.indexOf('</head>');
  if (headEndIndex !== -1) {
    const beforeHead = html.substring(0, headEndIndex);
    const afterHead = html.substring(headEndIndex);
    
    html = beforeHead + cspMeta + securityMeta + resourceHints + criticalCSS + serviceWorkerScript + afterHead;
  }
  
  // 8. OPTIMIZE SCRIPT AND LINK TAGS
  // Add fetchpriority to critical scripts
  html = html.replace(
    /<script([^>]*src="[^"]*main-[^"]*"[^>]*)>/g,
    '<script$1 fetchpriority="high">'
  );
  
  // Add nonce to inline scripts and styles that don't already have one
  // More robust regex to prevent duplicate nonces
  html = html.replace(/<script(?![^>]*nonce=)(?![^>]*src)([^>]*)>/g, `<script$1 nonce="${nonce}">`);
  html = html.replace(/<style(?![^>]*nonce=)([^>]*)>/g, `<style$1 nonce="${nonce}">`);
  
  // Add nonce to stylesheet links that don't already have one
  html = html.replace(/<link([^>]*rel="stylesheet"[^>]*?)(?![^>]*nonce=)>/g, `<link$1 nonce="${nonce}">`);
  
  // Remove any duplicate nonce attributes that might have been created
  html = html.replace(/nonce="[^"]*"\s+nonce="[^"]*"/g, `nonce="${nonce}"`);
  html = html.replace(/nonce="[^"]*"\s+([^>]*)\s+nonce="[^"]*"/g, `nonce="${nonce}" $1`);
  
  // 9. LAZY LOADING OPTIMIZATION
  // Add loading="lazy" to images that are not critical
  html = html.replace(
    /<img(?![^>]*loading=)([^>]*(?!alt="ThinkRED Logo")[^>]*)>/g,
    '<img$1 loading="lazy">'
  );
  
  // 10. OPTIMIZE FONT LOADING
  html = html.replace(
    /href="https:\/\/fonts\.googleapis\.com\/css2[^"]*"/g,
    (match) => `${match} media="print" onload="this.media='all'"`
  );

  // 11. SKIP NON-CRITICAL CSS LOADING - Let Vite handle CSS naturally
  // Removed problematic dynamic CSS loading that conflicts with Vite

  // 12. WRITE OPTIMIZED HTML
  fs.writeFileSync(indexPath, html, 'utf8');
  
  // 13. CREATE ENHANCED SERVICE WORKER
  const serviceWorkerContent = `
const CACHE_NAME = 'thinkred-v${Date.now()}';
const STATIC_CACHE_URLS = [
  '/',
  '/assets/logos/thinkRED-np.svg',
  ${criticalAssets.map(asset => `'/assets/${asset}'`).join(',\n  ')}
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  if (event.request.destination === 'document') {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  } else if (event.request.destination === 'script' || event.request.destination === 'style') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) return response;
          return fetch(event.request).then(fetchResponse => {
            const responseClone = fetchResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
            return fetchResponse;
          });
        })
    );
  }
});`;

  fs.writeFileSync(path.join(distDir, 'sw.js'), serviceWorkerContent, 'utf8');
  
  // 14. CREATE OPTIMIZED HTACCESS
  const htaccessContent = `
# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Enable Brotli compression if available
<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/plain
  AddOutputFilterByType BROTLI_COMPRESS text/html
  AddOutputFilterByType BROTLI_COMPRESS text/xml
  AddOutputFilterByType BROTLI_COMPRESS text/css
  AddOutputFilterByType BROTLI_COMPRESS text/javascript
  AddOutputFilterByType BROTLI_COMPRESS application/xml
  AddOutputFilterByType BROTLI_COMPRESS application/xhtml+xml
  AddOutputFilterByType BROTLI_COMPRESS application/rss+xml
  AddOutputFilterByType BROTLI_COMPRESS application/javascript
  AddOutputFilterByType BROTLI_COMPRESS application/x-javascript
  AddOutputFilterByType BROTLI_COMPRESS application/json
  AddOutputFilterByType BROTLI_COMPRESS image/svg+xml
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
  ExpiresActive on
  
  # Images
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  
  # CSS and JavaScript
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType application/x-javascript "access plus 1 year"
  
  # Fonts
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/ttf "access plus 1 year"
  ExpiresByType font/eot "access plus 1 year"
  ExpiresByType font/otf "access plus 1 year"
  
  # Documents
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType application/json "access plus 0 seconds"
  ExpiresByType application/xml "access plus 0 seconds"
  ExpiresByType text/xml "access plus 0 seconds"
  
  # Manifest and service worker
  ExpiresByType application/manifest+json "access plus 0 seconds"
  ExpiresByType text/cache-manifest "access plus 0 seconds"
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options nosniff
  Header always set X-Frame-Options SAMEORIGIN
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
  
  # CORS for fonts
  <FilesMatch "\\.(woff2?|eot|ttf|otf)$">
    Header set Access-Control-Allow-Origin "*"
  </FilesMatch>
  
  # Cache control for versioned assets
  <FilesMatch "\\.(js|css)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  
  # Cache control for images
  <FilesMatch "\\.(jpg|jpeg|png|gif|webp|avif|svg)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>

# Enable HTTP/2 Push (if supported)
<IfModule mod_http2.c>
  H2PushPriority * after
  H2PushPriority text/css before
  H2PushPriority application/javascript interleaved
</IfModule>

# Redirect to HTTPS
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>`;

  fs.writeFileSync(path.join(distDir, '.htaccess'), htaccessContent, 'utf8');
  
  console.log('✅ Advanced Performance Optimization completed successfully!');
  console.log('   📊 Enhanced CSP with nonce');
  console.log('   🎨 Improved accessibility contrast');
  console.log('   ⚡ Optimized critical resource loading');
  console.log('   🔒 Advanced security headers');
  console.log('   💾 Service worker with caching strategy');
  console.log('   🗜️  Compression and cache optimization');
  console.log('   🚀 Ready for near-perfect PageSpeed scores!');
  
} catch (error) {
  console.error('❌ Advanced performance optimization failed:', error.message);
  process.exit(1);
}
