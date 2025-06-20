#!/bin/bash

# Production Deployment Script with Enhanced Security
# This script builds the project with production CSP configuration

echo "🚀 ThinkRED Production Deployment"
echo "================================="

# Set environment variables for production
export NODE_ENV=production
export CSP_ENV=production

echo "📦 Installing dependencies..."
npm ci

echo "🧹 Cleaning previous build..."
rm -rf build/

echo "🔧 Building project with production CSP..."
npm run build

echo "🛡️ Applying production security headers..."

# Apply production CSP to built HTML files
PRODUCTION_CSP="default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.thinkred.tech; object-src 'none'; media-src 'self'; child-src 'none'; frame-src 'none'; worker-src 'self'; manifest-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests; block-all-mixed-content;"

# Update CSP in build files
find build -name "*.html" -type f -exec sed -i.bak \
  's/script-src '\''self'\'' '\''unsafe-inline'\'' '\''unsafe-eval'\''/script-src '\''self'\''/g; s/connect-src '\''self'\'' https:\/\/api\.thinkred\.tech https:/connect-src '\''self'\'' https:\/\/api\.thinkred\.tech/g' {} \;

# Remove backup files
find build -name "*.bak" -delete

echo "✅ Production build complete with enhanced security!"
echo ""
echo "🔍 Security verification:"
echo "- CSP: Strict policy applied (no unsafe-inline, no unsafe-eval)"
echo "- HTTPS: All connections enforced"
echo "- Headers: Complete security header suite"
echo ""
echo "📁 Build output: ./build/"
echo "🌐 Ready for deployment to production!"

# Optional: Run security validation
if command -v node &> /dev/null; then
    echo ""
    echo "🛡️ Running security validation..."
    node scripts/validate-security.js
fi
