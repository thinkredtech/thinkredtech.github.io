#!/bin/bash

# Quick script to preview the maintenance page locally
# This helps test the maintenance page before deployment

echo "🚧 Starting maintenance page preview..."

# Check if maintenance page exists
if [ ! -f "build/maintenance.html" ]; then
    echo "❌ Maintenance page not found. Running post-build script..."
    ./scripts/post-build.sh
fi

# Start a simple HTTP server
if command -v python3 &> /dev/null; then
    echo "🌐 Starting Python HTTP server on port 8080..."
    echo "📱 Open: http://localhost:8080/maintenance.html"
    echo "⏹️  Press Ctrl+C to stop"
    cd build && python3 -m http.server 8080
elif command -v node &> /dev/null; then
    echo "🌐 Starting Node.js HTTP server on port 8080..."
    echo "📱 Open: http://localhost:8080/maintenance.html"
    echo "⏹️  Press Ctrl+C to stop"
    npx serve build -p 8080
else
    echo "❌ No HTTP server available. Install Python 3 or Node.js to preview."
    echo "📁 Maintenance page location: build/maintenance.html"
fi
