#!/bin/bash

# Pre-build script to prevent Git from picking up build artifacts
# This can be run before your build process starts

echo "🔒 Setting up build isolation..."

# Create lock files to prevent Git operations during build
touch .building
touch frontend/.building 2>/dev/null || true
touch backend/.building 2>/dev/null || true

# Stash any uncommitted changes to prevent conflicts during build
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "📦 Stashing uncommitted changes..."
    git stash push -m "Auto-stash before build $(date)"
    echo "build-stashed" > .build-stash-flag
fi

# Ensure build directories are clean and ignored
echo "🧹 Cleaning build directories..."
rm -rf build/ 2>/dev/null || true
rm -rf frontend/dist/ 2>/dev/null || true
rm -rf frontend/hostinger-deploy/ 2>/dev/null || true
rm -rf backend/dist/ 2>/dev/null || true

# Create .gitkeep files to maintain directory structure if needed
mkdir -p build && echo "# Build artifacts - ignored by Git" > build/.gitkeep 2>/dev/null || true

echo "✅ Build environment prepared!"
echo "🔥 You can now run your build process safely"
