#!/bin/bash

# Script to clean up any build artifacts that might have been accidentally tracked by Git
# Run this if you notice build files appearing in git status during builds

echo "🧹 Cleaning up Git build artifacts..."

# Remove any accidentally tracked build artifacts from Git index (without deleting files)
echo "Removing build artifacts from Git tracking..."

# Common build artifacts that shouldn't be tracked
git rm --cached -r build/ 2>/dev/null || true
git rm --cached -r frontend/dist/ 2>/dev/null || true
git rm --cached -r frontend/hostinger-deploy/ 2>/dev/null || true
git rm --cached -r backend/dist/ 2>/dev/null || true
git rm --cached **/*.map 2>/dev/null || true
git rm --cached **/*.min.js 2>/dev/null || true
git rm --cached **/*.min.css 2>/dev/null || true
git rm --cached **/*.tmp 2>/dev/null || true
git rm --cached **/*.temp 2>/dev/null || true
git rm --cached **/*.building 2>/dev/null || true
git rm --cached **/*.deploying 2>/dev/null || true

# Clean up any temporary lock files
find . -name "*.lock.tmp" -delete 2>/dev/null || true
find . -name "*.building" -delete 2>/dev/null || true
find . -name "*.deploying" -delete 2>/dev/null || true

echo "✅ Build artifact cleanup complete!"
echo "💡 If you had tracked build files, commit the removal with:"
echo "   git commit -m 'Remove build artifacts from tracking'"

# Show current status
echo ""
echo "📊 Current Git status:"
git status --short
