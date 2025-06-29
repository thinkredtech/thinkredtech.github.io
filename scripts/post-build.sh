#!/bin/bash

# Post-build script to clean up after build process
# This should be run after your build process completes

echo "🎯 Post-build cleanup..."

# Remove build lock files
rm -f .building
rm -f frontend/.building 2>/dev/null || true
rm -f backend/.building 2>/dev/null || true

# Restore stashed changes if they exist
if [ -f .build-stash-flag ]; then
    echo "📦 Restoring stashed changes..."
    git stash pop
    rm -f .build-stash-flag
fi

# Double-check that no build artifacts are being tracked
if git ls-files | grep -E "\.(map|min\.(js|css)|tmp|temp)$" > /dev/null; then
    echo "⚠️  Warning: Build artifacts detected in Git tracking!"
    echo "   Run ./scripts/clean-git-build-artifacts.sh to fix this"
fi

# Show final status
echo "📊 Final Git status:"
git status --short

echo "✅ Post-build cleanup complete!"
